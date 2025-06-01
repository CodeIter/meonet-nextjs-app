import { NextRequest, NextResponse } from "next/server"
import { pasteStore } from "@/lib/stores"

interface ContextProps {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: ContextProps
) {
  const { id } = await params
  const paste = pasteStore.get(id)

  if (!paste) {
    return NextResponse.json({ error: "Paste not found" }, { status: 404 })
  }

  // Return without sensitive data
  const { ...responseData } = paste
  return NextResponse.json(responseData)
}
