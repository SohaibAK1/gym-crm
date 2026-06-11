import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken:  true,   // silently refreshes the access token before it expires
    persistSession:    true,   // keeps session across page reloads (localStorage)
    detectSessionInUrl: false, // not using OAuth or magic links
  },
})
