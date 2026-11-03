import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tenantSlug, email, name, consentRescue, consentNews, source = "WEB_FORM", originUrl, utmSource, utmMedium, utmCampaign } = body;

    // 1. Validaciones básicas
    if (!tenantSlug || !email) {
      return NextResponse.json({ success: false, error: "Datos incompletos. Se requiere email y negocio." }, { status: 400 });
    }

    // Normalizar email
    const normalizedEmail = String(email).trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json({ success: false, error: "El formato de correo electrónico no es válido." }, { status: 400 });
    }

    // El consentimiento de continuidad/rescate es requerido expresamente
    if (!consentRescue) {
      return NextResponse.json({
        success: false,
        error: "Para registrarte debes aceptar recibir avisos de continuidad y nueva presencia.",
      }, { status: 400 });
    }

    // 2. Buscar Tenant
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
      include: {
        _count: {
          select: { contacts: true },
        },
      },
    });

    if (!tenant || tenant.status !== "ACTIVE") {
      return NextResponse.json({ success: false, error: "El negocio no existe o se encuentra inactivo." }, { status: 404 });
    }

    // 3. Control de Cuotas del Plan Free (hasta 100 contactos)
    const MAX_FREE_CONTACTS = parseInt(process.env.FREE_PLAN_MAX_CONTACTS || "100", 10);
    if (tenant.plan === "FREE" && tenant._count.contacts >= MAX_FREE_CONTACTS) {
      // Verificar si ya existe este contacto específico antes de bloquear
      const existingChannel = await prisma.contactChannel.findUnique({
        where: {
          tenantId_type_normalizedValue: {
            tenantId: tenant.id,
            type: "EMAIL",
            normalizedValue: normalizedEmail,
          },
        },
      });

      if (!existingChannel) {
        return NextResponse.json({
          success: false,
          error: "Este negocio ha alcanzado el límite de contactos de su plan actual. Te invitamos a intentar nuevamente más adelante.",
          isQuotaReached: true,
        }, { status: 403 });
      }
    }

    // Hash de IP y User Agent para trazabilidad probatoria del consentimiento sin guardar PII excesiva
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "127.0.0.1";
    const ipHash = crypto.createHash("sha256").update(ip + "adnqn_salt").digest("hex").substring(0, 16);
    const userAgent = req.headers.get("user-agent") || "unknown";

    // 4. Buscar o Crear Contacto dentro del Tenant
    let channel = await prisma.contactChannel.findUnique({
      where: {
        tenantId_type_normalizedValue: {
          tenantId: tenant.id,
          type: "EMAIL",
          normalizedValue: normalizedEmail,
        },
      },
      include: {
        contact: true,
      },
    });

    let contactId = channel?.contactId;

    if (!channel) {
      // Crear nuevo contacto
      const newContact = await prisma.contact.create({
        data: {
          tenantId: tenant.id,
          name: name ? String(name).trim() : null,
          source: String(source).toUpperCase(),
          status: "PENDING",
        },
      });
      contactId = newContact.id;

      channel = await prisma.contactChannel.create({
        data: {
          contactId: newContact.id,
          tenantId: tenant.id,
          type: "EMAIL",
          normalizedValue: normalizedEmail,
          isVerified: false,
        },
        include: {
          contact: true,
        },
      });

      // Crear preferencias iniciales
      await prisma.preference.create({
        data: {
          contactId: newContact.id,
          tenantId: tenant.id,
          allowRescue: Boolean(consentRescue),
          allowNewsletter: Boolean(consentNews),
        },
      });
    } else {
      // Actualizar nombre si no existía
      if (name && !channel.contact.name) {
        await prisma.contact.update({
          where: { id: channel.contact.id },
          data: { name: String(name).trim() },
        });
      }

      // Actualizar preferencias
      await prisma.preference.upsert({
        where: {
          tenantId_contactId: {
            tenantId: tenant.id,
            contactId: channel.contact.id,
          },
        },
        create: {
          tenantId: tenant.id,
          contactId: channel.contact.id,
          allowRescue: Boolean(consentRescue),
          allowNewsletter: Boolean(consentNews),
        },
        update: {
          allowRescue: Boolean(consentRescue),
          allowNewsletter: Boolean(consentNews),
        },
      });
    }

    // 5. Registrar Eventos de Consentimiento Explícito (inmutables)
    await prisma.consentEvent.create({
      data: {
        contactId: contactId!,
        tenantId: tenant.id,
        channelType: "EMAIL",
        purpose: "CONTINUITY_RESCUE",
        policyVersion: "v1.0",
        ipHash,
        userAgent,
        sourceUrl: originUrl || req.headers.get("referer"),
        utmSource: utmSource || null,
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
        granted: true,
      },
    });

    if (consentNews) {
      await prisma.consentEvent.create({
        data: {
          contactId: contactId!,
          tenantId: tenant.id,
          channelType: "EMAIL",
          purpose: "COMMUNITY_NEWS",
          policyVersion: "v1.0",
          ipHash,
          userAgent,
          sourceUrl: originUrl || req.headers.get("referer"),
          utmSource: utmSource || null,
          utmMedium: utmMedium || null,
          utmCampaign: utmCampaign || null,
          granted: true,
        },
      });
    }

    // 6. Generar Token de Verificación de un solo uso
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    await prisma.verificationToken.create({
      data: {
        contactChannelId: channel.id,
        tokenHash,
        expiresAt,
      },
    });

    // 7. Enviar Correo de Verificación (vía adaptador con modo sandbox)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verificationLink = `${appUrl}/c/${tenant.slug}/verify?token=${rawToken}`;

    await sendEmail({
      to: normalizedEmail,
      subject: `Confirmá tu suscripción a la comunidad de ${tenant.name}`,
      tenantName: tenant.name,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; color: #1e293b; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h2 style="color: ${tenant.brandColor}; margin-top: 0;">¡Hola${name ? ` ${name}` : ""}!</h2>
          <p>Queremos asegurarnos de que realmente querés unirte a la comunidad oficial de <strong>${tenant.name}</strong> para no perder el contacto si cambian nuestras redes sociales.</p>
          <div style="margin: 28px 0; text-align: center;">
            <a href="${verificationLink}" style="background: ${tenant.brandColor}; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
              Confirmar mi suscripción
            </a>
          </div>
          <p style="font-size: 13px; color: #64748b;">Este enlace es de uso único y vence en 24 horas. Si no solicitaste este registro, podés ignorar este correo.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center;">
            Social Backup by ADNQN · «Tus redes pueden desaparecer. Tu comunidad debe permanecer».
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "¡Registro recibido! Por favor revisá tu casilla de correo para confirmar tu dirección.",
      debugLink: process.env.NODE_ENV !== "production" ? verificationLink : undefined,
    });
  } catch (error: any) {
    console.error("Error en capture submit:", error);
    return NextResponse.json({ success: false, error: "Ocurrió un error interno al procesar el registro." }, { status: 500 });
  }
}
