import type { Metadata } from "next";
import { AppShell } from "@/shared/components/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "JAC Lealtad",
  description: "Tu cuenta de puntos en un solo lugar.",
  icons: { icon: "/jac-favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full"><AppShell>{children}</AppShell></body>
    </html>
  );
}
