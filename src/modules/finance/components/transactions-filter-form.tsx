import type { OptionItem } from "@/modules/shared/utils/labels";

type FilterValue = {
  from?: string;
  to?: string;
  accountId?: string;
  categoryId?: string;
  type?: string;
};

type Option = {
  id: string;
  name: string;
};

type CategoryOption = Option & {
  kind: string;
};

export function TransactionsFilterForm({
  filters,
  accounts,
  categories,
  types,
}: {
  filters: FilterValue;
  accounts: Option[];
  categories: CategoryOption[];
  types: OptionItem[];
}) {
  return (
    <form className="grid items-end gap-3 md:grid-cols-2 2xl:grid-cols-[repeat(4,minmax(0,1fr))_minmax(180px,220px)_auto]" method="GET">
      <input
        type="date"
        name="from"
        defaultValue={filters.from}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
      />
      <input
        type="date"
        name="to"
        defaultValue={filters.to}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
      />
      <select
        name="accountId"
        defaultValue={filters.accountId}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
      >
        <option value="">Todas as contas</option>
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </select>
      <select
        name="categoryId"
        defaultValue={filters.categoryId}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
      >
        <option value="">Todas as categorias</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <div className="grid grid-cols-[1fr_auto] gap-2 md:col-span-2 2xl:col-span-2">
        <select
          name="type"
          defaultValue={filters.type}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
        >
          <option value="">Todos os tipos</option>
          {types.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
          Filtrar
        </button>
      </div>
    </form>
  );
}