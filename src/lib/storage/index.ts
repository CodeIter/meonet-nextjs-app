
import { supabase } from '@/lib/storage/supabaseClient'
import { PastebinRepository } from '@/lib/storage/PastebinRepository'
import { URLShortenerRepository } from '@/lib/storage/URLShortenerRepository'

export { supabase }

export const pastebinDB = supabase ?
  new PastebinRepository(supabase) : null

export const urlShortenerDB = supabase ?
  new URLShortenerRepository(supabase) : null

if (!supabase) {
  console.warn('⚠️ Supabase not configured.')
}

