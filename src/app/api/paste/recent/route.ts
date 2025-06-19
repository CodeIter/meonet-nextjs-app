
import { NextResponse } from "next/server"

import { pastebinDB } from "@/lib/storage"

export async function GET() {

  if (!pastebinDB) {
    return NextResponse.json(
      { error: "Storage is not available" },
      { status: 503 } // Service Unavailable
    )
  }

  const result = await pastebinDB.list('*')

  // Convert Map to array and exclude sensitive fields
  // Extract and format pastes
  const pastes = result.data
    .map((item) => ({
      id: item.id,
      title: item.title,
      timestamp: new Date(item.created_at),
    }))
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10)

  return NextResponse.json({ pastes })

}

