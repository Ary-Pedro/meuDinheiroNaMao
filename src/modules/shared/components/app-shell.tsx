"use client";

import type { ReactNode } from "react";
import { BottomNav } from "./bottom-nav";
import { SidebarNav } from "./sidebar-nav";
import { ThemeProvider, useAppTheme } from "./theme-provider";

type Props = {
  children: ReactNode;
  currentUser: {
    name: string;
    email: string;
  };
};

export function AppShell({ children, currentUser }: Props) {
  return (
    <ThemeProvider>
      <AppShellContent currentUser={currentUser}>{children}</AppShellContent>
    </ThemeProvider>
  );
}

function AppShellContent({ children, currentUser }: Props) {
  const { isDarkMode, toggleThemeMode } = useAppTheme();

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
      <div className="flex w-full">
        <SidebarNav currentUser={currentUser} isDarkMode={isDarkMode} onToggleThemeMode={toggleThemeMode} />
        <main className="min-h-screen min-w-0 flex-1 px-4 pb-24 pt-4 lg:px-8 lg:pb-10 lg:pt-8">
          <div className="w-full">{children}</div>
        </main>
      </div>
      <BottomNav isDarkMode={isDarkMode} />
    </div>
  );
}
