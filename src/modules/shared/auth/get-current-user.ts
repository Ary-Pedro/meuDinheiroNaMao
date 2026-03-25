import { AppError } from "@/server/core/errors/app-error";
import { prisma } from "@/server/db/prisma";

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
};

export async function getCurrentUser(): Promise<CurrentUser> {
  const email = process.env.DEMO_USER_EMAIL;

  if (!email) {
    throw new AppError("Variável DEMO_USER_EMAIL não configurada.", 500);
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  if (!user) {
    throw new AppError("Usuário demo não encontrado. Execute o seed do Prisma.", 500);
  }

  return user;
}
