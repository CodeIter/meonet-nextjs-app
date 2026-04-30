
import { supabase } from '@/lib/storage'

export async function GET() {

  return Response.json({
    storageType: supabase ? 'database' : 'disabled'
  })

}

