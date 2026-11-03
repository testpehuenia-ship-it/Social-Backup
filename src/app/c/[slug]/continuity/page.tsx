import { prisma } from "@/lib/prisma";
import { ShieldCheck, AlertCircle, ExternalLink, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ContinuityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    include: {
      rescueIncidents: {
        orderBy: { reportedAt: "desc" },
        take: 1,
      },
    },
  });

  if (!tenant) {
    return <div className="p-8 text-white">Negocio no encontrado</div>;
  }

  const latestIncident = tenant.rescueIncidents[0];

  return (
    <div className="min-h-screen bg-brand-navy text-slate-100 flex flex-col justify-between p-4 sm:p-6">
      <header className="max-w-xl mx-auto w-full pt-4 pb-6 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Canal Oficial de Continuidad</span>
        </div>
        <div className="text-[11px]">Powered by ADNQN</div>
      </header>

      <main className="max-w-xl mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {tenant.name}
            </h1>
            <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
              Estado de Presencia Oficial Verificado
            </p>
          </div>

          {latestIncident ? (
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-3">
              <div className="flex items-center gap-2 font-bold text-amber-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Aviso de Incidente en Redes Sociales</span>
              </div>
              <p className="leading-relaxed">
                Nuestra cuenta anterior en <strong>{latestIncident.platform}</strong> (@{latestIncident.affectedHandle}) dejó de estar disponible.
              </p>
              <div className="pt-2">
                <a
                  href={latestIncident.newOfficialUrl}
                  target="_blank"
                  className="block w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center text-xs shadow-lg transition-all"
                >
                  Seguir en nuestra nueva cuenta oficial en {latestIncident.platform} →
                </a>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center text-xs text-emerald-300">
              <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
              Nuestras redes sociales y canales de comunicación oficiales operan con normalidad.
            </div>
          )}

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="font-semibold text-slate-300">¿Por qué existe esta página?</div>
            <p className="text-[11px] leading-relaxed">
              Las cuentas en redes sociales pueden ser suspendidas, hackeadas o eliminadas de forma arbitraria por las grandes plataformas. <strong>Social Backup by ADNQN</strong> proporciona este dominio independiente e inmutable para que la comunidad siempre pueda autenticar la verdadera presencia del negocio.
            </p>
          </div>

          <div className="text-center pt-2">
            <Link
              href={`/c/${tenant.slug}`}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Unirme a la comunidad oficial de {tenant.name}
            </Link>
          </div>
        </div>
      </main>

      <footer className="max-w-xl mx-auto w-full py-4 text-center text-[11px] text-slate-600">
        Social Backup by ADNQN · «Tus redes pueden desaparecer. Tu comunidad debe permanecer».
      </footer>
    </div>
  );
}
