'use client'

import { useState } from 'react'
import { FileTextIcon, LockIcon, CopyIcon, CheckIcon, EyeIcon, EyeOffIcon } from 'lucide-react'

export default function PastePage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [syntax, setSyntax] = useState('')
  const [encryption, setEncryption] = useState<'none' | 'server'>('none')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [keywords, setKeywords] = useState('')
  const [pasteId, setPasteId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const syntaxOptions = [
    { value: '', label: 'Plain Text' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'bash', label: 'Bash' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const keywordArray = keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0)

      const response = await fetch('/api/paste', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title || 'Untitled',
          content,
          encryption,
          password: encryption === 'server' ? password : undefined,
          syntax: syntax || undefined,
          keywords: keywordArray.length > 0 ? keywordArray : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create paste')
      }

      setPasteId(data.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    const pasteUrl = `${window.location.origin}/api/paste/${pasteId}`
    try {
      await navigator.clipboard.writeText(pasteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const resetForm = () => {
    setTitle('')
    setContent('')
    setSyntax('')
    setEncryption('none')
    setPassword('')
    setKeywords('')
    setPasteId('')
    setError('')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileTextIcon className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Secure Pastebin</h1>
          <p className="text-gray-600">
            Share code snippets and text securely with optional password protection
          </p>
        </div>

        {!pasteId ? (
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title (optional)
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My awesome code snippet"
                  className="input-field"
                />
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your code or text here..."
                  className="input-field min-h-[300px] font-mono text-sm"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Syntax Highlighting */}
                <div>
                  <label htmlFor="syntax" className="block text-sm font-medium text-gray-700 mb-2">
                    Syntax Highlighting
                  </label>
                  <select
                    id="syntax"
                    value={syntax}
                    onChange={(e) => setSyntax(e.target.value)}
                    className="input-field"
                  >
                    {syntaxOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Keywords */}
                <div>
                  <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="keywords"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="react, typescript, api"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Encryption Options */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Security Options
                </label>

                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="encryption"
                      value="none"
                      checked={encryption === 'none'}
                      onChange={(e) => setEncryption(e.target.value as 'none')}
                      className="text-green-600"
                    />
                    <span>No encryption (public)</span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="encryption"
                      value="server"
                      checked={encryption === 'server'}
                      onChange={(e) => setEncryption(e.target.value as 'server')}
                      className="text-green-600"
                    />
                    <span className="flex items-center gap-2">
                      <LockIcon className="w-4 h-4" />
                      Server-side encryption (password required)
                    </span>
                  </label>
                </div>

                {encryption === 'server' && (
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password for encryption"
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
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Paste...' : 'Create Paste'}
              </button>
            </form>
          </div>
        ) : (
          <div className="card">
            <div className="text-center mb-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckIcon className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Paste Created Successfully!
              </h2>
              <p className="text-gray-600">Your paste has been created and is ready to share.</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                Paste URL
              </h3>

              <div className="flex items-center gap-2 p-3 bg-white border border-green-300 rounded-lg mb-4">
                <code className="flex-1 text-green-700 font-mono text-sm break-all">
                  {`${window.location.origin}/api/paste/${pasteId}`}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="p-2 text-green-600 hover:bg-green-100 rounded-md transition-colors shrink-0"
                  title="Copy to clipboard"
                >
                  {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                </button>
              </div>

              {copied && (
                <p className="text-sm text-green-600 mb-4">
                  ✓ Copied to clipboard!
                </p>
              )}

              <div className="text-sm text-green-700">
                <p><strong>Paste ID:</strong> {pasteId}</p>
                {encryption === 'server' && (
                  <p className="mt-2 flex items-center gap-2">
                    <LockIcon className="w-4 h-4" />
                    This paste is password protected
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={resetForm}
              className="btn-secondary w-full"
            >
              Create Another Paste
            </button>
          </div>
        )}

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <LockIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Secure Encryption</h3>
            <p className="text-sm text-gray-600">Optional password protection with server-side encryption</p>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">{ }</span>
            </div>
            <h3 className="font-semibold mb-2">Syntax Highlighting</h3>
            <p className="text-sm text-gray-600">Support for multiple programming languages</p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 font-bold">⚡</span>
            </div>
            <h3 className="font-semibold mb-2">Fast & Reliable</h3>
            <p className="text-sm text-gray-600">Quick paste creation with persistent storage</p>
          </div>
        </div>
      </div>
    </main>
  )
}
