"use client";

import { FormEvent, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  initialFrom: string;
  initialTo: string;
  today: string;
};

const STORAGE_KEY = "finance:dashboard-period";

function isInputDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function DashboardPeriodFilter({ initialFrom, initialTo, today }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hydratedFromSessionRef = useRef(false);
  const [isPending, startTransition] = useTransition();

  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);

  useEffect(() => {
    if (hydratedFromSessionRef.current) {
      return;
    }

    hydratedFromSessionRef.current = true;

    const queryFrom = searchParams.get("from");
    const queryTo = searchParams.get("to");
    const hasExplicitQuery = Boolean(queryFrom && queryTo);

    if (hasExplicitQuery && queryFrom && queryTo) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ from: queryFrom, to: queryTo }));
      return;
    }

    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }

    let parsed: { from?: string; to?: string };
    try {
      parsed = JSON.parse(raw) as { from?: string; to?: string };
    } catch {
      return;
    }
    if (!parsed.from || !parsed.to) {
      return;
    }

    if (!isInputDate(parsed.from) || !isInputDate(parsed.to)) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("from", parsed.from);
    nextParams.set("to", parsed.to);
    router.replace(`${pathname}?${nextParams.toString()}`);
  }, [pathname, router, searchParams]);

  const hasScopeChanged = useMemo(() => from !== initialFrom || to !== initialTo, [from, initialFrom, to, initialTo]);

  const isInvalidRange = useMemo(() => {
    if (!isInputDate(from) || !isInputDate(to)) {
      return true;
    }

    if (to > today) {
      return true;
    }

    return from > to;
  }, [from, to, today]);

  const isSubmitDisabled = !hasScopeChanged || isInvalidRange || isPending;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    const safeTo = to > today ? today : to;
    const safeFrom = from > safeTo ? safeTo : from;

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ from: safeFrom, to: safeTo }));

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("from", safeFrom);
    nextParams.set("to", safeTo);
    startTransition(() => {
      router.push(`${pathname}?${nextParams.toString()}`);
    });
  }

  return (
    <form className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]" onSubmit={handleSubmit}>
      <div className="grid gap-1">
        <label htmlFor="dashboard-from" className="text-sm font-medium text-slate-700">
          Data inicial
        </label>
        <input
          id="dashboard-from"
          name="from"
          type="date"
          max={today}
          value={from}
          onChange={(event) => setFrom(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
        />
      </div>
      <div className="grid gap-1">
        <label htmlFor="dashboard-to" className="text-sm font-medium text-slate-700">
          Data final
        </label>
        <input
          id="dashboard-to"
          name="to"
          type="date"
          max={today}
          value={to}
          onChange={(event) => setTo(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitDisabled}
        className={`rounded-xl px-4 py-2 text-sm font-medium text-white transition-all duration-200 ${
          isSubmitDisabled
            ? "cursor-not-allowed bg-slate-300"
            : "bg-blue-600 shadow-sm hover:bg-blue-700 hover:shadow"
        } ${isPending ? "animate-pulse" : ""}`}
      >
        {isPending ? "Aplicando..." : "Aplicar"}
      </button>

      <p className="sm:col-span-3 text-xs text-slate-500">
        {isInvalidRange
          ? "Intervalo inválido: a data final deve ser hoje ou anterior, e a inicial não pode ser maior que a final."
          : hasScopeChanged
            ? "Período alterado. Clique em Aplicar para atualizar os indicadores."
            : "Escopo aplicado. Ajuste as datas para habilitar o botão."}
      </p>
    </form>
  );
}
