import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// Client per il browser (with build-time fallback to prevent SSR crashes)
export const createBrowserClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )
}
