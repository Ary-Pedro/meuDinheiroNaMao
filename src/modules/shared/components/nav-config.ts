export type NavItem = {
  label: string;
  mobileLabel?: string;
  href: string;
};

export const primaryNavItems: NavItem[] = [
  { label: "Início", mobileLabel: "Início", href: "/finance" },
  { label: "Transações", mobileLabel: "Trans.", href: "/finance/transactions" },
  { label: "Contas", mobileLabel: "Contas", href: "/finance/accounts" },
];

export const secondaryNavItems: NavItem[] = [
  { label: "Perfil", href: "/profile" },
  { label: "Categorias", href: "/finance/categories" },
  { label: "Importação", href: "/finance/imports" },
  { label: "Investimentos", href: "/investments" },
  { label: "Simulações", href: "/simulations" },
];

export const desktopNavItems: NavItem[] = [
  { label: "Início", href: "/finance" },
  { label: "Transações", href: "/finance/transactions" },
  { label: "Contas", href: "/finance/accounts" },
  { label: "Categorias", href: "/finance/categories" },
  { label: "Importação", href: "/finance/imports" },
  { label: "Investimentos", href: "/investments" },
  { label: "Simulações", href: "/simulations" },
  { label: "Perfil", href: "/profile" },
];
