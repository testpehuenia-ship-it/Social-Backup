import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Social Backup by ADNQN — Tu comunidad. Tus contactos. Tu futuro.",
  description: "Plataforma SaaS para construir, administrar, proteger y recuperar la comunicación directa con tu comunidad de clientes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="bg-brand-navy text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        {children}
      </body>
    </html>
  );
}
