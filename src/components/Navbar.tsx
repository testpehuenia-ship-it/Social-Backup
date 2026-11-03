"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldCheck, 
  Users, 
  QrCode, 
  LifeBuoy, 
  Database, 
  Building2, 
  ExternalLink,
  Skull,
  Sliders
} from "lucide-react";

export function Navbar({ tenantSlug = "adnqn-coffee", tenantName = "ADNQN Coffee Roasters" }: { tenantSlug?: string; tenantName?: string }) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: ShieldCheck },
    { href: "/contacts", label: "Contactos", icon: Users },
    { href: "/capture", label: "Captura & QR", icon: QrCode },
    { href: "/rescue", label: "Modo Rescate", icon: LifeBuoy, highlight: true },
    { href: "/backup", label: "Respaldo", icon: Database },
  ];

  return (
    <header className="border-b border-slate-800 bg-brand-navy/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                  Social Backup <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">ADNQN</span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Tu comunidad. Tus contactos. Tu futuro.</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-slate-800 text-white border border-slate-700 shadow-sm"
                      : link.highlight
                      ? "text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${link.highlight ? "text-rose-400" : ""}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Tenant Indicator & Public Page link */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-slate-200">{tenantName}</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1 rounded">FREE</span>
            </div>

            <Link
              href={`/c/${tenantSlug}`}
              target="_blank"
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm shadow-emerald-600/30"
              title="Abrir página pública de captación"
            >
              <span>Ver Página Pública</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Planes y Tarifas Admin Link */}
            <Link
              href="/admin/plans"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
              title="Gestor central de planes y precios"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>Planes & Tarifas</span>
            </Link>

            {/* Frankenstein VIP Admin Link */}
            <Link
              href="/admin/frankenstein"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all shadow-sm shadow-amber-500/10"
              title="Módulo exclusivo para administradores de ADNQN"
            >
              <Skull className="w-3.5 h-3.5 text-amber-400" />
              <span>Frankenstein VIP</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
