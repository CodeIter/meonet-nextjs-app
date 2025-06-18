
import { supabase } from '@/lib/storage/supabaseClient'
import { PastebinRepository } from '@/lib/storage/PastebinRepository'
import { URLShortenerRepository } from '@/lib/storage/URLShortenerRepository'

export { supabase }

export const pastebinDB = new PastebinRepository(supabase)

export const urlShortenerDB = new URLShortenerRepository(supabase)

if (!supabase) {
  pastebinDB = null
  urlShortenerDB = null
  console.warn('⚠️ Supabase not configured.')
}

