import type { ReactNode } from "react";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {description ? <p className="text-sm text-slate-600">{description}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}
