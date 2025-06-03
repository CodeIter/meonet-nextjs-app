
import { supabase } from '@/lib/supabaseClient'
import { StorageService, PasteEntry } from './types'

// Define the expected shape of the data returned from
// Supabase
type PasteData = {
  id: string
  title: string
  content: string
  encryption: 'none' | 'client' | 'server'
  password_hash: string | null
  salt: string | null
  iv: string | null
  cipher_algorithm: string | null
  created_at: string // ISO 8601 date string
  syntax: string | null
  keywords: string[] | null
}

export class SupabaseStorage implements StorageService {

  async getPaste(id: string) {
    const { data, error } = await supabase!
      .from('pastebin')
      .select('*')
      .eq('id', id)
      .single()
    return error ? null : this.mapPaste(data)
  }

  async savePaste(paste: PasteEntry) {
    await supabase!.from('pastebin').insert([{
      id: paste.id,
      title: paste.title,
      content: paste.content,
      encryption: paste.encryption,
      password_hash: paste.passwordHash,
      salt: paste.salt,
      iv: paste.iv,
      cipher_algorithm: paste.cipher_algorithm,
      syntax: paste.syntax,
      keywords: paste.keywords
    }])
  }

  async getRecentPastes() {
    const { data } = await supabase!
      .from('pastebin')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    return data?.map(this.mapPaste) || []
  }

  async getUrl(shortCode: string): Promise<{ url: string } | null> {
    const { data, error } = await supabase!
      .from('urlshortener')
      .select('original_url')
      .eq('short_code', shortCode)
      .single()

    if (error || !data) {
      return null
    }

    return { url: data.original_url }
  }

  async saveUrl({ shortCode, url, ip }: { shortCode: string; url: string; ip: string }): Promise<void> {
    await supabase!.from('urlshortener').insert([{
      short_code: shortCode,
      original_url: url,
      ip: ip
    }])
  }

  private mapPaste(data: PasteData): PasteEntry {
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      encryption: data.encryption,
      passwordHash: data.password_hash,
      salt: data.salt,
      iv: data.iv,
      cipher_algorithm: data.cipher_algorithm,
      timestamp: new Date(data.created_at),
      syntax: data.syntax === null ? undefined : data.syntax,
      keywords: (data.keywords as string[]) || []
    }
  }
}
