import { CheckCircle } from 'lucide-react'

const BC  = "'Barlow Condensed', sans-serif"
const INT = 'Inter, system-ui, sans-serif'
const YLW = '#FACC15'
const CRD = '#1E1C18'
const BRD = 'rgba(250,204,21,0.1)'

export default function MemberAttendance() {
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      <h1 className="text-4xl font-black text-white mb-1" style={{ fontFamily: BC }}>ATTENDANCE</h1>
      <p className="text-sm mb-6" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>
        {today}
      </p>

      {/* Check-in button */}
      <div
        className="rounded-2xl p-6 mb-6 flex flex-col items-center gap-4"
        style={{ background: CRD, border: `1px solid ${BRD}` }}
      >
        <p className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.5)' }}>
          Mark your attendance for today
        </p>
        <div className="flex gap-3 w-full">
          {['Morning', 'Evening'].map(slot => (
            <button
              key={slot}
              className="flex-1 py-3 rounded-xl text-sm font-bold transition-opacity hover:opacity-80"
              style={{ fontFamily: INT, background: YLW, color: '#0A0A0A' }}
            >
              <CheckCircle className="w-4 h-4 inline mr-2" />
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* Consistency stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'This Month', val: '—' },
          { label: 'This Week',  val: '—' },
          { label: 'All Time',   val: '—' },
        ].map(({ label, val }) => (
          <div key={label} className="rounded-2xl p-4 text-center" style={{ background: CRD, border: `1px solid ${BRD}` }}>
            <p className="text-xl font-black mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace", color: YLW }}>{val}</p>
            <p className="text-[10px]" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Calendar heatmap placeholder */}
      <div className="rounded-2xl p-5" style={{ background: CRD, border: `1px solid ${BRD}` }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>
          Monthly View
        </p>
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-md"
              style={{ background: 'rgba(249,250,251,0.05)' }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
