
import { randomInt } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const LIMIT = 1_000_000_000_000; // |min|, |max| <= 1e12 (range stays far below crypto.randomInt's 2^48 limit)
const MIN_QUANTITY = 1;
const MAX_QUANTITY = 100;

const NO_STORE = { "Cache-Control": "no-store" };

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400, headers: NO_STORE });
}

// Strict signed integer parsing: accepts "-10", "0", "25";
// rejects "5.5", "1e2", "+3", " 7", "abc"
function parseSignedInt(value: string): number | null {
  if (!/^-?\d{1,15}$/.test(value)) return null;
  const n = Number(value);
  if (n < -LIMIT || n > LIMIT) return null;
  return n === 0 ? 0 : n; // normalise "-0" to 0
}

function parseQuantity(value: string): number | null {
  if (!/^\d{1,3}$/.test(value)) return null;
  const n = Number(value);
  return n >= MIN_QUANTITY && n <= MAX_QUANTITY ? n : null;
}

// Missing -> false. Only "true" / "false" (case-insensitive) are accepted.
function parseBool(value: string | null): boolean | null {
  if (value === null) return false;
  const v = value.toLowerCase();
  if (v === "true") return true;
  if (v === "false") return false;
  return null;
}

export async function GET(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ min: string; max: string; quantity: string }> },
) {
  const { min: minParam, max: maxParam, quantity: quantityParam } = await params;

  const min = parseSignedInt(minParam);
  if (min === null) {
    return badRequest(`min must be an integer between -${LIMIT} and ${LIMIT}`);
  }

  const max = parseSignedInt(maxParam);
  if (max === null) {
    return badRequest(`max must be an integer between -${LIMIT} and ${LIMIT}`);
  }

  const quantity = parseQuantity(quantityParam);
  if (quantity === null) {
    return badRequest(
      `quantity must be an integer between ${MIN_QUANTITY} and ${MAX_QUANTITY}`,
    );
  }

  const exclusive = parseBool(request.nextUrl.searchParams.get("exclusive"));
  if (exclusive === null) {
    return badRequest("exclusive must be true or false");
  }

  if (min >= max) {
    return badRequest("min must be less than max");
  }

  // Inclusive: min <= n <= max. Exclusive: min < n < max.
  const lo = exclusive ? min + 1 : min;
  const hi = exclusive ? max - 1 : max;
  if (lo > hi) {
    return badRequest(
      "no integer exists between min and max when exclusive is true",
    );
  }

  // crypto.randomInt: uniform, no modulo bias. Upper bound is exclusive.
  const numbers = Array.from({ length: quantity }, () => randomInt(lo, hi + 1));

  return NextResponse.json(
    { min, max, quantity, exclusive, numbers },
    { headers: NO_STORE },
  );
}
