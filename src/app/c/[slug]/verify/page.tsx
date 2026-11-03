"use client";

import { useEffect, useState, use } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function VerifyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [tenantInfo, setTenantInfo] = useState<any>(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token de verificación no proporcionado en el enlace.");
      return;
    }

    fetch("/api/capture/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
          setMessage(data.message);
          setTenantInfo(data.tenant);
        } else {
          setStatus("error");
          setMessage(data.error || "No se pudo verificar el correo.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Error de conexión al verificar el enlace.");
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-brand-navy text-slate-100 flex flex-col justify-between p-4 sm:p-6">
      <header className="max-w-md mx-auto w-full pt-4 pb-6 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-semibold text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Verificación de Contacto</span>
        </div>
        <div className="text-[11px]">Social Backup</div>
      </header>

      <main className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl text-center space-y-6">
          {status === "loading" && (
            <div className="py-8 space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin mx-auto"></div>
              <p className="text-sm text-slate-300">Verificando enlace de suscripción...</p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4 py-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white">¡Suscripción Confirmada!</h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-xs mx-auto">
                {message}
              </p>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                Tu correo ahora está protegido. Si {tenantInfo?.name || "el negocio"} cambia de redes sociales, recibirás un aviso oficial en esta casilla.
              </div>
              <div className="pt-2">
                <Link
                  href={`/c/${slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                >
                  <span>Volver a la página principal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4 py-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
                <XCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Enlace Inválido o Expirado</h2>
              <p className="text-sm text-rose-300 leading-relaxed max-w-xs mx-auto">
                {message}
              </p>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 text-left space-y-1">
                <div>• Los enlaces de verificación son de <strong>un solo uso</strong>.</div>
                <div>• Vencen a las 24 horas de haber sido emitidos.</div>
              </div>
              <div className="pt-2">
                <Link
                  href={`/c/${slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                >
                  <span>Solicitar un nuevo registro</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="max-w-md mx-auto w-full py-4 text-center text-[11px] text-slate-600">
        Social Backup by ADNQN
      </footer>
    </div>
  );
}
