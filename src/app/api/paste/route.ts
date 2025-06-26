
import { type NextRequest, NextResponse } from "next/server"

import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcryptjs"
import crypto from "crypto"

import { getClientIp } from "@/lib/utils"
import { pastebinDB } from '@/lib/storage'

function generateSalt(length: number = 16): string {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
}

export async function POST(request: NextRequest) {

  if (!pastebinDB) {
    return NextResponse.json(
      { error: "Storage is not available" },
      { status: 503 } // Service Unavailable
    )
  }

  const ip = getClientIp(request)

  const {
    title,
    content,
    encryption = "none",
    password,
    salt: _salt,
    iv: _iv,
    cipher_algorithm: _cipher_algorithm,
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
  let passwordHash = undefined
  let salt = _salt
  let iv = _iv
  let cipher_algorithm = _cipher_algorithm

  if (encryption === "server" && password) {
    // Generate salt and hash password
    passwordHash = await bcrypt.hash(password, 10)
    // generate salt
    salt = generateSalt(20)
    // Generate encryption IV
    iv = crypto.randomBytes(16)
    const key = crypto.scryptSync(password, salt, 32)
    cipher_algorithm = "aes-256-gcm"
    const cipher = crypto.createCipheriv(cipher_algorithm, key, iv)
    encryptedContent = Buffer.concat([
      cipher.update(content, "utf8"),
      cipher.final(),
    ]).toString("base64")
  }

  try {

    // For client-side encryption, we store encrypted content directly
    // and don't store password or IV
    await pastebinDB.set(id, {
      id,
      title: title || "Untitled",
      content: encryptedContent,
      ip,
      encryption,
      password_hash: passwordHash,
      salt,
      iv: iv ? iv.toString("base64") : undefined,
      cipher_algorithm,
      created_at: timestamp.toISOString(),
      syntax: syntax || "text",
      keywords: keywords || []
    })

    return NextResponse.json({ id })

  } catch (err: unknown) {
    console.error(err)
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 })
  }

}

