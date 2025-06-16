
'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // Register service worker from public directory
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      })
        .then(reg => console.log('ServiceWorker registered', reg.scope))
        .catch(err => console.error('ServiceWorker registration failed', err))
    }
  }, [])

  return null
}
