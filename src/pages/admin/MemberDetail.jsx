import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Loader, Plus, CheckCircle, XCircle } from 'lucide-react'
import { useMember, useUpdateMember, useAddTrainerNote } from '../../hooks/useMembers'
import { useMemberAttendance } from '../../hooks/useAttendance'
import { useAddSubscription } from '../../hooks/useSubscriptions'

const BC  = "'Barlow Condensed', sans-serif"
const INT = 'Inter, system-ui, sans-serif'
const IBP = "'IBM Plex Mono', ui-monospace, monospace"
const YLW = '#FACC15'
const CRD = '#1E1C18'
const BRD = 'rgba(250,204,21,0.1)'

const GOALS = [
  { value: 'weight_loss',     label: 'Weight Loss'          },
  { value: 'muscle_gain',     label: 'Muscle Gain'          },
  { value: 'general_fitness', label: 'General Fitness'      },
  { value: 'maintenance',     label: 'Maintenance'          },
  { value: 'athletic',        label: 'Athletic Performance' },
  { value: 'rehab',           label: 'Rehab / Recovery'     },
]

function fmtDate(d)  { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) }
function fmtRs(v)    { return `₹${Number(v).toLocaleString('en-IN')}` }
function daysLeft(d) { return Math.ceil((new Date(d) - new Date()) / 86400000) }

const PLAN_COLOR = { monthly: '#60A5FA', quarterly: YLW, annual: '#34D399' }

function Field({ label, children }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>{label}</p>
      {children}
    </div>
  )
}

const editInp = {
  className: 'w-full px-3 py-2 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none transition-colors',
  style: { fontFamily: INT, background: 'rgba(249,250,251,0.04)', border: '1px solid rgba(250,204,21,0.12)' },
  onFocus: e => { e.target.style.borderColor = 'rgba(250,204,21,0.45)' },
  onBlur:  e => { e.target.style.borderColor = 'rgba(250,204,21,0.12)' },
}
const selStyle = {
  className: 'w-full px-3 py-2 rounded-xl text-white text-sm focus:outline-none transition-colors',
  style: { fontFamily: INT, background: '#141414', border: '1px solid rgba(250,204,21,0.12)' },
  onFocus: e => { e.target.style.borderColor = 'rgba(250,204,21,0.45)' },
  onBlur:  e => { e.target.style.borderColor = 'rgba(250,204,21,0.12)' },
}

// ── Attendance calendar this month ───────────────────────────────
function AttendanceCalendar({ memberId }) {
  const { data: records = [] } = useMemberAttendance(memberId)
  const now      = new Date()
  const year     = now.getFullYear()
  const month    = now.getMonth()
  const daysInMo = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay() // 0=Sun

  const attendedDays = new Set(
    records.map(r => new Date(r.checked_in_at).getDate())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>
          {now.toLocaleString('en-IN', { month: 'long', year: 'numeric' })}
        </p>
        <span className="text-xs font-semibold" style={{ fontFamily: IBP, color: YLW }}>
          {attendedDays.size} / {now.getDate()} days
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} className="text-center text-[10px]" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.3)' }}>{d}</div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMo }).map((_, i) => {
          const day = i + 1
          const attended = attendedDays.has(day)
          const isFuture = day > now.getDate()
          return (
            <div key={day} className="aspect-square rounded-lg flex items-center justify-center text-xs font-medium"
              style={{
                fontFamily: INT,
                background: attended ? YLW : isFuture ? 'transparent' : 'rgba(249,250,251,0.04)',
                color: attended ? '#0A0A0A' : isFuture ? 'rgba(249,250,251,0.15)' : 'rgba(249,250,251,0.45)',
              }}>
              {day}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function AdminMemberDetail() {
  const { id } = useParams()
  const { data: member, isLoading } = useMember(id)
  const { mutate: updateMember, isPending: saving, error: saveError } = useUpdateMember()
  const { mutate: addNote, isPending: addingNote }     = useAddTrainerNote()
  const { mutate: addPlan, isPending: addingPlan }     = useAddSubscription()

  const [form, setForm]       = useState({})
  const [dirty, setDirty]     = useState(false)
  const [noteText, setNoteText] = useState('')
  const [showAddPlan, setShowAddPlan] = useState(false)
  const [planForm, setPlanForm] = useState({ plan_type: 'monthly', amount: '', start_date: new Date().toISOString().split('T')[0] })

  useEffect(() => {
    if (member) {
      setForm({
        full_name:          member.full_name ?? '',
        phone:              member.phone ?? '',
        gender:             member.gender ?? '',
        date_of_birth:      member.date_of_birth ?? '',
        goal:               member.goal ?? '',
        slot:               member.slot ?? '',
        can_create_routine: member.can_create_routine ?? false,
        is_active:          member.is_active ?? true,
      })
      setDirty(false)
    }
  }, [member])

  const setF = k => e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [k]: val }))
    setDirty(true)
  }

  const handleSave = () => updateMember({ id, ...form }, { onSuccess: () => setDirty(false) })

  const handleAddNote = e => {
    e.preventDefault()
    if (!noteText.trim()) return
    addNote({ member_id: id, note: noteText.trim() }, { onSuccess: () => setNoteText('') })
  }

  const handleAddPlan = e => {
    e.preventDefault()
    addPlan({ ...planForm, member_id: id }, {
      onSuccess: () => { setShowAddPlan(false); setPlanForm({ plan_type: 'monthly', amount: '', start_date: new Date().toISOString().split('T')[0] }) }
    })
  }

  const activePlan = member?.memberships?.find(m => m.is_active && daysLeft(m.end_date) >= 0)
  const activeRoutine = member?.routines?.find(r => r.is_active)

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!member) return (
    <div className="max-w-4xl mx-auto">
      <Link to="/admin/members" className="inline-flex items-center gap-2 text-sm mb-4 hover:text-white transition-colors"
        style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <p className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.5)' }}>Member not found.</p>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto">
      <Link to="/admin/members" className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:text-white"
        style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>
        <ArrowLeft className="w-4 h-4" /> Back to Members
      </Link>

      {/* ── Profile header ── */}
      <div className="flex items-center gap-5 mb-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black flex-shrink-0"
          style={{ background: YLW, color: '#0A0A0A', fontFamily: BC }}>
          {member.full_name?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div>
          <h1 className="text-3xl font-black text-white mb-0.5" style={{ fontFamily: BC }}>
            {member.full_name ?? 'Unnamed Member'}
          </h1>
          <p className="text-xs" style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.35)' }}>
            Joined {fmtDate(member.created_at)}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">

        {/* ── Left column (profile edit + attendance) ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Profile edit */}
          <div className="rounded-2xl p-6" style={{ background: CRD, border: `1px solid ${BRD}` }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black text-white" style={{ fontFamily: BC }}>PROFILE</h2>
              {dirty && (
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-opacity hover:opacity-80"
                  style={{ fontFamily: INT, background: YLW, color: '#0A0A0A' }}>
                  {saving ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save
                </button>
              )}
            </div>

            {saveError && (
              <p className="text-sm mb-4 px-3 py-2 rounded-xl" style={{ fontFamily: INT, color: '#F87171', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }}>
                Save failed: {saveError.message}
              </p>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full Name">
                <input value={form.full_name ?? ''} onChange={setF('full_name')} {...editInp} />
              </Field>
              <Field label="Phone">
                <input value={form.phone ?? ''} onChange={setF('phone')} type="tel" {...editInp} />
              </Field>
              <Field label="Goal">
                <select value={form.goal ?? ''} onChange={setF('goal')} {...selStyle}>
                  <option value="">—</option>
                  {GOALS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
              </Field>
              <Field label="Slot">
                <select value={form.slot ?? ''} onChange={setF('slot')} {...selStyle}>
                  <option value="">—</option>
                  <option value="morning">Morning</option>
                  <option value="evening">Evening</option>
                  <option value="both">Both</option>
                </select>
              </Field>
              <Field label="Gender">
                <select value={form.gender ?? ''} onChange={setF('gender')} {...selStyle}>
                  <option value="">—</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </Field>
              <Field label="Date of Birth">
                <input type="date" value={form.date_of_birth ?? ''} onChange={setF('date_of_birth')} {...editInp} />
              </Field>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6 mt-5 pt-5" style={{ borderTop: `1px solid ${BRD}` }}>
              {[
                { key: 'is_active',          label: 'Active Member' },
                { key: 'can_create_routine', label: 'Can Build Own Routine' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={form[key] ?? false} onChange={setF(key)} className="sr-only" />
                  <div className="w-10 h-5 rounded-full relative transition-colors"
                    style={{ background: form[key] ? YLW : 'rgba(249,250,251,0.1)' }}>
                    <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                      style={{ left: form[key] ? 'calc(100% - 18px)' : '2px' }} />
                  </div>
                  <span className="text-xs font-medium" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.7)' }}>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Attendance this month */}
          <div className="rounded-2xl p-6" style={{ background: CRD, border: `1px solid ${BRD}` }}>
            <h2 className="text-lg font-black text-white mb-4" style={{ fontFamily: BC }}>ATTENDANCE</h2>
            <AttendanceCalendar memberId={id} />
          </div>

          {/* Trainer Notes */}
          <div className="rounded-2xl p-6" style={{ background: CRD, border: `1px solid ${BRD}` }}>
            <h2 className="text-lg font-black text-white mb-4" style={{ fontFamily: BC }}>TRAINER NOTES</h2>

            <form onSubmit={handleAddNote} className="flex gap-3 mb-5">
              <input value={noteText} onChange={e => setNoteText(e.target.value)}
                placeholder="Add a private note about this member…"
                className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none"
                style={{ fontFamily: INT, background: 'rgba(249,250,251,0.04)', border: `1px solid ${BRD}` }} />
              <button type="submit" disabled={addingNote || !noteText.trim()}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 transition-opacity hover:opacity-80 flex-shrink-0"
                style={{ fontFamily: INT, background: YLW, color: '#0A0A0A' }}>
                {addingNote ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              </button>
            </form>

            {!member.trainer_notes?.length ? (
              <p className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.3)' }}>No notes yet.</p>
            ) : (
              <div className="space-y-3">
                {[...member.trainer_notes].reverse().map(n => (
                  <div key={n.id} className="p-3 rounded-xl" style={{ background: 'rgba(249,250,251,0.04)' }}>
                    <p className="text-sm text-white" style={{ fontFamily: INT }}>{n.note}</p>
                    <p className="text-xs mt-1" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.3)' }}>
                      {fmtDate(n.created_at)} · {n.admin?.full_name ?? 'Admin'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right column (membership + routine) ── */}
        <div className="space-y-4">

          {/* Membership */}
          <div className="rounded-2xl p-5" style={{ background: CRD, border: `1px solid ${BRD}` }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-white" style={{ fontFamily: BC }}>MEMBERSHIP</h2>
              <button onClick={() => setShowAddPlan(v => !v)}
                className="p-1.5 rounded-lg transition-colors text-gray-500 hover:text-yellow-400">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {activePlan ? (
              <div className="rounded-xl p-4 mb-4" style={{ background: 'rgba(250,204,21,0.06)', border: '1px solid rgba(250,204,21,0.2)' }}>
                <p className="text-xs uppercase tracking-wider mb-2" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>Active Plan</p>
                <p className="text-2xl font-black capitalize mb-1" style={{ fontFamily: BC, color: PLAN_COLOR[activePlan.plan_type] ?? YLW }}>
                  {activePlan.plan_type}
                </p>
                <p className="text-lg font-black" style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.85)' }}>
                  {fmtRs(activePlan.amount)}
                </p>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div>
                    <p className="text-[10px]" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>Start</p>
                    <p className="text-xs font-medium text-white" style={{ fontFamily: INT }}>{fmtDate(activePlan.start_date)}</p>
                  </div>
                  <div>
                    <p className="text-[10px]" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>Expires</p>
                    <p className="text-xs font-medium" style={{ fontFamily: INT, color: daysLeft(activePlan.end_date) <= 7 ? '#FB923C' : 'white' }}>
                      {fmtDate(activePlan.end_date)} · {daysLeft(activePlan.end_date)}d
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl p-4 mb-4 text-center" style={{ background: 'rgba(249,250,251,0.04)' }}>
                <XCircle className="w-6 h-6 mx-auto mb-2" style={{ color: 'rgba(249,250,251,0.2)' }} />
                <p className="text-xs" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>No active plan</p>
              </div>
            )}

            {/* Add plan inline form */}
            {showAddPlan && (
              <motion.form initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                onSubmit={handleAddPlan} className="space-y-3 pt-3" style={{ borderTop: `1px solid ${BRD}` }}>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>Add New Plan</p>
                <select value={planForm.plan_type} onChange={e => setPlanForm(f => ({ ...f, plan_type: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl text-white text-sm focus:outline-none"
                  style={{ fontFamily: INT, background: '#141414', border: `1px solid ${BRD}` }}>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annual">Annual</option>
                </select>
                <input type="number" value={planForm.amount} onChange={e => setPlanForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="Amount (₹)" required min="1"
                  className="w-full px-3 py-2 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none"
                  style={{ fontFamily: INT, background: 'rgba(249,250,251,0.04)', border: `1px solid ${BRD}` }} />
                <input type="date" value={planForm.start_date} onChange={e => setPlanForm(f => ({ ...f, start_date: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl text-white text-sm focus:outline-none"
                  style={{ fontFamily: INT, background: 'rgba(249,250,251,0.04)', border: `1px solid ${BRD}` }} />
                <button type="submit" disabled={addingPlan || !planForm.amount}
                  className="w-full py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 transition-opacity hover:opacity-80"
                  style={{ fontFamily: INT, background: YLW, color: '#0A0A0A' }}>
                  {addingPlan ? 'Saving…' : 'Confirm Plan'}
                </button>
              </motion.form>
            )}

            {/* Past memberships */}
            {member.memberships?.filter(m => !activePlan || m.id !== activePlan.id).length > 0 && (
              <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${BRD}` }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>History</p>
                <div className="space-y-2">
                  {member.memberships.filter(m => !activePlan || m.id !== activePlan.id).map(m => (
                    <div key={m.id} className="flex items-center justify-between">
                      <span className="text-xs capitalize" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>{m.plan_type}</span>
                      <span className="text-xs" style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.35)' }}>{fmtRs(m.amount)}</span>
                      <span className="text-xs" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.3)' }}>{fmtDate(m.end_date)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Routine */}
          <div className="rounded-2xl p-5" style={{ background: CRD, border: `1px solid ${BRD}` }}>
            <h2 className="text-lg font-black text-white mb-4" style={{ fontFamily: BC }}>ROUTINE</h2>
            {activeRoutine ? (
              <div>
                <p className="text-sm font-semibold text-white mb-1" style={{ fontFamily: INT }}>{activeRoutine.name}</p>
                <p className="text-xs mb-3" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>
                  {activeRoutine.routine_days?.length ?? 0} days ·{' '}
                  {activeRoutine.routine_days?.reduce((s, d) => s + (d.exercises?.length ?? 0), 0) ?? 0} exercises
                </p>
                <Link to={`/admin/routines/${activeRoutine.id}`}
                  className="inline-flex items-center gap-2 text-xs font-semibold transition-colors hover:text-white"
                  style={{ fontFamily: INT, color: YLW }}>
                  Open Builder →
                </Link>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs mb-3" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>No routine assigned</p>
                <Link to="/admin/routines"
                  className="inline-flex items-center gap-2 text-xs font-semibold transition-opacity hover:opacity-80 px-3 py-2 rounded-xl"
                  style={{ fontFamily: INT, background: YLW, color: '#0A0A0A' }}>
                  <Plus className="w-3.5 h-3.5" /> Assign Routine
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
