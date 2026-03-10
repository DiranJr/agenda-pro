import { ToastProvider } from "./components/ui/toast-provider";
import "./globals.css";

import Script from "next/script";

export const metadata = {
  title: {
    default: "Agenda Pro | Gestão de Agendamentos",
    template: "%s | Agenda Pro"
  },
  description: "O sistema operacional definitivo para estúdio de lash, sobrancelhas e estética.",
  keywords: ["agendamento", "crm", "estética", "lash", "sobrancelhas", "gestão"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <ToastProvider />
        {children}

        {/* Analytics Placeholder (Fase 3 do Guia) */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
