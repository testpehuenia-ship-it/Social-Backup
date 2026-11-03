"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { 
  LifeBuoy, 
  AlertTriangle, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink,
  Users,
  Eye,
  Lock,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

export default function RescuePage() {
  const [tenantSlug] = useState("adnqn-coffee");
  const [platform, setPlatform] = useState("Instagram");
  const [affectedHandle, setAffectedHandle] = useState("adnqncoffee");
  const [newOfficialUrl, setNewOfficialUrl] = useState("https://instagram.com/adnqncoffee_oficial");
  const [messageBody, setMessageBody] = useState(
    "Nuestra cuenta anterior de Instagram fue suspendida por un error de plataforma. Para seguir en contacto, te invitamos a seguirnos en nuestra nueva cuenta oficial y consultar las novedades exclusivas de la comunidad."
  );

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [testSendResult, setTestSendResult] = useState<string | null>(null);
  const [dispatchResult, setDispatchResult] = useState<any | null>(null);
  const [idempotencyKey] = useState(`rescue-${Date.now()}-${Math.random().toString(36).substring(7)}`);

  // Simulación interactiva de cálculo de elegibilidad
  const totalAudience = 3;
  const eligibleAudience = 1; // Sofia Martínez
  const excludedUnverified = 1; // Carlos Gómez
  const excludedOptedOut = 1; // Lucía Fernández

  // Paso 4: Enviar Prueba al Admin
  const handleTestSend = async () => {
    setIsLoading(true);
    setTestSendResult(null);
    try {
      const res = await fetch("/api/rescue/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantSlug,
          platform,
          affectedHandle,
          newOfficialUrl,
          messageBody,
          isTestSend: true,
          adminEmail: "admin@adnqncoffee.com",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTestSendResult("✅ Correo de prueba enviado exitosamente a admin@adnqncoffee.com (verificable en Sandbox).");
      } else {
        setTestSendResult(`❌ Error: ${data.error}`);
      }
    } catch {
      setTestSendResult("❌ Error de conexión al enviar la prueba.");
    } finally {
      setIsLoading(false);
    }
  };

  // Paso 5: Despacho Definitivo en Cola
  const handleLiveDispatch = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/rescue/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantSlug,
          platform,
          affectedHandle,
          newOfficialUrl,
          messageBody,
          idempotencyKey,
          isTestSend: false,
        }),
      });
      const data = await res.json();
      setDispatchResult(data);
      if (data.success) {
        setStep(5);
      }
    } catch {
      alert("Error al despachar la campaña de rescate.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-navy text-slate-100 flex flex-col">
      <Navbar tenantSlug={tenantSlug} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Wizard Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Modo Rescate — Social Rescue
            </h1>
          </div>
          <p className="text-sm text-slate-400">
            Asistente para restablecer la comunicación con tu comunidad tras la pérdida, hackeo o bloqueo de una cuenta social.
          </p>

          {/* Steps Indicator */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2">
            {[
              { num: 1, label: "Incidente" },
              { num: 2, label: "Nueva Presencia" },
              { num: 3, label: "Audiencia Elegible" },
              { num: 4, label: "Vista Previa & Prueba" },
              { num: 5, label: "Ejecución & Continuidad" },
            ].map((s) => (
              <div
                key={s.num}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  step === s.num
                    ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                    : step > s.num
                    ? "bg-slate-800 text-emerald-400"
                    : "bg-slate-900 text-slate-500"
                }`}
              >
                <span>{s.num}. {s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: Incidente */}
        {step === 1 && (
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white mb-1">Paso 1: Declaración del Incidente</h2>
              <p className="text-xs text-slate-400">
                Seleccioná qué plataforma sufrió el incidente y la cuenta afectada.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Plataforma Afectada:
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="TikTok">TikTok</option>
                  <option value="YouTube">YouTube</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="X">X (Twitter)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre de Usuario Anterior (afectado):
                </label>
                <div className="flex items-center">
                  <span className="bg-slate-800 border border-r-0 border-slate-700 rounded-l-lg px-3 py-2.5 text-sm text-slate-400">@</span>
                  <input
                    type="text"
                    value={affectedHandle}
                    onChange={(e) => setAffectedHandle(e.target.value)}
                    placeholder="ej: adnqncoffee"
                    className="w-full bg-slate-900 border border-slate-700 rounded-r-lg p-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tipo de Incidente:
                </label>
                <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white">
                  <option value="SUSPENDED">Cuenta suspendida o inhabilitada</option>
                  <option value="HACKED">Acceso no autorizado / Cuenta comprometida</option>
                  <option value="SHADOWBAN">Pérdida crítica de alcance por algoritmo</option>
                  <option value="MIGRATION">Migración voluntaria de marca</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2"
              >
                <span>Continuar al Paso 2</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Nueva Presencia */}
        {step === 2 && (
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white mb-1">Paso 2: Nueva Presencia y Mensaje Oficial</h2>
              <p className="text-xs text-slate-400">
                Ingresá la nueva URL o cuenta oficial verificada a donde dirigir a tu comunidad.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nueva URL Oficial de la Cuenta:
                </label>
                <input
                  type="url"
                  value={newOfficialUrl}
                  onChange={(e) => setNewOfficialUrl(e.target.value)}
                  placeholder="https://instagram.com/adnqncoffee_oficial"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Validación de seguridad: debe comenzar con https:// y pertenecer a un dominio oficial.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mensaje Explicativo para la Comunidad:
                </label>
                <textarea
                  rows={4}
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-rose-500"
                ></textarea>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Volver
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2"
              >
                <span>Revisar Audiencia Elegible</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Audiencia Elegible y Exclusiones */}
        {step === 3 && (
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white mb-1">Paso 3: Audiencia Elegible & Filtros de Privacidad</h2>
              <p className="text-xs text-slate-400">
                El sistema aplica filtros estrictos para cumplir con la legislación de protección de datos y las políticas del plan.
              </p>
            </div>

            {/* Audience Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <div className="text-2xl font-bold text-emerald-400 mb-1">{eligibleAudience}</div>
                <div className="text-xs font-semibold text-emerald-300">Destinatarios Elegibles</div>
                <div className="text-[10px] text-slate-400 mt-1">Verificados + consentimiento rescate</div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                <div className="text-2xl font-bold text-amber-400 mb-1">{excludedUnverified}</div>
                <div className="text-xs font-semibold text-amber-300">Excluidos (Sin Verificar)</div>
                <div className="text-[10px] text-slate-400 mt-1">Aún no confirmaron enlace</div>
              </div>

              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
                <div className="text-2xl font-bold text-rose-400 mb-1">{excludedOptedOut}</div>
                <div className="text-xs font-semibold text-rose-300">Excluidos (Baja Voluntaria)</div>
                <div className="text-[10px] text-slate-400 mt-1">Opt-out respetado al 100%</div>
              </div>
            </div>

            {/* Guardrails Box */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="font-semibold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                Garantías de Protección al Destinatario:
              </div>
              <p className="text-slate-400">
                • Tener un teléfono o correo en la base <strong>no autoriza envíos si el contacto no aceptó la finalidad de rescate</strong>.
              </p>
              <p className="text-slate-400">
                • Los contactos dados de baja quedan permanentemente bloqueados para este y futuros envíos.
              </p>
              <p className="text-slate-400">
                • Cuota estimada consumida: <strong>{eligibleAudience} envío</strong> (dentro del Plan Free, sin costos adicionales).
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Volver
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2"
              >
                <span>Continuar a Vista Previa</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Vista Previa y Prueba de Envío al Administrador */}
        {step === 4 && (
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white mb-1">Paso 4: Vista Previa & Prueba de Envío</h2>
              <p className="text-xs text-slate-400">
                Revisá el mensaje exacto antes de emitir y enviate una prueba como administrador.
              </p>
            </div>

            {/* Email Preview Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-2xl">
              <div className="border-b border-slate-800 pb-3 mb-4 text-xs space-y-1">
                <div><span className="text-slate-500">De:</span> <span className="text-slate-300">ADNQN Coffee Roasters &lt;no-reply@socialbackup.adnqn.com&gt;</span></div>
                <div><span className="text-slate-500">Asunto:</span> <span className="font-semibold text-emerald-400">¡Seguimos conectados! Nueva cuenta oficial de ADNQN Coffee Roasters</span></div>
              </div>

              <div className="bg-white text-slate-800 rounded-lg p-6 max-w-lg mx-auto text-sm space-y-4">
                <h3 className="text-emerald-700 font-bold text-lg">¡Seguimos conectados!</h3>
                <p>Nuestra cuenta anterior de <strong>{platform}</strong> (@{affectedHandle}) ya no se encuentra disponible.</p>
                <p className="text-slate-700 leading-relaxed">{messageBody}</p>
                <div className="text-center py-2">
                  <span className="inline-block px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-lg text-xs shadow">
                    Ir a nuestra nueva cuenta oficial en {platform}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 border-t pt-3 text-center">
                  Social Backup by ADNQN · Enlace de desuscripción de 1 clic incluido en cada pie de mensaje.
                </div>
              </div>
            </div>

            {/* Test Send Button */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-white">Enviar prueba de verificación al Administrador:</div>
                <div className="text-[11px] text-slate-400">Destinatario: admin@adnqncoffee.com (Sandbox)</div>
              </div>
              <button
                onClick={handleTestSend}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all flex items-center gap-2"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isLoading ? "Enviando prueba..." : "Enviar Correo de Prueba"}</span>
              </button>
            </div>

            {testSendResult && (
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200">
                {testSendResult}
              </div>
            )}

            {/* Express Confirmation & Live Dispatch */}
            <div className="p-5 rounded-xl bg-rose-500/10 border border-rose-500/30">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-1">
                    Confirmación Expresa de Despacho
                  </h4>
                  <p className="text-xs text-rose-200/90 leading-relaxed mb-4">
                    Al confirmar, se iniciará el despacho en cola a los <strong>{eligibleAudience} destinatarios elegibles</strong>. Cada mensaje utilizará claves de idempotencia para garantizar que ningún suscriptor reciba duplicados.
                  </p>
                  <button
                    onClick={handleLiveDispatch}
                    disabled={isLoading}
                    className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isLoading ? "Procesando en cola..." : "Confirmar y Ejecutar Rescate"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Resultados & Continuidad */}
        {step === 5 && dispatchResult && (
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">¡Campaña de Rescate Ejecutada!</h2>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Tu comunicación fue despachada con éxito a través del adaptador de correo.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-2xl font-extrabold text-emerald-400">{dispatchResult.sentCount}</div>
                <div className="text-xs text-slate-400">Mensajes Enviados</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-2xl font-extrabold text-slate-400">{dispatchResult.failedCount}</div>
                <div className="text-xs text-slate-400">Fallos</div>
              </div>
            </div>

            {/* Continuity Page link */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 max-w-lg mx-auto text-left">
              <div className="text-xs font-semibold text-white mb-1">
                Página Oficial de Continuidad Activa:
              </div>
              <p className="text-[11px] text-slate-400 mb-2">
                Un dominio neutral donde tus clientes pueden verificar tu nueva presencia oficial en cualquier momento:
              </p>
              <Link
                href={`/c/${tenantSlug}/continuity`}
                target="_blank"
                className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1.5 break-all"
              >
                <span>{dispatchResult.continuityUrl || `/c/${tenantSlug}/continuity`}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </Link>
            </div>

            <div className="pt-4">
              <Link
                href="/dashboard"
                className="px-6 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
              >
                Volver al Panel de Control
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
