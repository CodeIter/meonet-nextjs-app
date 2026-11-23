
import { randomInt } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const LIMIT = 1_000_000_000_000; // |min|, |max| <= 1e12
const MIN_QUANTITY = 1;
const MAX_QUANTITY = 100;
const DEFAULT_DECIMALS = 2; // decimal=true: at least this many decimal places
const MAX_DECIMALS = 6; // decimal=true: max decimal places accepted in min/max
const MAX_SPAN = 2n ** 48n - 1n; // crypto.randomInt range limit
const MAX_SAFE = BigInt(Number.MAX_SAFE_INTEGER);

const NO_STORE = { "Cache-Control": "no-store" };

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400, headers: NO_STORE });
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

type Parsed = { negative: boolean; int: string; frac: string };

// Parses the path value as text (never as a float) so "0.1" stays exactly 0.1.
// Integers only unless `allowDecimal`, then up to MAX_DECIMALS decimal places.
function parseNumber(value: string, allowDecimal: boolean): Parsed | null {
  const re = allowDecimal
    ? new RegExp(`^(-?)(\\d{1,15})(?:\\.(\\d{1,${MAX_DECIMALS}}))?$`)
    : /^(-?)(\d{1,15})()$/;
  const m = re.exec(value);
  if (!m) return null;
  return { negative: m[1] === "-", int: m[2] ?? "", frac: m[3] ?? "" };
}

// Value as an exact integer count of 10^-decimals units, e.g. -1.5 @ 2 -> -150n
function toScaled(p: Parsed, decimals: number): bigint {
  const digits = BigInt(p.int + p.frac.padEnd(decimals, "0"));
  return p.negative ? -digits : digits;
}

export async function GET(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ min: string; max: string; quantity: string }> },
) {
  const { min: minParam, max: maxParam, quantity: quantityParam } = await params;
  const searchParams = request.nextUrl.searchParams;

  const exclusive = parseBool(searchParams.get("exclusive"));
  if (exclusive === null) {
    return badRequest("exclusive must be true or false");
  }

  const decimal = parseBool(searchParams.get("decimal"));
  if (decimal === null) {
    return badRequest("decimal must be true or false");
  }

  const quantity = parseQuantity(quantityParam);
  if (quantity === null) {
    return badRequest(
      `quantity must be an integer between ${MIN_QUANTITY} and ${MAX_QUANTITY}`,
    );
  }

  const minParsed = parseNumber(minParam, decimal);
  const maxParsed = parseNumber(maxParam, decimal);
  if (minParsed === null || maxParsed === null) {
    return badRequest(
      decimal
        ? `min and max must be numbers with at most ${MAX_DECIMALS} decimal places`
        : "min and max must be integers (use ?decimal=true to allow decimals)",
    );
  }

  // Working precision: integers -> 0 places. Decimal mode -> at least
  // DEFAULT_DECIMALS, or more if min/max have more decimal places.
  const decimals = decimal
    ? Math.max(DEFAULT_DECIMALS, minParsed.frac.length, maxParsed.frac.length)
    : 0;
  const scale = 10 ** decimals;

  const minScaled = toScaled(minParsed, decimals);
  const maxScaled = toScaled(maxParsed, decimals);

  const bound = [BigInt(LIMIT) * BigInt(scale), MAX_SAFE].reduce((a, b) =>
    a < b ? a : b,
  );
  const abs = (n: bigint) => (n < 0n ? -n : n);
  if (abs(minScaled) > bound || abs(maxScaled) > bound) {
    return badRequest(`min and max must be between -${LIMIT} and ${LIMIT}`);
  }

  if (minScaled >= maxScaled) {
    return badRequest("min must be less than max");
  }

  // Inclusive: min <= n <= max. Exclusive: min < n < max
  // (at the working precision, i.e. one step of 10^-decimals).
  const lo = exclusive ? minScaled + 1n : minScaled;
  const hi = exclusive ? maxScaled - 1n : maxScaled;
  if (lo > hi) {
    return badRequest(
      "no value exists between min and max when exclusive is true",
    );
  }

  const span = hi - lo + 1n;
  if (span > MAX_SPAN) {
    return badRequest("range between min and max is too large");
  }

  // crypto.randomInt is uniform (no modulo bias). Dividing an exact integer
  // by a power of ten gives the closest double, so 7 / 100 prints as 0.07.
  const spanNumber = Number(span);
  const numbers = Array.from(
    { length: quantity },
    () => Number(lo + BigInt(randomInt(spanNumber))) / scale,
  );

  return NextResponse.json(
    {
      min: Number(minScaled) / scale,
      max: Number(maxScaled) / scale,
      quantity,
      exclusive,
      decimal,
      decimals,
      numbers,
    },
    { headers: NO_STORE },
  );
}
