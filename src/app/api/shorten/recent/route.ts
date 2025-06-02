
import { NextResponse } from "next/server"
import { urlStore } from "@/lib/stores"

export async function GET() {
  // Convert Map to array and omit IP field
  const urls = urlStore.getAll().map(([key, value]) => ({
    shortCode: key,
    url: value.url,
    timestamp: value.timestamp
  })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10)

  return NextResponse.json({ urls })
}