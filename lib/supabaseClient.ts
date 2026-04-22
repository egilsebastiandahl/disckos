import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env vars not set: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export default supabase

// Ensure that when a user signs in we call backend to ensure profile exists.
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange(async (event, session) => {
    try {
      if (event === 'SIGNED_IN' && session?.access_token) {
        const token = session.access_token
        const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL ?? '')
        if (backendUrl) {
          // call GET /api/profile to create or fetch the profile
          await fetch(`${backendUrl}/api/profile`, { headers: { Authorization: `Bearer ${token}` } })
        }
      }
    } catch (e) {
      // non-fatal
      console.debug('profile upsert failed', e)
    }
  })
}
