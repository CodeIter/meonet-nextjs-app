import { generateShortCode } from "./utils"

interface UrlEntry {
  url: string
  ip: string
  timestamp: Date
}

interface PasteEntry {
  id: string
  title: string
  content: string
  encryption: "none" | "client" | "server"
  passwordHash: string | null
  salt: string | null
  iv: string | null
  timestamp: Date
  syntax?: string
  keywords?: string[]
}

// URL Store with LRU eviction
export const urlStore = (() => {
  const store = new Map<string, UrlEntry>()
  const maxEntries = 500

  return {
    get(key: string): UrlEntry | undefined {
      return store.get(key)
    },
    set(key: string, value: UrlEntry) {
      if (store.size >= maxEntries) {
        // Find and delete oldest entry
        const oldest = Array.from(store.entries()).reduce((oldest, [key, entry]) =>
          entry.timestamp < oldest[1].timestamp ? [key, entry] : oldest
        )
        store.delete(oldest[0])
      }
      store.set(key, value)
    },
    size() {
      return store.size
    }
  }
})()

// Paste Store
export const pasteStore = (() => {
  const store = new Map<string, PasteEntry>()

  return {
    get(key: string): PasteEntry | undefined {
      return store.get(key)
    },
    set(key: string, value: PasteEntry) {
      store.set(key, value)
    },
    size() {
      return store.size
    }
  }
})()
