import type { ReactNode } from "react";

export function SectionCard({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-[var(--app-heading)]">{title}</h2>
        {actions}
      </div>
      {children}
    </section>
  );
}
