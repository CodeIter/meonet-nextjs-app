
import { SupabaseStorage } from './supabaseStorage'
import { TempFsStorage } from './tempStorage'
import { supabase } from '@/lib/supabaseClient'

export const storage = supabase
  ? new SupabaseStorage()
  : new TempFsStorage()

if (!supabase) {
  console.warn('⚠️ Supabase not configured. Using temporary file system storage. Data will be lost on restart.')
}