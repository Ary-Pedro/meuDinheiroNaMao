"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";

type Props = {
  endpoint?: string;
  method?: "POST" | "PATCH";
  submitLabel?: string;
  initialValues?: {
    name: string;
    description: string;
    targetAmount: string;
    participantsText: string;
    costsText: string;
  };
  onSuccess?: () => void;
};

function parseParticipants(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, expected, actual] = line.split("|").map((item) => item.trim());
      return {
        name,
        expectedContribution: Number(expected ?? 0),
        actualContribution: Number(actual ?? 0),
      };
    });
}

function parseCosts(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, amount] = line.split("|").map((item) => item.trim());
      return {
        name,
        amount: Number(amount ?? 0),
      };
    });
}

export function SimulationScenarioForm({
  endpoint = "/api/simulations/scenarios",
  method = "POST",
  submitLabel,
  initialValues,
  onSuccess,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const participantsText = String(formData.get("participants") ?? "");
    const costsText = String(formData.get("costs") ?? "");

    const payload = {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      targetAmount: Number(formData.get("targetAmount") ?? 0),
      participants: parseParticipants(participantsText),
      costs: parseCosts(costsText),
    };

    startTransition(async () => {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Falha ao salvar simulação." }));
        setError(body.error ?? "Falha ao salvar simulação.");
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
        <label htmlFor="simulation-name" className="text-sm font-medium text-slate-700">
          Nome do cenário
        </label>
        <input
          id="simulation-name"
          name="name"
          required
          defaultValue={initialValues?.name}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          placeholder="Ex.: Compra do comércio com parceiros"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1">
          <label htmlFor="simulation-target" className="text-sm font-medium text-slate-700">
            Meta total
          </label>
          <input
            id="simulation-target"
            name="targetAmount"
            type="number"
            step="0.01"
            defaultValue={initialValues?.targetAmount ?? "0"}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          />
        </div>

        <div className="grid gap-1">
          <label htmlFor="simulation-description" className="text-sm font-medium text-slate-700">
            Descrição
          </label>
          <input
            id="simulation-description"
            name="description"
            defaultValue={initialValues?.description}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
            placeholder="Opcional"
          />
        </div>
      </div>

      <div className="grid gap-1">
        <label htmlFor="simulation-participants" className="text-sm font-medium text-slate-700">
          Participantes
        </label>
        <textarea
          id="simulation-participants"
          name="participants"
          rows={5}
          defaultValue={initialValues?.participantsText}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          placeholder={"um por linha: Nome | esperado | pago\nJoão | 5000 | 3000\nRosy | 6000 | 6000"}
        />
      </div>

      <div className="grid gap-1">
        <label htmlFor="simulation-costs" className="text-sm font-medium text-slate-700">
          Custos / saídas
        </label>
        <textarea
          id="simulation-costs"
          name="costs"
          rows={4}
          defaultValue={initialValues?.costsText}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          placeholder={"um por linha: Nome | valor\nEntrada do negócio | 26000\nDocumentação | 2000"}
        />
      </div>

      <p className="text-xs text-slate-500">
        A simulação é isolada do dado real: serve para meta, diferenças entre parceiros e leitura tipo Sankey.
      </p>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition disabled:opacity-70"
      >
        {isPending ? "Salvando..." : submitLabel ?? (method === "POST" ? "Salvar simulação" : "Salvar alterações")}
      </button>
    </form>
  );
}
