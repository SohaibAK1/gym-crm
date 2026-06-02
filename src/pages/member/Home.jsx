import { useAuth } from '../../context/AuthContext'

const BC  = "'Barlow Condensed', sans-serif"
const INT = 'Inter, system-ui, sans-serif'
const IBP = "'IBM Plex Mono', ui-monospace, monospace"
const YLW = '#FACC15'
const CRD = '#1E1C18'
const BRD = 'rgba(250,204,21,0.1)'

export default function MemberHome() {
  const { profile } = useAuth()
  const firstName = profile?.full_name?.split(' ')[0] ?? 'Member'

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      {/* Greeting */}
      <div className="mb-6">
        <p className="text-sm mb-1" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.5)' }}>
          Good morning,
        </p>
        <h1 className="text-4xl font-black text-white" style={{ fontFamily: BC }}>
          {firstName.toUpperCase()} 💪
        </h1>
      </div>

      {/* Streak card */}
      <div
        className="rounded-2xl p-5 mb-4 flex items-center justify-between"
        style={{ background: CRD, border: `1px solid ${BRD}` }}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>
            Current Streak
          </p>
          <p className="text-4xl font-black" style={{ fontFamily: IBP, color: YLW }}>— days</p>
        </div>
        <div className="text-4xl">🔥</div>
      </div>

      {/* Membership badge */}
      <div
        className="rounded-2xl p-5 mb-4"
        style={{ background: CRD, border: `1px solid ${BRD}` }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>
          Membership
        </p>
        <div className="h-5 w-32 rounded animate-pulse" style={{ background: 'rgba(249,250,251,0.06)' }} />
      </div>

      {/* Today's workout */}
      <div
        className="rounded-2xl p-5 mb-4"
        style={{ background: CRD, border: `1px solid ${BRD}` }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>
          Today&apos;s Workout
        </p>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-10 rounded-xl animate-pulse" style={{ background: 'rgba(249,250,251,0.04)' }} />
          ))}
        </div>
      </div>

      {/* Announcements */}
      <div className="rounded-2xl p-5" style={{ background: CRD, border: `1px solid ${BRD}` }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>
          Announcements
        </p>
        <p className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.3)' }}>
          No announcements yet.
        </p>
      </div>
    </div>
  )
}
