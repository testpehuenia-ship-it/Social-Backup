"use client";

import { useState } from "react";
import { 
  Skull, 
  Sparkles, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  AlertOctagon, 
  ShieldAlert, 
  Lock, 
  Zap, 
  Compass,
  Layers
} from "lucide-react";

interface FrankensteinPromoBannerProps {
  tenantSlug?: string;
  tenantName?: string;
}

export function FrankensteinPromoBanner({ tenantSlug = "adnqn-coffee", tenantName = "Tu Negocio" }: FrankensteinPromoBannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    lostPlatform: "INSTAGRAM",
    lostAccountUrl: "",
    newAccountUrl: "",
    notes: "",
  });

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
          tenantId: tenantSlug,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "No se pudo enviar la solicitud");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al enviar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Banner Principal Promocional */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 p-6 sm:p-7 shadow-xl shadow-amber-950/20 mb-8">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 max-w-2xl">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/10">
              <Skull className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Servicio Forense Especial ADNQN
                </span>
                <span className="text-xs text-slate-400">¿Perdiste tu cuenta antes de tener Social Backup?</span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Nosotros te ayudamos con tu cuenta perdida: <span className="text-amber-400">Programa Cuentas Frankenstein</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                Si sufriste un baneo, hackeo o cierre repentino y no eras usuario, nuestro equipo extrae forensemente tu audiencia previa y reconecta a tus seguidores con tu nueva cuenta de forma dosificada y 100% blindada contra nuevos bloqueos.
              </p>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <button
              onClick={() => setIsOpen(true)}
              className="w-full md:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 hover:translate-y-[-1px] active:translate-y-[0px]"
            >
              <span>Solicitar Rescate de Cuenta Perdida</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Solicitud VIP Frankenstein */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header Modal */}
            <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Skull className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    Rescate Forense · Cuentas Frankenstein
                  </h4>
                  <p className="text-xs text-slate-400">Servicio asistido por especialistas de ADNQN</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSubmitted(false);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido Modal */}
            <div className="p-6 overflow-y-auto">
              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">¡Solicitud de Rescate Recibida!</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto mb-6">
                    El equipo de arquitectura e investigación de ADNQN iniciará el escaneo forense de tu cuenta anterior para recuperar a tus seguidores y preparará el motor de goteo seguro.
                  </p>
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-left text-xs text-slate-400 space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-amber-400 font-semibold">
                      <ShieldAlert className="w-4 h-4" /> Próximos Pasos:
                    </div>
                    <p>• Te contactaremos vía WhatsApp/Email para coordinar el informe preliminar de audiencia extraída.</p>
                    <p>• Definiremos el tier adecuado y activaremos el despacho seguro (50 a 100 diarios sin riesgo de baneo).</p>
                    <p>• Tu nueva cuenta quedará blindada permanentemente con Social Backup.</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
                  >
                    Entendido, Volver al Dashboard
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-amber-200">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong>No te preocupes por la parte técnica:</strong> Solo indícanos el enlace o usuario de la cuenta que perdiste y tu nueva cuenta. Nosotros nos encargamos de la extracción y de avisar a tu comunidad de forma segura.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Tu Nombre o Negocio *</label>
                      <input
                        type="text"
                        required
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        placeholder="Ej. Juan Pérez / Café Patagonia"
                        className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Email de Contacto *</label>
                      <input
                        type="email"
                        required
                        value={formData.clientEmail}
                        onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                        placeholder="tu@email.com"
                        className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">WhatsApp de contacto directo</label>
                      <input
                        type="tel"
                        value={formData.clientPhone}
                        onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                        placeholder="+54 9 299 ..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Plataforma Afectada</label>
                      <select
                        value={formData.lostPlatform}
                        onChange={(e) => setFormData({ ...formData, lostPlatform: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="INSTAGRAM">Instagram</option>
                        <option value="TIKTOK">TikTok</option>
                        <option value="FACEBOOK">Facebook Fanpage</option>
                        <option value="X_TWITTER">X (Twitter)</option>
                        <option value="YOUTUBE">YouTube</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Enlace o usuario de la cuenta PERDIDA *</label>
                    <input
                      type="text"
                      required
                      value={formData.lostAccountUrl}
                      onChange={(e) => setFormData({ ...formData, lostAccountUrl: e.target.value })}
                      placeholder="Ej. https://instagram.com/micuenta_anterior o @micuenta_anterior"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Enlace o usuario de tu NUEVA cuenta oficial</label>
                    <input
                      type="text"
                      value={formData.newAccountUrl}
                      onChange={(e) => setFormData({ ...formData, newAccountUrl: e.target.value })}
                      placeholder="Ej. https://instagram.com/micuenta_nueva o 'Aún no la creé'"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Detalles adicionales del incidente (opcional)</label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Cuándo ocurrió el bloqueo, si tienes capturas o cantidad estimada de seguidores..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {loading ? "Enviando solicitud..." : "Enviar a Equipo Forense"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

