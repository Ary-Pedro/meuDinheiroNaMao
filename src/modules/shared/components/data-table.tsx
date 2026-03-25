import type { ReactNode } from "react";

export function DataTable({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="hidden overflow-x-auto lg:block">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-slate-500">
            {headers.map((header) => (
              <th key={header} className="px-3 py-2 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
