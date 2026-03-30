"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import type { OptionItem } from "@/modules/shared/utils/labels";

type Props = {
  kinds: OptionItem[];
  endpoint?: string;
  method?: "POST" | "PATCH";
  submitLabel?: string;
  initialValues?: {
    name: string;
    kind: string;
    subcategories: string[];
  };
  onSuccess?: () => void;
};

export function CategoriesForm({
  kinds,
  endpoint = "/api/finance/categories",
  method = "POST",
  submitLabel,
  initialValues,
  onSuccess,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      kind: String(formData.get("kind") ?? ""),
      subcategories: String(formData.get("subcategories") ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
    };

    startTransition(async () => {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Falha ao criar categoria." }));
        setError(body.error ?? "Falha ao criar categoria.");
        return;
      }

      form.reset();
      onSuccess?.();
      router.refresh();
    });
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <div className="grid gap-1">
        <label htmlFor="category-name" className="text-sm font-medium text-slate-700">
          Nome da categoria
        </label>
        <input
          id="category-name"
          name="name"
          required
          defaultValue={initialValues?.name}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          placeholder="Ex.: Alimentação"
        />
      </div>

      <div className="grid gap-1">
        <label htmlFor="category-kind" className="text-sm font-medium text-slate-700">
          Tipo
        </label>
        <select
          id="category-kind"
          name="kind"
          defaultValue={initialValues?.kind ?? kinds[0]?.value}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
        >
          {kinds.map((kind) => (
            <option key={kind.value} value={kind.value}>
              {kind.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-1">
        <label htmlFor="category-subs" className="text-sm font-medium text-slate-700">
          Subcategorias
        </label>
        <input
          id="category-subs"
          name="subcategories"
          defaultValue={initialValues?.subcategories.join(", ")}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          placeholder="Mercado, Restaurante"
        />
        <p className="text-xs text-slate-500">Separe por vírgula para criar várias subcategorias.</p>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition disabled:opacity-70"
      >
        {isPending ? "Salvando..." : submitLabel ?? (method === "POST" ? "Criar categoria" : "Salvar categoria")}
      </button>
    </form>
  );
}
