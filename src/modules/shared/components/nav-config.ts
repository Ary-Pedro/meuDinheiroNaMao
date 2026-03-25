export type NavItem = {
  label: string;
  href: string;
};

export const primaryNavItems: NavItem[] = [
  { label: "Início", href: "/finance" },
  { label: "Transações", href: "/finance/transactions" },
  { label: "Revisão", href: "/review" },
];

export const secondaryNavItems: NavItem[] = [
  { label: "Contas", href: "/finance/accounts" },
  { label: "Categorias", href: "/finance/categories" },
  { label: "Investimentos", href: "/investments" },
  { label: "Simulações", href: "/simulations" },
];

export const desktopNavItems: NavItem[] = [
  { label: "Início", href: "/finance" },
  { label: "Transações", href: "/finance/transactions" },
  { label: "Contas", href: "/finance/accounts" },
  { label: "Categorias", href: "/finance/categories" },
  { label: "Revisão", href: "/review" },
  { label: "Investimentos", href: "/investments" },
  { label: "Simulações", href: "/simulations" },
];
