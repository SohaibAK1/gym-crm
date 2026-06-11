import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusCircle, X, TrendingUp, Loader } from 'lucide-react'
import { useBodyStats, useLogBodyStats } from '../../hooks/useMemberData'
import { friendlyError } from '../../lib/errors'

const BC  = "'Barlow Condensed', sans-serif"
const INT = 'Inter, system-ui, sans-serif'
const IBP = "'IBM Plex Mono', ui-monospace, monospace"
const YLW = '#FACC15'
const CRD = '#1E1C18'
const BRD = 'rgba(250,204,21,0.1)'

const METRICS = [
  { key: 'weight_kg',    label: 'Weight',   unit: 'kg',  color: YLW         },
  { key: 'chest_cm',     label: 'Chest',    unit: 'cm',  color: '#34D399'   },
  { key: 'waist_cm',     label: 'Waist',    unit: 'cm',  color: '#FB923C'   },
  { key: 'bicep_cm',     label: 'Bicep',    unit: 'cm',  color: '#60A5FA'   },
]

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })
}

// Simple bar chart using divs
function WeightChart({ data }) {
  if (data.length === 0) return null
  const values  = data.map(d => parseFloat(d.weight_kg)).filter(Boolean)
  if (values.length === 0) return null
  const min     = Math.min(...values)
  const max     = Math.max(...values)
  const range   = max - min || 1
  const last12  = data.slice(0, 12).reverse()   // take 12 most recent, show oldest→newest

  return (
    <div className="rounded-2xl p-5" style={{ background: CRD, border: `1px solid ${BRD}` }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider"
          style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>Weight Trend</p>
        <p className="text-xs" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>
          Last {last12.length} entries
        </p>
      </div>
      <div className="flex items-end gap-1 h-28">
        {last12.map((d, i) => {
          const v   = parseFloat(d.weight_kg)
          const pct = ((v - min) / range) * 80 + 20   // 20% min height
          return (
            <div key={d.id} className="flex-1 flex flex-col items-center gap-1 group relative">
              <div className="w-full rounded-t-md transition-all duration-300"
                style={{ height: `${pct}%`, background: i === last12.length - 1 ? YLW : 'rgba(250,204,21,0.3)' }} />
              {/* Tooltip on last bar */}
              {i === last12.length - 1 && (
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{ fontFamily: IBP, background: YLW, color: '#0A0A0A', whiteSpace: 'nowrap' }}>
                  {v} kg
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className="flex justify-between mt-2">
        <p className="text-[10px]" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.3)' }}>
          {fmtDate(last12[0]?.logged_at)}
        </p>
        <p className="text-[10px]" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.3)' }}>
          {fmtDate(last12[last12.length - 1]?.logged_at)}
        </p>
      </div>
    </div>
  )
}

const inp = {
  className: 'w-full px-4 py-3 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none transition-colors',
  style: { fontFamily: INT, background: 'rgba(249,250,251,0.04)', border: '1px solid rgba(250,204,21,0.15)' },
  onFocus: e => { e.target.style.borderColor = 'rgba(250,204,21,0.5)' },
  onBlur:  e => { e.target.style.borderColor = 'rgba(250,204,21,0.15)' },
}

function LogForm({ onClose }) {
  const STAT_FIELDS = [
    { k: 'weight_kg',    label: 'Weight (kg)',  type: 'number', min: 0, max: 500  },
    { k: 'chest_cm',     label: 'Chest (cm)',   type: 'number', min: 0, max: 300  },
    { k: 'waist_cm',     label: 'Waist (cm)',   type: 'number', min: 0, max: 300  },
    { k: 'bicep_cm',     label: 'Bicep (cm)',   type: 'number', min: 0, max: 100  },
    { k: 'body_fat_pct', label: 'Body Fat (%)', type: 'number', min: 0, max: 100  },
    { k: 'hips_cm',      label: 'Hips (cm)',    type: 'number', min: 0, max: 300  },
  ]
  const blank = { logged_at: new Date().toISOString().split('T')[0], weight_kg: '', height_cm: '', chest_cm: '', waist_cm: '', hips_cm: '', bicep_cm: '', body_fat_pct: '', notes: '' }
  const [form, setForm]   = useState(blank)
  const [done, setDone]   = useState(false)
  const { mutate, isPending, error, reset } = useLogBodyStats()
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    mutate(form, {
      onSuccess: () => { setDone(true); setTimeout(() => { setDone(false); reset(); setForm(blank); onClose() }, 1200) }
    })
  }

  if (done) return (
    <div className="py-8 text-center">
      <p className="text-4xl mb-2">✅</p>
      <p className="text-lg font-black text-white" style={{ fontFamily: BC }}>STATS SAVED!</p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider mb-1" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>Date</p>
          <input type="date" value={form.logged_at} onChange={set('logged_at')} {...inp} />
        </div>
        {STAT_FIELDS.map(({ k, label, min, max }) => (
          <div key={k}>
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>{label}</p>
            <input type="number" step="0.1" min={min} max={max} value={form[k]} onChange={set(k)} {...inp} />
          </div>
        ))}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider mb-1" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>Notes</p>
        <input value={form.notes} onChange={set('notes')} placeholder="Optional note" maxLength={500} {...inp} />
      </div>
      {error && <p className="text-red-400 text-xs" style={{ fontFamily: INT }}>{friendlyError(error)}</p>}
      <button type="submit" disabled={isPending}
        className="w-full py-3 rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
        style={{ fontFamily: INT, background: YLW, color: '#0A0A0A' }}>
        {isPending ? <Loader className="w-4 h-4 animate-spin" /> : 'Save Measurements'}
      </button>
    </form>
  )
}

export default function MemberProgress() {
  const { data: stats = [], isLoading } = useBodyStats()
  const [showForm, setShowForm]         = useState(false)

  const latest = stats[0] ?? null

  return (
    <div className="px-4 pt-6 pb-6 max-w-lg mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white mb-0.5" style={{ fontFamily: BC }}>PROGRESS</h1>
          <p className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>
            Track your body measurements
          </p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-80"
          style={{ fontFamily: INT, background: showForm ? 'rgba(249,250,251,0.08)' : YLW, color: showForm ? 'rgba(249,250,251,0.7)' : '#0A0A0A' }}>
          {showForm ? <X className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Log Stats'}
        </button>
      </div>

      {/* Log form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl p-5" style={{ background: CRD, border: `1px solid rgba(250,204,21,0.2)` }}>
            <p className="text-lg font-black text-white mb-4" style={{ fontFamily: BC }}>LOG MEASUREMENTS</p>
            <LogForm onClose={() => setShowForm(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Latest stats grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1,2,3,4].map(i => <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: CRD }} />)}
        </div>
      ) : latest ? (
        <div>
          <p className="text-[10px] uppercase tracking-wider font-semibold mb-3"
            style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>
            Latest — {fmtDate(latest.logged_at)}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {METRICS.map(({ key, label, unit, color }) => (
              <div key={key} className="rounded-2xl p-4"
                style={{ background: CRD, border: `1px solid ${BRD}` }}>
                <p className="text-xs mb-1" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>{label}</p>
                <p className="text-2xl font-black" style={{ fontFamily: IBP, color }}>
                  {latest[key] != null
                    ? <>{latest[key]} <span className="text-sm font-normal" style={{ color: 'rgba(249,250,251,0.4)' }}>{unit}</span></>
                    : <span style={{ color: 'rgba(249,250,251,0.2)' }}>—</span>
                  }
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl py-12 flex flex-col items-center gap-3"
          style={{ background: CRD, border: `1px solid ${BRD}` }}>
          <TrendingUp className="w-10 h-10" style={{ color: 'rgba(249,250,251,0.15)' }} />
          <p className="text-base font-black text-white" style={{ fontFamily: BC }}>NO DATA YET</p>
          <p className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>
            Log your first measurement to start tracking progress.
          </p>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-80 mt-1"
            style={{ fontFamily: INT, background: YLW, color: '#0A0A0A' }}>
            <PlusCircle className="w-4 h-4" /> Log First Entry
          </button>
        </div>
      )}

      {/* Weight chart */}
      <WeightChart data={stats} />

      {/* History list */}
      {stats.length > 1 && (
        <div>
          <p className="text-[10px] uppercase tracking-wider font-semibold mb-3"
            style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>History</p>
          <div className="rounded-2xl overflow-hidden" style={{ background: CRD, border: `1px solid ${BRD}` }}>
            {stats.slice(1).map((s, i) => (
              <div key={s.id}
                className="flex items-center justify-between px-5 py-3.5"
                style={{ borderBottom: i < stats.length - 2 ? `1px solid ${BRD}` : 'none' }}>
                <p className="text-sm text-white" style={{ fontFamily: INT }}>{fmtDate(s.logged_at)}</p>
                <div className="flex items-center gap-4">
                  {s.weight_kg && (
                    <p className="text-sm font-semibold" style={{ fontFamily: IBP, color: YLW }}>{s.weight_kg} kg</p>
                  )}
                  {s.waist_cm && (
                    <p className="text-xs" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>
                      {s.waist_cm}cm waist
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
