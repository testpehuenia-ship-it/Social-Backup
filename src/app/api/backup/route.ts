import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = searchParams.get("tenantSlug") || "adnqn-coffee";

    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
      include: {
        forms: true,
        captureCampaigns: true,
        contacts: {
          include: {
            channels: true,
            consents: true,
            preferences: true,
          },
        },
        rescueIncidents: {
          include: {
            campaigns: true,
          },
        },
        auditLogs: {
          take: 50,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant no encontrado" }, { status: 404 });
    }

    const snapshot = {
      version: "1.0",
      generatedAt: new Date().toISOString(),
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      tenantName: tenant.name,
      plan: tenant.plan,
      data: {
        tenant: {
          name: tenant.name,
          slug: tenant.slug,
          brandColor: tenant.brandColor,
          headline: tenant.headline,
          description: tenant.description,
        },
        forms: tenant.forms,
        captureCampaigns: tenant.captureCampaigns,
        contacts: tenant.contacts,
        rescueIncidents: tenant.rescueIncidents,
        auditLogs: tenant.auditLogs,
      },
    };

    const serialized = JSON.stringify(snapshot, null, 2);
    const checksum = crypto.createHash("sha256").update(serialized).digest("hex");

    // Registrar BackupRun
    await prisma.backupRun.create({
      data: {
        tenantId: tenant.id,
        type: "FULL_TENANT_SNAPSHOT",
        status: "SUCCESS",
        checksum,
        dataJson: serialized,
      },
    });

    // Auditoría
    await prisma.auditLog.create({
      data: {
        tenantId: tenant.id,
        action: "BACKUP_GENERATE",
        resource: "tenant_backup",
        details: `Generado respaldo completo de datos con checksum ${checksum.substring(0, 8)}...`,
      },
    });

    return new NextResponse(serialized, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="backup_${tenant.slug}_${new Date().toISOString().split("T")[0]}_${checksum.substring(0, 8)}.json"`,
        "X-Checksum-Sha256": checksum,
      },
    });
  } catch (error: any) {
    console.error("Error al generar respaldo:", error);
    return NextResponse.json({ error: "Error interno al generar respaldo." }, { status: 500 });
  }
}
