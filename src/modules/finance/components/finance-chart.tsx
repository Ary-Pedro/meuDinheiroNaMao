type Props = {
  incomes: number;
  expenses: number;
};

export function FinanceChart({ incomes, expenses }: Props) {
  const total = incomes + expenses;
  const incomesWidth = total > 0 ? (incomes / total) * 100 : 0;
  const expensesWidth = total > 0 ? (expenses / total) * 100 : 0;

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
          <span>Receitas</span>
          <span>{incomesWidth.toFixed(0)}%</span>
        </div>
        <div className="h-3 rounded-full bg-slate-100">
          <div className="h-3 rounded-full bg-emerald-500" style={{ width: `${incomesWidth}%` }} />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
          <span>Despesas</span>
          <span>{expensesWidth.toFixed(0)}%</span>
        </div>
        <div className="h-3 rounded-full bg-slate-100">
          <div className="h-3 rounded-full bg-rose-500" style={{ width: `${expensesWidth}%` }} />
        </div>
      </div>
    </div>
  );
}
