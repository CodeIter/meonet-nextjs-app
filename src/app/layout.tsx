
import SerwistProviderWrapper from '@/components/SerwistProviderWrapper'

import type { Viewport } from "next"
import type { ReactNode } from "react"

import { Inter } from 'next/font/google'

import './globals.css'

import Navigation from '@/components/Navigation'
import StorageWarning from '@/components/StorageWarning'

import metadata from '@/app/metadata'
import Footer from '@/components/Footer'

export { metadata, Footer }

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${inter.className} bg-gray-50 min-h-screen flex flex-col antialiased`}>
        <Navigation />
        <div className="flex-1">
          <StorageWarning />
          {children}
        </div>
        <Footer />
        <SerwistProviderWrapper swUrl="/sw.js" /*disable={process.env.NODE_ENV === "development"}*/ />
      </body>
    </html>
  )
}
