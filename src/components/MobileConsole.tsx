
'use client'

import { useEffect } from 'react'

interface MobileConsoleProps {
  /** Max screen width in px to load the console (default: 768) */
  maxWidth?: number
  /** Only load in development mode (default: true) */
  devOnly?: boolean
}

export function MobileConsole({
  maxWidth = 768,
  devOnly = true,
}: MobileConsoleProps) {

  useEffect(() => {
    // Skip in production if devOnly
    if (devOnly && process.env.NODE_ENV === 'production') return

    // Only load on small screens
    if (!window.matchMedia(`(max-width: ${maxWidth}px)`).matches) return

    import('https://cdn.jsdelivr.net/gh/c-kick/mobileConsole/hnl.mobileconsole.min.js')
      .catch((err) => console.warn('MobileConsole failed to load:', err))

  }, [maxWidth, devOnly])

  return null
}

export default MobileConsole

