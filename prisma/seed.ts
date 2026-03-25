import { PrismaClient, AccountType, CategoryKind, AssetType, SimulationBaseContext } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.DEMO_USER_EMAIL ?? "demo@carteira.local";

  const user = await prisma.user.upsert({
    where: { email },
    update: { name: "Usuário Demo" },
    create: {
      email,
      name: "Usuário Demo",
    },
  });

  const existingAccounts = await prisma.financialAccount.count({ where: { userId: user.id } });
  if (!existingAccounts) {
    await prisma.financialAccount.createMany({
      data: [
        { userId: user.id, name: "Carteira", type: AccountType.CASH, currency: "BRL", initialBalance: 250 },
        { userId: user.id, name: "Nubank", type: AccountType.CHECKING, currency: "BRL", initialBalance: 3200 },
        { userId: user.id, name: "Inter", type: AccountType.CHECKING, currency: "BRL", initialBalance: 1800 },
      ],
    });
  }

  const categorySeeds = [
    { name: "Salário", kind: CategoryKind.INCOME, subs: [] },
    { name: "Freelance", kind: CategoryKind.INCOME, subs: [] },
    { name: "Rendimentos", kind: CategoryKind.INCOME, subs: [] },
    { name: "Alimentação", kind: CategoryKind.EXPENSE, subs: ["Mercado", "Restaurante"] },
    { name: "Moradia", kind: CategoryKind.EXPENSE, subs: ["Aluguel", "Internet"] },
    { name: "Transporte", kind: CategoryKind.EXPENSE, subs: ["Combustível", "Uber"] },
    { name: "Saúde", kind: CategoryKind.EXPENSE, subs: [] },
    { name: "Lazer", kind: CategoryKind.EXPENSE, subs: [] },
    { name: "Transferência entre contas", kind: CategoryKind.TRANSFER, subs: [] },
    { name: "Aporte para investimento", kind: CategoryKind.TRANSFER, subs: [] },
  ];

  for (const seed of categorySeeds) {
    const category = await prisma.category.upsert({
      where: {
        userId_kind_name: {
          userId: user.id,
          kind: seed.kind,
          name: seed.name,
        },
      },
      update: {},
      create: {
        userId: user.id,
        name: seed.name,
        kind: seed.kind,
      },
    });

    for (const subName of seed.subs) {
      await prisma.subcategory.upsert({
        where: {
          categoryId_name: {
            categoryId: category.id,
            name: subName,
          },
        },
        update: {},
        create: {
          categoryId: category.id,
          name: subName,
        },
      });
    }
  }

  const existingAssets = await prisma.asset.count({ where: { userId: user.id } });
  if (!existingAssets) {
    await prisma.asset.createMany({
      data: [
        { userId: user.id, tickerOrName: "Tesouro Selic", assetType: AssetType.BOND, currency: "BRL" },
        { userId: user.id, tickerOrName: "CDB 100% CDI", assetType: AssetType.CASH_EQUIVALENT, currency: "BRL" },
        { userId: user.id, tickerOrName: "IVVB11", assetType: AssetType.ETF, currency: "BRL" },
      ],
    });
  }

  await prisma.simulationScenario.upsert({
    where: {
      userId_name: {
        userId: user.id,
        name: "Aporte mensal 1000 por 12 meses",
      },
    },
    update: {},
    create: {
      userId: user.id,
      name: "Aporte mensal 1000 por 12 meses",
      baseContext: SimulationBaseContext.INVESTMENT,
      description: "Cenário demo para evolução de aportes.",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
