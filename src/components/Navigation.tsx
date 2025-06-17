'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon, LinkIcon, FileTextIcon, MenuIcon, XIcon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type NavItem = {
  href: string
  key: string
  label: string
  icon: LucideIcon
}

export default function Navigation() {
  const [isStorageAvailable, setIsStorageAvailable] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navItems: NavItem= [
    {
      href: '/',
      key:'home',
      label: 'Home',
      icon: HomeIcon
    },
    {
      href: '/shorten',
      key:'shorten',
      label: 'URL Shortener',
      icon: LinkIcon
    },
    {
      href: '/paste',
      key:'paste',
      label: 'Secure Pastebin',
      icon: FileTextIcon
    },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  useEffect(() => {
    fetch('/api/storage')
      .then(res => res.json())
      .then(data => {
        setIsStorageAvailable(data.storageType !== 'disabled')
      })
      .catch(() => setIsStorageAvailable(false))
  }, [])

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">WA</span>
            </div>
            Web App
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(({ href, key, label, icon: Icon }) => (
              <Link
                key={key}
                href={isStorageAvailable ? href : '#'}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive(href)
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }${isStorageAvailable ? '' : 'text-gray-400 cursor-not-allowed' }` }
                aria-disabled={!isStorageAvailable}
              >
                <Icon className="w-4 h-4" />
                {label}
                {!isStorageAvailable && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                    Disabled
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-2">
              {navItems.map(({ href, key, label, icon: Icon }) => (
                <Link
                  key={key}
                  href={isStorageAvailable ? href : '#'}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(href)
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }${isStorageAvailable ? '' : 'text-gray-400 cursor-not-allowed' }` }
                aria-disabled={!isStorageAvailable}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                  {!isStorageAvailable && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                      Disabled
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
