
import { createClient } from '@supabase/supabase-js'

import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY
} from '@/lib/config'

export const supabase = PUBLIC_SUPABASE_URL && PUBLIC_SUPABASE_ANON_KEY
  ? createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)
  : null

export default supabase

