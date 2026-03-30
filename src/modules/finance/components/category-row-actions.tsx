"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { OptionItem } from "@/modules/shared/utils/labels";
import { CategoriesForm } from "./categories-form";

type Props = {
  category: {
    id: string;
    name: string;
    kind: string;
    subcategories: { id: string; name: string }[];
  };
  kinds: OptionItem[];
};

export function CategoryRowActions({ category, kinds }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    setDeleteError(null);
    startTransition(async () => {
      const response = await fetch(`/api/finance/categories/${category.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Falha ao excluir categoria." }));
        setDeleteError(body.error ?? "Falha ao excluir categoria.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setIsEditing((value) => !value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
        >
          {isEditing ? "Fechar edição" : "Editar"}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={handleDelete}
          className="rounded-lg border border-rose-300 px-3 py-2 text-sm font-medium text-rose-700 disabled:opacity-70"
        >
          {isPending ? "Excluindo..." : "Excluir"}
        </button>
      </div>

      {deleteError ? <p className="text-sm text-red-600">{deleteError}</p> : null}

      {isEditing ? (
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <CategoriesForm
            kinds={kinds}
            endpoint={`/api/finance/categories/${category.id}`}
            method="PATCH"
            submitLabel="Salvar alterações"
            initialValues={{
              name: category.name,
              kind: category.kind,
              subcategories: category.subcategories.map((subcategory) => subcategory.name),
            }}
            onSuccess={() => setIsEditing(false)}
          />
        </div>
      ) : null}
    </div>
  );
}
