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
  authors: [{ name: "Agenda Pro Team" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://agendapro.com.br",
    title: "Agenda Pro | Gestão de Agendamentos",
    description: "Multiplique seus agendamentos com o CRM feito para especialistas em estética.",
    siteName: "Agenda Pro",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "Agenda Pro Preview"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Agenda Pro | Gestão de Agendamentos",
    description: "O sistema operacional definitivo para estúdio de lash, sobrancelhas e estética.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  }
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
