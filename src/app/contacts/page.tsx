import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { 
  Users, 
  Search, 
  Download, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ShieldCheck, 
  Filter,
  Eye,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ tenant?: string; q?: string; status?: string }>;
}) {
  const resolvedParams = await searchParams;
  const tenantSlug = resolvedParams.tenant || "adnqn-coffee";
  const query = resolvedParams.q || "";
  const filterStatus = resolvedParams.status || "ALL";

  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
    include: {
      contacts: {
        include: {
          channels: true,
          preferences: true,
          consents: {
            orderBy: { timestamp: "desc" },
            take: 3,
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!tenant) {
    return <div className="p-8 text-white">Negocio no encontrado</div>;
  }

  // Filtrado en memoria para respuesta instantánea
  const filteredContacts = tenant.contacts.filter((c) => {
    const emailChannel = c.channels.find((ch) => ch.type === "EMAIL");
    const nameMatch = c.name?.toLowerCase().includes(query.toLowerCase());
    const emailMatch = emailChannel?.normalizedValue.toLowerCase().includes(query.toLowerCase());
    const matchesSearch = query === "" || nameMatch || emailMatch;

    if (!matchesSearch) return false;

    if (filterStatus === "VERIFIED") {
      return emailChannel?.isVerified && c.status !== "SUPPRESSED" && emailChannel.optedOutAt === null;
    }
    if (filterStatus === "PENDING") {
      return !emailChannel?.isVerified && c.status !== "SUPPRESSED";
    }
    if (filterStatus === "SUPPRESSED") {
      return c.status === "SUPPRESSED" || emailChannel?.optedOutAt !== null;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-brand-navy text-slate-100 flex flex-col">
      <Navbar tenantSlug={tenant.slug} tenantName={tenant.name} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Base de Contactos</h1>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                {tenant.contacts.length} registros
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Contactos propios captados con consentimiento explícito y trazabilidad inmutable
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`/api/contacts/export?tenantSlug=${tenant.slug}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all shadow-md shadow-emerald-600/20"
            >
              <Download className="w-4 h-4" />
              <span>Exportar CSV Seguro</span>
            </a>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="glass-panel rounded-xl p-4 mb-6 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <form method="GET" className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Buscar por nombre o correo..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <input type="hidden" name="tenant" value={tenant.slug} />
            <input type="hidden" name="status" value={filterStatus} />
          </form>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <Link
              href={`/contacts?tenant=${tenant.slug}&status=ALL&q=${encodeURIComponent(query)}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterStatus === "ALL"
                  ? "bg-slate-700 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200"
              }`}
            >
              Todos ({tenant.contacts.length})
            </Link>
            <Link
              href={`/contacts?tenant=${tenant.slug}&status=VERIFIED&q=${encodeURIComponent(query)}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterStatus === "VERIFIED"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200"
              }`}
            >
              Verificados
            </Link>
            <Link
              href={`/contacts?tenant=${tenant.slug}&status=PENDING&q=${encodeURIComponent(query)}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterStatus === "PENDING"
                  ? "bg-amber-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200"
              }`}
            >
              Pendientes
            </Link>
            <Link
              href={`/contacts?tenant=${tenant.slug}&status=SUPPRESSED&q=${encodeURIComponent(query)}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterStatus === "SUPPRESSED"
                  ? "bg-rose-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200"
              }`}
            >
              Bajas
            </Link>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Contacto</th>
                  <th className="py-3 px-4 font-semibold">Canal (Email)</th>
                  <th className="py-3 px-4 font-semibold">Estado Verificación</th>
                  <th className="py-3 px-4 font-semibold">Consentimiento Rescate</th>
                  <th className="py-3 px-4 font-semibold">Origen</th>
                  <th className="py-3 px-4 font-semibold">Fecha Registro</th>
                  <th className="py-3 px-4 font-semibold text-right">Evidencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No se encontraron contactos con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((c) => {
                    const emailChannel = c.channels.find((ch) => ch.type === "EMAIL");
                    const isSuppressed = c.status === "SUPPRESSED" || emailChannel?.optedOutAt !== null;
                    const pref = c.preferences.find((p) => p.allowRescue);
                    const lastConsent = c.consents[0];

                    return (
                      <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-medium text-white">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0">
                              {c.name ? c.name.charAt(0).toUpperCase() : "C"}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-100">{c.name || "Sin nombre registrado"}</div>
                              <div className="text-[10px] text-slate-500">ID: {c.id.substring(0, 8)}...</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                          {emailChannel?.normalizedValue || "-"}
                        </td>

                        <td className="py-3 px-4">
                          {isSuppressed ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 font-medium">
                              <XCircle className="w-3 h-3" />
                              Dado de baja
                            </span>
                          ) : emailChannel?.isVerified ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                              <CheckCircle2 className="w-3 h-3" />
                              Verificado ({emailChannel.verifiedAt ? new Date(emailChannel.verifiedAt).toLocaleDateString() : "OK"})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-medium">
                              <Clock className="w-3 h-3" />
                              Pendiente confirmación
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          {isSuppressed ? (
                            <span className="text-slate-500 font-medium">Revocado (baja)</span>
                          ) : pref?.allowRescue ? (
                            <span className="text-emerald-400 font-medium flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Habilitado
                            </span>
                          ) : (
                            <span className="text-slate-400">No autorizado</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-slate-400">
                          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">
                            {c.source}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-slate-400 text-[11px]">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>

                        <td className="py-3 px-4 text-right">
                          {lastConsent ? (
                            <div className="text-[10px] text-slate-400 font-mono" title={`IP Hash: ${lastConsent.ipHash || "-"} | Finalidad: ${lastConsent.purpose}`}>
                              Hash: {lastConsent.ipHash ? lastConsent.ipHash.substring(0, 8) : "demo"}
                            </div>
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
