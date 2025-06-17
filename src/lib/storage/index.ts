
import { SupabaseStorage } from '@/lib/storage/supabaseStorage'
import { supabase } from '@/lib/storage/supabaseClient'

export const storage = supabase
  ? new SupabaseStorage()
  : null

if (!supabase) {
  console.warn('⚠️ Supabase not configured.')
}