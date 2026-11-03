import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const cases = await prisma.frankensteinCase.findMany({
      include: {
        targets: {
          take: 20,
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calcular estadísticas globales
    const totalCases = cases.length;
    const totalScraped = cases.reduce((acc, c) => acc + c.totalScraped, 0);
    const totalNotified = cases.reduce((acc, c) => acc + c.totalNotified, 0);
    const totalConverted = cases.reduce((acc, c) => acc + c.totalConverted, 0);

    return NextResponse.json({
      success: true,
      data: cases,
      stats: {
        totalCases,
        totalScraped,
        totalNotified,
        totalConverted,
        avgConversionRate: totalNotified > 0 ? Math.round((totalConverted / totalNotified) * 100) : 0,
      },
    });
  } catch (error: any) {
    console.error("Error al obtener casos Frankenstein:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      clientName,
      clientEmail,
      clientPhone,
      lostPlatform = "INSTAGRAM",
      lostAccountUrl,
      newAccountUrl,
      tier = "FRANKEN_PRO",
      dailyRateLimit = 50,
      notes,
      priceCharged,
      isClientSubmission = false,
      tenantId,
    } = body;

    if (!clientName || !clientEmail || !lostAccountUrl) {
      return NextResponse.json(
        { success: false, error: "Nombre, email y enlace de la cuenta perdida son obligatorios" },
        { status: 400 }
      );
    }

    const defaultPrices: Record<string, number> = {
      FRANKEN_LOCAL: 180,
      FRANKEN_PRO: 420,
      FRANKEN_VIP: 850,
    };

    const newCase = await prisma.frankensteinCase.create({
      data: {
        tenantId: tenantId || null,
        clientName,
        clientEmail,
        clientPhone: clientPhone || null,
        lostPlatform,
        lostAccountUrl,
        newAccountUrl: newAccountUrl || "Pendiente de creación",
        status: isClientSubmission ? "PENDING_REVIEW" : "READY_FOR_DRIP",
        tier,
        dailyRateLimit: tier === "FRANKEN_VIP" ? 100 : (dailyRateLimit || 50),
        notes: notes || (isClientSubmission ? "Solicitud enviada desde el panel del cliente" : "Alta directa SuperAdmin"),
        priceCharged: priceCharged !== undefined ? Number(priceCharged) : (defaultPrices[tier] || 420),
      },
    });

    return NextResponse.json({
      success: true,
      case: newCase,
      message: isClientSubmission
        ? "Tu solicitud de Rescate Frankenstein ha sido recibida con éxito. Nuestro equipo forense analizará la cuenta y te contactará en breve."
        : "Caso Frankenstein creado exitosamente en la consola SuperAdmin.",
    });
  } catch (error: any) {
    console.error("Error al crear caso Frankenstein:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}

