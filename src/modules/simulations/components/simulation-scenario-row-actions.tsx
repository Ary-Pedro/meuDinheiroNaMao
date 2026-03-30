"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { SimulationScenarioForm } from "./simulation-scenario-form";

type Props = {
  scenario: {
    id: string;
    name: string;
    description: string | null;
    targetAmount: string | null;
    participants: {
      name: string;
      expectedContribution: string;
      actualContribution: string;
    }[];
    costs: {
      name: string;
      amount: string;
    }[];
  };
};

export function SimulationScenarioRowActions({ scenario }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const response = await fetch(`/api/simulations/scenarios/${scenario.id}`, { method: "DELETE" });
      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Falha ao excluir simulação." }));
        setError(body.error ?? "Falha ao excluir simulação.");
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

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {isEditing ? (
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <SimulationScenarioForm
            endpoint={`/api/simulations/scenarios/${scenario.id}`}
            method="PATCH"
            submitLabel="Salvar simulação"
            initialValues={{
              name: scenario.name,
              description: scenario.description ?? "",
              targetAmount: scenario.targetAmount ?? "0",
              participantsText: scenario.participants
                .map((participant) => `${participant.name} | ${participant.expectedContribution} | ${participant.actualContribution}`)
                .join("\n"),
              costsText: scenario.costs.map((cost) => `${cost.name} | ${cost.amount}`).join("\n"),
            }}
            onSuccess={() => setIsEditing(false)}
          />
        </div>
      ) : null}
    </div>
  );
}
