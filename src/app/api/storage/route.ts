
import { storage } from '@/lib/storage'
import { SupabaseStorage } from '@/lib/storage/supabaseStorage'

export async function GET() {
  const isSupabase = storage instanceof SupabaseStorage
  return Response.json({ storageType: isSupabase ? 'supabase' : 'temp_fs' })
}