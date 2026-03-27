import {
  AccountType,
  AssetType,
  CategoryKind,
  ImportBatchStatus,
  ImportSourceType,
  ImportedEntryStatus,
  InvestmentOperationType,
  Prisma,
  PrismaClient,
  ReviewItemKind,
  ReviewItemStatus,
  SimulationBaseContext,
  SimulationScenarioStatus,
  SimulationValueType,
  TransactionSource,
  TransactionStatus,
  TransactionType,
} from "@prisma/client";

const prisma = new PrismaClient();

type SeedRefs = {
  accounts: Record<string, { id: string; name: string }>;
  categories: Record<string, { id: string; name: string; kind: CategoryKind }>;
  subcategories: Record<string, { id: string; name: string }>;
  assets: Record<string, { id: string; tickerOrName: string }>;
};

type TransactionSeed = {
  account: string;
  category: string;
  subcategory?: string;
  type: TransactionType;
  amount: number;
  occurredAt: Date;
  description: string;
  source?: TransactionSource;
  status?: TransactionStatus;
  notes?: string;
};

type OperationSeed = {
  asset: string;
  account?: string;
  type: InvestmentOperationType;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  fees?: number;
  occurredAt: Date;
};

const monthNames = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

function decimal(value: number, scale = 2) {
  return value.toFixed(scale);
}

function getDaysInMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

function monthDate(monthStart: Date, day: number) {
  const year = monthStart.getUTCFullYear();
  const month = monthStart.getUTCMonth();
  const safeDay = Math.min(day, getDaysInMonth(year, month));
  return new Date(Date.UTC(year, month, safeDay, 12, 0, 0));
}

function shiftMonth(date: Date, delta: number) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + delta, 1, 12, 0, 0));
}

function monthLabel(date: Date) {
  return `${monthNames[date.getUTCMonth()]}/${date.getUTCFullYear()}`;
}

function currentMonthStart() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 12, 0, 0));
}

async function seedUser() {
  const email = process.env.DEMO_USER_EMAIL ?? "demo@carteira.local";
  const name = process.env.DEMO_USER_NAME ?? "João Demo";

  return prisma.user.upsert({
    where: { email },
    update: { name },
    create: { email, name },
  });
}

async function resetDemoData(userId: string) {
  await prisma.$transaction(async (tx) => {
    await tx.reviewItem.deleteMany({ where: { userId } });
    await tx.importedEntry.deleteMany({ where: { userId } });
    await tx.importBatch.deleteMany({ where: { userId } });

    const scenarios = await tx.simulationScenario.findMany({
      where: { userId },
      select: { id: true },
    });
    const scenarioIds = scenarios.map((item) => item.id);

    if (scenarioIds.length) {
      await tx.simulationResult.deleteMany({ where: { scenarioId: { in: scenarioIds } } });
      await tx.simulationInput.deleteMany({ where: { scenarioId: { in: scenarioIds } } });
    }

    await tx.simulationScenario.deleteMany({ where: { userId } });
    await tx.portfolioSnapshot.deleteMany({ where: { userId } });
    await tx.investmentPosition.deleteMany({ where: { userId } });
    await tx.investmentOperation.deleteMany({ where: { userId } });
    await tx.asset.deleteMany({ where: { userId } });
    await tx.transaction.deleteMany({ where: { userId } });
    await tx.category.deleteMany({ where: { userId } });
    await tx.financialAccount.deleteMany({ where: { userId } });
  });
}

async function seedAccounts(userId: string) {
  const accountSeeds = [
    {
      name: "Carteira",
      type: AccountType.CASH,
      institution: "Espécie",
      initialBalance: 120,
    },
    {
      name: "Nubank",
      type: AccountType.CHECKING,
      institution: "Nubank",
      initialBalance: 950,
    },
    {
      name: "Inter",
      type: AccountType.CHECKING,
      institution: "Banco Inter",
      initialBalance: 430,
    },
    {
      name: "Reserva",
      type: AccountType.SAVINGS,
      institution: "Caixinha",
      initialBalance: 1500,
    },
    {
      name: "XP Investimentos",
      type: AccountType.INVESTMENT,
      institution: "XP",
      initialBalance: 0,
    },
  ];

  for (const account of accountSeeds) {
    await prisma.financialAccount.upsert({
      where: {
        userId_name: {
          userId,
          name: account.name,
        },
      },
      update: {
        type: account.type,
        institution: account.institution,
        currency: "BRL",
        initialBalance: new Prisma.Decimal(account.initialBalance),
      },
      create: {
        userId,
        name: account.name,
        type: account.type,
        institution: account.institution,
        currency: "BRL",
        initialBalance: new Prisma.Decimal(account.initialBalance),
      },
    });
  }
}

async function seedCategories(userId: string) {
  const categorySeeds = [
    { name: "Salário", kind: CategoryKind.INCOME, subs: ["Bolsa estágio", "Auxílio educação"] },
    { name: "Vale e benefícios", kind: CategoryKind.INCOME, subs: ["Vale refeição", "Vale transporte"] },
    { name: "Freela", kind: CategoryKind.INCOME, subs: ["Design", "Suporte"] },
    { name: "Reembolso", kind: CategoryKind.INCOME, subs: ["Saúde", "Trabalho"] },
    { name: "Rendimentos", kind: CategoryKind.INCOME, subs: ["Cashback", "Conta remunerada"] },
    { name: "Moradia", kind: CategoryKind.EXPENSE, subs: ["Aluguel", "Energia", "Água", "Internet"] },
    {
      name: "Alimentação",
      kind: CategoryKind.EXPENSE,
      subs: ["Mercado", "Restaurante", "Delivery", "Café"],
    },
    { name: "Transporte", kind: CategoryKind.EXPENSE, subs: ["Ônibus/Metrô", "Uber"] },
    { name: "Saúde", kind: CategoryKind.EXPENSE, subs: ["Farmácia", "Consulta"] },
    { name: "Educação", kind: CategoryKind.EXPENSE, subs: ["Curso", "Livros"] },
    { name: "Lazer", kind: CategoryKind.EXPENSE, subs: ["Cinema", "Bar", "Passeio"] },
    { name: "Compras", kind: CategoryKind.EXPENSE, subs: ["Roupas", "Casa"] },
    { name: "Assinaturas", kind: CategoryKind.EXPENSE, subs: ["Streaming", "Telefonia", "Software"] },
    { name: "Impostos e tarifas", kind: CategoryKind.EXPENSE, subs: ["Tarifa bancária", "IOF"] },
    { name: "Emergências", kind: CategoryKind.EXPENSE, subs: ["Manutenção", "Imprevistos"] },
    { name: "Transferência entre contas", kind: CategoryKind.TRANSFER, subs: ["Carteira", "Reserva"] },
    { name: "Reserva de emergência", kind: CategoryKind.TRANSFER, subs: ["Poupança", "Caixinha"] },
    { name: "Aporte para investimento", kind: CategoryKind.TRANSFER, subs: ["Renda fixa", "ETF", "FII"] },
  ];

  for (const seed of categorySeeds) {
    const category = await prisma.category.upsert({
      where: {
        userId_kind_name: {
          userId,
          kind: seed.kind,
          name: seed.name,
        },
      },
      update: {},
      create: {
        userId,
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
}

async function seedAssets(userId: string) {
  const assetSeeds = [
    { tickerOrName: "Tesouro Selic 2029", assetType: AssetType.BOND, currency: "BRL", broker: "Tesouro Direto" },
    { tickerOrName: "CDB 110% CDI", assetType: AssetType.CASH_EQUIVALENT, currency: "BRL", broker: "Banco Inter" },
    { tickerOrName: "IVVB11", assetType: AssetType.ETF, currency: "BRL", broker: "XP" },
    { tickerOrName: "MXRF11", assetType: AssetType.FII, currency: "BRL", broker: "XP" },
    { tickerOrName: "BTC", assetType: AssetType.CRYPTO, currency: "BRL", broker: "Mercado Bitcoin" },
  ];

  for (const asset of assetSeeds) {
    await prisma.asset.upsert({
      where: {
        userId_tickerOrName: {
          userId,
          tickerOrName: asset.tickerOrName,
        },
      },
      update: {
        assetType: asset.assetType,
        currency: asset.currency,
        broker: asset.broker,
      },
      create: {
        userId,
        tickerOrName: asset.tickerOrName,
        assetType: asset.assetType,
        currency: asset.currency,
        broker: asset.broker,
      },
    });
  }
}

async function loadRefs(userId: string): Promise<SeedRefs> {
  const [accounts, categories, assets] = await Promise.all([
    prisma.financialAccount.findMany({
      where: { userId },
      select: { id: true, name: true },
    }),
    prisma.category.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        kind: true,
        subcategories: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.asset.findMany({
      where: { userId },
      select: { id: true, tickerOrName: true },
    }),
  ]);

  const accountMap = Object.fromEntries(accounts.map((item) => [item.name, item]));
  const categoryMap = Object.fromEntries(categories.map((item) => [item.name, item]));
  const subcategoryMap = Object.fromEntries(
    categories.flatMap((category) =>
      category.subcategories.map((subcategory) => [`${category.name}:${subcategory.name}`, subcategory] as const)
    )
  );
  const assetMap = Object.fromEntries(assets.map((item) => [item.tickerOrName, item]));

  return {
    accounts: accountMap,
    categories: categoryMap,
    subcategories: subcategoryMap,
    assets: assetMap,
  };
}

function buildTransactionData(userId: string, refs: SeedRefs) {
  const monthStarts = Array.from({ length: 12 }, (_, index) => shiftMonth(currentMonthStart(), index - 11));

  const extraIncome = [0, 280, 0, 420, 0, 0, 350, 0, 0, 520, 0, 250];
  const cashbackIncome = [18, 22, 0, 31, 17, 0, 28, 19, 0, 34, 23, 27];
  const groceryOne = [228, 245, 252, 261, 274, 289, 301, 312, 295, 326, 318, 334];
  const groceryTwo = [96, 88, 103, 110, 98, 114, 120, 108, 117, 126, 119, 130];
  const transport = [142, 149, 145, 154, 162, 158, 166, 171, 168, 176, 181, 178];
  const uber = [36, 42, 38, 51, 57, 48, 62, 54, 59, 66, 72, 64];
  const leisure = [62, 74, 58, 95, 71, 84, 97, 89, 78, 112, 119, 86];
  const clothing = [0, 0, 89, 0, 0, 145, 0, 0, 98, 0, 0, 165];
  const pharmacy = [24, 0, 18, 37, 0, 22, 0, 28, 0, 44, 0, 36];
  const reserveTransfer = [180, 180, 200, 200, 220, 220, 240, 240, 260, 260, 280, 280];
  const investTransfer = [150, 150, 180, 180, 200, 200, 220, 220, 240, 260, 260, 300];

  const records: Prisma.TransactionCreateManyInput[] = [];

  const pushTransaction = (seed: TransactionSeed) => {
    const account = refs.accounts[seed.account];
    const category = refs.categories[seed.category];
    const subcategory = seed.subcategory ? refs.subcategories[`${seed.category}:${seed.subcategory}`] : undefined;

    if (!account || !category) {
      throw new Error(`Dependência não encontrada para seed: conta=${seed.account}, categoria=${seed.category}`);
    }

    if (seed.subcategory && !subcategory) {
      throw new Error(`Subcategoria não encontrada para seed: ${seed.category}:${seed.subcategory}`);
    }

    records.push({
      userId,
      accountId: account.id,
      categoryId: category.id,
      subcategoryId: subcategory?.id,
      type: seed.type,
      amount: new Prisma.Decimal(seed.amount),
      description: seed.description,
      occurredAt: seed.occurredAt,
      source: seed.source ?? TransactionSource.MANUAL,
      status: seed.status ?? TransactionStatus.CONFIRMED,
      notes: seed.notes,
    });
  };

  monthStarts.forEach((monthStart, index) => {
    const label = monthLabel(monthStart);
    const salary = index < 4 ? 1650 : index < 8 ? 1850 : 2100;
    const benefit = index < 6 ? 440 : 520;
    const internet = index < 6 ? 79.9 : 89.9;
    const streaming = 27.9;
    const phone = 34.9;
    const course = index >= 5 ? 69.9 : 0;
    const rent = index < 6 ? 780 : 850;
    const energy = 58 + (index % 4) * 7;
    const water = 28 + (index % 3) * 4;

    pushTransaction({
      account: "Nubank",
      category: "Salário",
      subcategory: "Bolsa estágio",
      type: TransactionType.INCOME,
      amount: salary,
      occurredAt: monthDate(monthStart, 5),
      description: `Bolsa estágio recebida - ${label}`,
    });

    pushTransaction({
      account: "Nubank",
      category: "Vale e benefícios",
      subcategory: "Vale refeição",
      type: TransactionType.INCOME,
      amount: benefit,
      occurredAt: monthDate(monthStart, 5),
      description: `Vale refeição - ${label}`,
    });

    if (extraIncome[index] > 0) {
      pushTransaction({
        account: "Inter",
        category: "Freela",
        subcategory: index % 2 === 0 ? "Design" : "Suporte",
        type: TransactionType.INCOME,
        amount: extraIncome[index],
        occurredAt: monthDate(monthStart, 18),
        description: `Freela pontual - ${label}`,
      });
    }

    if (cashbackIncome[index] > 0) {
      pushTransaction({
        account: "Nubank",
        category: "Rendimentos",
        subcategory: "Cashback",
        type: TransactionType.INCOME,
        amount: cashbackIncome[index],
        occurredAt: monthDate(monthStart, 26),
        description: `Cashback fatura/cartão - ${label}`,
      });
    }

    pushTransaction({
      account: "Nubank",
      category: "Moradia",
      subcategory: "Aluguel",
      type: TransactionType.EXPENSE,
      amount: rent,
      occurredAt: monthDate(monthStart, 6),
      description: `Aluguel república - ${label}`,
      source: index % 3 === 0 ? TransactionSource.IMPORT : TransactionSource.MANUAL,
    });

    pushTransaction({
      account: "Nubank",
      category: "Moradia",
      subcategory: "Energia",
      type: TransactionType.EXPENSE,
      amount: energy,
      occurredAt: monthDate(monthStart, 11),
      description: `Conta de energia - ${label}`,
    });

    pushTransaction({
      account: "Nubank",
      category: "Moradia",
      subcategory: "Água",
      type: TransactionType.EXPENSE,
      amount: water,
      occurredAt: monthDate(monthStart, 12),
      description: `Conta de água - ${label}`,
    });

    pushTransaction({
      account: "Nubank",
      category: "Moradia",
      subcategory: "Internet",
      type: TransactionType.EXPENSE,
      amount: internet,
      occurredAt: monthDate(monthStart, 14),
      description: `Internet da casa - ${label}`,
    });

    pushTransaction({
      account: "Nubank",
      category: "Alimentação",
      subcategory: "Mercado",
      type: TransactionType.EXPENSE,
      amount: groceryOne[index],
      occurredAt: monthDate(monthStart, 8),
      description: `Mercado do mês - ${label}`,
      source: index % 2 === 0 ? TransactionSource.IMPORT : TransactionSource.MANUAL,
    });

    pushTransaction({
      account: "Inter",
      category: "Alimentação",
      subcategory: index % 2 === 0 ? "Restaurante" : "Delivery",
      type: TransactionType.EXPENSE,
      amount: groceryTwo[index],
      occurredAt: monthDate(monthStart, 21),
      description: index % 2 === 0 ? `Almoço fora - ${label}` : `Delivery fim de semana - ${label}`,
    });

    pushTransaction({
      account: "Carteira",
      category: "Alimentação",
      subcategory: "Café",
      type: TransactionType.EXPENSE,
      amount: 18 + (index % 4) * 3,
      occurredAt: monthDate(monthStart, 3),
      description: `Café e lanche rápido - ${label}`,
    });

    pushTransaction({
      account: "Nubank",
      category: "Transporte",
      subcategory: "Ônibus/Metrô",
      type: TransactionType.EXPENSE,
      amount: transport[index],
      occurredAt: monthDate(monthStart, 7),
      description: `Recarga transporte - ${label}`,
    });

    pushTransaction({
      account: "Inter",
      category: "Transporte",
      subcategory: "Uber",
      type: TransactionType.EXPENSE,
      amount: uber[index],
      occurredAt: monthDate(monthStart, 19),
      description: `Corridas por chuva/atraso - ${label}`,
      status: index === monthStarts.length - 1 ? TransactionStatus.PENDING_REVIEW : TransactionStatus.CONFIRMED,
      source: index === monthStarts.length - 1 ? TransactionSource.IMPORT : TransactionSource.MANUAL,
    });

    pushTransaction({
      account: "Nubank",
      category: "Assinaturas",
      subcategory: "Streaming",
      type: TransactionType.EXPENSE,
      amount: streaming,
      occurredAt: monthDate(monthStart, 9),
      description: `Streaming mensal - ${label}`,
    });

    pushTransaction({
      account: "Inter",
      category: "Assinaturas",
      subcategory: "Telefonia",
      type: TransactionType.EXPENSE,
      amount: phone,
      occurredAt: monthDate(monthStart, 10),
      description: `Plano de celular - ${label}`,
    });

    if (course > 0) {
      pushTransaction({
        account: "Inter",
        category: "Educação",
        subcategory: index % 3 === 0 ? "Livros" : "Curso",
        type: TransactionType.EXPENSE,
        amount: course + (index % 3 === 0 ? 18 : 0),
        occurredAt: monthDate(monthStart, 17),
        description: index % 3 === 0 ? `Livro/curso de carreira - ${label}` : `Assinatura curso online - ${label}`,
      });
    }

    if (pharmacy[index] > 0) {
      pushTransaction({
        account: "Nubank",
        category: "Saúde",
        subcategory: index % 4 === 1 ? "Consulta" : "Farmácia",
        type: TransactionType.EXPENSE,
        amount: index % 4 === 1 ? pharmacy[index] + 72 : pharmacy[index],
        occurredAt: monthDate(monthStart, 23),
        description: index % 4 === 1 ? `Consulta eventual - ${label}` : `Farmácia - ${label}`,
      });
    }

    pushTransaction({
      account: "Carteira",
      category: "Lazer",
      subcategory: index % 3 === 0 ? "Cinema" : index % 3 === 1 ? "Bar" : "Passeio",
      type: TransactionType.EXPENSE,
      amount: leisure[index],
      occurredAt: monthDate(monthStart, 25),
      description: `Lazer do mês - ${label}`,
    });

    if (clothing[index] > 0) {
      pushTransaction({
        account: "Inter",
        category: "Compras",
        subcategory: index % 2 === 0 ? "Casa" : "Roupas",
        type: TransactionType.EXPENSE,
        amount: clothing[index],
        occurredAt: monthDate(monthStart, 27),
        description: index % 2 === 0 ? `Compra para casa - ${label}` : `Roupa/calçado - ${label}`,
      });
    }

    if (index === 3 || index === 8) {
      pushTransaction({
        account: "Nubank",
        category: "Emergências",
        subcategory: "Imprevistos",
        type: TransactionType.EXPENSE,
        amount: index === 3 ? 186 : 248,
        occurredAt: monthDate(monthStart, 28),
        description: index === 3 ? `Conserto de notebook - ${label}` : `Dentista e remédios - ${label}`,
      });
    }

    pushTransaction({
      account: "Nubank",
      category: "Transferência entre contas",
      subcategory: "Carteira",
      type: TransactionType.TRANSFER,
      amount: 70 + (index % 3) * 10,
      occurredAt: monthDate(monthStart, 2),
      description: `Dinheiro para gastos rápidos - ${label}`,
    });

    pushTransaction({
      account: "Nubank",
      category: "Reserva de emergência",
      subcategory: "Caixinha",
      type: TransactionType.TRANSFER,
      amount: reserveTransfer[index],
      occurredAt: monthDate(monthStart, 15),
      description: `Transferência para reserva - ${label}`,
    });

    pushTransaction({
      account: "Inter",
      category: "Aporte para investimento",
      subcategory: index % 2 === 0 ? "Renda fixa" : "ETF",
      type: TransactionType.TRANSFER,
      amount: investTransfer[index],
      occurredAt: monthDate(monthStart, 22),
      description: `Aporte mensal em investimentos - ${label}`,
    });
  });

  return records;
}

function buildInvestmentOperations(userId: string, refs: SeedRefs) {
  const monthStarts = Array.from({ length: 12 }, (_, index) => shiftMonth(currentMonthStart(), index - 11));

  const operations: OperationSeed[] = [];

  monthStarts.forEach((monthStart, index) => {
    operations.push({
      asset: index % 2 === 0 ? "Tesouro Selic 2029" : "CDB 110% CDI",
      account: "XP Investimentos",
      type: InvestmentOperationType.BUY,
      quantity: 1,
      unitPrice: index % 2 === 0 ? 100 + index * 3 : 120 + index * 2,
      totalAmount: index % 2 === 0 ? 100 + index * 3 : 120 + index * 2,
      occurredAt: monthDate(monthStart, 22),
    });

    if (index >= 2) {
      const price = 308 + index * 6;
      operations.push({
        asset: "IVVB11",
        account: "XP Investimentos",
        type: InvestmentOperationType.BUY,
        quantity: index % 4 === 0 ? 2 : 1,
        unitPrice: price,
        totalAmount: price * (index % 4 === 0 ? 2 : 1),
        fees: 1.9,
        occurredAt: monthDate(monthStart, 23),
      });
    }

    if (index % 3 === 0) {
      const fiiPrice = 10.4 + index * 0.3;
      operations.push({
        asset: "MXRF11",
        account: "XP Investimentos",
        type: InvestmentOperationType.BUY,
        quantity: 8,
        unitPrice: fiiPrice,
        totalAmount: fiiPrice * 8,
        fees: 1.2,
        occurredAt: monthDate(monthStart, 24),
      });
    }

    if (index % 4 === 1) {
      operations.push({
        asset: "BTC",
        account: "XP Investimentos",
        type: InvestmentOperationType.BUY,
        quantity: 0.0002,
        unitPrice: 310000 + index * 4500,
        totalAmount: (310000 + index * 4500) * 0.0002,
        occurredAt: monthDate(monthStart, 26),
      });
    }

    if (index >= 6 && index % 2 === 0) {
      operations.push({
        asset: "MXRF11",
        account: "XP Investimentos",
        type: InvestmentOperationType.DIVIDEND,
        quantity: 0,
        unitPrice: 0,
        totalAmount: 8 + index * 0.9,
        occurredAt: monthDate(monthStart, 27),
      });
    }
  });

  return operations.map((operation) => {
    const asset = refs.assets[operation.asset];
    const account = operation.account ? refs.accounts[operation.account] : undefined;

    if (!asset) {
      throw new Error(`Ativo não encontrado para operação: ${operation.asset}`);
    }

    return {
      userId,
      assetId: asset.id,
      accountId: account?.id,
      type: operation.type,
      quantity: new Prisma.Decimal(decimal(operation.quantity, 8)),
      unitPrice: new Prisma.Decimal(decimal(operation.unitPrice, 8)),
      totalAmount: new Prisma.Decimal(decimal(operation.totalAmount)),
      fees: new Prisma.Decimal(decimal(operation.fees ?? 0)),
      occurredAt: operation.occurredAt,
    };
  });
}

async function seedFinanceData(userId: string, refs: SeedRefs) {
  await prisma.transaction.createMany({
    data: buildTransactionData(userId, refs),
  });
}

async function seedInvestmentData(userId: string, refs: SeedRefs) {
  await prisma.investmentOperation.createMany({
    data: buildInvestmentOperations(userId, refs),
  });

  const buyOperations = await prisma.investmentOperation.findMany({
    where: {
      userId,
      type: InvestmentOperationType.BUY,
    },
    select: {
      assetId: true,
      quantity: true,
      totalAmount: true,
    },
  });

  const assets = await prisma.asset.findMany({
    where: { userId },
    select: { id: true, tickerOrName: true },
  });

  const currentPrices: Record<string, number> = {
    "Tesouro Selic 2029": 142,
    "CDB 110% CDI": 151,
    IVVB11: 417,
    MXRF11: 11.3,
    BTC: 382000,
  };

  for (const asset of assets) {
    const operations = buyOperations.filter((item) => item.assetId === asset.id);
    const totalQuantity = operations.reduce((sum, item) => sum.plus(item.quantity), new Prisma.Decimal(0));
    const totalInvested = operations.reduce((sum, item) => sum.plus(item.totalAmount), new Prisma.Decimal(0));

    if (totalQuantity.lte(0)) {
      continue;
    }

    const averagePrice = totalInvested.div(totalQuantity);
    const currentValue = totalQuantity.mul(new Prisma.Decimal(currentPrices[asset.tickerOrName] ?? 0));

    await prisma.investmentPosition.create({
      data: {
        userId,
        assetId: asset.id,
        quantity: totalQuantity,
        averagePrice,
        currentValue,
      },
    });
  }

  const snapshotData = Array.from({ length: 12 }, (_, index) => {
    const monthStart = shiftMonth(currentMonthStart(), index - 11);
    const totalInvested = 600 + index * 230;
    const totalCurrentValue = totalInvested * (1.02 + index * 0.008);
    const totalProfitLoss = totalCurrentValue - totalInvested;

    return {
      userId,
      referenceDate: monthDate(monthStart, 28),
      totalInvested: new Prisma.Decimal(decimal(totalInvested)),
      totalCurrentValue: new Prisma.Decimal(decimal(totalCurrentValue)),
      totalProfitLoss: new Prisma.Decimal(decimal(totalProfitLoss)),
    };
  });

  await prisma.portfolioSnapshot.createMany({ data: snapshotData });
}

async function seedImportAndReviewData(userId: string, refs: SeedRefs) {
  const baseMonth = currentMonthStart();

  const completedBatch = await prisma.importBatch.create({
    data: {
      userId,
      sourceType: ImportSourceType.FILE,
      fileName: "nubank-fevereiro.csv",
      status: ImportBatchStatus.COMPLETED,
      startedAt: monthDate(shiftMonth(baseMonth, -1), 3),
      finishedAt: monthDate(shiftMonth(baseMonth, -1), 3),
    },
  });

  const reviewBatch = await prisma.importBatch.create({
    data: {
      userId,
      sourceType: ImportSourceType.FILE,
      fileName: "inter-marco.csv",
      status: ImportBatchStatus.REVIEW_REQUIRED,
      startedAt: monthDate(baseMonth, 4),
    },
  });

  const marketEntry = await prisma.importedEntry.create({
    data: {
      batchId: completedBatch.id,
      userId,
      rawDescription: "SUPERMERCADO CENTRAL",
      rawAmount: new Prisma.Decimal("312.40"),
      rawOccurredAt: monthDate(shiftMonth(baseMonth, -1), 8),
      rawPayload: { source: "csv", line: 14 },
      suggestedCategoryId: refs.categories["Alimentação"]?.id,
      status: ImportedEntryStatus.IMPORTED,
    },
  });

  const transportEntry = await prisma.importedEntry.create({
    data: {
      batchId: reviewBatch.id,
      userId,
      rawDescription: "UBER *TRIP",
      rawAmount: new Prisma.Decimal("64.90"),
      rawOccurredAt: monthDate(baseMonth, 19),
      rawPayload: { source: "csv", line: 7 },
      suggestedCategoryId: refs.categories["Transporte"]?.id,
      status: ImportedEntryStatus.REVIEW_REQUIRED,
    },
  });

  const unknownEntry = await prisma.importedEntry.create({
    data: {
      batchId: reviewBatch.id,
      userId,
      rawDescription: "PAG*LOJA DESCONHECIDA",
      rawAmount: new Prisma.Decimal("118.27"),
      rawOccurredAt: monthDate(baseMonth, 23),
      rawPayload: { source: "csv", line: 11 },
      status: ImportedEntryStatus.REVIEW_REQUIRED,
    },
  });

  await prisma.reviewItem.createMany({
    data: [
      {
        userId,
        kind: ReviewItemKind.IMPORTED_ENTRY,
        referenceId: transportEntry.id,
        status: ReviewItemStatus.OPEN,
        reason: "Categoria sugerida precisa de confirmação.",
      },
      {
        userId,
        kind: ReviewItemKind.IMPORTED_ENTRY,
        referenceId: unknownEntry.id,
        status: ReviewItemStatus.OPEN,
        reason: "Descrição ambígua e sem categoria sugerida.",
      },
      {
        userId,
        kind: ReviewItemKind.IMPORTED_ENTRY,
        referenceId: marketEntry.id,
        status: ReviewItemStatus.RESOLVED,
        reason: "Lançamento conciliado com transação existente.",
      },
    ],
  });
}

async function seedSimulationData(userId: string) {
  const scenarios = [
    {
      name: "Reserva de emergência em 18 meses",
      description: "Aportar parte da bolsa + freelas até fechar 6 meses de custo fixo.",
      baseContext: SimulationBaseContext.FINANCE,
      status: SimulationScenarioStatus.CALCULATED,
      inputs: [
        { key: "aporteMensal", value: "350", valueType: SimulationValueType.NUMBER },
        { key: "meses", value: "18", valueType: SimulationValueType.NUMBER },
        { key: "meta", value: "7200", valueType: SimulationValueType.NUMBER },
      ],
      results: [
        { metric: "valor_final", value: 7420.55 },
        { metric: "meta_atingida_em_meses", value: 18 },
      ],
    },
    {
      name: "Cortar delivery e investir a diferença",
      description: "Reduzir pedidos por app e transformar a sobra em aporte mensal no ETF.",
      baseContext: SimulationBaseContext.MIXED,
      status: SimulationScenarioStatus.CALCULATED,
      inputs: [
        { key: "economiaDelivery", value: "120", valueType: SimulationValueType.NUMBER },
        { key: "aporteMensal", value: "120", valueType: SimulationValueType.NUMBER },
        { key: "meses", value: "12", valueType: SimulationValueType.NUMBER },
      ],
      results: [
        { metric: "valor_investido", value: 1440 },
        { metric: "valor_projetado", value: 1513.2 },
      ],
    },
    {
      name: "Aporte mensal de 300 por 12 meses",
      description: "Simulação base para reforçar renda fixa e começar ETF sem mexer no orçamento essencial.",
      baseContext: SimulationBaseContext.INVESTMENT,
      status: SimulationScenarioStatus.CALCULATED,
      inputs: [
        { key: "aporteMensal", value: "300", valueType: SimulationValueType.NUMBER },
        { key: "meses", value: "12", valueType: SimulationValueType.NUMBER },
        { key: "taxaAnual", value: "0.12", valueType: SimulationValueType.NUMBER },
      ],
      results: [
        { metric: "total_aportado", value: 3600 },
        { metric: "valor_projetado", value: 3836.48 },
      ],
    },
  ];

  for (const scenario of scenarios) {
    await prisma.simulationScenario.upsert({
      where: {
        userId_name: {
          userId,
          name: scenario.name,
        },
      },
      update: {
        description: scenario.description,
        baseContext: scenario.baseContext,
        status: scenario.status,
      },
      create: {
        userId,
        name: scenario.name,
        description: scenario.description,
        baseContext: scenario.baseContext,
        status: scenario.status,
      },
    });

    const persistedScenario = await prisma.simulationScenario.findUniqueOrThrow({
      where: {
        userId_name: {
          userId,
          name: scenario.name,
        },
      },
      select: { id: true },
    });

    for (const input of scenario.inputs) {
      await prisma.simulationInput.upsert({
        where: {
          scenarioId_key: {
            scenarioId: persistedScenario.id,
            key: input.key,
          },
        },
        update: {
          value: input.value,
          valueType: input.valueType,
        },
        create: {
          scenarioId: persistedScenario.id,
          key: input.key,
          value: input.value,
          valueType: input.valueType,
        },
      });
    }

    await prisma.simulationResult.createMany({
      data: scenario.results.map((result) => ({
        scenarioId: persistedScenario.id,
        metric: result.metric,
        value: new Prisma.Decimal(decimal(result.value, 4)),
      })),
    });
  }
}

async function main() {
  const user = await seedUser();

  await resetDemoData(user.id);
  await seedAccounts(user.id);
  await seedCategories(user.id);
  await seedAssets(user.id);

  const refs = await loadRefs(user.id);

  await seedFinanceData(user.id, refs);
  await seedInvestmentData(user.id, refs);
  await seedImportAndReviewData(user.id, refs);
  await seedSimulationData(user.id);
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
