export function StatCard({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "positive" | "negative" }) {
  const toneClass =
    tone === "positive" ? "text-emerald-600" : tone === "negative" ? "text-red-600" : "text-slate-900";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${toneClass}`}>{value}</p>
    </article>
  );
}
