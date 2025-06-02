
import type { Metadata } from 'next'

import './globals.css'

import Navigation from '@/components/Navigation'
import ClientIP from '@/components/ClientIP'

import packageJson from '#/package.json'

// Get author name, username and email
const authorName = packageJson.author.name || 'Anonymous'
const gitUsername = packageJson.author.username || 'Anonymous'
const authorUrl = packageJson.author.url || packageJson.homepage

// Extract Git repo URL and username from package.json
const repoUrl = packageJson.repository?.url || ''

export const metadata: Metadata = {
  title: 'Web App - URL Shortener & Secure Pastebin',
  description: 'Fast and secure URL shortening and text sharing platform',
  keywords: ['url shortener', 'pastebin', 'secure', 'encryption', 'nextjs'],
  authors: [{ name: authorName, url: authorUrl }],
  creator: gitUsername,
  publisher: gitUsername
}

function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600">
          <p>&copy; 2025 Web App. Built with ❤️ by @{gitUsername}</p>
          <p className="mt-2 text-sm">
            MIT License - Free for personal and commercial use
          </p>
          <div className="mt-4 flex justify-center gap-4 text-sm">
            <a href="https://nextjs.org"  className="hover:text-blue-600 transition-colors">Next.js</a>
            <span>•</span>
            <a href="https://tailwindcss.com"  className="hover:text-blue-600 transition-colors">Tailwind CSS</a>
            <span>•</span>
            <a href={repoUrl}  className="hover:text-blue-600 transition-colors">Source</a>
          </div>
          {/* Add client IP component here */}
          <div className="mt-4">
            <ClientIP />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen flex flex-col antialiased">
        <Navigation />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
