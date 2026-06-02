import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

function calcEndDate(startDate, planType) {
  const d = new Date(startDate)
  if (planType === 'monthly')   d.setMonth(d.getMonth() + 1)
  if (planType === 'quarterly') d.setMonth(d.getMonth() + 3)
  if (planType === 'annual')    d.setFullYear(d.getFullYear() + 1)
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

export function useSubscriptions() {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('memberships')
        .select('*, member:profiles!memberships_member_id_fkey(id, full_name, phone)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useAddSubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ member_id, plan_type, amount, start_date, notes }) => {
      const { data: { user } } = await supabase.auth.getUser()
      const end_date = calcEndDate(start_date, plan_type)

      // Deactivate any existing active plan for this member first
      await supabase
        .from('memberships')
        .update({ is_active: false })
        .eq('member_id', member_id)
        .eq('is_active', true)

      const { data, error } = await supabase
        .from('memberships')
        .insert({ member_id, plan_type, amount: parseFloat(amount), start_date, end_date, notes, created_by: user.id })
        .select()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      queryClient.invalidateQueries({ queryKey: ['members'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useToggleSubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, is_active }) => {
      const { data, error } = await supabase
        .from('memberships')
        .update({ is_active })
        .eq('id', id)
        .select()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      queryClient.invalidateQueries({ queryKey: ['members'] })
    },
  })
}
