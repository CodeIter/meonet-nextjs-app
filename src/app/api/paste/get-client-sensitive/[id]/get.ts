
import { type NextRequest, NextResponse } from "next/server"

import { pastebinDB } from "@/lib/storage"

interface ContextProps {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: ContextProps) {

  if (!pastebinDB) {
    return NextResponse.json(
      { error: "Storage is not available" },
      { status: 503 } // Service Unavailable
    )
  }

  const { id } = await params

  try {

    const paste = await pastebinDB.get(id)

    if (!paste) {
      return NextResponse.json({ error: "Paste not found" }, { status: 404 })
    }

    if (paste.encryption !== "client") {
      return NextResponse.json(
        { error: "Only client-side encrypted pastes are allowed" },
        { status: 400 }
      )
    }

    const { iv, salt, cipher_algorithm } = paste

    if (!iv || !salt || !cipher_algorithm) {
      return NextResponse.json(
        { error: "Missing decryption metadata" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      iv,
      salt,
      cipher_algorithm
    })

  } catch (err: unknown) {
    console.error(err)
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 })
  }

}

