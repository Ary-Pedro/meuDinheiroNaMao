import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Módulo de simulações ainda será implementado no próximo incremento.",
  });
}
