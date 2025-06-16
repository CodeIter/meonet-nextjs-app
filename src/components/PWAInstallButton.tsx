
'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    deferredPrompt?: BeforeInstallPromptEvent
  }
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed', platform: string }>
  prompt(): Promise<void>
}

export default function PWAInstallButton() {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing
      e.preventDefault()

      // Stash the event so it can be triggered later
      window.deferredPrompt = e as BeforeInstallPromptEvent

      // Show the install button
      setShowButton(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Check for post-install prompt
    window.addEventListener('appinstalled', () => {
      setShowButton(false)
      console.log('PWA installed successfully')
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!window.deferredPrompt) return

    try {
      // Show the install prompt
      await window.deferredPrompt.prompt()

      // Wait for the user to respond to the prompt
      const { outcome } = await window.deferredPrompt.userChoice

      // Reset the deferred prompt variable
      window.deferredPrompt = undefined

      // Hide the install button
      setShowButton(false)

      console.log(`User chose ${outcome} on ${window.deferredPrompt?.platforms?.join(', ') ?? 'unknown platform'}`)
    } catch (error) {
      console.error('Installation prompt failed:', error)
    }
  }

  if (!showButton) return null

  return (
    <button
      onClick={handleInstallClick}
      className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
    >
      Install App
    </button>
  )
}