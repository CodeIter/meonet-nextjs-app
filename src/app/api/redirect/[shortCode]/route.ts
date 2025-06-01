import { NextRequest, NextResponse } from "next/server"
import { urlStore } from "@/lib/stores"

export async function GET(
  request: NextRequest,
  { params }: { params: { shortCode: string } }
) {
  const { shortCode } = params
  const entry = urlStore.get(shortCode)

  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.redirect(entry.url)
}
