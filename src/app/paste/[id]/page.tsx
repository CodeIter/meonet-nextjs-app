'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { FileTextIcon, LockIcon, CopyIcon, CheckIcon, EyeIcon, EyeOffIcon, CalendarIcon } from 'lucide-react'
import Link from 'next/link'

interface PasteData {
  id: string
  title: string
  content: string
  encryption: 'none' | 'client' | 'server'
  salt: string | null
  iv: string | null
  created_at: string
  syntax?: string
  keywords?: string[]
}

export default function PasteViewPage() {
  const params = useParams()
  const id = params.id as string

  const [paste, setPaste] = useState<PasteData | null>(null)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [needsPassword, setNeedsPassword] = useState(false)

  const fetchPaste = useCallback(async () => {
    try {
      const response = await fetch(`/api/paste/${id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Paste not found')
      }

      if (data.encryption === 'server' && data.content.includes('base64')) {
        setNeedsPassword(true)
      }

      setPaste({ ...data, created_at: new Date(data.created_at) })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load paste')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchPaste()
  }, [fetchPaste])

  const decryptContent = async () => {
    if (!paste || !password) return

    setIsDecrypting(true)
    setError('')

    try {
      const encoder = new TextEncoder()
      const decoder = new TextDecoder()

      const salt = base64ToArrayBuffer(paste.salt!)
      const iv = base64ToArrayBuffer(paste.iv!)

      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      )

      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: 100000,
          hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['decrypt']
      )

      const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        base64ToArrayBuffer(paste.content)
      )

      setPaste({ ...paste, content: decoder.decode(decryptedData) })
      setNeedsPassword(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to decrypt paste. Please check your password.')
    } finally {
      setIsDecrypting(false)
    }

  }

  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binaryString = atob(base64)
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
  }

  const copyToClipboard = async () => {
    if (!paste) return

    try {
      await navigator.clipboard.writeText(paste.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="card text-center">
            <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading paste...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="card text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">❌</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Paste Not Found</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/paste" className="btn-primary">Create New Paste</Link>
          </div>
        </div>
      </main>
    )
  }

  if (needsPassword && paste) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="card text-center">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <LockIcon className="w-8 h-8 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Password Protected</h1>
            <p className="text-gray-600 mb-6">This paste is encrypted and requires a password to view.</p>

            <form onSubmit={(e) => { e.preventDefault(); decryptContent(); }} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="input-field pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isDecrypting}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDecrypting ? 'Decrypting...' : 'Unlock Paste'}
              </button>
            </form>
          </div>
        </div>
      </main>
    )
  }

  if (!paste) return null

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="card mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <FileTextIcon className="w-6 h-6 text-green-600" />
                <h1 className="text-2xl font-bold text-gray-900">{paste.title}</h1>
                {paste.encryption !== 'none' && (
                  <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                    <LockIcon className="w-3 h-3" />
                    Encrypted
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  {formatDate(paste.created_at)}
                </div>
                {paste.syntax && (
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {paste.syntax}
                  </div>
                )}
              </div>

              {paste.keywords && paste.keywords.length > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-sm text-gray-500">Tags:</span>
                  <div className="flex gap-1 flex-wrap">
                    {paste.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={copyToClipboard}
              className="btn-secondary flex items-center gap-2"
            >
              {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="card">
          <div className="bg-gray-50 rounded-lg p-4 border">
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 overflow-x-auto">
              {paste.content}
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 text-center">
          <Link href="/paste" className="btn-primary">Create New Paste</Link>
        </div>
      </div>
    </main>
  )
}
