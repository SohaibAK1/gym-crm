import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus, Search, X, Eye, ChevronRight } from 'lucide-react'
import { useMembers, useCreateMember } from '../../hooks/useMembers'

const BC  = "'Barlow Condensed', sans-serif"
const INT = 'Inter, system-ui, sans-serif'
const YLW = '#FACC15'
const CRD = '#1E1C18'
const BRD = 'rgba(250,204,21,0.1)'

const GOALS = [
  { value: 'weight_loss',      label: 'Weight Loss'          },
  { value: 'muscle_gain',      label: 'Muscle Gain'          },
  { value: 'general_fitness',  label: 'General Fitness'      },
  { value: 'maintenance',      label: 'Maintenance'          },
  { value: 'athletic',         label: 'Athletic Performance' },
  { value: 'rehab',            label: 'Rehab / Recovery'     },
]

const PLAN_COLOR = { monthly: '#60A5FA', quarterly: YLW, annual: '#34D399' }

function getActivePlan(memberships) {
  return memberships?.find(m => m.is_active && new Date(m.end_date) >= new Date()) ?? null
}

function SlotBadge({ slot }) {
  if (!slot) return <span style={{ color: 'rgba(249,250,251,0.3)', fontSize: 12, fontFamily: INT }}>—</span>
  const cfg = {
    morning: { label: 'Morning', color: YLW,       bg: 'rgba(250,204,21,0.1)'  },
    evening: { label: 'Evening', color: '#60A5FA', bg: 'rgba(96,165,250,0.1)'  },
    both:    { label: 'Both',    color: '#34D399', bg: 'rgba(52,211,153,0.1)'  },
  }[slot] ?? { label: slot, color: '#aaa', bg: 'rgba(170,170,170,0.1)' }
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ color: cfg.color, background: cfg.bg, fontFamily: INT }}>
      {cfg.label}
    </span>
  )
}

function PlanBadge({ memberships }) {
  const plan = getActivePlan(memberships)
  if (!plan) return <span style={{ color: 'rgba(249,250,251,0.3)', fontSize: 12, fontFamily: INT }}>No Plan</span>
  const daysLeft = Math.ceil((new Date(plan.end_date) - new Date()) / 86400000)
  const color = PLAN_COLOR[plan.plan_type] ?? YLW
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-semibold capitalize" style={{ color, fontFamily: INT }}>{plan.plan_type}</span>
      <span className="text-xs" style={{ color: daysLeft <= 7 ? '#FB923C' : 'rgba(249,250,251,0.3)', fontFamily: INT }}>
        · {daysLeft}d
      </span>
    </div>
  )
}

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

function AddMemberModal({ open, onClose }) {
  const blank = { full_name: '', email: '', password: '', phone: '', goal: '', slot: '' }
  const [form, setForm]       = useState(blank)
  const [success, setSuccess] = useState(false)
  const { mutate, isPending, error, reset } = useCreateMember()

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
                <h2 className="text-2xl font-black text-white" style={{ fontFamily: BC }}>ADD MEMBER</h2>
                <button onClick={handleClose} className="p-1.5 rounded-lg text-gray-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {success ? (
                <div className="py-10 text-center">
                  <p className="text-5xl mb-3">✅</p>
                  <p className="text-xl font-black text-white" style={{ fontFamily: BC }}>MEMBER CREATED!</p>
                  <p className="text-sm mt-1" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.5)' }}>
                    They can now log in with their email &amp; password.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Field label="Full Name" required>
                    <input value={form.full_name} onChange={set('full_name')} required placeholder="Rahul Sharma" {...inp} />
                  </Field>
                  <Field label="Email" required>
                    <input type="email" value={form.email} onChange={set('email')} required placeholder="rahul@gmail.com" {...inp} />
                  </Field>
                  <Field label="Temp Password" required>
                    <input type="password" value={form.password} onChange={set('password')} required placeholder="Min 6 characters" {...inp} />
                  </Field>
                  <Field label="Phone">
                    <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" {...inp} />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Goal">
                      <select value={form.goal} onChange={set('goal')}
                        className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-colors"
                        style={{ fontFamily: INT, background: '#141414', color: form.goal ? 'white' : 'rgba(249,250,251,0.4)', border: '1px solid rgba(250,204,21,0.15)' }}
                        onFocus={e => e.target.style.borderColor = 'rgba(250,204,21,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(250,204,21,0.15)'}>
                        <option value="">Select</option>
                        {GOALS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                      </select>
                    </Field>
                    <Field label="Slot">
                      <select value={form.slot} onChange={set('slot')}
                        className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-colors"
                        style={{ fontFamily: INT, background: '#141414', color: form.slot ? 'white' : 'rgba(249,250,251,0.4)', border: '1px solid rgba(250,204,21,0.15)' }}
                        onFocus={e => e.target.style.borderColor = 'rgba(250,204,21,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(250,204,21,0.15)'}>
                        <option value="">Select</option>
                        <option value="morning">Morning</option>
                        <option value="evening">Evening</option>
                        <option value="both">Both</option>
                      </select>
                    </Field>
                  </div>

                  {error && (
                    <p className="text-red-400 text-sm" style={{ fontFamily: INT }}>{error.message}</p>
                  )}

                  <button type="submit" disabled={isPending}
                    className="w-full py-3 rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2 mt-2 transition-opacity hover:opacity-80"
                    style={{ fontFamily: INT, background: YLW, color: '#0A0A0A' }}>
                    {isPending
                      ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      : 'Create Member'}
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

export default function AdminMembers() {
  const { data: members = [], isLoading, error: membersError } = useMembers()
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('all')
  const [showModal, setShowModal] = useState(false)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return members
      .filter(m => filter === 'all' ? true : filter === 'active' ? m.is_active : !m.is_active)
      .filter(m => !q || m.full_name?.toLowerCase().includes(q) || m.phone?.includes(q))
  }, [members, search, filter])

  return (
    <div className="max-w-7xl mx-auto">
      <AddMemberModal open={showModal} onClose={() => setShowModal(false)} />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-black text-white mb-1" style={{ fontFamily: BC }}>MEMBERS</h1>
          <p className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>
            {members.length} total · {members.filter(m => m.is_active).length} active
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-80"
          style={{ fontFamily: INT, background: YLW, color: '#0A0A0A' }}>
          <UserPlus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: 'rgba(249,250,251,0.3)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or phone…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none"
            style={{ fontFamily: INT, background: CRD, border: `1px solid ${BRD}` }} />
        </div>
        <div className="flex gap-2">
          {[['all', 'All'], ['active', 'Active'], ['inactive', 'Inactive']].map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={{
                fontFamily: INT,
                background: filter === v ? YLW : CRD,
                color:      filter === v ? '#0A0A0A' : 'rgba(249,250,251,0.55)',
                border:     filter === v ? 'none' : `1px solid ${BRD}`,
              }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {membersError && (
        <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#F87171', fontFamily: INT }}>
          Query error: {membersError.message}
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: CRD, border: `1px solid ${BRD}` }}>
        {/* Desktop header */}
        <div className="hidden md:grid px-5 py-3"
          style={{ gridTemplateColumns: '2.2fr 1fr 1.2fr 1.5fr 1fr 40px', borderBottom: `1px solid ${BRD}` }}>
          {['Member', 'Slot', 'Goal', 'Plan', 'Joined', ''].map(h => (
            <div key={h} className="text-[11px] font-semibold uppercase tracking-wider"
              style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>{h}</div>
          ))}
        </div>

        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: 'rgba(249,250,251,0.04)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.3)' }}>
              {search ? `No results for "${search}"` : 'No members yet — add your first member above.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop rows */}
            {filtered.map((m, i) => (
              <div key={m.id}
                className="hidden md:grid items-center px-5 py-3.5 transition-colors hover:bg-white/[0.025]"
                style={{ gridTemplateColumns: '2.2fr 1fr 1.2fr 1.5fr 1fr 40px', borderBottom: i < filtered.length - 1 ? `1px solid ${BRD}` : 'none' }}>
                {/* Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: m.is_active ? YLW : 'rgba(249,250,251,0.08)', color: m.is_active ? '#0A0A0A' : 'rgba(249,250,251,0.4)', fontFamily: INT }}>
                    {m.full_name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate" style={{ fontFamily: INT }}>
                      {m.full_name ?? 'Unnamed'}
                    </p>
                    <p className="text-xs truncate" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>
                      {m.phone ?? '—'}
                    </p>
                  </div>
                </div>
                <SlotBadge slot={m.slot} />
                <span className="text-xs" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.55)' }}>
                  {GOALS.find(g => g.value === m.goal)?.label ?? '—'}
                </span>
                <PlanBadge memberships={m.memberships} />
                <span className="text-xs" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>
                  {new Date(m.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                </span>
                <Link to={`/admin/members/${m.id}`}
                  className="p-1.5 rounded-lg transition-colors hover:text-white"
                  style={{ color: 'rgba(249,250,251,0.3)' }}>
                  <Eye className="w-4 h-4" />
                </Link>
              </div>
            ))}

            {/* Mobile rows */}
            {filtered.map((m, i) => (
              <Link key={`mob-${m.id}`} to={`/admin/members/${m.id}`}
                className="md:hidden flex items-center justify-between px-4 py-4 transition-colors hover:bg-white/[0.025]"
                style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${BRD}` : 'none' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: m.is_active ? YLW : 'rgba(249,250,251,0.08)', color: m.is_active ? '#0A0A0A' : 'rgba(249,250,251,0.4)', fontFamily: INT }}>
                    {m.full_name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white" style={{ fontFamily: INT }}>{m.full_name ?? 'Unnamed'}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <SlotBadge slot={m.slot} />
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(249,250,251,0.3)' }} />
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
