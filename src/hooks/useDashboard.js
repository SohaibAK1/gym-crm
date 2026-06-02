import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const today     = new Date().toISOString().split('T')[0]
      const nextWeek  = new Date(); nextWeek.setDate(nextWeek.getDate() + 7)
      const nwStr     = nextWeek.toISOString().split('T')[0]
      const firstOfMo = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString().split('T')[0]

      const [
        { count: totalMembers },
        { count: todayCheckIns },
        { count: expiringSoon },
        { data: revenueRows },
        { data: recentCheckIns },
        { data: expiringList },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'member').eq('is_active', true),
        supabase.from('attendance').select('*', { count: 'exact', head: true }).gte('checked_in_at', `${today}T00:00:00`),
        supabase.from('memberships').select('*', { count: 'exact', head: true }).eq('is_active', true).lte('end_date', nwStr).gte('end_date', today),
        supabase.from('memberships').select('amount').gte('created_at', `${firstOfMo}T00:00:00`),
        supabase.from('attendance')
          .select('id, checked_in_at, slot, member:profiles!attendance_member_id_fkey(full_name)')
          .gte('checked_in_at', `${today}T00:00:00`)
          .order('checked_in_at', { ascending: false })
          .limit(6),
        supabase.from('memberships')
          .select('id, plan_type, end_date, member:profiles!memberships_member_id_fkey(full_name)')
          .eq('is_active', true)
          .lte('end_date', nwStr)
          .gte('end_date', today)
          .order('end_date')
          .limit(6),
      ])

      const revenue = revenueRows?.reduce((s, r) => s + parseFloat(r.amount), 0) ?? 0

      return {
        totalMembers:  totalMembers ?? 0,
        todayCheckIns: todayCheckIns ?? 0,
        expiringSoon:  expiringSoon ?? 0,
        revenue,
        recentCheckIns: recentCheckIns ?? [],
        expiringList:   expiringList ?? [],
      }
    },
    refetchInterval: 30_000,
  })
}
