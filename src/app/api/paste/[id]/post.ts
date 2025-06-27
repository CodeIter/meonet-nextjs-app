
import { type NextRequest, NextResponse } from "next/server"

import bcrypt from "bcryptjs"
import crypto from "crypto"

import { pastebinDB } from "@/lib/storage"

interface ContextProps {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: ContextProps) {

  if (!pastebinDB) {
    return NextResponse.json(
      { error: "Storage is not available" },
      { status: 503 } // Service Unavailable
    )
  }

  const { id } = await params

  const { password } = await request.json()

  if (!password) {
    return NextResponse.json(
      { error: "Password is required" },
      { status: 400 }
    )
  }

  try {

    const paste = await pastebinDB.get(id)

    if (!paste) {
      return NextResponse.json({ error: "Paste not found" }, { status: 404 })
    }

    if (paste.encryption !== "server") {
      return NextResponse.json(
        { error: "Paste is not server-encrypted" },
        { status: 400 }
      )
    }

    const isValid = await bcrypt.compare(password, paste.password_hash || "")
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      )
    }

    let decryptedContent = null

    try {

      if (paste.cipher_algorithm === "aes-256-gcm") {

        // Split ciphertext and tag
        // TODO (delayed) Consider use the tag from the database.
        const parts = paste.content.split(".")
        if (parts.length === 0) {
          return NextResponse.json({ error: "Invalid content format" }, { status: 400 })
        }
        const [cipherText, tag] = parts
        if (!tag) {
          return NextResponse.json(
            { error: "Missing authentication tag in encrypted content" },
            { status: 400 }
          )
        }
        const key = crypto.scryptSync(password, paste.salt || "", 32)
        const decipher = crypto.createDecipheriv(
          paste.cipher_algorithm || "aes-256-gcm",
          key,
          Buffer.from(paste.iv || "", "base64")
        )
        // Set authentication tag
        decipher.setAuthTag(Buffer.from(tag, "base64"))
        // Decrypt
        decryptedContent = decipher.update(cipherText, "base64", "utf8")
        decryptedContent += decipher.final("utf8")

      } else if (paste.cipher_algorithm === "aes-256-cbc") {

        // Decrypt the content using scrypt + AES-256-CBC
        const key = crypto.scryptSync(password, paste.salt || "", 32)
        const decipher = crypto.createDecipheriv(
          paste.cipher_algorithm || "aes-256-cbc",
          key,
          Buffer.from(paste.iv || "", "base64")
        )
        decryptedContent = decipher.update(paste.content, "base64", "utf8")
        decryptedContent += decipher.final("utf8")

      } else {

        return NextResponse.json(
          { error: `cipher_algorithm '${cipher_algorithm}' not supported` },
          { status: 400 }
        )

      }

    } catch(err: unknown) {
      console.error(err)
      if (err instanceof Error) {
        return NextResponse.json({ error: `Decryption fail. ${err.message}` }, { status: 400 })
      }
      return NextResponse.json({ error: "Decryption fail" }, { status: 400 })
    }

    // Exclude sensitive fields
    const {
      password_hash, salt, iv, cipher_algorithm,
      ip,
      ...safePaste
    } = paste

    return NextResponse.json({
      ...safePaste,
      content: decryptedContent
    })

  } catch (err: unknown) {
    console.error(err)
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 })
  }

}

