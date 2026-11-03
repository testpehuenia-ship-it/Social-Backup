"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Skull, 
  ShieldAlert, 
  Users, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ExternalLink, 
  Play, 
  Pause, 
  RefreshCw, 
  Search, 
  Plus, 
  Sliders, 
  DollarSign,
  TrendingUp,
  Mail,
  MessageSquare,
  ShieldCheck,
  Zap,
  Info,
  Building2,
  Lock,
  CreditCard,
  Share2
} from "lucide-react";

interface FrankensteinTarget {
  id: string;
  handle: string;
  displayName: string | null;
  email: string | null;
  status: string;
  notificationChannel: string;
  sentAt: string | null;
  convertedAt: string | null;
  responseNote: string | null;
}

interface FrankensteinCase {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  lostPlatform: string;
  lostAccountUrl: string;
  newAccountUrl: string;
  status: string;
  tier: string;
  dailyRateLimit: number;
  priceCharged: number | null;
  paymentStatus: string;
  mercadoPagoPaymentUrl: string | null;
  estimatedFollowers: number;
  guaranteedReach: number;
  estimatedSuccessRate: number;
  totalScraped: number;
  totalNotified: number;
  totalConverted: number;
  createdAt: string;
  targets: FrankensteinTarget[];
}

export default function AdminFrankensteinPage() {
  const [cases, setCases] = useState<FrankensteinCase[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Formulario nuevo caso
  const [newCaseData, setNewCaseData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    lostPlatform: "INSTAGRAM",
    lostAccountUrl: "",
    newAccountUrl: "",
    tier: "FRANKEN_PRO",
    dailyRateLimit: 50,
    priceCharged: 420,
    notes: "",
  });

  const fetchCases = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/frankenstein");
      const data = await res.json();
      if (data.success && data.data) {
        setCases(data.data);
        if (!selectedCaseId && data.data.length > 0) {
          setSelectedCaseId(data.data[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching Frankenstein cases:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const handleAction = async (action: "SCRAPE" | "DRIP_DISPATCH" | "UPDATE_STATUS", payload: any = {}) => {
    if (!selectedCase) return;
    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/frankenstein/${selectedCase.id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...payload }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al ejecutar la acción");
      }

      setMessage({ type: "success", text: data.message });
      await fetchCases();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Error al procesar la acción" });
    } finally {
      setActionLoading(false);
    }
  };

  // Generar link de Mercado Pago
  const handleGenerateMercadoPago = async () => {
    if (!selectedCase) return;
    setActionLoading(true);

    try {
      const res = await fetch("/api/payments/mercadopago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: selectedCase.id,
          planCode: selectedCase.tier,
          amountUsd: selectedCase.priceCharged || 420,
          clientEmail: selectedCase.clientEmail,
          title: `Rescate Forense Social Backup - ${selectedCase.clientName}`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al generar link de Mercado Pago");
      }

      setMessage({ type: "success", text: `Link de Mercado Pago generado: ${data.paymentUrl}` });
      await fetchCases();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  // Confirmar pago manualmente o por MP
  const handleConfirmPayment = async () => {
    if (!selectedCase) return;
    setActionLoading(true);

    try {
      const res = await fetch("/api/payments/mercadopago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CONFIRM_PAYMENT",
          caseId: selectedCase.id,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al confirmar pago");
      }

      setMessage({ type: "success", text: data.message });
      await fetchCases();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  // Redactar y abrir WhatsApp con la propuesta calculada
  const handleOpenWhatsApp = () => {
    if (!selectedCase) return;
    const phone = (selectedCase.clientPhone || "").replace(/\D/g, "");
    const estimatedFollowers = selectedCase.tier === "FRANKEN_VIP" ? "15.000+" : selectedCase.tier === "FRANKEN_PRO" ? "4.500 - 8.000" : "1.200 - 2.500";
    const guaranteedReach = selectedCase.tier === "FRANKEN_VIP" ? "hasta 50.000 contactos" : selectedCase.tier === "FRANKEN_PRO" ? "hasta 10.000 contactos" : "hasta 2.500 contactos";
    const successRate = selectedCase.tier === "FRANKEN_VIP" ? "50% a 70%" : "40% a 65%";
    const mpLink = selectedCase.mercadoPagoPaymentUrl || `https://mpago.la/socialbackup-${selectedCase.id.slice(0, 8)}`;

    const text = `¡Hola ${selectedCase.clientName}! Te escribimos del equipo forense de ADNQN / Social Backup respecto a tu solicitud de rescate.

Hemos auditado preliminarmente tu cuenta previa:
🔗 ${selectedCase.lostAccountUrl}
📊 Audiencia estimada rastreable: ${estimatedFollowers} seguidores.
🎯 Plan asignado: ${selectedCase.tier} ($${selectedCase.priceCharged || 420} USD).

🛡️ ALCANCE Y GARANTÍAS DE SEGURIDAD:
• Contactos asegurados a notificar: ${guaranteedReach}.
• Ritmo de entrega: ${selectedCase.dailyRateLimit} avisos/día mediante cuentas satélite de ADNQN (tu cuenta nueva queda 100% blindada contra bloqueos).
• Tasa estimada de reconexión efectiva: ${successRate} de tu comunidad activa.
• Nueva cuenta oficial: ${selectedCase.newAccountUrl}

💳 Enlace de pago seguro (Mercado Pago en cuotas / transferencia):
${mpLink}

Una vez acreditado, activamos de inmediato la extracción forense y el motor de goteo. ¡Quedamos a tu disposición para cualquier duda!`;

    const encoded = encodeURIComponent(text);
    const url = phone ? `https://wa.me/${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, "_blank");
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/frankenstein", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCaseData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al crear caso");
      }

      setMessage({ type: "success", text: "Caso Frankenstein creado con éxito." });
      setShowCreateModal(false);
      await fetchCases();
      if (data.case) {
        setSelectedCaseId(data.case.id);
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  // Métricas agregadas
  const totalRevenue = cases.reduce((acc, c) => acc + (c.priceCharged || 0), 0);
  const totalScrapedAll = cases.reduce((acc, c) => acc + c.totalScraped, 0);
  const totalNotifiedAll = cases.reduce((acc, c) => acc + c.totalNotified, 0);
  const totalConvertedAll = cases.reduce((acc, c) => acc + c.totalConverted, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top SuperAdmin Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 border-b border-red-500/20 px-4 py-2 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2 text-red-300 font-semibold">
          <Lock className="w-3.5 h-3.5 text-red-400" />
          <span>SUPERADMIN ADNQN · CONSOLA FORENSE FRANKENSTEIN & COBROS</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <Link href="/admin/plans" className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1">
            <Sliders className="w-3 h-3" /> Gestor de Planes y Tarifas
          </Link>
          <span>|</span>
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard General</Link>
        </div>
      </div>

      {/* Main Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 to-red-500 flex items-center justify-center shadow-lg shadow-amber-600/25">
              <Skull className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Cuentas Frankenstein
                </h1>
                <span className="text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase">
                  VIP ADNQN
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Rescate asistido de comunidades perdidas · Scraping forense, cotización y cobros MP
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/plans"
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Modificar Tarifas</span>
            </Link>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Rescate Forense</span>
            </button>
            <button
              onClick={fetchCases}
              disabled={loading}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Alerta de notificación */}
      {message && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-4">
          <div className={`p-4 rounded-xl border text-xs sm:text-sm flex items-center justify-between ${
            message.type === "success" 
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}>
            <div className="flex items-center gap-2">
              {message.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
              <span>{message.text}</span>
            </div>
            <button onClick={() => setMessage(null)} className="text-xs underline font-semibold">Cerrar</button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Cards de Frankenstein */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider">Facturación Forense</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">${totalRevenue.toLocaleString()} USD</div>
            <div className="text-[11px] text-slate-500 mt-1">{cases.length} casos gestionados</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider">Audiencia Extraída</span>
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">{totalScrapedAll.toLocaleString()}</div>
            <div className="text-[11px] text-slate-500 mt-1">Seguidores en base forense</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider">Despachos Seguros</span>
              <Send className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-cyan-400">{totalNotifiedAll.toLocaleString()}</div>
            <div className="text-[11px] text-slate-500 mt-1">Vía satélites & email</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider">Reconexión Exitosa</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">{totalConvertedAll.toLocaleString()}</div>
            <div className="text-[11px] text-slate-500 mt-1">
              {totalNotifiedAll > 0 ? `${Math.round((totalConvertedAll / totalNotifiedAll) * 100)}% de tasa de retorno` : "En proceso"}
            </div>
          </div>
        </div>

        {/* Panel de Casos y Operación */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Izquierda: Listado de Casos */}
          <div className="lg:col-span-1 glass-panel rounded-2xl border border-slate-800 p-5 bg-slate-900/50 flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Skull className="w-4 h-4 text-amber-400" /> Solicitudes & Casos ({cases.length})
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">ADNQN SuperAdmin</span>
            </div>

            {cases.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-500">
                No hay casos registrados aún.
              </div>
            ) : (
              <div className="space-y-2 overflow-y-auto max-h-[600px] pr-1">
                {cases.map((c) => {
                  const isSelected = selectedCase?.id === c.id;
                  const isPaid = c.paymentStatus === "APPROVED";
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCaseId(c.id)}
                      className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? "bg-slate-800 border-amber-500/50 shadow-md shadow-amber-500/5"
                          : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-white truncate max-w-[140px]">{c.clientName}</span>
                        <div className="flex items-center gap-1">
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            isPaid ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}>
                            {isPaid ? "PAGADO" : "PEND. PAGO"}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                            c.status === "COMPLETED" ? "bg-emerald-500/20 text-emerald-300" :
                            c.status === "IN_PROGRESS" ? "bg-cyan-500/20 text-cyan-300 animate-pulse" :
                            c.status === "READY_FOR_DRIP" ? "bg-amber-500/20 text-amber-300" :
                            "bg-slate-700 text-slate-300"
                          }`}>
                            {c.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-slate-400 truncate text-[11px] mb-2 font-mono">
                        Perdida: {c.lostAccountUrl}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                        <span className="font-semibold text-amber-300/90">{c.tier} (${c.priceCharged})</span>
                        <span>{c.totalConverted} / {c.totalScraped} reconectados</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Columna Derecha: Detalle Operativo del Caso Seleccionado */}
          <div className="lg:col-span-2 glass-panel rounded-2xl border border-slate-800 p-6 bg-slate-900/50 space-y-6">
            {!selectedCase ? (
              <div className="text-center py-20 text-slate-500 text-sm">
                Selecciona un caso para operar el scraper, cotizar y despachar.
              </div>
            ) : (
              <>
                {/* Header del Caso */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-bold text-white">{selectedCase.clientName}</h2>
                      <span className="text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                        {selectedCase.tier} · ${selectedCase.priceCharged || 420} USD
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        selectedCase.paymentStatus === "APPROVED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}>
                        {selectedCase.paymentStatus === "APPROVED" ? "✓ Cobro Acreditado" : "Pendiente de Cobro"}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3">
                      <span>Email: <strong className="text-slate-200">{selectedCase.clientEmail}</strong></span>
                      {selectedCase.clientPhone && (
                        <span>WhatsApp: <strong className="text-emerald-400">{selectedCase.clientPhone}</strong></span>
                      )}
                      <span>Red: <strong className="text-slate-200">{selectedCase.lostPlatform}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
                      Goteo: {selectedCase.dailyRateLimit}/día
                    </span>
                  </div>
                </div>

                {/* Módulo de Respuesta al Cliente & Mercado Pago */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-emerald-950/20 border border-amber-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-amber-400" /> Respuesta Comercial & Coordinación de Pago
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Informa al cliente la audiencia asegurable, porcentaje de éxito y link de cobro MP
                      </p>
                    </div>

                    {selectedCase.paymentStatus !== "APPROVED" && (
                      <button
                        onClick={handleConfirmPayment}
                        disabled={actionLoading}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-[11px] font-bold border border-emerald-500/40 transition-colors"
                        title="Marcar pago como recibido (transferencia/efectivo/MP)"
                      >
                        ✓ Marcar Pagado Manualmente
                      </button>
                    )}
                  </div>

                  {/* Botonera de Acción de Contacto */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Botón WhatsApp */}
                    <button
                      onClick={handleOpenWhatsApp}
                      className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Enviar Propuesta por WhatsApp</span>
                    </button>

                    {/* Botón Mercado Pago */}
                    <button
                      onClick={handleGenerateMercadoPago}
                      disabled={actionLoading}
                      className="p-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-600/20"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>{selectedCase.mercadoPagoPaymentUrl ? "Regenerar Link Mercado Pago" : "Generar Link Mercado Pago"}</span>
                    </button>
                  </div>

                  {selectedCase.mercadoPagoPaymentUrl && (
                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] flex items-center justify-between">
                      <span className="text-slate-400 truncate max-w-md font-mono">
                        Link MP: {selectedCase.mercadoPagoPaymentUrl}
                      </span>
                      <a
                        href={selectedCase.mercadoPagoPaymentUrl}
                        target="_blank"
                        className="text-cyan-400 hover:underline font-semibold shrink-0 ml-2 flex items-center gap-1"
                      >
                        <span>Abrir Checkout</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Rutas de Cuentas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-red-500/20">
                    <div className="text-[10px] text-red-400 font-bold uppercase mb-1 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Cuenta Perdida / Baneada
                    </div>
                    <div className="font-mono text-slate-200 truncate">{selectedCase.lostAccountUrl}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/20">
                    <div className="text-[10px] text-emerald-400 font-bold uppercase mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Nueva Cuenta Oficial
                    </div>
                    <div className="font-mono text-slate-200 truncate">{selectedCase.newAccountUrl}</div>
                  </div>
                </div>

                {/* Módulo de Acciones Operativas (Scraping & Drip) */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" /> Operaciones Forenses y Despacho
                      </h4>
                      <p className="text-xs text-slate-400">Ejecución del pipeline de scraping e inyección segura</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAction("UPDATE_STATUS", { newStatus: selectedCase.status === "PAUSED" ? "IN_PROGRESS" : "PAUSED" })}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 flex items-center gap-1.5"
                      >
                        {selectedCase.status === "PAUSED" ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
                        <span>{selectedCase.status === "PAUSED" ? "Reanudar" : "Pausar"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {/* Botón 1: Iniciar Scraping Forense */}
                    <button
                      onClick={() => handleAction("SCRAPE")}
                      disabled={actionLoading}
                      className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/40 text-left transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-xs text-white group-hover:text-amber-400 flex items-center gap-1.5">
                          <Search className="w-3.5 h-3.5 text-amber-400" />
                          1. Iniciar Scraping Forense
                        </span>
                        <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded">
                          {selectedCase.totalScraped} extraídos
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Escanea la cuenta previa (caché/web) identificando seguidores, bios y correos públicos disponibles.
                      </p>
                    </button>

                    {/* Botón 2: Despachar Lote Diario Drip */}
                    <button
                      onClick={() => handleAction("DRIP_DISPATCH", { batchSize: selectedCase.dailyRateLimit })}
                      disabled={actionLoading || selectedCase.totalScraped === 0}
                      className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 hover:border-emerald-500/50 border border-emerald-500/30 text-left transition-all group disabled:opacity-50"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-xs text-emerald-300 flex items-center gap-1.5">
                          <Send className="w-3.5 h-3.5 text-emerald-400" />
                          2. Despachar Lote de Hoy ({selectedCase.dailyRateLimit}/día)
                        </span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                          Anti-Ban Guard ON
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Envía notas seguras con jitter de 4-12m usando cuentas satélite ADNQN y email directo sin tocar la nueva cuenta.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Métricas de Progreso del Caso */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 font-semibold">Progreso de Reactivación de la Comunidad</span>
                    <span className="font-bold text-amber-400">
                      {selectedCase.totalNotified} / {selectedCase.totalScraped} Notificados ({selectedCase.totalConverted} reconectados)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden flex">
                    <div 
                      className="bg-emerald-500 transition-all duration-500" 
                      style={{ width: `${selectedCase.totalScraped > 0 ? (selectedCase.totalConverted / selectedCase.totalScraped) * 100 : 0}%` }}
                      title="Reconectados"
                    />
                    <div 
                      className="bg-cyan-500 transition-all duration-500" 
                      style={{ width: `${selectedCase.totalScraped > 0 ? ((selectedCase.totalNotified - selectedCase.totalConverted) / selectedCase.totalScraped) * 100 : 0}%` }}
                      title="En espera"
                    />
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-slate-400 mt-2">
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Reconectados a nueva cuenta</div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500" /> Mensaje entregado / Pendiente confirmación</div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-700" /> En cola de goteo</div>
                  </div>
                </div>

                {/* Tabla de Audiencia Extraída / Muestreo Forense */}
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>Muestreo de Contactos Extraídos ({selectedCase.targets?.length || 0})</span>
                    <span className="text-[10px] text-slate-500 font-normal">Mostrando lote activo</span>
                  </h4>

                  {(!selectedCase.targets || selectedCase.targets.length === 0) ? (
                    <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/40 text-center text-xs text-slate-500">
                      Aún no se ha ejecutado el scraping forense. Presiona "1. Iniciar Scraping Forense" arriba.
                    </div>
                  ) : (
                    <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/60 max-h-72 overflow-y-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-900/90 text-slate-400 text-[10px] uppercase font-semibold sticky top-0">
                          <tr>
                            <th className="p-3">Usuario / Handle</th>
                            <th className="p-3">Canal Blindado</th>
                            <th className="p-3">Estado</th>
                            <th className="p-3">Detalle / Respuesta</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80">
                          {selectedCase.targets.map((t) => (
                            <tr key={t.id} className="hover:bg-slate-900/40">
                              <td className="p-3 font-mono font-medium text-white">
                                {t.handle}
                                {t.email && (
                                  <div className="text-[10px] text-cyan-400 font-sans">{t.email}</div>
                                )}
                              </td>
                              <td className="p-3">
                                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                                  t.notificationChannel === "DIRECT_EMAIL"
                                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                }`}>
                                  {t.notificationChannel === "DIRECT_EMAIL" ? "Email Directo (0% riesgo)" : "Satélite ADNQN"}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  t.status === "CONVERTED" ? "bg-emerald-500/20 text-emerald-300" :
                                  t.status === "SENT" ? "bg-cyan-500/20 text-cyan-300" :
                                  "bg-slate-800 text-slate-400"
                                }`}>
                                  {t.status}
                                </span>
                              </td>
                              <td className="p-3 text-[11px] text-slate-400">
                                {t.responseNote || (t.status === "PENDING" ? "En cola para próximo lote" : "Enviado")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Modal para Crear Nuevo Caso Forense */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Skull className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Nuevo Rescate Forense Frankenstein</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nombre / Negocio *</label>
                  <input
                    type="text"
                    required
                    value={newCaseData.clientName}
                    onChange={(e) => setNewCaseData({ ...newCaseData, clientName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email Cliente *</label>
                  <input
                    type="email"
                    required
                    value={newCaseData.clientEmail}
                    onChange={(e) => setNewCaseData({ ...newCaseData, clientEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">WhatsApp Cliente</label>
                  <input
                    type="text"
                    value={newCaseData.clientPhone}
                    onChange={(e) => setNewCaseData({ ...newCaseData, clientPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Plataforma</label>
                  <select
                    value={newCaseData.lostPlatform}
                    onChange={(e) => setNewCaseData({ ...newCaseData, lostPlatform: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  >
                    <option value="INSTAGRAM">Instagram</option>
                    <option value="TIKTOK">TikTok</option>
                    <option value="FACEBOOK">Facebook</option>
                    <option value="X_TWITTER">X (Twitter)</option>
                    <option value="YOUTUBE">YouTube</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">URL o Usuario de la Cuenta PERDIDA *</label>
                <input
                  type="text"
                  required
                  placeholder="https://instagram.com/cuenta_perdida"
                  value={newCaseData.lostAccountUrl}
                  onChange={(e) => setNewCaseData({ ...newCaseData, lostAccountUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">URL o Usuario de la NUEVA Cuenta Oficial</label>
                <input
                  type="text"
                  placeholder="https://instagram.com/cuenta_nueva"
                  value={newCaseData.newAccountUrl}
                  onChange={(e) => setNewCaseData({ ...newCaseData, newAccountUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Tier Rescate</label>
                  <select
                    value={newCaseData.tier}
                    onChange={(e) => {
                      const tier = e.target.value;
                      const prices: Record<string, number> = { FRANKEN_LOCAL: 180, FRANKEN_PRO: 420, FRANKEN_VIP: 850 };
                      setNewCaseData({ 
                        ...newCaseData, 
                        tier, 
                        priceCharged: prices[tier] || 420,
                        dailyRateLimit: tier === "FRANKEN_VIP" ? 100 : 50 
                      });
                    }}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  >
                    <option value="FRANKEN_LOCAL">Local ($180)</option>
                    <option value="FRANKEN_PRO">Pro ($420)</option>
                    <option value="FRANKEN_VIP">VIP ($850)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Goteo Diario</label>
                  <input
                    type="number"
                    value={newCaseData.dailyRateLimit}
                    onChange={(e) => setNewCaseData({ ...newCaseData, dailyRateLimit: parseInt(e.target.value, 10) })}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Precio USD</label>
                  <input
                    type="number"
                    value={newCaseData.priceCharged}
                    onChange={(e) => setNewCaseData({ ...newCaseData, priceCharged: parseFloat(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  {actionLoading ? "Guardando..." : "Crear Caso"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
