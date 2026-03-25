import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppShell } from "@/modules/shared/components/app-shell";

export const metadata: Metadata = {
  title: "meuDinheiroNaMao",
  description: "MonÃ³lito fullstack para controle financeiro pessoal",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
