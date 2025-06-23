
'use client'

import { useState, useEffect } from 'react'
import { LinkIcon, CopyIcon, CheckIcon, ExternalLinkIcon } from 'lucide-react'

interface UrlEntry {
  shortCode: string
  url: string
  timestamp: Date
}

export default function ShortenPage() {

  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)

  const [url, setUrl] = useState('')
  const [shortCode, setShortCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [recentUrls, setRecentUrls] = useState<UrlEntry[]>([])

  useEffect(() => {
    const checkStorage = async () => {
      try {
        const res = await fetch('/api/storage')
        const data = await res.json()
        setIsAvailable(data.storageType !== 'disabled')
      } catch (error) {
        console.error('Failed to fetch storage status:', error)
        setIsAvailable(false)
      }
    }
    checkStorage()
  }, [])

  // Fetch recent URLs on component mount
  useEffect(() => {
    fetch('/api/shorten/recent')
      .then(res => res.json())
      .then(data => setRecentUrls(data.urls))
      .catch(() => setError('Failed to load recent URLs'))
  }, [])

  if (isAvailable === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Checking service status...</p>
      </div>
    )
  }

  if (!isAvailable) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl text-red-600">Service Unavailable</h1>
        <p>This feature requires database configuration.</p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to shorten URL')
      }

      setShortCode(data.shortCode)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    const shortUrl = `${window.location.origin}/r/${shortCode}`
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const openShortUrl = () => {
    const shortUrl = `${window.location.origin}/r/${shortCode}`
    window.open(shortUrl, '_blank')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <LinkIcon className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">URL Shortener</h1>
          <p className="text-gray-600">
            Transform your long URLs into short, shareable links
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/very/long/url/that/needs/shortening"
                className="input-field"
                required
              />
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
              {isLoading ? 'Shortening...' : 'Shorten URL'}
            </button>
          </form>

          {shortCode && (
            <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                Your shortened URL is ready!
              </h3>

              <div className="flex items-center gap-2 p-3 bg-white border border-green-300 rounded-lg mb-4">
                <code className="flex-1 text-green-700 font-mono text-sm">
                  {`${window.location.origin}/r/${shortCode}`}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="p-2 text-green-600 hover:bg-green-100 rounded-md transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                </button>
                <button
                  onClick={openShortUrl}
                  className="p-2 text-green-600 hover:bg-green-100 rounded-md transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLinkIcon className="w-4 h-4" />
                </button>
              </div>

              {copied && (
                <p className="text-sm text-green-600">
                  ✓ Copied to clipboard!
                </p>
              )}
            </div>
          )}
        </div>

        { /* recent */ }
        {recentUrls.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Recent Shortened URLs</h3>
            <ul className="space-y-2">
              {recentUrls.map((urlEntry, index) => (
                <li key={index} className="bg-white p-3 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <a 
                      href={`/r/${urlEntry.shortCode}`} 
                      className="text-blue-600 hover:underline truncate"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {`${window.location.origin}/r/${urlEntry.shortCode}`}
                    </a>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/r/${urlEntry.shortCode}`)
                        setCopied(true)
                        setTimeout(() => setCopied(false), 2000)
                      }}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">⚡</span>
            </div>
            <h3 className="font-semibold mb-2">Lightning Fast</h3>
            <p className="text-sm text-gray-600">Get your shortened URL in seconds</p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold">🔒</span>
            </div>
            <h3 className="font-semibold mb-2">Secure</h3>
            <p className="text-sm text-gray-600">Your URLs are safely stored and redirected</p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 font-bold">📊</span>
            </div>
            <h3 className="font-semibold mb-2">Clean Links</h3>
            <p className="text-sm text-gray-600">Beautiful, short URLs perfect for sharing</p>
          </div>
        </div>
      </div>
    </main>
  )
}
