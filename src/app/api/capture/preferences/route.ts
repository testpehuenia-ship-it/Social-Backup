import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tenantSlug, email, allowRescue, allowNewsletter, unsubscribeAll } = body;

    if (!tenantSlug || !email) {
      return NextResponse.json({ success: false, error: "Email y negocio son obligatorios." }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
    });

    if (!tenant) {
      return NextResponse.json({ success: false, error: "Negocio no encontrado." }, { status: 404 });
    }

    const channel = await prisma.contactChannel.findUnique({
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

    if (!channel) {
      return NextResponse.json({ success: false, error: "Contacto no encontrado en este negocio." }, { status: 404 });
    }

    const isFullUnsubscribe = Boolean(unsubscribeAll) || (!allowRescue && !allowNewsletter);

    if (isFullUnsubscribe) {
      // Registrar baja total inmediata
      await prisma.contactChannel.update({
        where: { id: channel.id },
        data: { optedOutAt: new Date() },
      });

      await prisma.contact.update({
        where: { id: channel.contact.id },
        data: { status: "SUPPRESSED" },
      });

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
          allowRescue: false,
          allowNewsletter: false,
        },
        update: {
          allowRescue: false,
          allowNewsletter: false,
        },
      });

      // Evento de consentimiento revocado
      await prisma.consentEvent.create({
        data: {
          contactId: channel.contact.id,
          tenantId: tenant.id,
          channelType: "EMAIL",
          purpose: "ALL_COMMUNICATIONS",
          policyVersion: "v1.0",
          granted: false,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Has sido dado de baja correctamente. No recibirás más comunicaciones de este negocio.",
        isSuppressed: true,
      });
    }

    // Actualizar preferencias parciales
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
        allowRescue: Boolean(allowRescue),
        allowNewsletter: Boolean(allowNewsletter),
      },
      update: {
        allowRescue: Boolean(allowRescue),
        allowNewsletter: Boolean(allowNewsletter),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Tus preferencias de comunicación han sido actualizadas.",
      isSuppressed: false,
    });
  } catch (error: any) {
    console.error("Error en preferencias:", error);
    return NextResponse.json({ success: false, error: "Error interno al actualizar preferencias." }, { status: 500 });
  }
}
