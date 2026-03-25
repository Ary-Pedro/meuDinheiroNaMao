import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { AppError } from "@/server/core/errors/app-error";
import type { ControllerResponse } from "./controller-response";

function mapError(error: unknown): { status: number; message: string } {
  if (error instanceof AppError) {
    return { status: error.statusCode, message: error.message };
  }

  if (error instanceof ZodError) {
    return {
      status: 400,
      message: error.issues.map((issue) => `${issue.path.join(".") || "payload"}: ${issue.message}`).join("; "),
    };
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return { status: 409, message: "Registro duplicado para os campos únicos." };
  }

  return { status: 500, message: "Erro interno ao processar a requisição." };
}

export async function executeRoute(action: () => Promise<ControllerResponse>) {
  try {
    const response = await action();
    return NextResponse.json(response.body, { status: response.status });
  } catch (error) {
    const mapped = mapError(error);
    return NextResponse.json({ error: mapped.message }, { status: mapped.status });
  }
}
