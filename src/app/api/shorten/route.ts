import { NextRequest, NextResponse } from "next/server"
import { generateShortCode } from "@/lib/utils"
import { urlStore } from "@/lib/stores"

export async function POST(request: NextRequest) {
  const { url } = await request.json()
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  try {
    new URL(url); // Validate URL format
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
  }

  const shortCode = generateShortCode()
  const timestamp = new Date()

  // Add to store (will auto-evict old entries if needed)
  urlStore.set(shortCode, {
    url,
    ip,
    timestamp,
  })

  return NextResponse.json({ shortCode })
}
