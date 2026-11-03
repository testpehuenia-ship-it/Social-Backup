"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sliders, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Plus, 
  Lock, 
  Edit3, 
  Save, 
  X, 
  Globe, 
  ShieldCheck, 
  Skull, 
  Zap,
  Users,
  Sparkles
} from "lucide-react";

interface Plan {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  priceUsd: number;
  priceArs: number | null;
  billingCycle: string;
  maxContacts: number;
  featuresJson: string;
  isActive: boolean;
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Formulario nuevo plan
  const [newPlan, setNewPlan] = useState({
    code: "",
    name: "",
    category: "SUBSCRIPTION",
    description: "",
    priceUsd: 29,
    priceArs: 34800,
    billingCycle: "MONTHLY",
    maxContacts: 1000,
    features: ["Soporte ADNQN", "Acceso a Social Backup"],
  });

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/plans");
      const data = await res.json();
      if (data.success && data.data) {
        setPlans(data.data);
      }
    } catch (err) {
      console.error("Error al cargar planes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleUpdatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    try {
      const res = await fetch("/api/admin/plans", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingPlan.id,
          priceUsd: editingPlan.priceUsd,
          priceArs: editingPlan.priceArs,
          maxContacts: editingPlan.maxContacts,
          description: editingPlan.description,
          name: editingPlan.name,
          isActive: editingPlan.isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al actualizar plan");
      }

      setMessage({ type: "success", text: `Plan ${editingPlan.name} actualizado con éxito.` });
      setEditingPlan(null);
      await fetchPlans();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlan),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al crear el plan");
      }

      setMessage({ type: "success", text: `Plan ${newPlan.name} creado exitosamente.` });
      setShowCreateModal(false);
      await fetchPlans();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const subscriptions = plans.filter((p) => p.category === "SUBSCRIPTION");
  const frankensteinPlans = plans.filter((p) => p.category === "RESCUE_FRANKENSTEIN");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Banner SuperAdmin */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border-b border-emerald-500/20 px-4 py-2 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-300 font-semibold">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>SUPERADMIN ADNQN · GESTOR CENTRAL DE PLANES, TARIFAS Y MONETIZACIÓN</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <Link href="/admin/frankenstein" className="hover:text-amber-400 transition-colors flex items-center gap-1">
            <Skull className="w-3 h-3 text-amber-400" /> Consola Frankenstein
          </Link>
          <span>|</span>
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard General</Link>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Tarifas y Planes Comerciales
              </h1>
              <p className="text-xs text-slate-400">
                Ajuste dinámico de precios en USD/ARS, cuotas de contactos y planes Web ADNQN
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Plan o Promoción</span>
            </button>
            <button
              onClick={fetchPlans}
              disabled={loading}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Alerta */}
      {message && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-4">
          <div className={`p-4 rounded-xl border text-xs sm:text-sm flex items-center justify-between ${
            message.type === "success" 
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{message.text}</span>
            </div>
            <button onClick={() => setMessage(null)} className="text-xs underline font-semibold">Cerrar</button>
          </div>
        </div>
      )}

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* SECCIÓN 1: SUSCRIPCIONES SAAS (INCLUYENDO CLIENTES WEB ADNQN) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-400" /> Planes de Suscripción Mensual
              </h2>
              <p className="text-xs text-slate-400">
                Tarifas de mantenimiento continuo y cuotas de contactos
              </p>
            </div>
            <span className="text-xs text-slate-500 font-mono">{subscriptions.length} planes configurados</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {subscriptions.map((plan) => {
              const isAdnqnWeb = plan.code === "ADNQN_WEB";
              return (
                <div
                  key={plan.id}
                  className={`glass-panel rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                    isAdnqnWeb
                      ? "bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950 border-emerald-500/40 shadow-lg shadow-emerald-950/20"
                      : "bg-slate-900/50 border-slate-800"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">{plan.code}</span>
                      {isAdnqnWeb && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                          EXCLUSIVO ADNQN
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-white text-base mb-1">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mb-4 leading-relaxed line-clamp-2">
                      {plan.description}
                    </p>

                    <div className="mb-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <div className="text-2xl font-black text-white flex items-baseline gap-1">
                        ${plan.priceUsd} <span className="text-xs text-slate-400 font-normal">USD / mes</span>
                      </div>
                      {plan.priceArs && (
                        <div className="text-xs font-semibold text-emerald-400 mt-0.5">
                          ~ ${plan.priceArs.toLocaleString()} ARS
                        </div>
                      )}
                      <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5 pt-2 border-t border-slate-800">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>Hasta <strong>{plan.maxContacts.toLocaleString()}</strong> contactos</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setEditingPlan(plan)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Modificar Precios</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECCIÓN 2: TIERS FORENSES FRANKENSTEIN */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Skull className="w-5 h-5 text-amber-400" /> Tarifas de Rescate Frankenstein (Pago Único)
              </h2>
              <p className="text-xs text-slate-400">
                Planes comerciales asistidos para cuentas perdidas o baneadas
              </p>
            </div>
            <Link
              href="/admin/frankenstein"
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              <span>Ir a Operación Frankenstein</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {frankensteinPlans.map((plan) => (
              <div
                key={plan.id}
                className="glass-panel rounded-2xl p-6 border border-amber-500/30 bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-950 flex flex-col justify-between shadow-lg shadow-amber-950/10"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] text-amber-400 font-bold uppercase">{plan.code}</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                      PAGO ÚNICO
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-lg mb-1">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="mb-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-3xl font-black text-amber-400">
                      ${plan.priceUsd} <span className="text-xs text-slate-400 font-normal">USD</span>
                    </div>
                    {plan.priceArs && (
                      <div className="text-xs font-semibold text-slate-300 mt-1">
                        ~ ${plan.priceArs.toLocaleString()} ARS (Mercado Pago)
                      </div>
                    )}
                    <div className="text-[11px] text-slate-400 mt-2.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                      <span>Audiencia cubierta:</span>
                      <strong className="text-white">Hasta {plan.maxContacts.toLocaleString()} seg.</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setEditingPlan(plan)}
                  className="w-full py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ajustar Tarifa Rescate</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal para Editar Precios */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-400" /> Modificar: {editingPlan.name}
              </h3>
              <button onClick={() => setEditingPlan(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleUpdatePlan} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nombre del Plan</label>
                <input
                  type="text"
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Precio en USD *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={editingPlan.priceUsd}
                    onChange={(e) => {
                      const usd = parseFloat(e.target.value) || 0;
                      setEditingPlan({ ...editingPlan, priceUsd: usd, priceArs: usd * 1200 });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Precio en ARS (Mercado Pago)</label>
                  <input
                    type="number"
                    value={editingPlan.priceArs || 0}
                    onChange={(e) => setEditingPlan({ ...editingPlan, priceArs: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Límite de Contactos / Audiencia</label>
                <input
                  type="number"
                  value={editingPlan.maxContacts}
                  onChange={(e) => setEditingPlan({ ...editingPlan, maxContacts: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Descripción Comercial</label>
                <textarea
                  rows={2}
                  value={editingPlan.description}
                  onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Crear Nuevo Plan */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" /> Crear Nuevo Plan / Promo
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Código Único *</label>
                  <input
                    type="text"
                    required
                    placeholder="PROMO_VERANO"
                    value={newPlan.code}
                    onChange={(e) => setNewPlan({ ...newPlan, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Categoría</label>
                  <select
                    value={newPlan.category}
                    onChange={(e) => setNewPlan({ ...newPlan, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  >
                    <option value="SUBSCRIPTION">Suscripción Mensual</option>
                    <option value="RESCUE_FRANKENSTEIN">Rescate Frankenstein</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nombre Comercial *</label>
                <input
                  type="text"
                  required
                  placeholder="Plan Especial..."
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Precio USD *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={newPlan.priceUsd}
                    onChange={(e) => {
                      const usd = parseFloat(e.target.value) || 0;
                      setNewPlan({ ...newPlan, priceUsd: usd, priceArs: usd * 1200 });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Precio ARS</label>
                  <input
                    type="number"
                    value={newPlan.priceArs}
                    onChange={(e) => setNewPlan({ ...newPlan, priceArs: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Máximo de Contactos</label>
                <input
                  type="number"
                  value={newPlan.maxContacts}
                  onChange={(e) => setNewPlan({ ...newPlan, maxContacts: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Crear Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

