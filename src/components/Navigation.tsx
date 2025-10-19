
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useEffect, useState } from 'react'

import {
  type LucideIcon,
  HomeIcon, LinkIcon, FileTextIcon, MenuIcon, XIcon,
  BookOpen
} from 'lucide-react'

type NavItem = {
  href: string
  key: string
  label: string
  icon: LucideIcon
  available?: boolean
}

/**
 * Normalizes input to an array, applies a default values
 * if it’s missing, and returns the new array.
 */
function normalizeNavItems(itemOrItems: NavItem | NavItem[]): NavItem[] {
  const items = Array.isArray(itemOrItems) ? itemOrItems : [itemOrItems]
  return items.map(item => {
    const {
      available = true,  // default
      ...rest
    } = item
    // Return a brand-new object (immutable) with available guaranteed
    return {
      ...rest,
      available,
    }
  })
}

export default function Navigation() {

  const [isStorageAvailable, setIsStorageAvailable] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/storage')
      .then(res => res.json())
      .then(data => {
        setIsStorageAvailable(data.storageType !== 'disabled')
      })
      .catch(() => setIsStorageAvailable(false))
  }, [])

  const navItems: NavItem[] = [
    {
      href: '/',
      key:'home',
      label: 'Home',
      icon: HomeIcon,
      available: true
    },
    {
      href: '/blog',
      key:'blog',
      label: 'Blog',
      icon: BookOpen,
      available: true
    },
    {
      href: '/shorten',
      key:'shorten',
      label: 'URL Shortener',
      icon: LinkIcon,
      available: isStorageAvailable
    },
    {
      href: '/paste',
      key:'paste',
      label: 'Secure Pastebin',
      icon: FileTextIcon,
      available: isStorageAvailable
    }
  ]

  navItems = normalizeNavItems(navItems)

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

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
            {navItems.map(({ href, key, label, icon: Icon, available }) => (
              <Link
                key={key}
                href={available ? href : '#'}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive(href)
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }${available ? '' : 'text-gray-400 cursor-not-allowed' }` }
                aria-disabled={!available}
              >
                <Icon className="w-4 h-4" />
                {label}
                {!available && (
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
              {navItems.map(({ href, key, label, icon: Icon, available }) => (
                <Link
                  key={key}
                  href={available ? href : '#'}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(href)
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }${available ? '' : 'text-gray-400 cursor-not-allowed' }` }
                aria-disabled={!available}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                  {!available && (
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
