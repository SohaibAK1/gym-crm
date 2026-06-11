import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

// ── Memberships ───────────────────────────────────────────────────
export function useMemberSubscription() {
  return useQuery({
    queryKey: ['member-subscription'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('memberships')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}

// ── Routine (active one assigned to current user) ─────────────────
export function useMemberRoutine() {
  return useQuery({
    queryKey: ['member-routine'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('routines')
        .select(`
          id, name, description,
          routine_days (
            id, day_name, sort_order,
            exercises (id, name, sets, reps, weight, rest_seconds, notes, sort_order)
          )
        `)
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (error) throw error
      if (!data) return null
      return {
        ...data,
        routine_days: (data.routine_days ?? [])
          .sort((a, b) => a.sort_order - b.sort_order)
          .map(d => ({
            ...d,
            exercises: (d.exercises ?? []).sort((a, b) => a.sort_order - b.sort_order),
          })),
      }
    },
  })
}

// ── Exercise logs for today ───────────────────────────────────────
export function useTodayExerciseLogs() {
  const today = new Date().toISOString().split('T')[0]
  return useQuery({
    queryKey: ['exercise-logs', today],
    staleTime: 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exercise_logs')
        .select('*')
        .eq('logged_date', today)
      if (error) throw error
      return data ?? []
    },
  })
}

export function useToggleExercise() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ exercise_id, routine_day_id, log_id, completed }) => {
      if (log_id) {
        const { data, error } = await supabase
          .from('exercise_logs')
          .update({ completed })
          .eq('id', log_id)
          .select()
          .single()
        if (error) throw error
        return data
      }
      const { data: { user } } = await supabase.auth.getUser()
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('exercise_logs')
        .insert({ exercise_id, routine_day_id, member_id: user.id, logged_date: today, completed: true })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['exercise-logs'] }),
  })
}

// ── Attendance (last 90 days, for streak + calendar) ──────────────
export function useMemberAttendanceAll() {
  return useQuery({
    queryKey: ['member-attendance-all'],
    staleTime: 0,
    queryFn: async () => {
      const from = new Date()
      from.setDate(from.getDate() - 90)
      const { data, error } = await supabase
        .from('attendance')
        .select('id, checked_in_at, slot')
        .gte('checked_in_at', from.toISOString())
        .order('checked_in_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}

// Compute streak from attendance records (exported so Home can reuse)
export function calcStreak(records) {
  const dates = new Set(records.map(r => new Date(r.checked_in_at).toISOString().split('T')[0]))
  const today = new Date().toISOString().split('T')[0]
  let streak = 0
  for (let i = 0; i <= 90; i++) {
    const d = new Date(); d.setDate(d.getDate() - i)
    const ds = d.toISOString().split('T')[0]
    if (dates.has(ds)) { streak++ }
    else if (i === 0)  { continue } // today might not be checked in yet
    else               { break }
  }
  return streak
}

// ── Body stats ────────────────────────────────────────────────────
export function useBodyStats() {
  return useQuery({
    queryKey: ['body-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('body_stats')
        .select('*')
        .order('logged_at', { ascending: false })
        .limit(30)
      if (error) throw error
      return data ?? []
    },
  })
}

export function useLogBodyStats() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (stats) => {
      const { data: { user } } = await supabase.auth.getUser()
      // Remove empty string fields → null
      const cleaned = Object.fromEntries(
        Object.entries(stats).map(([k, v]) => [k, v === '' ? null : v])
      )
      const { data, error } = await supabase
        .from('body_stats')
        .insert({ ...cleaned, member_id: user.id })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['body-stats'] }),
  })
}

// ── Upload avatar photo ───────────────────────────────────────────
function resizeToBase64(file, maxPx = 200) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(maxPx / img.width, maxPx / img.height, 1)
      const canvas = document.createElement('canvas')
      canvas.width  = Math.round(img.width  * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = reject
    img.src = url
  })
}

export function useUploadAvatar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (file) => {
      const { data: { user } } = await supabase.auth.getUser()
      const dataUrl = await resizeToBase64(file)
      const { error } = await supabase
        .from('profiles')
        .update({ profile_picture_url: dataUrl })
        .eq('id', user.id)
      if (error) throw error
      return dataUrl
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['member-profile'] }),
  })
}

// ── Update own profile ────────────────────────────────────────────
export function useUpdateMemberProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (updates) => {
      const { data: { user } } = await supabase.auth.getUser()
      const cleaned = Object.fromEntries(
        Object.entries(updates).map(([k, v]) => [k, v === '' ? null : v])
      )
      const { data, error } = await supabase
        .from('profiles')
        .update(cleaned)
        .eq('id', user.id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['member-profile'] }),
  })
}

// ── Announcements (active only) ───────────────────────────────────
export function useMemberAnnouncements() {
  return useQuery({
    queryKey: ['member-announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('id, title, body, created_at')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(5)
      if (error) throw error
      return data ?? []
    },
  })
}
