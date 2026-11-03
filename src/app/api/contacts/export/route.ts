import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateContactsCsv, CsvContactRow } from "@/lib/csv";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = searchParams.get("tenantSlug") || "adnqn-coffee";

    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant no encontrado" }, { status: 404 });
    }

    // Consulta con aislamiento estricto por tenantId
    const contacts = await prisma.contact.findMany({
      where: { tenantId: tenant.id },
      include: {
        channels: true,
        preferences: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const rows: CsvContactRow[] = contacts.map((c) => {
      const emailChannel = c.channels.find((ch) => ch.type === "EMAIL");
      const pref = c.preferences[0];
      const isSuppressed = c.status === "SUPPRESSED" || (emailChannel && emailChannel.optedOutAt !== null);

      return {
        id: c.id,
        nombre: c.name || "Sin nombre",
        email: emailChannel?.normalizedValue || "Sin email",
        estado: isSuppressed ? "DADO DE BAJA" : c.status,
        canal_verificado: emailChannel?.isVerified ? "SI" : "NO",
        fecha_verificacion: emailChannel?.verifiedAt ? emailChannel.verifiedAt.toISOString().split("T")[0] : "-",
        autoriza_rescate: pref?.allowRescue && !isSuppressed ? "SI" : "NO",
        autoriza_noticias: pref?.allowNewsletter && !isSuppressed ? "SI" : "NO",
        origen: c.source,
        fecha_registro: c.createdAt.toISOString().split("T")[0],
      };
    });

    const csvContent = generateContactsCsv(rows);

    // Auditoría
    await prisma.auditLog.create({
      data: {
        tenantId: tenant.id,
        action: "EXPORT_CSV",
        resource: "contacts",
        details: `Exportados ${contacts.length} contactos en formato CSV`,
      },
    });

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="contactos_${tenant.slug}_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error: any) {
    console.error("Error en exportación CSV:", error);
    return NextResponse.json({ error: "Error interno al generar exportación" }, { status: 500 });
  }
}
