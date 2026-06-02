import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusCircle, X, ToggleLeft, ToggleRight } from 'lucide-react'
import { useSubscriptions, useAddSubscription, useToggleSubscription } from '../../hooks/useSubscriptions'
import { useMembers } from '../../hooks/useMembers'

const BC  = "'Barlow Condensed', sans-serif"
const INT = 'Inter, system-ui, sans-serif'
const IBP = "'IBM Plex Mono', ui-monospace, monospace"
const YLW = '#FACC15'
const CRD = '#1E1C18'
const BRD = 'rgba(250,204,21,0.1)'

const PLAN_CFG = {
  monthly:   { label: 'Monthly',   color: '#60A5FA', bg: 'rgba(96,165,250,0.1)'  },
  quarterly: { label: 'Quarterly', color: YLW,       bg: 'rgba(250,204,21,0.1)'  },
  annual:    { label: 'Annual',     color: '#34D399', bg: 'rgba(52,211,153,0.1)'  },
}

function daysLeft(end) { return Math.ceil((new Date(end) - new Date()) / 86400000) }
function fmtDate(d)    { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }) }
function fmtRs(v)      { return `₹${Number(v).toLocaleString('en-IN')}` }

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
        style={{ fontFamily: INT, color: 'rgba(249,250,251,0.5)' }}>
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const inp = {
  className: 'w-full px-4 py-2.5 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none transition-colors',
  style: { fontFamily: INT, background: 'rgba(249,250,251,0.04)', border: '1px solid rgba(250,204,21,0.15)' },
  onFocus: e => { e.target.style.borderColor = 'rgba(250,204,21,0.5)' },
  onBlur:  e => { e.target.style.borderColor = 'rgba(250,204,21,0.15)' },
}

function AddPlanModal({ open, onClose }) {
  const blank = { member_id: '', plan_type: 'monthly', amount: '', start_date: new Date().toISOString().split('T')[0], notes: '' }
  const [form, setForm] = useState(blank)
  const [success, setSuccess] = useState(false)
  const { data: members = [] } = useMembers()
  const { mutate, isPending, error, reset } = useAddSubscription()
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    mutate(form, {
      onSuccess: () => {
        setSuccess(true)
        setTimeout(() => { setSuccess(false); setForm(blank); reset(); onClose() }, 1400)
      },
    })
  }
  const handleClose = () => { reset(); setSuccess(false); setForm(blank); onClose() }

  const selStyle = {
    className: 'w-full px-4 py-2.5 rounded-xl text-white text-sm focus:outline-none transition-colors',
    style: { fontFamily: INT, background: '#141414', border: '1px solid rgba(250,204,21,0.15)' },
    onFocus: e => { e.target.style.borderColor = 'rgba(250,204,21,0.5)' },
    onBlur:  e => { e.target.style.borderColor = 'rgba(250,204,21,0.15)' },
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
            onClick={handleClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-md rounded-2xl p-6"
              style={{ background: '#1E1C18', border: '1px solid rgba(250,204,21,0.2)', boxShadow: '0 0 80px rgba(0,0,0,0.7)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white" style={{ fontFamily: BC }}>ADD PLAN</h2>
                <button onClick={handleClose} className="p-1.5 rounded-lg text-gray-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {success ? (
                <div className="py-10 text-center">
                  <p className="text-5xl mb-3">✅</p>
                  <p className="text-xl font-black text-white" style={{ fontFamily: BC }}>PLAN ADDED!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Field label="Member" required>
                    <select value={form.member_id} onChange={set('member_id')} required {...selStyle}>
                      <option value="">Select member</option>
                      {members.map(m => <option key={m.id} value={m.id}>{m.full_name ?? m.id}</option>)}
                    </select>
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Plan" required>
                      <select value={form.plan_type} onChange={set('plan_type')} {...selStyle}>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annual">Annual</option>
                      </select>
                    </Field>
                    <Field label="Amount (₹)" required>
                      <input type="number" value={form.amount} onChange={set('amount')} required min="1"
                        placeholder="e.g. 1200" {...inp} />
                    </Field>
                  </div>
                  <Field label="Start Date" required>
                    <input type="date" value={form.start_date} onChange={set('start_date')} required {...inp} />
                  </Field>
                  <Field label="Notes">
                    <input value={form.notes} onChange={set('notes')} placeholder="Optional note" {...inp} />
                  </Field>
                  {error && <p className="text-red-400 text-sm" style={{ fontFamily: INT }}>{error.message}</p>}
                  <button type="submit" disabled={isPending}
                    className="w-full py-3 rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2 mt-2 transition-opacity hover:opacity-80"
                    style={{ fontFamily: INT, background: YLW, color: '#0A0A0A' }}>
                    {isPending
                      ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      : 'Add Plan'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function AdminSubscriptions() {
  const { data: subs = [], isLoading } = useSubscriptions()
  const { mutate: toggle }             = useToggleSubscription()
  const [filter, setFilter]            = useState('all')
  const [showModal, setShowModal]      = useState(false)

  const today = new Date()
  const nextWeek = new Date(); nextWeek.setDate(nextWeek.getDate() + 7)

  const stats = useMemo(() => ({
    monthly:   subs.filter(s => s.is_active && s.plan_type === 'monthly').length,
    quarterly: subs.filter(s => s.is_active && s.plan_type === 'quarterly').length,
    annual:    subs.filter(s => s.is_active && s.plan_type === 'annual').length,
    expiring:  subs.filter(s => s.is_active && new Date(s.end_date) <= nextWeek && new Date(s.end_date) >= today).length,
  }), [subs])

  const filtered = useMemo(() => subs.filter(s => {
    if (filter === 'active')   return s.is_active && new Date(s.end_date) >= today
    if (filter === 'expired')  return !s.is_active || new Date(s.end_date) < today
    if (filter === 'expiring') return s.is_active && new Date(s.end_date) <= nextWeek && new Date(s.end_date) >= today
    return true
  }), [subs, filter])

  return (
    <div className="max-w-7xl mx-auto">
      <AddPlanModal open={showModal} onClose={() => setShowModal(false)} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-black text-white mb-1" style={{ fontFamily: BC }}>SUBSCRIPTIONS</h1>
          <p className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>
            Manage membership plans and renewals
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-80"
          style={{ fontFamily: INT, background: YLW, color: '#0A0A0A' }}>
          <PlusCircle className="w-4 h-4" /> Add Plan
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Monthly',       val: stats.monthly,   color: '#60A5FA' },
          { label: 'Quarterly',     val: stats.quarterly, color: YLW       },
          { label: 'Annual',        val: stats.annual,    color: '#34D399' },
          { label: 'Expiring Soon', val: stats.expiring,  color: '#FB923C' },
        ].map(({ label, val, color }) => (
          <div key={label} className="rounded-2xl p-5" style={{ background: CRD, border: `1px solid ${BRD}` }}>
            <p className="text-3xl font-black mb-1" style={{ fontFamily: IBP, color }}>{isLoading ? '—' : val}</p>
            <p className="text-xs" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.5)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {[['all','All'],['active','Active'],['expiring','Expiring'],['expired','Expired']].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)}
            className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ fontFamily: INT, background: filter === v ? YLW : CRD, color: filter === v ? '#0A0A0A' : 'rgba(249,250,251,0.55)', border: filter === v ? 'none' : `1px solid ${BRD}` }}>
            {l}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: CRD, border: `1px solid ${BRD}` }}>
        <div className="hidden md:grid px-5 py-3"
          style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 60px', borderBottom: `1px solid ${BRD}` }}>
          {['Member', 'Plan', 'Amount', 'Start', 'End', 'Status', ''].map(h => (
            <div key={h} className="text-[11px] font-semibold uppercase tracking-wider"
              style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>{h}</div>
          ))}
        </div>

        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1,2,3,4].map(i => <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: 'rgba(249,250,251,0.04)' }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.3)' }}>No subscriptions found.</p>
          </div>
        ) : filtered.map((s, i) => {
          const days     = daysLeft(s.end_date)
          const isActive = s.is_active && days >= 0
          const cfg      = PLAN_CFG[s.plan_type]
          return (
            <div key={s.id}
              className="hidden md:grid items-center px-5 py-3.5 transition-colors hover:bg-white/[0.025]"
              style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 60px', borderBottom: i < filtered.length - 1 ? `1px solid ${BRD}` : 'none' }}>
              {/* Member */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: YLW, color: '#0A0A0A', fontFamily: INT }}>
                  {s.member?.full_name?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate" style={{ fontFamily: INT }}>{s.member?.full_name ?? '—'}</p>
                  <p className="text-xs" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>{s.member?.phone ?? ''}</p>
                </div>
              </div>
              {/* Plan */}
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ fontFamily: INT, color: cfg?.color, background: cfg?.bg }}>{cfg?.label}</span>
              {/* Amount */}
              <span className="text-sm font-semibold" style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.85)' }}>{fmtRs(s.amount)}</span>
              {/* Start */}
              <span className="text-xs" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>{fmtDate(s.start_date)}</span>
              {/* End */}
              <span className="text-xs" style={{ fontFamily: INT, color: days <= 7 && isActive ? '#FB923C' : 'rgba(249,250,251,0.45)' }}>
                {fmtDate(s.end_date)}
                {isActive && <span className="ml-1">({days}d)</span>}
              </span>
              {/* Status */}
              <span className="text-xs font-semibold" style={{ fontFamily: INT, color: isActive ? '#34D399' : 'rgba(249,250,251,0.3)' }}>
                {isActive ? 'Active' : 'Expired'}
              </span>
              {/* Toggle */}
              <button onClick={() => toggle({ id: s.id, is_active: !s.is_active })}
                className="transition-colors hover:text-white" title={s.is_active ? 'Deactivate' : 'Activate'}
                style={{ color: 'rgba(249,250,251,0.3)' }}>
                {s.is_active ? <ToggleRight className="w-5 h-5 text-green-400" /> : <ToggleLeft className="w-5 h-5" />}
              </button>
            </div>
          )
        })}

        {/* Mobile cards */}
        {!isLoading && filtered.map((s, i) => {
          const days     = daysLeft(s.end_date)
          const isActive = s.is_active && days >= 0
          const cfg      = PLAN_CFG[s.plan_type]
          return (
            <div key={`mob-${s.id}`} className="md:hidden px-4 py-4"
              style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${BRD}` : 'none' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white" style={{ fontFamily: INT }}>{s.member?.full_name ?? '—'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: cfg?.color, background: cfg?.bg, fontFamily: INT }}>{cfg?.label}</span>
                    <span className="text-xs" style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.6)' }}>{fmtRs(s.amount)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ fontFamily: INT, color: isActive ? '#34D399' : 'rgba(249,250,251,0.3)' }}>{isActive ? 'Active' : 'Expired'}</p>
                  <p className="text-xs mt-0.5" style={{ fontFamily: INT, color: days <= 7 && isActive ? '#FB923C' : 'rgba(249,250,251,0.4)' }}>
                    {fmtDate(s.end_date)}{isActive ? ` · ${days}d` : ''}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
