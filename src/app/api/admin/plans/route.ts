import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const plans = await prisma.platformPlan.findMany({
      orderBy: [{ category: "asc" }, { priceUsd: "asc" }],
    });

    return NextResponse.json({
      success: true,
      data: plans,
    });
  } catch (error: any) {
    console.error("Error al obtener planes:", error);
    return NextResponse.json(
      { success: false, error: "Error interno al obtener los planes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      code,
      name,
      category = "SUBSCRIPTION",
      description,
      priceUsd,
      priceArs,
      billingCycle = "MONTHLY",
      maxContacts = 100,
      features = [],
    } = body;

    if (!code || !name || priceUsd === undefined) {
      return NextResponse.json(
        { success: false, error: "Código, nombre y precio en USD son obligatorios" },
        { status: 400 }
      );
    }

    const createdPlan = await prisma.platformPlan.create({
      data: {
        code: code.toUpperCase().trim(),
        name,
        category,
        description: description || "",
        priceUsd: parseFloat(priceUsd),
        priceArs: priceArs ? parseFloat(priceArs) : parseFloat(priceUsd) * 1200,
        billingCycle,
        maxContacts: parseInt(maxContacts, 10),
        featuresJson: JSON.stringify(features),
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: createdPlan,
      message: "Plan creado exitosamente",
    });
  } catch (error: any) {
    console.error("Error al crear plan:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Error al crear el plan" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, priceUsd, priceArs, maxContacts, description, name, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID de plan requerido" },
        { status: 400 }
      );
    }

    const updatedPlan = await prisma.platformPlan.update({
      where: { id },
      data: {
        ...(priceUsd !== undefined && { priceUsd: parseFloat(priceUsd) }),
        ...(priceArs !== undefined && { priceArs: parseFloat(priceArs) }),
        ...(maxContacts !== undefined && { maxContacts: parseInt(maxContacts, 10) }),
        ...(description !== undefined && { description }),
        ...(name !== undefined && { name }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedPlan,
      message: "Plan actualizado correctamente",
    });
  } catch (error: any) {
    console.error("Error al actualizar plan:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Error al actualizar el plan" },
      { status: 500 }
    );
  }
}

