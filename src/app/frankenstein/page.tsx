"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Skull, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Clock, 
  Lock, 
  Send, 
  Users, 
  ExternalLink,
  ChevronRight,
  ShieldAlert
} from "lucide-react";

export default function PublicFrankensteinPage() {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    lostPlatform: "INSTAGRAM",
    lostAccountUrl: "",
    newAccountUrl: "",
    tier: "FRANKEN_PRO",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/frankenstein", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          isClientSubmission: true,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "No se pudo procesar la solicitud.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur sticky top-0 z-50 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-red-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Skull className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">Cuentas Frankenstein</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  by ADNQN
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Servicio Forense de Recuperación de Audiencia</p>
            </div>
          </Link>

          <div className="flex items-center gap-3 text-xs">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors hidden sm:block">
              Inicio
            </Link>
            <Link
              href="/dashboard"
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 transition-colors"
            >
              Ya soy cliente
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-300 mb-6">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            Para quienes NO tenían Social Backup y perdieron su cuenta
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight mb-5">
            ¿Te suspendieron o hackearon tu cuenta? <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-red-400 bg-clip-text text-transparent">
              Nosotros rescatamos tu comunidad.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            No pierdas años de esfuerzo. Nuestro equipo forense extrae los seguidores de tu cuenta perdida y los reconecta progresivamente con tu nueva presencia oficial de forma <strong>100% blindada contra nuevos baneos</strong>.
          </p>
        </div>

        {/* 3 Pilares de Seguridad */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14 text-xs">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm mb-1.5">1. Cero Esfuerzo Técnico</h3>
            <p className="text-slate-400 leading-relaxed">
              No tienes que configurar nada ni saber de programación. Solo nos das el enlace de tu cuenta perdida y el de tu nueva cuenta. Nosotros hacemos todo.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm mb-1.5">2. Tu Nueva Cuenta Blindada</h3>
            <p className="text-slate-400 leading-relaxed">
              Jamás usamos tu cuenta nueva para mandar spam. Usamos cuentas puente verificadas y correos directos para que tu nueva cuenta esté 100% segura.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
              <Send className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm mb-1.5">3. Goteo Diario Seguro</h3>
            <p className="text-slate-400 leading-relaxed">
              Dosificamos entre 50 y 100 avisos diarios con intervalos humanos aleatorios para garantizar la máxima entregabilidad y tasa de reconexión.
            </p>
          </div>
        </div>

        {/* Formulario de Rescate o Confirmación */}
        <div className="glass-panel rounded-3xl border border-amber-500/30 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-10 shadow-2xl shadow-amber-950/20">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">¡Solicitud de Rescate Frankenstein Recibida!</h2>
              <p className="text-slate-300 text-sm max-w-lg mx-auto mb-6 leading-relaxed">
                El equipo forense de ADNQN ya tiene tu caso en la bandeja de análisis. Estamos iniciando el escaneo preliminar de la cuenta que nos indicaste.
              </p>
              <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-left text-xs text-slate-400 space-y-2 mb-8">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> ¿Qué sucederá ahora?
                </div>
                <p>1. Un especialista de ADNQN te escribirá a tu WhatsApp/Email en menos de 2 horas hábiles.</p>
                <p>2. Te mostraremos el volumen de seguidores extraídos y los correos públicos detectados.</p>
                <p>3. Activaremos el motor de goteo seguro hacia tu nueva cuenta oficial.</p>
              </div>
              <Link
                href="/"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-lg"
              >
                Volver a la Página Principal
              </Link>
            </div>
          ) : (
            <div>
              <div className="mb-8">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Paso 1 de 1 · Cero Fricción</span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Ingresa los datos para iniciar el rescate
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Completa este formulario. Nosotros evaluamos tu caso y te contactamos de inmediato con el informe preliminar de audiencia recuperable.
                </p>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                {/* Datos del Cliente */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">Tu Nombre o Nombre de tu Negocio *</label>
                    <input
                      type="text"
                      required
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      placeholder="Ej. Martín Cafetero / Café Neuquén"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                      placeholder="contacto@tunegocio.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">WhatsApp de Contacto Directo *</label>
                    <input
                      type="tel"
                      required
                      value={formData.clientPhone}
                      onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                      placeholder="+54 9 299 123-4567"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">Red Social Afectada</label>
                    <select
                      value={formData.lostPlatform}
                      onChange={(e) => setFormData({ ...formData, lostPlatform: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="INSTAGRAM">Instagram</option>
                      <option value="TIKTOK">TikTok</option>
                      <option value="FACEBOOK">Facebook Fanpage</option>
                      <option value="X_TWITTER">X (Twitter)</option>
                      <option value="YOUTUBE">YouTube</option>
                    </select>
                  </div>
                </div>

                {/* Datos de las Cuentas */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                  <div>
                    <label className="block text-amber-300 font-bold mb-1">
                      1. Enlace o Usuario de la cuenta PERDIDA / BANEADA *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lostAccountUrl}
                      onChange={(e) => setFormData({ ...formData, lostAccountUrl: e.target.value })}
                      placeholder="https://instagram.com/micuenta_anterior o @micuenta_anterior"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      A partir de este link iniciaremos la extracción forense de tu comunidad.
                    </span>
                  </div>

                  <div>
                    <label className="block text-emerald-300 font-bold mb-1">
                      2. Enlace o Usuario de tu NUEVA cuenta oficial
                    </label>
                    <input
                      type="text"
                      value={formData.newAccountUrl}
                      onChange={(e) => setFormData({ ...formData, newAccountUrl: e.target.value })}
                      placeholder="https://instagram.com/micuenta_nueva (o escribe 'Aún no la creé')"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Aquí es donde invitaremos a tus seguidores a unirse. Si aún no la creaste, te asesoramos.
                    </span>
                  </div>
                </div>

                {/* Selector de Plan Sugerido */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-2">Selecciona el plan de rescate aproximado:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      formData.tier === "FRANKEN_LOCAL"
                        ? "bg-slate-800 border-amber-500 shadow-md"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    }`}>
                      <input
                        type="radio"
                        name="tier"
                        value="FRANKEN_LOCAL"
                        checked={formData.tier === "FRANKEN_LOCAL"}
                        onChange={() => setFormData({ ...formData, tier: "FRANKEN_LOCAL" })}
                        className="sr-only"
                      />
                      <div className="font-bold text-white text-xs">Franken-Local</div>
                      <div className="text-amber-400 font-black text-base my-0.5">$180 USD</div>
                      <div className="text-[10px] text-slate-400">Hasta 2.500 seguidores · 50/día</div>
                    </label>

                    <label className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      formData.tier === "FRANKEN_PRO"
                        ? "bg-slate-800 border-amber-500 shadow-md"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    }`}>
                      <input
                        type="radio"
                        name="tier"
                        value="FRANKEN_PRO"
                        checked={formData.tier === "FRANKEN_PRO"}
                        onChange={() => setFormData({ ...formData, tier: "FRANKEN_PRO" })}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">Franken-Pro</span>
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold">POPULAR</span>
                      </div>
                      <div className="text-amber-400 font-black text-base my-0.5">$420 USD</div>
                      <div className="text-[10px] text-slate-400">Hasta 10.000 seguidores · 100/día</div>
                    </label>

                    <label className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      formData.tier === "FRANKEN_VIP"
                        ? "bg-slate-800 border-amber-500 shadow-md"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    }`}>
                      <input
                        type="radio"
                        name="tier"
                        value="FRANKEN_VIP"
                        checked={formData.tier === "FRANKEN_VIP"}
                        onChange={() => setFormData({ ...formData, tier: "FRANKEN_VIP" })}
                        className="sr-only"
                      />
                      <div className="font-bold text-white text-xs">Franken-VIP</div>
                      <div className="text-amber-400 font-black text-base my-0.5">$850+ USD</div>
                      <div className="text-[10px] text-slate-400">Influencers · Multi-satélite</div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Notas adicionales (opcional)</label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Cuéntanos cuándo fue el bloqueo, motivo alegado por la red o cualquier dato que nos ayude..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Sin compromiso previo. Recibirás primero el informe de viabilidad técnica.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 hover:translate-y-[-1px]"
                  >
                    {loading ? "Analizando caso..." : "Solicitar Rescate Forense Ahora"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-6 bg-slate-950 text-center text-xs text-slate-500">
        <p>Cuentas Frankenstein · Servicio Especial de Social Backup by ADNQN · Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

