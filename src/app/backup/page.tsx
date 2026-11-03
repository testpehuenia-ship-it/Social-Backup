import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { 
  Database, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ArrowLeft,
  Lock,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BackupPage({
  searchParams,
}: {
  searchParams: Promise<{ tenant?: string }>;
}) {
  const resolvedParams = await searchParams;
  const tenantSlug = resolvedParams.tenant || "adnqn-coffee";

  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
    include: {
      backupRuns: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      auditLogs: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!tenant) {
    return <div className="p-8 text-white">Negocio no encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-brand-navy text-slate-100 flex flex-col">
      <Navbar tenantSlug={tenant.slug} tenantName={tenant.name} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Respaldos, Restauración & Auditoría
          </h1>
        </div>
        <p className="text-sm text-slate-400 mb-8">
          Soberanía de datos del negocio: generación de copias de seguridad portables y trazabilidad inmutable de eventos sensibles
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Card 1: Snapshot Generator */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  Copia de Seguridad Integral del Negocio (Snapshot)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Exporta la totalidad de tus contactos, canales, marcas temporales de consentimiento, formularios y configuraciones en formato estándar JSON cifrado.
                </p>
              </div>

              <a
                href={`/api/backup?tenantSlug=${tenant.slug}`}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Generar y Descargar Respaldo</span>
              </a>
            </div>

            {/* Protocol Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <div className="font-semibold text-white flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Aislamiento Verificado
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  El respaldo contiene exclusivamente los datos de <strong>{tenant.name}</strong>. Es matemáticamente imposible que contenga registros de otros tenants.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <div className="font-semibold text-white flex items-center gap-1.5 mb-1">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  Checksum SHA-256
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Cada archivo incluye su firma de integridad criptográfica para certificar que el contenido no fue adulterado ni corrompido.
                </p>
              </div>
            </div>

            {/* Restoration Protocol Notes (Section 13) */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="font-semibold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Procedimiento de Restauración Segura (ADNQN Safe Restore):
              </div>
              <p className="text-[11px] text-slate-400">
                1. <strong>Entorno Aislado:</strong> Se simula en un entorno sandbox antes de aplicar en producción.
              </p>
              <p className="text-[11px] text-slate-400">
                2. <strong>Preservación de Bajas:</strong> Las bajas (opt-out) registradas con posterioridad a la fecha del respaldo prevalecen siempre y no se reactivan.
              </p>
              <p className="text-[11px] text-slate-400">
                3. <strong>Sin duplicación:</strong> Las campañas ya ejecutadas nunca se reproducen y los tokens vencidos son descartados.
              </p>
            </div>
          </div>

          {/* Card 2: Status & Quick Info */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Estado del Respaldo
              </h3>

              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <div className="font-semibold text-emerald-300 mb-1">Respaldo Local Operativo</div>
                  <div className="text-slate-400 text-[11px]">
                    Frecuencia: Diaria automática + Descarga manual bajo demanda.
                  </div>
                </div>

                <div className="text-xs space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Tenant:</span>
                    <span className="text-slate-200 font-mono">{tenant.slug}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Plan:</span>
                    <span className="text-emerald-400 font-semibold">{tenant.plan}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Portabilidad:</span>
                    <span className="text-slate-200">100% Libre (JSON / CSV)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 text-center mt-6">
              Sin mecanismo de cautividad: podés exportar tu base en cualquier momento.
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              Registro de Auditoría de Seguridad
            </h3>
            <span className="text-xs text-slate-400">Últimas acciones registradas</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Fecha y Hora</th>
                  <th className="py-2.5 px-3">Acción</th>
                  <th className="py-2.5 px-3">Recurso</th>
                  <th className="py-2.5 px-3">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tenant.auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">
                      No hay eventos de auditoría registrados aún.
                    </td>
                  </tr>
                ) : (
                  tenant.auditLogs.map((log) => (
                    <tr key={log.id} className="text-slate-300">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-emerald-400">
                        {log.action}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                        {log.resource}
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">
                        {log.details || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
