import { PlusCircle } from 'lucide-react'

const BC  = "'Barlow Condensed', sans-serif"
const INT = 'Inter, system-ui, sans-serif'
const IBP = "'IBM Plex Mono', ui-monospace, monospace"
const YLW = '#FACC15'
const CRD = '#1E1C18'
const BRD = 'rgba(250,204,21,0.1)'

const METRICS = [
  { label: 'Weight',    unit: 'kg',  color: YLW         },
  { label: 'Chest',     unit: 'cm',  color: '#34D399'   },
  { label: 'Waist',     unit: 'cm',  color: '#FB923C'   },
  { label: 'Bicep',     unit: 'cm',  color: '#60A5FA'   },
]

export default function MemberProgress() {
  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-4xl font-black text-white mb-1" style={{ fontFamily: BC }}>PROGRESS</h1>
          <p className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>
            Track your body stats over time
          </p>
        </div>
        <button
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-opacity hover:opacity-80"
          style={{ fontFamily: INT, background: YLW, color: '#0A0A0A' }}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Log Stats
        </button>
      </div>

      {/* Latest stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {METRICS.map(({ label, unit, color }) => (
          <div key={label} className="rounded-2xl p-4" style={{ background: CRD, border: `1px solid ${BRD}` }}>
            <p className="text-xs mb-1" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>{label}</p>
            <p className="text-2xl font-black" style={{ fontFamily: IBP, color }}>
              — <span className="text-sm font-normal">{unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Chart placeholder */}
      <div className="rounded-2xl p-5" style={{ background: CRD, border: `1px solid ${BRD}` }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>
          Weight Trend
        </p>
        {/* Simple bar chart skeleton */}
        <div className="flex items-end gap-1.5 h-28">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t animate-pulse"
              style={{
                height: `${30 + Math.sin(i) * 20 + 20}%`,
                background: 'rgba(249,250,251,0.06)',
              }}
            />
          ))}
        </div>
        <p className="text-center text-xs mt-3" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.25)' }}>
          Log your first measurement to see your trend
        </p>
      </div>
    </div>
  )
}
