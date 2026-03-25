import { Prisma } from "@prisma/client";

export function decimalToString(value: Prisma.Decimal | string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return "0.00";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return value.toFixed(2);
  }

  return value.toFixed(2);
}

export function decimalToNumber(value: Prisma.Decimal | string | number | null | undefined): number {
  if (value === null || value === undefined) {
    return 0;
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return Number(value);
  }

  return Number(value.toString());
}
