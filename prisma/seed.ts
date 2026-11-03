import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  console.log("Iniciando seed de Social Backup by ADNQN...");

  // 1. Limpieza controlada
  await prisma.platformPlan.deleteMany({});
  await prisma.frankensteinTarget.deleteMany({});
  await prisma.frankensteinCase.deleteMany({});
  await prisma.rescueMessage.deleteMany({});
  await prisma.rescueCampaign.deleteMany({});
  await prisma.rescueIncident.deleteMany({});
  await prisma.consentEvent.deleteMany({});
  await prisma.preference.deleteMany({});
  await prisma.verificationToken.deleteMany({});
  await prisma.contactChannel.deleteMany({});
  await prisma.contact.deleteMany({});
  await prisma.form.deleteMany({});
  await prisma.captureCampaign.deleteMany({});
  await prisma.socialConnection.deleteMany({});
  await prisma.membership.deleteMany({});
  await prisma.tenant.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Crear SuperAdmin ADNQN
  const superAdmin = await prisma.user.create({
    data: {
      email: "soporte@adnqn.com",
      name: "Soporte Central ADNQN",
      passwordHash: hashPassword("adnqn2026!"),
      isSuperAdmin: true,
    },
  });

  // 3. Crear Usuario Administrador de Negocio
  const businessAdmin = await prisma.user.create({
    data: {
      email: "admin@adnqncoffee.com",
      name: "Martín Cafetero",
      passwordHash: hashPassword("admin123"),
      isSuperAdmin: false,
    },
  });

  // 4. Crear Negocio Principal: ADNQN Coffee & Roasters
  const tenant1 = await prisma.tenant.create({
    data: {
      name: "ADNQN Coffee Roasters",
      slug: "adnqn-coffee",
      brandColor: "#059669",
      headline: "Unite a la Comunidad ADNQN Coffee",
      description: "Nuestras cuentas en redes pueden cambiar, pero vos y tu café especial se quedan siempre con nosotros.",
      plan: "FREE",
      status: "ACTIVE",
      reportedFollowersInstagram: 1250,
      reportedFollowersFacebook: 600,
      reportedFollowersTikTok: 350,
      reportedFollowersUpdatedAt: new Date(),
    },
  });

  // Membresía
  await prisma.membership.create({
    data: {
      tenantId: tenant1.id,
      userId: businessAdmin.id,
      role: "OWNER",
    },
  });

  // Formulario por defecto
  const form1 = await prisma.form.create({
    data: {
      tenantId: tenant1.id,
      slug: "default",
      title: "Comunidad ADNQN Coffee",
      description: "Dejanos tus datos para recibir catas exclusivas, beneficios y mantenernos comunicados pase lo que pase con las redes sociales.",
      askName: true,
      requireName: false,
      submitButtonText: "Quiero ser parte",
      successMessage: "¡Excelente! Te enviamos un correo para verificar tu suscripción y confirmar tu lugar.",
      isActive: true,
      allowedOrigins: "*",
    },
  });

  // Campaña de captura de bio Instagram
  await prisma.captureCampaign.create({
    data: {
      tenantId: tenant1.id,
      name: "Bio de Instagram",
      slug: "bio-ig",
      utmSource: "instagram",
      utmMedium: "bio",
      utmCampaign: "comunidad-cafe",
      clicksCount: 42,
    },
  });

  // Conexiones de redes sociales (estado real no simulado)
  await prisma.socialConnection.create({
    data: {
      tenantId: tenant1.id,
      platform: "INSTAGRAM",
      status: "COMING_SOON",
      accountName: "@adnqncoffee",
      profileUrl: "https://instagram.com/adnqncoffee",
    },
  });

  await prisma.socialConnection.create({
    data: {
      tenantId: tenant1.id,
      platform: "FACEBOOK",
      status: "COMING_SOON",
      accountName: "ADNQN Coffee",
    },
  });

  // 5. Contactos de Demostración Separados y Explícitos
  // Contacto 1: Verificado y Habilitado para rescate y novedades
  const contact1 = await prisma.contact.create({
    data: {
      tenantId: tenant1.id,
      name: "Sofía Martínez",
      status: "ACTIVE",
      source: "WEB_FORM",
    },
  });
  const channel1 = await prisma.contactChannel.create({
    data: {
      contactId: contact1.id,
      tenantId: tenant1.id,
      type: "EMAIL",
      normalizedValue: "sofia.martinez@ejemplo.com",
      isVerified: true,
      verifiedAt: new Date(),
    },
  });
  await prisma.preference.create({
    data: {
      contactId: contact1.id,
      tenantId: tenant1.id,
      allowRescue: true,
      allowNewsletter: true,
    },
  });
  await prisma.consentEvent.create({
    data: {
      contactId: contact1.id,
      tenantId: tenant1.id,
      channelType: "EMAIL",
      purpose: "CONTINUITY_RESCUE",
      policyVersion: "v1.0",
      utmSource: "instagram",
      utmMedium: "bio",
      utmCampaign: "comunidad-cafe",
      granted: true,
    },
  });

  // Contacto 2: Pendiente de verificación (no elegible para rescate masivo hasta verificar)
  const contact2 = await prisma.contact.create({
    data: {
      tenantId: tenant1.id,
      name: "Carlos Gómez",
      status: "PENDING",
      source: "WIDGET",
    },
  });
  const channel2 = await prisma.contactChannel.create({
    data: {
      contactId: contact2.id,
      tenantId: tenant1.id,
      type: "EMAIL",
      normalizedValue: "carlos.gomez@ejemplo.com",
      isVerified: false,
    },
  });
  await prisma.preference.create({
    data: {
      contactId: contact2.id,
      tenantId: tenant1.id,
      allowRescue: true,
      allowNewsletter: false,
    },
  });
  // Token activo de prueba para Carlos
  const tokenHashCarlos = crypto.createHash("sha256").update("demo-token-carlos-123").digest("hex");
  await prisma.verificationToken.create({
    data: {
      contactChannelId: channel2.id,
      tokenHash: tokenHashCarlos,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
    },
  });

  // Contacto 3: Dado de baja (Opted-out) - No debe ser contactado bajo ninguna circunstancia
  const contact3 = await prisma.contact.create({
    data: {
      tenantId: tenant1.id,
      name: "Lucía Fernández",
      status: "SUPPRESSED",
      source: "QR_CODE",
    },
  });
  await prisma.contactChannel.create({
    data: {
      contactId: contact3.id,
      tenantId: tenant1.id,
      type: "EMAIL",
      normalizedValue: "lucia.baja@ejemplo.com",
      isVerified: true,
      verifiedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      optedOutAt: new Date(), // DADA DE BAJA
    },
  });
  await prisma.preference.create({
    data: {
      contactId: contact3.id,
      tenantId: tenant1.id,
      allowRescue: false,
      allowNewsletter: false,
    },
  });

  // 6. Segundo Tenant para probar Aislamiento Multicliente
  const tenant2 = await prisma.tenant.create({
    data: {
      name: "Patagonia Crossfit",
      slug: "patagonia-crossfit",
      brandColor: "#0284c7",
      headline: "Comunidad de Atletas Patagonia",
      plan: "FREE",
      status: "ACTIVE",
    },
  });

  const contactPatagonia = await prisma.contact.create({
    data: {
      tenantId: tenant2.id,
      name: "Juan Atleta",
      status: "ACTIVE",
    },
  });
  await prisma.contactChannel.create({
    data: {
      contactId: contactPatagonia.id,
      tenantId: tenant2.id,
      type: "EMAIL",
      normalizedValue: "juan.atleta@otrocliente.com",
      isVerified: true,
      verifiedAt: new Date(),
    },
  });

  // 7. Caso de Demostración: Cuentas Frankenstein (Rescate VIP)
  const frankenCase = await prisma.frankensteinCase.create({
    data: {
      tenantId: tenant1.id,
      clientName: "Valeria Rossi (Influencer Moda & Lifestyle)",
      clientEmail: "valeria@rossistyle.com",
      clientPhone: "+54 9 299 555-1928",
      lostPlatform: "INSTAGRAM",
      lostAccountUrl: "https://instagram.com/valeriarossi_style",
      newAccountUrl: "https://instagram.com/valeriarossi.oficial",
      status: "IN_PROGRESS",
      tier: "FRANKEN_VIP",
      dailyRateLimit: 100,
      priceCharged: 850.0,
      totalScraped: 120,
      totalNotified: 45,
      totalConverted: 26,
      notes: "Cuenta con 48k seguidores suspendida arbitrariamente por Meta sin preaviso. Activado cluster de satélites ADNQN.",
    },
  });

  // Targets de muestra
  const sampleTargets = [
    { handle: "@camila_lookbook", displayName: "Camila V.", email: "camila@modablog.com", status: "CONVERTED", notificationChannel: "DIRECT_EMAIL", responseNote: "Se unió a la nueva cuenta y envió felicitaciones." },
    { handle: "@fashion_neuquen", displayName: "Neuquén Tendencias", email: "info@neuquentendencias.com", status: "CONVERTED", notificationChannel: "DIRECT_EMAIL", responseNote: "Re-siguió la nueva cuenta oficial." },
    { handle: "@lucas_streetstyle", displayName: "Lucas B.", email: null, status: "SENT", notificationChannel: "SATELLITE_DM", responseNote: "Mensaje entregado mediante cuenta satélite verificada ADNQN." },
    { handle: "@sofia_outfits", displayName: "Sofía O.", email: null, status: "PENDING", notificationChannel: "SATELLITE_DM", responseNote: "En cola para el próximo lote seguro." },
    { handle: "@estilourbano.arg", displayName: "Estilo Urbano", email: "contacto@estilourbano.ar", status: "PENDING", notificationChannel: "DIRECT_EMAIL", responseNote: "En cola para el próximo lote seguro." },
  ];

  for (const st of sampleTargets) {
    await prisma.frankensteinTarget.create({
      data: {
        caseId: frankenCase.id,
        handle: st.handle,
        displayName: st.displayName,
        email: st.email,
        status: st.status,
        notificationChannel: st.notificationChannel,
        responseNote: st.responseNote,
        sentAt: st.status !== "PENDING" ? new Date() : null,
        convertedAt: st.status === "CONVERTED" ? new Date() : null,
      },
    });
  }

  // 8. Crear Planes de la Plataforma
  const plans = [
    {
      code: "FREE",
      name: "Plan Free Independiente",
      category: "SUBSCRIPTION",
      description: "Para pequeños negocios que desean probar la soberanía de sus contactos.",
      priceUsd: 0,
      priceArs: 0,
      billingCycle: "MONTHLY",
      maxContacts: 100,
      featuresJson: JSON.stringify(["Hasta 100 contactos", "1 Formulario de captura", "Modo rescate básico por email", "Exportación CSV segura"]),
    },
    {
      code: "ADNQN_WEB",
      name: "Social Backup + Web ADNQN",
      category: "SUBSCRIPTION",
      description: "Exclusivo para clientes con sitios web desarrollados por ADNQN. Comienzan de cero con acompañamiento y widgets exclusivos.",
      priceUsd: 35,
      priceArs: 42000,
      billingCycle: "MONTHLY",
      maxContacts: 1500,
      featuresJson: JSON.stringify(["Integración completa en tu Web ADNQN", "Estrategia para empezar redes desde cero", "Hasta 1.500 contactos verificados", "Widget embebible de alta conversión", "Soporte prioritario ADNQN"]),
    },
    {
      code: "PRO",
      name: "Social Backup Profesional",
      category: "SUBSCRIPTION",
      description: "Para marcas y empresas con comunidades medianas en crecimiento constante.",
      priceUsd: 49,
      priceArs: 58800,
      billingCycle: "MONTHLY",
      maxContacts: 5000,
      featuresJson: JSON.stringify(["Hasta 5.000 contactos", "Múltiples formularios y campañas UTM", "Modo Rescate prioritario", "Atribución avanzada y códigos QR ilimitados"]),
    },
    {
      code: "ENTERPRISE",
      name: "Social Backup Empresa",
      category: "SUBSCRIPTION",
      description: "Para corporaciones, agencias y marcas masivas sin límites de escala.",
      priceUsd: 120,
      priceArs: 144000,
      billingCycle: "MONTHLY",
      maxContacts: 25000,
      featuresJson: JSON.stringify(["Hasta 25.000 contactos", "SLA de rescate inmediato", "Integraciones multi-red", "Gestor de cuenta asignado ADNQN"]),
    },
    {
      code: "FRANKEN_LOCAL",
      name: "Rescate Franken-Local",
      category: "RESCUE_FRANKENSTEIN",
      description: "Para comercios locales que sufrieron baneo en 1 red social.",
      priceUsd: 180,
      priceArs: 216000,
      billingCycle: "ONE_TIME",
      maxContacts: 2500,
      featuresJson: JSON.stringify(["Extracción forense de hasta 2.500 seguidores", "Despacho seguro de 50 mensajes/día", "3 meses de Social Backup Free incluidos", "Blindaje anti-bloqueo"]),
    },
    {
      code: "FRANKEN_PRO",
      name: "Rescate Franken-Pro",
      category: "RESCUE_FRANKENSTEIN",
      description: "Para marcas y creadores con audiencia consolidada.",
      priceUsd: 420,
      priceArs: 504000,
      billingCycle: "ONE_TIME",
      maxContacts: 10000,
      featuresJson: JSON.stringify(["Extracción forense de hasta 10.000 seguidores", "Despacho dosificado de 100 mensajes/día", "Uso de cuentas satélite ADNQN", "3 meses de Social Backup Pro incluidos"]),
    },
    {
      code: "FRANKEN_VIP",
      name: "Rescate Franken-VIP (Influencers)",
      category: "RESCUE_FRANKENSTEIN",
      description: "Para influencers y figuras públicas con comunidades masivas.",
      priceUsd: 850,
      priceArs: 1020000,
      billingCycle: "ONE_TIME",
      maxContacts: 50000,
      featuresJson: JSON.stringify(["Extracción forense profunda (+10k a 50k+ seguidores)", "Cluster multi-satélite de alta velocidad", "Detección de emails públicos en bios y posts", "Acompañamiento personal de relanzamiento"]),
    },
  ];

  for (const p of plans) {
    await prisma.platformPlan.create({ data: p });
  }

  console.log("Seed completado exitosamente:");
  console.log("- SuperAdmin: soporte@adnqn.com / adnqn2026!");
  console.log("- Admin Negocio: admin@adnqncoffee.com / admin123");
  console.log(`- Tenant 1: ${tenant1.name} (slug: ${tenant1.slug})`);
  console.log(`- Tenant 2: ${tenant2.name} (slug: ${tenant2.slug})`);
}

main()
  .catch((e) => {
    console.error("Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
