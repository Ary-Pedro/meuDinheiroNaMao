export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface-muted)] px-4 py-6 text-center">
      <p className="font-medium text-[var(--app-heading)]">{title}</p>
      {description ? <p className="mt-1 text-sm text-[var(--app-muted)]">{description}</p> : null}
    </div>
  );
}
