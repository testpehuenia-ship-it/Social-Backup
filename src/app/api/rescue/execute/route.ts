import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tenantSlug = "adnqn-coffee",
      platform,
      affectedHandle,
      newOfficialUrl,
      incidentType = "ACCOUNT_SUSPENDED",
      subject,
      messageBody,
      idempotencyKey,
      isTestSend = false,
      adminEmail = "admin@adnqncoffee.com",
    } = body;

    // 1. Validaciones
    if (!platform || !affectedHandle || !newOfficialUrl) {
      return NextResponse.json({ success: false, error: "Datos del incidente incompletos (red, cuenta anterior, nueva URL)." }, { status: 400 });
    }

    if (!newOfficialUrl.startsWith("http://") && !newOfficialUrl.startsWith("https://")) {
      return NextResponse.json({ success: false, error: "La nueva URL debe ser válida (iniciar con https:// o http://)." }, { status: 400 });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
    });

    if (!tenant) {
      return NextResponse.json({ success: false, error: "Negocio no encontrado." }, { status: 404 });
    }

    // 2. MODO PRUEBA: Enviar prueba únicamente al administrador
    if (isTestSend) {
      const testSubject = `[PRUEBA DE RESCATE] ${subject || `Aviso urgente de ${tenant.name}`}`;
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const continuityUrl = `${appUrl}/c/${tenant.slug}/continuity`;

      const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; color: #1e293b; border-radius: 8px; border: 2px dashed #f59e0b;">
          <div style="background: #fef3c7; color: #92400e; padding: 8px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-bottom: 16px;">
            ⚠️ ESTE ES UN ENVÍO DE PRUEBA EXCLUSIVO PARA EL ADMINISTRADOR. NO FUE ENVIADO A LA COMUNIDAD.
          </div>
          <h2 style="color: ${tenant.brandColor}; margin-top: 0;">¡Seguimos conectados!</h2>
          <p>Nuestra cuenta anterior en <strong>${platform}</strong> (@${affectedHandle}) ya no se encuentra disponible.</p>
          <p>${messageBody || "Para seguir en contacto y no perderte ninguna novedad, podés encontrarnos en nuestra nueva cuenta oficial:"}</p>
          <div style="margin: 24px 0; text-align: center;">
            <a href="${newOfficialUrl}" style="background: ${tenant.brandColor}; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
              Ir a nuestra nueva cuenta oficial
            </a>
          </div>
          <p style="font-size: 13px; color: #64748b;">
            También podés consultar nuestra página oficial de continuidad: <a href="${continuityUrl}">${continuityUrl}</a>
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center;">
            Podés administrar tus preferencias o darte de baja en cualquier momento.<br />
            Social Backup by ADNQN · Powered by ADNQN
          </p>
        </div>
      `;

      await sendEmail({
        to: adminEmail,
        subject: testSubject,
        tenantName: tenant.name,
        html,
      });

      return NextResponse.json({
        success: true,
        isTestSend: true,
        message: `Correo de prueba enviado con éxito al administrador (${adminEmail}).`,
      });
    }

    // 3. MODO PRODUCCIÓN / DESPACHO REAL
    const safeKey = idempotencyKey || `rescue-${tenant.id}-${Date.now()}`;

    // Verificar si ya se procesó con esta clave de idempotencia
    const existingCampaign = await prisma.rescueCampaign.findUnique({
      where: { idempotencyKey: safeKey },
    });

    if (existingCampaign) {
      return NextResponse.json({
        success: true,
        alreadyProcessed: true,
        campaignId: existingCampaign.id,
        sentCount: existingCampaign.sentCount,
        failedCount: existingCampaign.failedCount,
        message: "Esta campaña ya fue ejecutada con la clave provista (idempotente).",
      });
    }

    // 4. Registrar Incidente
    const incident = await prisma.rescueIncident.create({
      data: {
        tenantId: tenant.id,
        platform,
        affectedHandle,
        incidentType,
        newOfficialUrl,
      },
    });

    // 5. Filtrar destinatarios estrictamente elegibles
    // Reglas:
    // a) Mismo tenantId
    // b) Contact status != SUPPRESSED
    // c) Canal EMAIL verificado (isVerified = true)
    // d) Canal sin baja (optedOutAt == null)
    // e) Preferencia allowRescue == true
    const eligibleChannels = await prisma.contactChannel.findMany({
      where: {
        tenantId: tenant.id,
        type: "EMAIL",
        isVerified: true,
        optedOutAt: null,
        contact: {
          status: { not: "SUPPRESSED" },
          preferences: {
            some: {
              allowRescue: true,
            },
          },
        },
      },
      include: {
        contact: true,
      },
    });

    // 6. Crear Registro de Campaña de Rescate
    const campaign = await prisma.rescueCampaign.create({
      data: {
        tenantId: tenant.id,
        incidentId: incident.id,
        subject: subject || `¡Seguimos comunicados! Nueva cuenta oficial de ${tenant.name}`,
        messageBody: messageBody || "Nuestra cuenta anterior dejó de estar disponible. Te esperamos en nuestra nueva presencia oficial.",
        newOfficialUrl,
        status: "IN_PROGRESS",
        idempotencyKey: safeKey,
        eligibleCount: eligibleChannels.length,
      },
    });

    let sentSuccess = 0;
    let sentFailed = 0;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const continuityUrl = `${appUrl}/c/${tenant.slug}/continuity`;

    // 7. Encolado y Envío con doble verificación de baja
    for (const channel of eligibleChannels) {
      // Re-verificar baja justo antes de enviar
      if (channel.optedOutAt !== null || channel.contact.status === "SUPPRESSED") {
        await prisma.rescueMessage.create({
          data: {
            campaignId: campaign.id,
            contactChannelId: channel.id,
            recipientEmail: channel.normalizedValue,
            status: "EXCLUDED_UNSUBSCRIBED",
            idempotencyKey: `${campaign.id}-${channel.id}`,
            errorMessage: "Contacto dado de baja antes del envío.",
          },
        });
        continue;
      }

      const unsubscribeUrl = `${appUrl}/c/${tenant.slug}/preferences?email=${encodeURIComponent(channel.normalizedValue)}`;

      const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; color: #1e293b; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h2 style="color: ${tenant.brandColor}; margin-top: 0;">¡Seguimos conectados!</h2>
          <p>Te escribimos porque formás parte de la comunidad de <strong>${tenant.name}</strong>.</p>
          <p>Nuestra cuenta anterior de <strong>${platform}</strong> (@${affectedHandle}) ya no se encuentra disponible.</p>
          <p>${campaign.messageBody}</p>
          <div style="margin: 28px 0; text-align: center;">
            <a href="${newOfficialUrl}" style="background: ${tenant.brandColor}; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; display: inline-block;">
              Ir a nuestra nueva cuenta oficial en ${platform}
            </a>
          </div>
          <p style="font-size: 13px; color: #64748b;">
            Página oficial de respaldo y continuidad: <a href="${continuityUrl}">${continuityUrl}</a>
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center;">
            Recibís este aviso porque autorizaste comunicaciones de continuidad al unirte a la comunidad.<br />
            Podés <a href="${unsubscribeUrl}" style="color: #64748b;">modificar tus preferencias o darte de baja</a> en cualquier momento.<br />
            Social Backup by ADNQN · Powered by ADNQN
          </p>
        </div>
      `;

      const result = await sendEmail({
        to: channel.normalizedValue,
        subject: campaign.subject,
        tenantName: tenant.name,
        html,
      });

      const messageKey = `${campaign.id}-${channel.id}`;

      if (result.success) {
        sentSuccess++;
        await prisma.rescueMessage.create({
          data: {
            campaignId: campaign.id,
            contactChannelId: channel.id,
            recipientEmail: channel.normalizedValue,
            status: "SENT",
            idempotencyKey: messageKey,
            sentAt: new Date(),
          },
        });
      } else {
        sentFailed++;
        await prisma.rescueMessage.create({
          data: {
            campaignId: campaign.id,
            contactChannelId: channel.id,
            recipientEmail: channel.normalizedValue,
            status: "FAILED",
            idempotencyKey: messageKey,
            errorMessage: result.error || "Error de proveedor",
          },
        });
      }
    }

    // 8. Actualizar estado de campaña y auditoría
    await prisma.rescueCampaign.update({
      where: { id: campaign.id },
      data: {
        status: sentFailed === 0 ? "COMPLETED" : "COMPLETED_WITH_ERRORS",
        sentCount: sentSuccess,
        failedCount: sentFailed,
        executedAt: new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        tenantId: tenant.id,
        action: "CAMPAIGN_SEND",
        resource: "rescue_campaign",
        details: `Ejecutado rescate ante incidente en ${platform}. Destinatarios: ${sentSuccess} enviados, ${sentFailed} fallidos.`,
      },
    });

    return NextResponse.json({
      success: true,
      campaignId: campaign.id,
      eligibleCount: eligibleChannels.length,
      sentCount: sentSuccess,
      failedCount: sentFailed,
      continuityUrl,
      message: `Campaña de rescate ejecutada exitosamente. Enviados: ${sentSuccess}, Fallidos: ${sentFailed}.`,
    });
  } catch (error: any) {
    console.error("Error en rescate:", error);
    return NextResponse.json({ success: false, error: "Error interno al ejecutar la campaña de rescate." }, { status: 500 });
  }
}
