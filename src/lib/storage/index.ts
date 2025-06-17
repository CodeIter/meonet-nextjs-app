
import { SupabaseStorage } from './supabaseStorage'
import { supabase } from '@/lib/supabaseClient'

export const storage = supabase
  ? new SupabaseStorage()
  : null

if (!supabase) {
  console.warn('⚠️ Supabase not configured.')
}