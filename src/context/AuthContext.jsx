import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,         setUser]         = useState(null)
  const [profile,      setProfile]      = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [profileReady, setProfileReady] = useState(false)

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    setProfile(data ?? null)
    setProfileReady(true)
  }

  useEffect(() => {
    // Initial session on mount — await profile before clearing loading spinner
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) await fetchProfile(u.id)
      else    setProfileReady(true)
      setLoading(false)
    })

    // Must NOT be async — Supabase JS v2 awaits async onAuthStateChange callbacks
    // which would block signInWithPassword from resolving. Fire-and-forget instead.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        setProfileReady(false)
        fetchProfile(u.id).catch(console.error)
      } else {
        setProfile(null)
        setProfileReady(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const role = profile?.role ?? null

  return (
    <AuthContext.Provider value={{ user, profile, role, loading, profileReady }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
