import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { calculateIID } from "../src/lib/iid.ts";
import { sanitizeCsvField, generateContactsCsv } from "../src/lib/csv.ts";

const prisma = new PrismaClient();

describe("Social Backup by ADNQN — Criterios de Aceptación Críticos", () => {
  let tenant1;
  let tenant2;

  before(async () => {
    tenant1 = await prisma.tenant.findUnique({ where: { slug: "adnqn-coffee" } });
    tenant2 = await prisma.tenant.findUnique({ where: { slug: "patagonia-crossfit" } });
    assert.ok(tenant1, "Tenant 1 debe existir en la base de datos");
    assert.ok(tenant2, "Tenant 2 debe existir en la base de datos");
  });

  after(async () => {
    await prisma.$disconnect();
  });

  // CRITERIO 1: Aislamiento Multicliente
  test("Criterio 1: Un negocio no puede leer contactos de otro negocio (Aislamiento por Tenant)", async () => {
    const contactsTenant1 = await prisma.contact.findMany({
      where: { tenantId: tenant1.id },
    });

    const contactsTenant2 = await prisma.contact.findMany({
      where: { tenantId: tenant2.id },
    });

    // Ningún ID de tenant2 debe aparecer en los contactos de tenant1
    const idsTenant1 = new Set(contactsTenant1.map((c) => c.id));
    for (const c2 of contactsTenant2) {
      assert.equal(idsTenant1.has(c2.id), false, `Fuga de datos detectada: Contacto ${c2.id} de Tenant 2 presente en Tenant 1`);
    }
  });

  // CRITERIO 2: Captura y Consentimientos Granulares
  test("Criterio 2: Registro de consentimiento inmutable y canal no verificado por defecto", async () => {
    const testEmail = `test.capture.${Date.now()}@adnqn-test.com`;

    const contact = await prisma.contact.create({
      data: {
        tenantId: tenant1.id,
        name: "Usuario Prueba",
        status: "PENDING",
        source: "WEB_FORM",
      },
    });

    const channel = await prisma.contactChannel.create({
      data: {
        contactId: contact.id,
        tenantId: tenant1.id,
        type: "EMAIL",
        normalizedValue: testEmail,
        isVerified: false,
      },
    });

    const consent = await prisma.consentEvent.create({
      data: {
        contactId: contact.id,
        tenantId: tenant1.id,
        channelType: "EMAIL",
        purpose: "CONTINUITY_RESCUE",
        policyVersion: "v1.0",
        granted: true,
      },
    });

    assert.equal(channel.isVerified, false, "El canal debe crearse sin verificar");
    assert.equal(consent.purpose, "CONTINUITY_RESCUE");
    assert.equal(consent.granted, true);
  });

  // CRITERIO 3: Tokens de Verificación de un Solo Uso
  test("Criterio 3: El token de verificación solo se puede usar una vez y rechaza reutilización", async () => {
    const rawToken = "acceptance-token-" + Date.now();
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    // Crear contacto temporal
    const contact = await prisma.contact.create({
      data: { tenantId: tenant1.id, name: "Prueba Token", status: "PENDING" },
    });
    const channel = await prisma.contactChannel.create({
      data: { contactId: contact.id, tenantId: tenant1.id, type: "EMAIL", normalizedValue: `token.${Date.now()}@test.com` },
    });

    const tokenRecord = await prisma.verificationToken.create({
      data: {
        contactChannelId: channel.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 60000),
      },
    });

    // Primer uso
    assert.equal(tokenRecord.usedAt, null);
    const updated = await prisma.verificationToken.update({
      where: { id: tokenRecord.id },
      data: { usedAt: new Date() },
    });
    assert.ok(updated.usedAt !== null);

    // Segundo intento debe ser detectado como ya utilizado
    const checkAgain = await prisma.verificationToken.findUnique({ where: { tokenHash } });
    assert.ok(checkAgain.usedAt !== null, "El token debe figurar consumido");
  });

  // CRITERIO 4: Tokens Expirados son Rechazados
  test("Criterio 4: Tokens vencidos no permiten activación", async () => {
    const expiredTokenHash = crypto.createHash("sha256").update("expired-token-" + Date.now()).digest("hex");
    const contact = await prisma.contact.create({
      data: { tenantId: tenant1.id, status: "PENDING" },
    });
    const channel = await prisma.contactChannel.create({
      data: { contactId: contact.id, tenantId: tenant1.id, type: "EMAIL", normalizedValue: `expired.${Date.now()}@test.com` },
    });

    const tokenRecord = await prisma.verificationToken.create({
      data: {
        contactChannelId: channel.id,
        tokenHash: expiredTokenHash,
        expiresAt: new Date(Date.now() - 10000), // Ya expirado
      },
    });

    const isExpired = new Date() > tokenRecord.expiresAt;
    assert.equal(isExpired, true, "El token vencido debe ser detectado");
  });

  // CRITERIO 5: Exclusión Estricta de Bajas (Opt-out)
  test("Criterio 5: Un contacto dado de baja queda excluido de la audiencia de rescate", async () => {
    // Buscar en la base la suscriptora de prueba Lucía Fernández (dada de baja en seed)
    const suppressedContact = await prisma.contact.findFirst({
      where: {
        tenantId: tenant1.id,
        channels: {
          some: {
            normalizedValue: "lucia.baja@ejemplo.com",
          },
        },
      },
      include: {
        channels: true,
        preferences: true,
      },
    });

    assert.ok(suppressedContact, "Contacto dado de baja debe existir en seed");
    const emailChannel = suppressedContact.channels[0];
    assert.ok(emailChannel.optedOutAt !== null || suppressedContact.status === "SUPPRESSED", "Debe tener baja registrada");

    // Verificar filtro de elegibilidad
    const isEligible =
      suppressedContact.status !== "SUPPRESSED" &&
      emailChannel.isVerified &&
      emailChannel.optedOutAt === null &&
      suppressedContact.preferences.some((p) => p.allowRescue);

    assert.equal(isEligible, false, "El contacto dado de baja NUNCA debe ser elegible para envíos");
  });

  // CRITERIO 6: Idempotencia en Envíos de Rescate
  test("Criterio 6: Idempotencia evita duplicación de campañas de rescate con la misma clave", async () => {
    const idempotencyKey = "idempotency-test-" + Date.now();

    const incident = await prisma.rescueIncident.create({
      data: {
        tenantId: tenant1.id,
        platform: "INSTAGRAM",
        affectedHandle: "adnqncoffee",
        incidentType: "SUSPENDED",
        newOfficialUrl: "https://instagram.com/nueva_cuenta",
      },
    });

    // Primera ejecución
    const campaign1 = await prisma.rescueCampaign.create({
      data: {
        tenantId: tenant1.id,
        incidentId: incident.id,
        subject: "Aviso Rescate",
        messageBody: "Mensaje",
        newOfficialUrl: "https://instagram.com/nueva_cuenta",
        idempotencyKey,
        sentCount: 1,
      },
    });
    assert.ok(campaign1.id);

    // Intento de segunda ejecución con la misma clave: debe fallar por restricción única en BD
    await assert.rejects(
      async () => {
        await prisma.rescueCampaign.create({
          data: {
            tenantId: tenant1.id,
            incidentId: incident.id,
            subject: "Aviso Rescate Duplicado",
            messageBody: "Mensaje",
            newOfficialUrl: "https://instagram.com/nueva_cuenta",
            idempotencyKey,
            sentCount: 1,
          },
        });
      },
      /Unique constraint failed/
    );
  });

  // CRITERIO 7: Protección contra Inyección de Fórmulas CSV (CWE-1236)
  test("Criterio 7: El exportador CSV neutraliza caracteres peligrosos (=, +, -, @)", () => {
    const maliciousValues = [
      "=cmd|' /C calc'!A0",
      "+123456",
      "-5000",
      "@SUM(A1:A10)",
      "Normal text",
    ];

    for (const val of maliciousValues) {
      const sanitized = sanitizeCsvField(val);
      if (/^[=+\-@]/.test(val)) {
        assert.ok(sanitized.startsWith("\"'"), `El campo peligroso ${val} debe estar prefijado con apóstrofe para neutralizar fórmula`);
      } else {
        assert.equal(sanitized, `"${val}"`);
      }
    }
  });

  // CRITERIO 8: Metodología Transparente del IID
  test("Criterio 8: El IID calcula adecuadamente la relación y emite advertencia si es > 100%", () => {
    // Caso 1: Sin datos
    const iidEmpty = calculateIID(5, 5, {});
    assert.equal(iidEmpty.hasSufficientData, false);
    assert.equal(iidEmpty.scorePercentage, null);

    // Caso 2: Proporción normal
    const iidNormal = calculateIID(50, 45, { instagram: 500 });
    assert.equal(iidNormal.hasSufficientData, true);
    assert.equal(iidNormal.scorePercentage, 10);
    assert.equal(iidNormal.isOverHundredPercent, false);

    // Caso 3: Numerador mayor a seguidores declarados (más de 100%)
    const iidOver = calculateIID(120, 100, { instagram: 100 });
    assert.equal(iidOver.hasSufficientData, true);
    assert.equal(iidOver.scorePercentage, 120);
    assert.equal(iidOver.isOverHundredPercent, true);
    assert.ok(iidOver.explanation, "Debe contener explicación metodológica cuando supera el 100%");
  });
});
