import { NextRequest, NextResponse } from "next/server"
import { urlStore } from "@/lib/stores"

interface ContextProps {
  params: Promise<{ shortCode: string }>
}

export async function GET(
  request: NextRequest,
  { params }: ContextProps
) {
  const { shortCode } = await params
  const entry = urlStore.get(shortCode)

  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.redirect(entry.url)
}
