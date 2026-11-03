"use client";

import { useState, use } from "react";
import { 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Sparkles,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

export default function PublicCapturePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consentRescue, setConsentRescue] = useState(false);
  const [consentNews, setConsentNews] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [debugLink, setDebugLink] = useState<string | null>(null);

  // Datos de marca (en una versión completa se leen vía props de servidor o fetch)
  const brandName = slug === "adnqn-coffee" ? "ADNQN Coffee Roasters" : "Comunidad Oficial";
  const brandColor = "#059669";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!consentRescue) {
      setErrorMessage("Debes aceptar el consentimiento de avisos de continuidad para poder registrarte.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/capture/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantSlug: slug,
          name,
          email,
          consentRescue,
          consentNews,
          source: "WEB_FORM",
          originUrl: typeof window !== "undefined" ? window.location.href : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
        if (data.debugLink) {
          setDebugLink(data.debugLink);
        }
      } else {
        setErrorMessage(data.error || "Ocurrió un error al procesar tu solicitud.");
      }
    } catch {
      setErrorMessage("Error de conexión al enviar el formulario.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-navy text-slate-100 flex flex-col justify-between p-4 sm:p-6">
      {/* Top Header */}
      <header className="max-w-xl mx-auto w-full pt-4 pb-6 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-semibold text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Comunidad Verificada</span>
        </div>
        <div className="text-[11px]">
          Social Backup by ADNQN
        </div>
      </header>

      {/* Main Card */}
      <main className="max-w-xl mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div
            className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ background: brandColor }}
          ></div>

          {isSuccess ? (
            /* Success State */
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-2">¡Casi listo! Revisá tu correo</h2>
                <p className="text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
                  Te enviamos un enlace de confirmación a <strong>{email}</strong> para validar tu suscripción y proteger tu privacidad.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 max-w-sm mx-auto">
                El enlace es de un solo uso y vencerá en 24 horas. Si no lo ves en tu bandeja principal, revisá correo no deseado.
              </div>

              {/* Dev / Sandbox Direct Click Link for fast testing */}
              {debugLink && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs max-w-sm mx-auto text-left">
                  <div className="font-bold flex items-center gap-1 mb-1 text-amber-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    Enlace de Sandbox para Pruebas:
                  </div>
                  <p className="text-[11px] text-amber-200/80 mb-2">
                    En entorno local de desarrollo podés hacer clic directo para simular la confirmación del correo:
                  </p>
                  <a
                    href={debugLink}
                    className="inline-block px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded font-bold text-xs"
                  >
                    Confirmar correo de prueba →
                  </a>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail("");
                    setName("");
                    setConsentRescue(false);
                    setConsentNews(false);
                  }}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  Registrar otro contacto
                </button>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <div>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                  {brandName}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                  «Tus redes pueden desaparecer. Tu comunidad debe permanecer». Dejanos tu contacto para no perder la comunicación pase lo que pase con las plataformas sociales.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-6 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tu Nombre (opcional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Valentina Morales"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tu Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Granular Consents (Without pre-checked boxes) */}
                <div className="pt-2 space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentRescue}
                        onChange={(e) => setConsentRescue(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-900 accent-emerald-500 shrink-0"
                      />
                      <span className="text-xs text-slate-300 leading-snug">
                        <strong>Autorizo a recibir avisos de continuidad y nueva presencia</strong> si cambian las redes sociales de este negocio. *
                      </span>
                    </label>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentNews}
                        onChange={(e) => setConsentNews(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-900 accent-emerald-500 shrink-0"
                      />
                      <span className="text-xs text-slate-300 leading-snug">
                        Deseo recibir novedades, promociones y lanzamientos exclusivos de la comunidad (opcional).
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-xl transition-all flex items-center justify-center gap-2"
                    style={{ background: brandColor }}
                  >
                    <Send className="w-4 h-4" />
                    <span>{isLoading ? "Enviando registro..." : "Unirme a la Comunidad"}</span>
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center text-[11px] text-slate-500 space-y-1">
                <div className="flex items-center justify-center gap-1.5">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>Tus datos son privados y podés darte de baja en cualquier momento.</span>
                </div>
                <div>
                  Protegido por <strong>Social Backup by ADNQN</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-xl mx-auto w-full py-4 text-center text-[11px] text-slate-600">
        © 2026 ADNQN · Todos los derechos reservados · Plataforma de Soberanía Comunitaria
      </footer>
    </div>
  );
}
