
import { NextRequest, NextResponse } from 'next/server'

import { pastebinDB } from '@/lib/Storage'

interface ContextProps {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: ContextProps
) {

  if (!pastebinDB) {
    return NextResponse.json(
      { error: "Storage is not available" },
      { status: 503 } // Service Unavailable
    )
  }

  const { id } = await params
  const paste = await pastebinDB.get(id)

  if (!paste) {
    return NextResponse.json({ error: "Paste not found" }, { status: 404 })
  }

  // Omit sensitive fields
  const { password_hash, salt, iv, ...safePaste } = paste
  return NextResponse.json(safePaste)

}

