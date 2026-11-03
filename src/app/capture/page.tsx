import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { 
  QrCode, 
  Copy, 
  ExternalLink, 
  Sparkles, 
  Code2, 
  Share2, 
  ArrowLeft,
  Check
} from "lucide-react";
import Link from "next/link";
import QRCode from "qrcode";

export const dynamic = "force-dynamic";

export default async function CapturePage({
  searchParams,
}: {
  searchParams: Promise<{ tenant?: string }>;
}) {
  const resolvedParams = await searchParams;
  const tenantSlug = resolvedParams.tenant || "adnqn-coffee";

  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
    include: {
      forms: true,
      captureCampaigns: true,
    },
  });

  if (!tenant) {
    return <div className="p-8 text-white">Negocio no encontrado</div>;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const publicPageUrl = `${appUrl}/c/${tenant.slug}`;
  const instagramBioUrl = `${appUrl}/c/${tenant.slug}?utm_source=instagram&utm_medium=bio&utm_campaign=comunidad`;

  // Generar DataURL del QR en el servidor
  let qrDataUrl = "";
  try {
    qrDataUrl = await QRCode.toDataURL(instagramBioUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: "#059669",
        light: "#ffffff",
      },
    });
  } catch (err) {
    console.error("Error generating QR:", err);
  }

  // Código del widget para copiar
  const widgetCode = `<!-- Social Backup by ADNQN Widget -->
<div id="social-backup-widget" data-tenant="${tenant.slug}" data-brand-color="${tenant.brandColor}"></div>
<script src="${appUrl}/widget.js" async defer></script>`;

  return (
    <div className="min-h-screen bg-brand-navy text-slate-100 flex flex-col">
      <Navbar tenantSlug={tenant.slug} tenantName={tenant.name} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Captación, Enlaces & Códigos QR
          </h1>
        </div>
        <p className="text-sm text-slate-400 mb-8">
          Herramientas oficiales para invitar a tus seguidores a registrarse voluntariamente en tu comunidad
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Box 1: Public Link & QR Code */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-white">Código QR & Enlace de Campaña</h3>
                </div>
                <Link
                  href={publicPageUrl}
                  target="_blank"
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                >
                  <span>Probar Formulario</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Descargá el QR para colocarlo en tu mostrador, folletos, empaques o historias de Instagram. Apunta directamente a tu formulario oficial con atribución de campaña.
              </p>

              {/* QR Image Box */}
              <div className="bg-white p-4 rounded-xl max-w-[260px] mx-auto mb-6 shadow-xl flex flex-col items-center">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="QR de Captación Social Backup" className="w-full h-auto rounded" />
                ) : (
                  <div className="w-48 h-48 bg-slate-200 flex items-center justify-center text-slate-500 text-xs">
                    Generando QR...
                  </div>
                )}
                <div className="text-[11px] font-bold text-slate-800 mt-2 text-center">
                  {tenant.name}
                </div>
                <div className="text-[10px] text-slate-500 text-center">
                  Escaneá y sumate a la comunidad
                </div>
              </div>

              {/* Direct links */}
              <div className="space-y-3 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Enlace de Campaña para Bio de Instagram / TikTok:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={instagramBioUrl}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-emerald-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Enlace Directo sin Parámetros:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={publicPageUrl}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Download Button */}
            {qrDataUrl && (
              <a
                href={qrDataUrl}
                download={`qr_socialbackup_${tenant.slug}.png`}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs text-center transition-all shadow-md shadow-emerald-600/20"
              >
                Descargar Código QR (PNG de Alta Calidad)
              </a>
            )}
          </div>

          {/* Box 2: Embeddable JS Widget */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Widget Incrustable para Sitios Web</h3>
                  <span className="text-[10px] text-emerald-400 font-medium">Compatible con cualquier web o WordPress</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Pegá este fragmento de código HTML en cualquier sitio web existente. El widget se adapta automáticamente a tu marca, valida consentimientos y nunca expone tus secretos ni tu base de datos.
              </p>

              <div className="relative mb-6">
                <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-[11px] font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                  {widgetCode}
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2 mb-6">
                <div className="font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Garantías de Seguridad del Widget:
                </div>
                <p className="text-[11px] text-slate-400">
                  • <strong>Permisos mínimos:</strong> Solo permite inserción de altas voluntarias.
                </p>
                <p className="text-[11px] text-slate-400">
                  • <strong>Cero exposición:</strong> Nunca permite listar ni consultar los contactos existentes.
                </p>
                <p className="text-[11px] text-slate-400">
                  • <strong>Validación en servidor:</strong> Cada registro pasa por control de cuotas, verificación de correo y filtros anti-abuso.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
              Copiar y pegar en el pie de página o barra lateral de tu web
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
