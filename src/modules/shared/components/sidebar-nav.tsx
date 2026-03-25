"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { desktopNavItems } from "./nav-config";

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-200 bg-white p-4 lg:block">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-slate-900">meuDinheiroNaMao</h1>
        <p className="text-sm text-slate-500">Monólito fullstack</p>
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
              className={`block rounded-xl px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
