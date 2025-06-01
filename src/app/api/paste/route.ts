import { NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcryptjs"
import { pasteStore } from "@/lib/stores"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  const {
    title,
    content,
    encryption = "none",
    password,
    syntax,
    keywords,
  } = await request.json()

  if (!content) {
    return NextResponse.json(
      { error: "Content is required" },
      { status: 400 }
    )
  }

  const id = uuidv4()
  const timestamp = new Date()
  let encryptedContent = content
  let passwordHash = null
  let salt = null
  let iv = null

  if (encryption === "server" && password) {
    // Generate salt and hash password
    passwordHash = await bcrypt.hash(password, 10)

    // Generate encryption IV
    iv = crypto.randomBytes(16)
    const key = crypto.scryptSync(password, "salt", 32)
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv)
    encryptedContent = Buffer.concat([
      cipher.update(content, "utf8"),
      cipher.final(),
    ]).toString("base64")
  }

  pasteStore.set(id, {
    id,
    title: title || "Untitled",
    content: encryptedContent,
    encryption,
    passwordHash,
    salt,
    iv: iv?.toString("base64"),
    timestamp,
    syntax,
    keywords: keywords || [],
  })

  return NextResponse.json({ id })
}
