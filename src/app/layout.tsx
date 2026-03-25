import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { AppShell } from "@/modules/shared/components/app-shell";

export const metadata: Metadata = {
  title: "meuDinheiroNaMao",
  description: "Monólito fullstack para controle financeiro pessoal",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="pt-BR">
      <body>
        <AppShell currentUser={currentUser}>{children}</AppShell>
      </body>
    </html>
  );
}
