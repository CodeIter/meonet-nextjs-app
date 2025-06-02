
import { NextResponse } from "next/server"
import { pasteStore } from "@/lib/stores"

export async function GET() {
  // Convert Map to array and exclude sensitive fields
  const pastes = pasteStore.getAll().map(([key, value]) => ({
    id: key,
    title: value.title,
    timestamp: value.timestamp
  })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10)

  return NextResponse.json({ pastes })
}