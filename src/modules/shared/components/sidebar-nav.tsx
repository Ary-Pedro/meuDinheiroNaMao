"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { desktopNavItems } from "./nav-config";

type Props = {
  currentUser: {
    name: string;
    email: string;
  };
  isDarkMode: boolean;
  onToggleThemeMode: () => void;
};

export function SidebarNav({ currentUser, isDarkMode, onToggleThemeMode }: Props) {
  const pathname = usePathname();

  return (
    <aside
      className={`sticky top-0 hidden h-screen w-72 shrink-0 border-r p-4 lg:block ${
        isDarkMode ? "border-[var(--app-border)] bg-[var(--app-surface)]" : "border-slate-200 bg-white"
      }`}
    >
      <div className="mb-6 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h1 className={`text-lg font-semibold ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>meuDinheiroNaMao</h1>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Monólito fullstack</p>
          </div>
          <button
            type="button"
            onClick={onToggleThemeMode}
            className={`rounded-md border px-2 py-1 text-xs font-medium transition ${
              isDarkMode
                ? "border-[var(--app-border)] bg-[#223351] text-[var(--app-heading)] hover:bg-[#2a3d5f]"
                : "border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {isDarkMode ? "Escuro" : "Claro"}
          </button>
        </div>

        <Link
          href="/profile"
          className={`block rounded-2xl border p-3 transition ${
            isDarkMode
              ? "border-[var(--app-border)] bg-[var(--app-surface-muted)] hover:bg-[#223351]"
              : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className={`truncate text-sm font-semibold ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>{currentUser.name}</p>
              <p className={`truncate text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{currentUser.email}</p>
            </div>
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-medium text-emerald-700">
              Sessão demo
            </span>
          </div>
        </Link>
      </div>

      <nav className="space-y-1">
        {desktopNavItems.map((item) => {
          const active =
            item.href === "/finance"
              ? pathname === "/finance"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`block rounded-xl px-3 py-2 text-sm font-medium transition ${
                active
                  ? isDarkMode
                    ? "bg-[#2a3d5f] text-[var(--app-heading)] shadow-sm"
                    : "bg-slate-900 text-white shadow-sm"
                  : isDarkMode
                    ? "text-[var(--app-text)] hover:bg-[#223351] hover:text-[var(--app-heading)]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
              style={active && !isDarkMode ? { color: "#ffffff" } : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
