
import { type NextRequest, NextResponse } from "next/server"

import { getClientIp } from "@/lib/utils"
import { pastebinDB } from "@/lib/storage"

export async function GET(request: NextRequest) {

  if (!pastebinDB) {
    return NextResponse.json(
      { error: "Storage is not available" },
      { status: 503 } // Service Unavailable
    )
  }

  const ip = getClientIp(request)

  try {

    const result = await pastebinDB.find('*', { ip })

    // Convert Map to array and exclude sensitive fields
    // Extract and format pastes
    const pastes = result
      .map((item) => ({
        id: item.id,
        title: item.title,
        timestamp: new Date(item.created_at),
      }))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10)

    return NextResponse.json({ pastes })

  } catch (err: unknown) {
    console.error(err)
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 })
  }

}

