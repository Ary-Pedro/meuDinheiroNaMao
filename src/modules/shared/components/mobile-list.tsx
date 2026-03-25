import type { ReactNode } from "react";

export function MobileList({ children }: { children: ReactNode }) {
  return <div className="space-y-2 lg:hidden">{children}</div>;
}
