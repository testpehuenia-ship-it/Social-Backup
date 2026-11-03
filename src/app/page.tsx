import Link from "next/link";
import { 
  ShieldCheck, 
  ArrowRight, 
  Users, 
  LifeBuoy, 
  Lock, 
  QrCode, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  Flame,
  Skull
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-brand-navy text-slate-100 flex flex-col">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-emerald-500/20 py-2.5 px-4 text-center text-xs text-emerald-300 font-medium">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <strong>Social Backup MVP v1.0</strong> — Diseñado e implementado con arquitectura multicliente para ADNQN
        </span>
      </div>

      {/* Hero Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/40 backdrop-blur py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white">Social Backup</span>
                <span className="text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  by ADNQN
                </span>
              </div>
              <p className="text-xs text-slate-400">Tecnología que impulsa negocios</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/frankenstein"
              className="text-xs font-bold px-3 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all flex items-center gap-1.5 shadow-sm shadow-amber-500/10"
              title="Para negocios que no eran clientes y sufrieron un baneo"
            >
              <Skull className="w-3.5 h-3.5 text-amber-400" />
              <span>¿Perdiste tu cuenta? Rescate Frankenstein</span>
            </Link>

            <Link
              href="/dashboard"
              className="text-sm font-semibold px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
            >
              <span>Acceder al Panel</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col justify-center">
        {/* Value Proposition */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs text-slate-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Principio del Producto
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
            «Tus redes pueden desaparecer. <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Tu comunidad debe permanecer».
            </span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed mb-8">
            Convierte seguidores prestados en <strong>contactos propios verificados</strong>. Protege tu negocio ante hackeos, bloqueos o cambios de algoritmo, y recupera la comunicación directa en minutos.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base shadow-xl shadow-emerald-600/25 transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Explorar Panel de Negocio (Demo)</span>
            </Link>

            <Link
              href="/c/adnqn-coffee"
              target="_blank"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-base border border-slate-700 transition-all flex items-center gap-2"
            >
              <ExternalLink className="w-5 h-5 text-emerald-400" />
              <span>Ver Formulario Público de Captación</span>
            </Link>
          </div>

          {/* Callout para Clientes Nuevos que Perdieron su Cuenta */}
          <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border border-amber-500/30 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
                <Skull className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white block font-bold">¿Ya perdiste tu cuenta y no eras cliente?</strong>
                <span className="text-slate-400">Rescatamos tu comunidad con el servicio forense Frankenstein by ADNQN.</span>
              </div>
            </div>
            <Link
              href="/frankenstein"
              className="shrink-0 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <span>Solicitar Rescate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Card 1: Capture */}
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group border border-slate-800 hover:border-emerald-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 text-emerald-400">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">1. Social Capture</h3>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Formularios públicos con tu marca, enlaces para biografía de Instagram, códigos QR descargables y widget incrustable para tu sitio web.
            </p>
            <ul className="text-xs text-slate-300 space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Consentimiento explícito sin casillas premarcadas</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verificación de correo por enlace de uso único</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Atribución por UTMs y trazabilidad probatoria</span>
              </li>
            </ul>
            <Link
              href="/capture"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
            >
              <span>Configurar Captura & QR</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Manager & IID */}
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group border border-slate-800 hover:border-cyan-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-5 text-cyan-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">2. Social Manager</h3>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Panel de control con métricas transparentes. Distingue seguidores reportados de contactos propios y calcula el Índice de Independencia Digital (IID).
            </p>
            <ul className="text-xs text-slate-300 space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Índice IID con metodología transparente</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Gestión de contactos, historial y preferencias</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Exportación segura a CSV sin riesgo de fórmulas</span>
              </li>
            </ul>
            <Link
              href="/contacts"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
            >
              <span>Ver Base de Contactos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Rescue */}
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group border border-slate-800 hover:border-rose-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-5 text-rose-400">
              <LifeBuoy className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">3. Social Rescue</h3>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Asistente guiado de Modo Rescate. Si pierdes una cuenta de Instagram o Facebook, envía un aviso a tus contactos autorizados con tu nueva URL oficial.
            </p>
            <ul className="text-xs text-slate-300 space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Exclusión estricta de bajas y no verificados</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Envío de prueba previo al administrador</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Claves de idempotencia anti-duplicados</span>
              </li>
            </ul>
            <Link
              href="/rescue"
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1.5"
            >
              <span>Iniciar Asistente de Rescate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Security & Multi-tenant banner */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900 border border-slate-700/60 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-1">
                Aislamiento Multicliente Estricto y Respaldo Independiente
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                Cada negocio opera en un entorno lógico independiente. Ningún cliente puede ver o modificar los datos de otro. Incluye generación de respaldos completos en formato estándar y procedimiento de restauración validado.
              </p>
            </div>
          </div>
          <Link
            href="/backup"
            className="shrink-0 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-600 transition-colors"
          >
            Auditar Respaldo de Datos
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-6 bg-slate-950/60 text-center text-xs text-slate-500">
        <p className="mb-2">
          <strong>Social Backup</strong>: «Tu comunidad. Tus contactos. Tu futuro» · <strong>Powered by ADNQN</strong>: «Tecnología que impulsa negocios».
        </p>
        <p>
          Versión MVP funcional lista para evaluación y pruebas locales · Cumplimiento de políticas de privacidad y consentimiento explícito.
        </p>
      </footer>
    </div>
  );
}
