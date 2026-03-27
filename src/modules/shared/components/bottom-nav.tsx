"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { desktopNavItems } from "./nav-config";

export function BottomNav({ isDarkMode }: { isDarkMode: boolean }) {
  const pathname = usePathname();

  return (
    <nav
      className={`fixed inset-x-0 bottom-0 z-50 border-t px-2 py-2 backdrop-blur lg:hidden ${
        isDarkMode ? "border-[var(--app-border)] bg-[var(--app-surface)]/95" : "border-slate-200 bg-white/95"
      }`}
    >
      <ul className="flex gap-1 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {desktopNavItems.map((item) => {
          const active =
            item.href === "/finance"
              ? pathname === "/finance"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                className={`flex min-h-10 items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold tracking-tight whitespace-nowrap transition ${
                  active
                    ? isDarkMode
                      ? "bg-[#2a3d5f] text-[var(--app-heading)] shadow-sm"
                      : "bg-slate-900 text-slate-50 shadow-sm"
                    : isDarkMode
                      ? "text-[var(--app-text)]"
                      : "text-slate-700"
                }`}
                style={active && !isDarkMode ? { color: "#f8fafc" } : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
