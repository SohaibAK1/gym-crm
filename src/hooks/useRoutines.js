import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export function useRoutines() {
  return useQuery({
    queryKey: ['routines'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('routines')
        .select(`
          *,
          member:profiles!routines_member_id_fkey(id, full_name),
          routine_days (
            id, day_name, sort_order,
            exercises (id, name, sets, reps, weight, rest_seconds, notes, sort_order)
          )
        `)
        .order('created_at', { ascending: false })
      if (error) throw error
      // Sort days and exercises by sort_order
      return (data ?? []).map(r => ({
        ...r,
        routine_days: (r.routine_days ?? [])
          .sort((a, b) => a.sort_order - b.sort_order)
          .map(d => ({
            ...d,
            exercises: (d.exercises ?? []).sort((a, b) => a.sort_order - b.sort_order),
          })),
      }))
    },
  })
}

export function useRoutine(id) {
  return useQuery({
    queryKey: ['routine', id],
    enabled: !!id && id !== 'new',
    queryFn: async () => {
      const { data, error } = await supabase
        .from('routines')
        .select(`
          *,
          member:profiles!routines_member_id_fkey(id, full_name),
          routine_days (
            id, day_name, sort_order,
            exercises (id, name, sets, reps, weight, rest_seconds, notes, sort_order)
          )
        `)
        .eq('id', id)
        .single()
      if (error) throw error
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

export function useCreateRoutine() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ member_id, name, description }) => {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('routines')
        .insert({ member_id, name, description, created_by: user.id })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['routines'] }),
  })
}

export function useUpdateRoutine() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('routines')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (_d, { id }) => queryClient.invalidateQueries({ queryKey: ['routine', id] }),
  })
}

export function useAddRoutineDay() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ routine_id, day_name, sort_order }) => {
      const { data, error } = await supabase
        .from('routine_days')
        .insert({ routine_id, day_name, sort_order })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (_d, { routine_id }) => queryClient.invalidateQueries({ queryKey: ['routine', routine_id] }),
  })
}

export function useDeleteRoutineDay() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, routine_id }) => {
      const { error } = await supabase.from('routine_days').delete().eq('id', id)
      if (error) throw error
      return routine_id
    },
    onSuccess: (_d, { routine_id }) => queryClient.invalidateQueries({ queryKey: ['routine', routine_id] }),
  })
}

export function useAddExercise() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ routine_day_id, routine_id, name, sets, reps, weight, rest_seconds, notes, sort_order }) => {
      const { data, error } = await supabase
        .from('exercises')
        .insert({ routine_day_id, name, sets: sets || null, reps, weight, rest_seconds: rest_seconds || null, notes, sort_order })
        .select()
        .single()
      if (error) throw error
      return { ...data, routine_id }
    },
    onSuccess: (_d, { routine_id }) => queryClient.invalidateQueries({ queryKey: ['routine', routine_id] }),
  })
}

export function useUpdateExercise() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, routine_id, ...updates }) => {
      const { data, error } = await supabase
        .from('exercises')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return { ...data, routine_id }
    },
    onSuccess: (_d, { routine_id }) => queryClient.invalidateQueries({ queryKey: ['routine', routine_id] }),
  })
}

export function useDeleteExercise() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, routine_id }) => {
      const { error } = await supabase.from('exercises').delete().eq('id', id)
      if (error) throw error
      return routine_id
    },
    onSuccess: (_d, { routine_id }) => queryClient.invalidateQueries({ queryKey: ['routine', routine_id] }),
  })
}
