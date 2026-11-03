import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tenantSlug = "adnqn-coffee",
      instagram = 0,
      facebook = 0,
      tiktok = 0,
      youtube = 0,
      linkedIn = 0,
      x = 0,
    } = body;

    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
    });

    if (!tenant) {
      return NextResponse.json({ success: false, error: "Negocio no encontrado." }, { status: 404 });
    }

    const updated = await prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        reportedFollowersInstagram: Math.max(0, parseInt(instagram, 10) || 0),
        reportedFollowersFacebook: Math.max(0, parseInt(facebook, 10) || 0),
        reportedFollowersTikTok: Math.max(0, parseInt(tiktok, 10) || 0),
        reportedFollowersYouTube: Math.max(0, parseInt(youtube, 10) || 0),
        reportedFollowersLinkedIn: Math.max(0, parseInt(linkedIn, 10) || 0),
        reportedFollowersX: Math.max(0, parseInt(x, 10) || 0),
        reportedFollowersUpdatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Métricas de seguidores actualizadas para el cálculo del IID.",
      metrics: {
        instagram: updated.reportedFollowersInstagram,
        facebook: updated.reportedFollowersFacebook,
        tiktok: updated.reportedFollowersTikTok,
        youtube: updated.reportedFollowersYouTube,
        linkedIn: updated.reportedFollowersLinkedIn,
        x: updated.reportedFollowersX,
        updatedAt: updated.reportedFollowersUpdatedAt,
      },
    });
  } catch (error: any) {
    console.error("Error al actualizar métricas:", error);
    return NextResponse.json({ success: false, error: "Error al actualizar métricas." }, { status: 500 });
  }
}
