import { useDashboard } from '../../hooks/useDashboard'

const BC  = "'Barlow Condensed', sans-serif"
const INT = 'Inter, system-ui, sans-serif'
const IBP = "'IBM Plex Mono', ui-monospace, monospace"
const YLW = '#FACC15'
const CRD = '#1E1C18'
const BRD = 'rgba(250,204,21,0.1)'

const STATS = [
  { key: 'totalMembers',  label: 'Total Members',    color: YLW,       fmt: v => v },
  { key: 'todayCheckIns', label: 'Checked In Today', color: '#34D399', fmt: v => v },
  { key: 'expiringSoon',  label: 'Expiring (7 days)', color: '#FB923C', fmt: v => v },
  { key: 'revenue',       label: 'Revenue (MTD)',     color: '#60A5FA', fmt: v => `₹${v.toLocaleString('en-IN')}` },
]

const SLOT_COLOR = { morning: YLW, evening: '#60A5FA' }
const PLAN_COLOR = { monthly: '#60A5FA', quarterly: YLW, annual: '#34D399' }

function StatCard({ label, value, color, loading }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: CRD, border: `1px solid ${BRD}` }}>
      <div className="text-3xl font-black mb-1 truncate" style={{ fontFamily: IBP, color }}>
        {loading ? <span className="opacity-30">—</span> : value}
      </div>
      <div className="text-xs" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.5)' }}>{label}</div>
    </div>
  )
}

function timeAgo(ts) {
  const diff = (Date.now() - new Date(ts)) / 60000
  if (diff < 1)  return 'just now'
  if (diff < 60) return `${Math.floor(diff)}m ago`
  return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

function daysUntil(date) {
  return Math.ceil((new Date(date) - new Date()) / 86400000)
}

export default function AdminDashboard() {
  const { data, isLoading } = useDashboard()
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white mb-1" style={{ fontFamily: BC }}>DASHBOARD</h1>
        <p className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>{today}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(({ key, label, color, fmt }) => (
          <StatCard key={key} label={label} value={data ? fmt(data[key]) : '—'} color={color} loading={isLoading} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent check-ins */}
        <div className="rounded-2xl p-6" style={{ background: CRD, border: `1px solid ${BRD}` }}>
          <h2 className="text-lg font-black text-white mb-4" style={{ fontFamily: BC }}>TODAY&apos;S CHECK-INS</h2>
          {isLoading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-10 rounded-xl animate-pulse" style={{ background: 'rgba(249,250,251,0.04)' }} />)}
            </div>
          ) : !data?.recentCheckIns?.length ? (
            <p className="text-sm py-4" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.3)' }}>No check-ins yet today.</p>
          ) : (
            <div className="space-y-2">
              {data.recentCheckIns.map(ci => (
                <div key={ci.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl"
                  style={{ background: 'rgba(249,250,251,0.04)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: YLW, color: '#0A0A0A', fontFamily: INT }}>
                      {ci.member?.full_name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <span className="text-sm font-medium text-white" style={{ fontFamily: INT }}>
                      {ci.member?.full_name ?? 'Unknown'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ color: SLOT_COLOR[ci.slot] ?? '#aaa', background: `${SLOT_COLOR[ci.slot]}18`, fontFamily: INT }}>
                      {ci.slot}
                    </span>
                    <span className="text-xs" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>
                      {timeAgo(ci.checked_in_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Expiring memberships */}
        <div className="rounded-2xl p-6" style={{ background: CRD, border: `1px solid ${BRD}` }}>
          <h2 className="text-lg font-black text-white mb-4" style={{ fontFamily: BC }}>EXPIRING SOON</h2>
          {isLoading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-10 rounded-xl animate-pulse" style={{ background: 'rgba(249,250,251,0.04)' }} />)}
            </div>
          ) : !data?.expiringList?.length ? (
            <p className="text-sm py-4" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.3)' }}>No memberships expiring in the next 7 days.</p>
          ) : (
            <div className="space-y-2">
              {data.expiringList.map(m => {
                const days = daysUntil(m.end_date)
                return (
                  <div key={m.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl"
                    style={{ background: 'rgba(249,250,251,0.04)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: '#FB923C20', color: '#FB923C', fontFamily: INT }}>
                        {m.member?.full_name?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white" style={{ fontFamily: INT }}>{m.member?.full_name ?? 'Unknown'}</p>
                        <p className="text-xs capitalize" style={{ fontFamily: INT, color: PLAN_COLOR[m.plan_type] ?? YLW }}>
                          {m.plan_type}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold"
                      style={{ fontFamily: IBP, color: days <= 2 ? '#F87171' : '#FB923C' }}>
                      {days === 0 ? 'Today' : `${days}d left`}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
