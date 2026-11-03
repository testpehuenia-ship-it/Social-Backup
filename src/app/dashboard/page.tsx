import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { 
  Users, 
  CheckCircle2, 
  Send, 
  LifeBuoy, 
  QrCode, 
  Download, 
  AlertTriangle, 
  TrendingUp, 
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Info
} from "lucide-react";
import { calculateIID } from "@/lib/iid";
import { FrankensteinPromoBanner } from "@/components/FrankensteinPromoBanner";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tenant?: string }>;
}) {
  const resolvedParams = await searchParams;
  const tenantSlug = resolvedParams.tenant || "adnqn-coffee";

  // Buscar tenant y datos asociados
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
    include: {
      contacts: {
        include: {
          channels: true,
          preferences: true,
        },
      },
      forms: true,
      rescueIncidents: {
        include: {
          campaigns: true,
        },
        orderBy: { reportedAt: "desc" },
        take: 3,
      },
    },
  });

  if (!tenant) {
    return (
      <div className="min-h-screen bg-brand-navy text-slate-100 flex items-center justify-center p-4">
        <div className="glass-panel p-8 rounded-xl max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Negocio no encontrado</h2>
          <p className="text-sm text-slate-400 mb-6">El slug "{tenantSlug}" no existe en la base de datos.</p>
          <Link href="/dashboard?tenant=adnqn-coffee" className="px-4 py-2 bg-emerald-600 rounded-lg text-sm font-semibold">
            Ir a ADNQN Coffee Roasters
          </Link>
        </div>
      </div>
    );
  }

  // Métricas calculadas con trazabilidad
  const totalContacts = tenant.contacts.length;
  
  const verifiedContacts = tenant.contacts.filter((c) =>
    c.channels.some((ch) => ch.type === "EMAIL" && ch.isVerified)
  ).length;

  const eligibleForRescue = tenant.contacts.filter((c) => {
    if (c.status === "SUPPRESSED") return false;
    const emailChannel = c.channels.find((ch) => ch.type === "EMAIL");
    if (!emailChannel || !emailChannel.isVerified || emailChannel.optedOutAt !== null) return false;
    const pref = c.preferences.find((p) => p.allowRescue);
    return Boolean(pref);
  }).length;

  const unsubscribedContacts = tenant.contacts.filter((c) =>
    c.status === "SUPPRESSED" || c.channels.some((ch) => ch.optedOutAt !== null)
  ).length;

  // Seguidores reportados
  const followers = {
    instagram: tenant.reportedFollowersInstagram,
    facebook: tenant.reportedFollowersFacebook,
    tiktok: tenant.reportedFollowersTikTok,
    youtube: tenant.reportedFollowersYouTube,
    linkedIn: tenant.reportedFollowersLinkedIn,
    x: tenant.reportedFollowersX,
  };

  const iid = calculateIID(verifiedContacts, eligibleForRescue, followers);

  // Cuotas Plan Free
  const maxContactsFree = parseInt(process.env.FREE_PLAN_MAX_CONTACTS || "100", 10);
  const quotaPercentage = Math.min(100, Math.round((totalContacts / maxContactsFree) * 100));
  const isNearQuota = quotaPercentage >= 80;

  return (
    <div className="min-h-screen bg-brand-navy text-slate-100 flex flex-col">
      <Navbar tenantSlug={tenant.slug} tenantName={tenant.name} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Header & Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{tenant.name}</h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Plan {tenant.plan}
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Panel de control Social Manager · Control y soberanía sobre la comunicación con tu comunidad
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/rescue"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition-all shadow-md shadow-rose-600/20"
            >
              <LifeBuoy className="w-4 h-4" />
              <span>Modo Rescate</span>
            </Link>

            <Link
              href="/capture"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-all"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>Captura & QR</span>
            </Link>

            <a
              href={`/api/contacts/export?tenantSlug=${tenant.slug}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-all"
              title="Descargar base en CSV seguro"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Exportar CSV</span>
            </a>
          </div>
        </div>

        {/* Quota Alert Banner if near limit */}
        {isNearQuota && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
              <div>
                <strong>Aviso de Cuota Free:</strong> Has utilizado {totalContacts} de {maxContactsFree} contactos disponibles ({quotaPercentage}%). Tus datos nunca serán eliminados al llegar al límite.
              </div>
            </div>
            <span className="font-semibold px-2 py-1 bg-amber-500/20 rounded">
              Límite {maxContactsFree}
            </span>
          </div>
        )}

        {/* Frankenstein Promotion Banner for Lost Accounts */}
        <FrankensteinPromoBanner tenantSlug={tenant.slug} tenantName={tenant.name} />

        {/* Core KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* KPI 1: Contactos Propios */}
          <div className="glass-panel rounded-xl p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Contactos Totales</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white mb-1">{totalContacts}</div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <span>Cuota Free:</span>
              <span className="text-emerald-400 font-semibold">{totalContacts} / {maxContactsFree}</span>
            </div>
          </div>

          {/* KPI 2: Contactos Verificados */}
          <div className="glass-panel rounded-xl p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Canal Verificado</span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-cyan-400 mb-1">{verifiedContacts}</div>
            <div className="text-xs text-slate-400">
              Confirmaron su correo por enlace único
            </div>
          </div>

          {/* KPI 3: Habilitados para Rescate */}
          <div className="glass-panel rounded-xl p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Elegibles Rescate</span>
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-teal-400 mb-1">{eligibleForRescue}</div>
            <div className="text-xs text-slate-400">
              Verificados + consentimiento activo
            </div>
          </div>

          {/* KPI 4: Bajas y Supresiones */}
          <div className="glass-panel rounded-xl p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Bajas (Opt-out)</span>
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-300 mb-1">{unsubscribedContacts}</div>
            <div className="text-xs text-slate-500">
              Excluidos automáticamente de envíos
            </div>
          </div>
        </div>

        {/* Section: Digital Independence Index (IID) & Social Followers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* IID Card */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    Índice de Independencia Digital (IID)
                  </h3>
                  <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium border border-slate-700">
                    Indicador orientativo
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Mide qué porcentaje de tu comunidad en redes ya es dueña de su canal directo con tu negocio.
                </p>
              </div>

              <div className="text-right">
                {iid.hasSufficientData ? (
                  <div className="text-4xl font-extrabold text-emerald-400 tracking-tight">
                    {iid.scorePercentage}%
                  </div>
                ) : (
                  <div className="text-sm font-semibold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                    Sin datos suficientes
                  </div>
                )}
              </div>
            </div>

            {/* Visual Bar */}
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden mb-4">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, iid.scorePercentage || 0)}%` }}
              ></div>
            </div>

            {/* Explanation / Warnings required by Prompt */}
            {iid.isOverHundredPercent && (
              <div className="p-3 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs mb-4">
                <strong>Resultado superior al 100%:</strong> {iid.explanation}
              </div>
            )}

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <strong>Metodología y Alcance:</strong> {iid.methodologyNote}
              </div>
            </div>
          </div>

          {/* Reported Followers per Platform */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Seguidores Declarados
                </h3>
                <span className="text-[11px] text-slate-400">
                  {tenant.reportedFollowersUpdatedAt
                    ? `Act. ${new Date(tenant.reportedFollowersUpdatedAt).toLocaleDateString()}`
                    : "No actualizado"}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-500"></span> Instagram
                  </span>
                  <span className="font-semibold text-white">{followers.instagram.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Facebook
                  </span>
                  <span className="font-semibold text-white">{followers.facebook.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span> TikTok
                  </span>
                  <span className="font-semibold text-white">{followers.tiktok.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-2 font-semibold">
                  <span className="text-slate-200">Total Plataformas Bruto</span>
                  <span className="text-emerald-400">{iid.totalReportedFollowers.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 text-center">
              Estado de conectores sociales: <strong>Próximamente / Por verificar</strong>
            </div>
          </div>
        </div>

        {/* Recent Incidents and Contacts Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Contacts Table Preview */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                Contactos Recientes
              </h3>
              <Link href="/contacts" className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold">
                Ver todos ({totalContacts}) →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2 font-medium">Nombre</th>
                    <th className="pb-2 font-medium">Email</th>
                    <th className="pb-2 font-medium">Verificado</th>
                    <th className="pb-2 font-medium">Rescate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {tenant.contacts.slice(0, 5).map((c) => {
                    const emailChannel = c.channels.find((ch) => ch.type === "EMAIL");
                    const isSuppressed = c.status === "SUPPRESSED" || emailChannel?.optedOutAt !== null;
                    const pref = c.preferences.find((p) => p.allowRescue);

                    return (
                      <tr key={c.id} className="text-slate-300">
                        <td className="py-2.5 font-medium text-white">{c.name || "Sin nombre"}</td>
                        <td className="py-2.5 text-slate-400">{emailChannel?.normalizedValue || "-"}</td>
                        <td className="py-2.5">
                          {emailChannel?.isVerified ? (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">
                              Sí
                            </span>
                          ) : (
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                              Pendiente
                            </span>
                          )}
                        </td>
                        <td className="py-2.5">
                          {isSuppressed ? (
                            <span className="text-[10px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded">
                              Baja
                            </span>
                          ) : pref ? (
                            <span className="text-[10px] text-teal-400">Autorizado</span>
                          ) : (
                            <span className="text-[10px] text-slate-500">No</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Social Rescue Activity */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <LifeBuoy className="w-4 h-4 text-rose-400" />
                Historial de Rescate e Incidentes
              </h3>
              <Link href="/rescue" className="text-xs text-rose-400 hover:text-rose-300 font-semibold">
                Nuevo Rescate →
              </Link>
            </div>

            {tenant.rescueIncidents.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                <ShieldCheck className="w-10 h-10 text-emerald-400/50 mx-auto mb-2" />
                No se registran incidentes de pérdida de redes. Tu presencia está respaldada.
              </div>
            ) : (
              <div className="space-y-3">
                {tenant.rescueIncidents.map((inc) => (
                  <div key={inc.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white">
                        {inc.platform} (@{inc.affectedHandle})
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(inc.reportedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-slate-400 mb-2 truncate">
                      Nueva URL oficial: <span className="text-emerald-400">{inc.newOfficialUrl}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-300">
                      <span>Campañas despachadas: <strong>{inc.campaigns.length}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
