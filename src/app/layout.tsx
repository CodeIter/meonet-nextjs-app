import type { Metadata } from 'next'
import Navigation from '../components/Navigation'
import './globals.css'

export const metadata: Metadata = {
  title: 'Web App - URL Shortener & Secure Pastebin',
  description: 'Fast and secure URL shortening and text sharing platform',
  keywords: ['url shortener', 'pastebin', 'secure', 'encryption', 'nextjs'],
  authors: [{ name: 'Muhammad Amin Boubaker', email: 'muhammadaminboubaker@gmail.com' }],
  creator: '@CodeIter',
}

function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600">
          <p>&copy; 2025 Web App. Built with ❤️ by @CodeIter</p>
          <p className="mt-2 text-sm">
            MIT License - Free for personal and commercial use
          </p>
          <div className="mt-4 flex justify-center gap-4 text-sm">
            <a href="https://nextjs.org" className="hover:text-blue-600 transition-colors">Next.js</a>
            <span>•</span>
            <a href="https://tailwindcss.com" className="hover:text-blue-600 transition-colors">Tailwind CSS</a>
            <span>•</span>
            <a href="https://gitlab.com/CodeIter/meonet" className="hover:text-blue-600 transition-colors">Source</a>
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
