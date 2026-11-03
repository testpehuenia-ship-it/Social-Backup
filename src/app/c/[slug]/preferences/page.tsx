"use client";

import { useState, use } from "react";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PreferencesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [allowRescue, setAllowRescue] = useState(true);
  const [allowNewsletter, setAllowNewsletter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSuppressed, setIsSuppressed] = useState(false);

  const handleUpdate = async (unsubscribeAll: boolean = false) => {
    if (!email) {
      alert("Por favor ingresá tu correo.");
      return;
    }

    setIsLoading(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/capture/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantSlug: slug,
          email,
          allowRescue: unsubscribeAll ? false : allowRescue,
          allowNewsletter: unsubscribeAll ? false : allowNewsletter,
          unsubscribeAll,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback(data.message);
        if (data.isSuppressed) {
          setIsSuppressed(true);
          setAllowRescue(false);
          setAllowNewsletter(false);
        }
      } else {
        setFeedback(`Error: ${data.error}`);
      }
    } catch {
      setFeedback("Error de comunicación con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-navy text-slate-100 flex flex-col justify-between p-4 sm:p-6">
      <header className="max-w-md mx-auto w-full pt-4 pb-6 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-semibold text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Gestión de Privacidad & Bajas</span>
        </div>
        <div className="text-[11px]">Social Backup</div>
      </header>

      <main className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
          <div>
            <h1 className="text-xl font-bold text-white mb-1">
              Preferencias de Comunicación
            </h1>
            <p className="text-xs text-slate-400">
              Tenés el control total sobre qué mensajes deseás recibir y podés darte de baja en cualquier momento sin trabas.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tu Correo Electrónico:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            {!isSuppressed ? (
              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowRescue}
                      onChange={(e) => setAllowRescue(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 accent-emerald-500"
                    />
                    <span className="text-xs text-slate-300">
                      <strong>Avisos de continuidad y nueva presencia</strong> ante incidentes o pérdida de cuentas oficiales de redes sociales.
                    </span>
                  </label>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowNewsletter}
                      onChange={(e) => setAllowNewsletter(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 accent-emerald-500"
                    />
                    <span className="text-xs text-slate-300">
                      Novedades, promociones y lanzamientos exclusivos de la comunidad.
                    </span>
                  </label>
                </div>

                <div className="pt-2 flex flex-col gap-3">
                  <button
                    onClick={() => handleUpdate(false)}
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                  >
                    Guardar Preferencias
                  </button>

                  <button
                    onClick={() => handleUpdate(true)}
                    disabled={isLoading}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-colors"
                  >
                    Darse de baja de todas las comunicaciones (Opt-out Total)
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center text-xs text-rose-300 space-y-2">
                <CheckCircle2 className="w-6 h-6 mx-auto text-rose-400" />
                <div className="font-bold">Baja definitiva confirmada</div>
                <p className="text-[11px] text-slate-400">
                  Tu dirección ha sido suprimida de todas las listas activas y no recibirás nuevos correos de este negocio.
                </p>
              </div>
            )}

            {feedback && (
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 text-center">
                {feedback}
              </div>
            )}
          </div>

          <div className="text-center pt-2">
            <Link
              href={`/c/${slug}`}
              className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la página del negocio</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="max-w-md mx-auto w-full py-4 text-center text-[11px] text-slate-600">
        Social Backup by ADNQN · Cumplimiento de la Ley 25.326 y estándares internacionales de privacidad
      </footer>
    </div>
  );
}
