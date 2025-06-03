import { NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcryptjs"
import crypto from "crypto"

import { storage } from '@/lib/storage'

function generateSalt(length: number = 16): string {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
}

export async function POST(request: NextRequest) {
  const {
    title,
    content,
    encryption = "none",
    password,
    salt: _salt,
    iv: _iv,
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
  let cipher_algorithm = undefined

  if (encryption === "server" && password) {
    // Generate salt and hash password
    passwordHash = await bcrypt.hash(password, 10)
    // generate salt
    salt = generateSalt(20)
    // Generate encryption IV
    iv = crypto.randomBytes(16)
    const key = crypto.scryptSync(password, salt, 32)
    cipher_algorithm = "aes-256-cbc"
    const cipher = crypto.createCipheriv(cipher_algorithm, key, iv)
    encryptedContent = Buffer.concat([
      cipher.update(content, "utf8"),
      cipher.final(),
    ]).toString("base64")
  }

  // For client-side encryption, we store encrypted content directly
  // and don't store password or IV

  await storage.savePaste({
    id,
    title: title || "Untitled",
    content: encryptedContent,
    encryption,
    passwordHash,
    salt,
    iv: iv ? iv.toString("base64") : undefined,
    cipher_algorithm,
    timestamp,
    syntax: syntax || "text",
    keywords: keywords || [],
  })

  return NextResponse.json({ id })
}
