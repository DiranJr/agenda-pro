import "./globals.css";

export const metadata = {
  title: "Agenda Pro | Admin",
  description: "Sistema operacional para Lash e Sobrancelhas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
