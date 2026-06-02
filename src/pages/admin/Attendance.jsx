import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Search, CheckCircle, Trash2, Sun, Moon } from 'lucide-react'
import { useTodayAttendance, useMarkAttendance, useDeleteAttendance } from '../../hooks/useAttendance'
import { useMembers } from '../../hooks/useMembers'

const BC  = "'Barlow Condensed', sans-serif"
const INT = 'Inter, system-ui, sans-serif'
const IBP = "'IBM Plex Mono', ui-monospace, monospace"
const YLW = '#FACC15'
const CRD = '#1E1C18'
const BRD = 'rgba(250,204,21,0.1)'

function fmtDate(d) {
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}
function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}
function isoDate(d) { return d.toISOString().split('T')[0] }

export default function AdminAttendance() {
  const [date, setDate]         = useState(new Date())
  const [memberSearch, setMemberSearch] = useState('')
  const [showPicker, setShowPicker]     = useState(false)

  const dateStr = isoDate(date)
  const { data: log = [], isLoading: logLoading } = useTodayAttendance(dateStr)
  const { data: members = [] }                    = useMembers()
  const { mutate: mark, isPending: marking }       = useMarkAttendance()
  const { mutate: remove }                         = useDeleteAttendance()

  const morningCount = log.filter(r => r.slot === 'morning').length
  const eveningCount = log.filter(r => r.slot === 'evening').length

  // Members not yet marked today (for the picker)
  const alreadyIn = new Set(log.map(r => r.member_id))
  const availableMembers = useMemo(() => {
    const q = memberSearch.toLowerCase()
    return members.filter(m =>
      m.is_active && !alreadyIn.has(m.id) &&
      (!q || m.full_name?.toLowerCase().includes(q) || m.phone?.includes(q))
    )
  }, [members, alreadyIn, memberSearch])

  const handleMark = (member_id, slot) => {
    mark({ member_id, slot }, { onSuccess: () => { setShowPicker(false); setMemberSearch('') } })
  }

  const prevDay = () => { const d = new Date(date); d.setDate(d.getDate() - 1); setDate(d) }
  const nextDay = () => { const d = new Date(date); d.setDate(d.getDate() + 1); setDate(d) }
  const isToday = isoDate(date) === isoDate(new Date())

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-black text-white mb-1" style={{ fontFamily: BC }}>ATTENDANCE</h1>
          <p className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>{fmtDate(date)}</p>
        </div>
        {isToday && (
          <button onClick={() => setShowPicker(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-80"
            style={{ fontFamily: INT, background: YLW, color: '#0A0A0A' }}>
            <CheckCircle className="w-4 h-4" /> Mark Attendance
          </button>
        )}
      </div>

      {/* Date nav */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={prevDay} className="p-2 rounded-xl transition-colors hover:bg-white/5"
          style={{ background: CRD, border: `1px solid ${BRD}`, color: 'rgba(249,250,251,0.6)' }}>
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={() => setDate(new Date())}
          className="text-sm px-4 py-2 rounded-xl transition-all"
          style={{ fontFamily: INT, background: isToday ? YLW : CRD, color: isToday ? '#0A0A0A' : 'rgba(249,250,251,0.55)', border: isToday ? 'none' : `1px solid ${BRD}` }}>
          Today
        </button>
        <button onClick={nextDay} disabled={isToday}
          className="p-2 rounded-xl transition-colors hover:bg-white/5 disabled:opacity-40"
          style={{ background: CRD, border: `1px solid ${BRD}`, color: 'rgba(249,250,251,0.6)' }}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Slot summary */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {[
          { label: 'Morning', count: morningCount, color: YLW,       Icon: Sun  },
          { label: 'Evening', count: eveningCount, color: '#60A5FA', Icon: Moon },
        ].map(({ label, count, color, Icon }) => (
          <div key={label} className="rounded-2xl p-5 flex items-center gap-4"
            style={{ background: CRD, border: `1px solid ${BRD}` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}18` }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <p className="text-3xl font-black" style={{ fontFamily: IBP, color }}>{count}</p>
              <p className="text-xs" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>{label} check-ins</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mark attendance picker */}
      <AnimatePresence>
        {showPicker && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl p-5 mb-6" style={{ background: CRD, border: `1px solid rgba(250,204,21,0.25)` }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-white" style={{ fontFamily: BC }}>MARK ATTENDANCE</h3>
              <button onClick={() => setShowPicker(false)} className="text-gray-500 hover:text-white transition-colors">
                ✕
              </button>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: 'rgba(249,250,251,0.3)' }} />
              <input value={memberSearch} onChange={e => setMemberSearch(e.target.value)}
                placeholder="Search member…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none"
                style={{ fontFamily: INT, background: 'rgba(249,250,251,0.04)', border: `1px solid ${BRD}` }} />
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableMembers.length === 0 ? (
                <p className="text-sm text-center py-4" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.3)' }}>
                  {memberSearch ? 'No matching members' : 'All active members already marked in today!'}
                </p>
              ) : availableMembers.map(m => (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: 'rgba(249,250,251,0.04)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: YLW, color: '#0A0A0A', fontFamily: INT }}>
                      {m.full_name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white" style={{ fontFamily: INT }}>{m.full_name}</p>
                      <p className="text-xs" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>{m.phone ?? ''}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {['morning', 'evening'].map(slot => (
                      <button key={slot} onClick={() => handleMark(m.id, slot)} disabled={marking}
                        className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-opacity hover:opacity-80 disabled:opacity-50 capitalize"
                        style={{ fontFamily: INT, background: slot === 'morning' ? 'rgba(250,204,21,0.15)' : 'rgba(96,165,250,0.15)', color: slot === 'morning' ? YLW : '#60A5FA' }}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Log */}
      <div className="rounded-2xl overflow-hidden" style={{ background: CRD, border: `1px solid ${BRD}` }}>
        <div className="px-5 py-3 border-b" style={{ borderColor: BRD }}>
          <h2 className="text-base font-black text-white" style={{ fontFamily: BC }}>
            LOG · {log.length} {log.length === 1 ? 'ENTRY' : 'ENTRIES'}
          </h2>
        </div>
        {logLoading ? (
          <div className="p-4 space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: 'rgba(249,250,251,0.04)' }} />)}
          </div>
        ) : log.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.3)' }}>
              No attendance recorded for this day.
            </p>
          </div>
        ) : (
          log.map((r, i) => (
            <div key={r.id} className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-white/[0.025]"
              style={{ borderBottom: i < log.length - 1 ? `1px solid ${BRD}` : 'none' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: r.slot === 'morning' ? 'rgba(250,204,21,0.15)' : 'rgba(96,165,250,0.15)', color: r.slot === 'morning' ? YLW : '#60A5FA', fontFamily: INT }}>
                  {r.member?.full_name?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div>
                  <p className="text-sm font-medium text-white" style={{ fontFamily: INT }}>
                    {r.member?.full_name ?? 'Unknown'}
                  </p>
                  <p className="text-xs" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>
                    {r.member?.phone ?? ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs px-2.5 py-1 rounded-full capitalize"
                  style={{ fontFamily: INT, color: r.slot === 'morning' ? YLW : '#60A5FA', background: r.slot === 'morning' ? 'rgba(250,204,21,0.1)' : 'rgba(96,165,250,0.1)' }}>
                  {r.slot}
                </span>
                <span className="text-xs" style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.35)' }}>
                  {fmtTime(r.checked_in_at)}
                </span>
                {isToday && (
                  <button onClick={() => remove(r.id)}
                    className="p-1.5 rounded-lg transition-colors text-gray-600 hover:text-red-400"
                    title="Undo">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
