
export interface PasteEntry {
  id: string
  timestamp: Date
  title: string
  content: string
  encryption: 'none' | 'client' | 'server'
  passwordHash?: string
  salt?: string
  iv?: string
  cipher_algorithm?: string
  syntax?: string
  keywords?: string[]
}

export interface StorageService {
  getPaste: (id: string) => Promise<PasteEntry | null>
  savePaste: (paste: PasteEntry) => Promise<void>
  getRecentPastes: () => Promise<PasteEntry[]>
  getUrl: (shortCode: string) => Promise<{ url: string } | null>
  saveUrl: (url: { shortCode: string; url: string; ip: string }) => Promise<void>
}
