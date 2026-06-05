import { Sun, Moon, CheckCircle } from 'lucide-react'
import { useSelfCheckIn } from '../../hooks/useAttendance'
import { useMemberAttendanceAll, calcStreak } from '../../hooks/useMemberData'

const BC  = "'Barlow Condensed', sans-serif"
const INT = 'Inter, system-ui, sans-serif'
const IBP = "'IBM Plex Mono', ui-monospace, monospace"
const YLW = '#FACC15'
const CRD = '#1E1C18'
const BRD = 'rgba(250,204,21,0.1)'

export default function MemberAttendance() {
  const { data: records = [], isLoading } = useMemberAttendanceAll()
  const { mutate: checkIn, isPending }    = useSelfCheckIn()

  const today   = new Date()
  const todayStr = today.toISOString().split('T')[0]

  const todayRecords   = records.filter(r => new Date(r.checked_in_at).toISOString().split('T')[0] === todayStr)
  const checkedMorning = todayRecords.some(r => r.slot === 'morning')
  const checkedEvening = todayRecords.some(r => r.slot === 'evening')

  // Calendar for current month
  const year      = today.getFullYear()
  const month     = today.getMonth()
  const daysInMo  = new Date(year, month + 1, 0).getDate()
  const firstDay  = new Date(year, month, 1).getDay()

  const attendedDays = new Set(
    records
      .filter(r => {
        const d = new Date(r.checked_in_at)
        return d.getFullYear() === year && d.getMonth() === month
      })
      .map(r => new Date(r.checked_in_at).getDate())
  )

  // Stats
  const streak       = calcStreak(records)
  const monthCount   = attendedDays.size
  const weekStart    = new Date(today); weekStart.setDate(today.getDate() - today.getDay())
  const weekCount    = records.filter(r => new Date(r.checked_in_at) >= weekStart).length

  const todayLabel = today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-5">
      <div>
        <h1 className="text-4xl font-black text-white mb-0.5" style={{ fontFamily: BC }}>ATTENDANCE</h1>
        <p className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>{todayLabel}</p>
      </div>

      {/* Check-in card */}
      <div className="rounded-2xl p-5" style={{ background: CRD, border: `1px solid rgba(250,204,21,0.2)` }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-4"
          style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>
          Mark Today&apos;s Attendance
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { slot: 'morning', label: 'Morning', Icon: Sun,  checked: checkedMorning, color: YLW       },
            { slot: 'evening', label: 'Evening', Icon: Moon, checked: checkedEvening, color: '#60A5FA' },
          ].map(({ slot, label, Icon, checked, color }) => (
            <button
              key={slot}
              onClick={() => !checked && checkIn({ slot })}
              disabled={checked || isPending}
              className="flex flex-col items-center gap-2 py-5 rounded-2xl font-bold transition-all duration-200 disabled:cursor-default"
              style={{
                fontFamily: INT,
                background: checked ? `${color}18` : 'rgba(249,250,251,0.04)',
                border: checked ? `1.5px solid ${color}` : `1.5px solid rgba(249,250,251,0.08)`,
                color: checked ? color : 'rgba(249,250,251,0.5)',
              }}
            >
              {checked
                ? <CheckCircle className="w-6 h-6" style={{ color }} />
                : <Icon className="w-6 h-6" />
              }
              <span className="text-sm">{label}</span>
              {checked && (
                <span className="text-[10px] font-normal" style={{ color: 'rgba(249,250,251,0.4)' }}>
                  Checked in ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'This Month', value: monthCount, color: YLW       },
          { label: 'This Week',  value: weekCount,  color: '#34D399' },
          { label: 'Streak',     value: streak,     color: '#FB923C' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl p-4 text-center"
            style={{ background: CRD, border: `1px solid ${BRD}` }}>
            <p className="text-2xl font-black mb-0.5" style={{ fontFamily: IBP, color }}>{value}</p>
            <p className="text-[10px]" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Monthly calendar */}
      <div className="rounded-2xl p-5" style={{ background: CRD, border: `1px solid ${BRD}` }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-4"
          style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>
          {today.toLocaleString('en-IN', { month: 'long', year: 'numeric' })}
        </p>
        <div className="grid grid-cols-7 gap-1.5 mb-2">
          {['S','M','T','W','T','F','S'].map((d, i) => (
            <p key={i} className="text-center text-[10px] font-semibold"
              style={{ fontFamily: INT, color: 'rgba(249,250,251,0.3)' }}>{d}</p>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMo }).map((_, i) => {
            const day      = i + 1
            const attended = attendedDays.has(day)
            const isToday  = day === today.getDate()
            const isFuture = day > today.getDate()
            return (
              <div key={day}
                className="aspect-square rounded-xl flex items-center justify-center text-xs font-semibold"
                style={{
                  fontFamily: INT,
                  background: attended ? YLW : isToday ? 'rgba(249,250,251,0.08)' : 'transparent',
                  color: attended ? '#0A0A0A' : isFuture ? 'rgba(249,250,251,0.15)' : isToday ? 'white' : 'rgba(249,250,251,0.5)',
                  border: isToday && !attended ? '1.5px solid rgba(250,204,21,0.4)' : 'none',
                }}>
                {day}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
