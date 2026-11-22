
import { randomInt } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const MIN_LENGTH = 3;
const MAX_LENGTH = 100;
const MIN_QUANTITY = 1;
const MAX_QUANTITY = 100;
const MAX_CHARS = 256; // max size of the custom character list

const DEFAULT_CHARS =
  "abcdefghijklmnopqrstuvwxyz" +
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
  "0123456789" +
  " `'\"\\|,./<>?;#:@~[]{}-=_+)(*&^%$£!¬€";

const NO_STORE = { "Cache-Control": "no-store" };

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400, headers: NO_STORE });
}

// Strict integer parsing: rejects "5.5", "1e2", " 7", "abc", "-3", ...
function parseIntInRange(value: string, min: number, max: number): number | null {
  if (!/^\d+$/.test(value)) return null;
  const n = Number(value);
  return n >= min && n <= max ? n : null;
}

function generatePassword(alphabet: string[], length: number): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    // crypto.randomInt is uniform (no modulo bias)
    out += alphabet[randomInt(alphabet.length)];
  }
  return out;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ length: string; quantity: string }> },
) {
  const { length: lengthParam, quantity: quantityParam } = await params;

  const length = parseIntInRange(lengthParam, MIN_LENGTH, MAX_LENGTH);
  if (length === null) {
    return badRequest(
      `length must be an integer between ${MIN_LENGTH} and ${MAX_LENGTH}`,
    );
  }

  const quantity = parseIntInRange(quantityParam, MIN_QUANTITY, MAX_QUANTITY);
  if (quantity === null) {
    return badRequest(
      `quantity must be an integer between ${MIN_QUANTITY} and ${MAX_QUANTITY}`,
    );
  }

  // `chars` missing -> default set. Present but empty -> error.
  const charsParam = request.nextUrl.searchParams.get("chars");
  if (charsParam !== null && charsParam.length === 0) {
    return badRequest("chars must not be empty");
  }

  // Array.from splits by code point (safe for emoji / non-BMP chars);
  // Set removes duplicates so every character is equally likely.
  const alphabet = Array.from(new Set(Array.from(charsParam ?? DEFAULT_CHARS)));
  if (alphabet.length > MAX_CHARS) {
    return badRequest(`chars must contain at most ${MAX_CHARS} unique characters`);
  }

  const passwords = Array.from({ length: quantity }, () =>
    generatePassword(alphabet, length),
  );

  return NextResponse.json(
    { length, quantity, charsetSize: alphabet.length, passwords },
    { headers: NO_STORE },
  );
}
