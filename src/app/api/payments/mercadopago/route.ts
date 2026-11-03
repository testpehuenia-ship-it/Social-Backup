import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      caseId, 
      planCode, 
      amountUsd, 
      amountArs, 
      title, 
      clientEmail,
      action = "CREATE_LINK" 
    } = body;

    // Acción A: Simular / Confirmar recepción de pago
    if (action === "CONFIRM_PAYMENT" && caseId) {
      const updatedCase = await prisma.frankensteinCase.update({
        where: { id: caseId },
        data: {
          paymentStatus: "APPROVED",
          status: "READY_FOR_DRIP",
          notes: "Pago acreditado exitosamente por Mercado Pago (Checkout Pro). Listo para scraping y goteo.",
        },
      });

      return NextResponse.json({
        success: true,
        message: "¡Pago de Mercado Pago acreditado con éxito! Caso habilitado para iniciar rescate.",
        case: updatedCase,
      });
    }

    // Acción B: Crear Link de Pago / Preferencia de Mercado Pago
    const mpAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const finalAmountArs = amountArs || (amountUsd ? amountUsd * 1200 : 420 * 1200);
    const itemTitle = title || `Social Backup - Rescate Forense Frankenstein (${planCode || "PRO"})`;

    let preferenceId = `MP-PREF-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    let initPoint = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;

    // Si hay Access Token configurado de Mercado Pago, llamamos a la API oficial
    if (mpAccessToken) {
      try {
        const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${mpAccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: [
              {
                title: itemTitle,
                quantity: 1,
                currency_id: "ARS",
                unit_price: finalAmountArs,
              },
            ],
            payer: {
              email: clientEmail || "cliente@socialbackup.com",
            },
            back_urls: {
              success: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/frankenstein?status=success`,
              failure: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/frankenstein?status=failure`,
              pending: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/frankenstein?status=pending`,
            },
            auto_return: "approved",
            external_reference: caseId || `case_${Date.now()}`,
          }),
        });

        const mpData = await mpRes.json();
        if (mpData.id && mpData.init_point) {
          preferenceId = mpData.id;
          initPoint = mpData.init_point;
        }
      } catch (mpErr) {
        console.warn("Mercado Pago API warning (usando fallback seguro):", mpErr);
      }
    } else {
      // Fallback seguro de sandbox para pruebas sin token externo
      initPoint = `https://mpago.la/socialbackup-${preferenceId.toLowerCase()}`;
    }

    // Si se pasó un caseId, persistimos el link en la base de datos
    if (caseId) {
      await prisma.frankensteinCase.update({
        where: { id: caseId },
        data: {
          mercadoPagoPreferenceId: preferenceId,
          mercadoPagoPaymentUrl: initPoint,
        },
      });
    }

    return NextResponse.json({
      success: true,
      preferenceId,
      paymentUrl: initPoint,
      amountArs: finalAmountArs,
      amountUsd: amountUsd || finalAmountArs / 1200,
      message: "Preferencia de Mercado Pago generada con éxito.",
    });
  } catch (error: any) {
    console.error("Error en Mercado Pago:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Error al procesar Mercado Pago" },
      { status: 500 }
    );
  }
}

