import { NextRequest, NextResponse } from "next/server"
import { pasteStore } from "@/lib/stores"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const paste = pasteStore.get(id)

  if (!paste) {
    return NextResponse.json({ error: "Paste not found" }, { status: 404 })
  }

  // Return without sensitive data
  const { ...responseData } = paste
  return NextResponse.json(responseData)
}
