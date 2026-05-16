
'use client'

import { useEffect } from 'react'

interface MobileConsoleProps {
  /** Max screen width in px to load the console (default: 768) */
  maxWidth?: number
  /** Only load in development mode (default: true) */
  devOnly?: boolean
}

const CDN_URL = 'https://cdn.jsdelivr.net/gh/c-kick/mobileConsole/hnl.mobileconsole.min.js'

export function MobileConsole({
  maxWidth = 768,
  devOnly = true,
}: MobileConsoleProps) {

  useEffect(() => {
    // Skip in production if devOnly
    if (devOnly && process.env.NODE_ENV === 'production') return

    // Only load on small screens
    if (!window.matchMedia(`(max-width: ${maxWidth}px)`).matches) return

    const script = document.createElement('script')
    script.src = CDN_URL
    script.type = 'module'
    script.async = true
    script.onerror = () => console.warn('MobileConsole failed to load')

    document.head.insertBefore(script, document.head.firstChild)

    return () => {
      script.remove()
    }

  }, [maxWidth, devOnly])

  return null
}

export default MobileConsole

