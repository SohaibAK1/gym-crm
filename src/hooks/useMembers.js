import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export function useMembers() {
  return useQuery({
    queryKey: ['members'],
    staleTime: 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id, full_name, phone, gender, date_of_birth,
          goal, slot, is_active, created_at, can_create_routine,
          memberships!memberships_member_id_fkey (id, plan_type, amount, start_date, end_date, is_active)
        `)
        .eq('role', 'member')
        .order('created_at', { ascending: false })
      if (error) {
        console.error('[useMembers] query error:', error)
        throw error
      }
      return data ?? []
    },
  })
}

export function useMember(id) {
  return useQuery({
    queryKey: ['member', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          memberships!memberships_member_id_fkey (id, plan_type, amount, start_date, end_date, is_active, notes, created_at),
          trainer_notes!trainer_notes_member_id_fkey (id, note, created_at, admin:profiles!trainer_notes_admin_id_fkey(full_name)),
          routines!routines_member_id_fkey (id, name, is_active, routine_days(id, day_name, sort_order, exercises(id, name, sets, reps, weight)))
        `)
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
  })
}

export function useCreateMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body) => {
      const { data, error } = await supabase.functions.invoke('create-member', { body })
      if (error) throw new Error(error.message)
      if (data?.error) throw new Error(data.error)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['members'] }),
  })
}

export function useUpdateMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      // Convert empty strings → null so CHECK constraints and date columns don't reject them
      const cleaned = Object.fromEntries(
        Object.entries(updates).map(([k, v]) => [k, v === '' ? null : v])
      )
      const { data, error } = await supabase
        .from('profiles')
        .update(cleaned)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (_d, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['members'] })
      queryClient.invalidateQueries({ queryKey: ['member', id] })
    },
  })
}

export function useAddTrainerNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ member_id, note }) => {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('trainer_notes')
        .insert({ member_id, note, admin_id: user.id })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (_d, { member_id }) => queryClient.invalidateQueries({ queryKey: ['member', member_id] }),
  })
}
