import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export function useTodayAttendance(date) {
  const d = date ?? new Date().toISOString().split('T')[0]
  return useQuery({
    queryKey: ['attendance', d],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance')
        .select('*, member:profiles!attendance_member_id_fkey(id, full_name, phone, slot)')
        .gte('checked_in_at', `${d}T00:00:00`)
        .lte('checked_in_at', `${d}T23:59:59`)
        .order('checked_in_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
    refetchInterval: 15000,
  })
}

export function useMemberAttendance(memberId) {
  return useQuery({
    queryKey: ['attendance', 'member', memberId],
    enabled: !!memberId,
    queryFn: async () => {
      const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('attendance')
        .select('id, checked_in_at, slot')
        .eq('member_id', memberId)
        .gte('checked_in_at', `${firstOfMonth}T00:00:00`)
        .order('checked_in_at', { ascending: true })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useMarkAttendance() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ member_id, slot, date }) => {
      const { data: { user } } = await supabase.auth.getUser()
      // For past dates use noon of that day; for today use current time
      const checked_in_at = date
        ? `${date}T12:00:00`
        : new Date().toISOString()
      const { data, error } = await supabase
        .from('attendance')
        .insert({ member_id, slot, checked_in_by: user.id, checked_in_at })
        .select()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['attendance'] }),
  })
}

export function useSelfCheckIn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ slot }) => {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('attendance')
        .insert({ member_id: user.id, slot })
        .select()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member-attendance-all'] })
    },
  })
}

export function useDeleteAttendance() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('attendance').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['attendance'] }),
  })
}
