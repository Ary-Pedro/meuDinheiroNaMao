import { formatCurrency } from "@/modules/shared/utils/currency";
import type { SankeyLink, SankeyNode } from "../models/finance-types";

type Props = {
  nodes: SankeyNode[];
  links: SankeyLink[];
};

function findNode(nodes: SankeyNode[], id: string) {
  return nodes.find((node) => node.id === id);
}

export function FinanceSankey({ nodes, links }: Props) {
  const incomePool = findNode(nodes, "pool:receitas");
  const balancePool = findNode(nodes, "pool:saldo");

  const incomeNodes = links
    .filter((link) => link.to === "pool:receitas" && link.from.startsWith("income:"))
    .map((link) => ({ link, node: findNode(nodes, link.from) }))
    .filter((item): item is { link: SankeyLink; node: SankeyNode } => Boolean(item.node));

  const expenseNodes = links
    .filter((link) => link.from === "pool:receitas" && link.to.startsWith("expense:"))
    .map((link) => ({ link, node: findNode(nodes, link.to) }))
    .filter((item): item is { link: SankeyLink; node: SankeyNode } => Boolean(item.node));

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr_1fr]">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Origens</p>
        {incomeNodes.length ? (
          incomeNodes.map(({ node }) => (
            <div key={node.id} className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
              <p className="font-medium text-emerald-900">{node.label}</p>
              <p className="text-sm text-emerald-700">{formatCurrency(node.value)}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">Sem receitas no período.</p>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Central do fluxo</p>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">{incomePool?.label ?? "Entradas do período"}</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{formatCurrency(incomePool?.value ?? "0")}</p>
          <div className="mt-4 space-y-3">
            {expenseNodes.map(({ node }) => (
              <div key={node.id} className="rounded-xl border border-rose-200 bg-white p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900">{node.label}</p>
                  <span className="text-sm font-semibold text-rose-700">{formatCurrency(node.value)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Saída final</p>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-900">{balancePool?.label ?? "Saldo restante"}</p>
          <p className="mt-1 text-lg font-bold text-blue-900">{formatCurrency(balancePool?.value ?? "0")}</p>
          <p className="mt-3 text-sm text-blue-800">
            O saldo restante considera somente receitas e despesas do período. As transferências ficam separadas do fluxo
            operacional.
          </p>
        </div>
      </div>
    </div>
  );
}
