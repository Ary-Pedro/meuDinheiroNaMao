"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNavItems } from "./nav-config";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur lg:hidden">
      <ul className="grid grid-cols-4 gap-1">
        {primaryNavItems.map((item) => {
          const active =
            item.href === "/finance"
              ? pathname === "/finance"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex min-h-11 items-center justify-center rounded-lg px-2 py-2 text-xs font-semibold tracking-tight transition ${
                  active ? "bg-slate-900 text-slate-50 shadow-sm" : "text-slate-700"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
        <li>
          <Link
            href="/finance/accounts"
            className={`flex min-h-11 items-center justify-center rounded-lg px-2 py-2 text-xs font-semibold tracking-tight transition ${
              pathname.startsWith("/finance/accounts") || pathname.startsWith("/finance/categories") || pathname.startsWith("/investments") || pathname.startsWith("/simulations")
                ? "bg-slate-900 text-slate-50 shadow-sm"
                : "text-slate-700"
            }`}
          >
            Mais
          </Link>
        </li>
      </ul>
    </nav>
  );
}
