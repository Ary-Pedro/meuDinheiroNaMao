"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { desktopNavItems } from "./nav-config";

type Props = {
  currentUser: {
    name: string;
    email: string;
  };
};

export function SidebarNav({ currentUser }: Props) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white p-4 lg:block">
      <div className="mb-6 space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">meuDinheiroNaMao</h1>
          <p className="text-sm text-slate-500">Monólito fullstack</p>
        </div>

        <Link
          href="/profile"
          className="block rounded-2xl border border-slate-200 bg-slate-50 p-3 transition hover:border-slate-300 hover:bg-slate-100"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{currentUser.name}</p>
              <p className="truncate text-xs text-slate-500">{currentUser.email}</p>
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
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
              style={active ? { color: "#ffffff" } : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
