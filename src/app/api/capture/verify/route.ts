import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ success: false, error: "Token de verificación no proporcionado." }, { status: 400 });
    }

    const tokenHash = crypto.createHash("sha256").update(String(token).trim()).digest("hex");

    const verificationRecord = await prisma.verificationToken.findUnique({
      where: { tokenHash },
      include: {
        channel: {
          include: {
            contact: {
              include: {
                tenant: true,
              },
            },
          },
        },
      },
    });

    if (!verificationRecord) {
      return NextResponse.json({ success: false, error: "El enlace de verificación no es válido o no existe." }, { status: 400 });
    }

    if (verificationRecord.usedAt) {
      return NextResponse.json({
        success: false,
        error: "Este enlace de verificación ya fue utilizado previamente.",
        isAlreadyUsed: true,
      }, { status: 400 });
    }

    if (new Date() > verificationRecord.expiresAt) {
      return NextResponse.json({
        success: false,
        error: "El enlace de verificación ha expirado. Por favor, solicita uno nuevo en el formulario.",
        isExpired: true,
      }, { status: 400 });
    }

    // Marcar token como consumido (un solo uso)
    await prisma.verificationToken.update({
      where: { id: verificationRecord.id },
      data: { usedAt: new Date() },
    });

    // Marcar canal como verificado
    await prisma.contactChannel.update({
      where: { id: verificationRecord.contactChannelId },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
      },
    });

    // Activar contacto
    await prisma.contact.update({
      where: { id: verificationRecord.channel.contactId },
      data: { status: "ACTIVE" },
    });

    const tenant = verificationRecord.channel.contact.tenant;

    return NextResponse.json({
      success: true,
      message: "¡Tu correo ha sido verificado con éxito! Ahora formas parte de nuestra comunidad.",
      tenant: {
        name: tenant.name,
        slug: tenant.slug,
        brandColor: tenant.brandColor,
      },
    });
  } catch (error: any) {
    console.error("Error en capture verify:", error);
    return NextResponse.json({ success: false, error: "Error interno al verificar el token." }, { status: 500 });
  }
}
