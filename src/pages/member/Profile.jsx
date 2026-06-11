import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, Save, Loader, LogOut, ChevronRight, X, Check, KeyRound } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import { useMemberSubscription, useUpdateMemberProfile } from '../../hooks/useMemberData'
import { friendlyError } from '../../lib/errors'

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

const PLAN_COLOR = { monthly: '#60A5FA', quarterly: YLW, annual: '#34D399' }

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}
function fmtRs(v) { return `₹${Number(v).toLocaleString('en-IN')}` }
function daysLeft(d) { return Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000)) }

// ── Inline editable field ─────────────────────────────────────────
function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3.5"
      style={{ borderBottom: `1px solid ${BRD}` }}>
      <span className="text-xs font-semibold uppercase tracking-wider"
        style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>{label}</span>
      <span className="text-sm text-right max-w-[60%] truncate"
        style={{ fontFamily: INT, color: value ? 'rgba(249,250,251,0.85)' : 'rgba(249,250,251,0.25)' }}>
        {value || 'Not set'}
      </span>
    </div>
  )
}

const fieldStyle = {
  className: 'w-full px-3 py-2.5 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none transition-colors',
  style: { fontFamily: INT, background: 'rgba(249,250,251,0.05)', border: '1px solid rgba(250,204,21,0.18)' },
  onFocus: e => { e.target.style.borderColor = 'rgba(250,204,21,0.5)' },
  onBlur:  e => { e.target.style.borderColor = 'rgba(250,204,21,0.18)' },
}
const selStyle = {
  className: 'w-full px-3 py-2.5 rounded-xl text-white text-sm focus:outline-none transition-colors',
  style: { fontFamily: INT, background: '#141414', border: '1px solid rgba(250,204,21,0.18)' },
  onFocus: e => { e.target.style.borderColor = 'rgba(250,204,21,0.5)' },
  onBlur:  e => { e.target.style.borderColor = 'rgba(250,204,21,0.18)' },
}

function ChangePasswordSection({ userEmail }) {
  const [open,    setOpen]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [status,  setStatus]  = useState(null)
  const [form,    setForm]    = useState({ current: '', next: '', confirm: '' })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)
    if (form.next.length < 8)          { setStatus('New password must be at least 8 characters.'); return }
    if (form.next !== form.confirm)     { setStatus('New passwords do not match.'); return }
    if (form.next === form.current)     { setStatus('New password must differ from the current one.'); return }

    setLoading(true)
    const { error: verifyErr } = await supabase.auth.signInWithPassword({ email: userEmail, password: form.current })
    if (verifyErr) { setStatus('Current password is incorrect.'); setLoading(false); return }

    const { error: updateErr } = await supabase.auth.updateUser({ password: form.next })
    if (updateErr) {
      setStatus(friendlyError(updateErr))
    } else {
      setStatus('success')
      setForm({ current: '', next: '', confirm: '' })
      setOpen(false)
      setTimeout(() => setStatus(null), 4000)
    }
    setLoading(false)
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: CRD, border: `1px solid ${BRD}` }}>
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <KeyRound className="w-3.5 h-3.5" style={{ color: 'rgba(249,250,251,0.4)' }} />
          <p className="text-xs font-semibold uppercase tracking-wider"
            style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>Password</p>
        </div>
        <button onClick={() => { setOpen(v => !v); setStatus(null) }}
          className="text-xs font-semibold transition-opacity hover:opacity-70"
          style={{ fontFamily: INT, color: open ? 'rgba(249,250,251,0.4)' : YLW }}>
          {open ? 'Cancel' : 'Change'}
        </button>
      </div>

      {status === 'success' && (
        <p className="px-5 pb-4 text-xs font-semibold" style={{ fontFamily: INT, color: '#34D399' }}>
          ✓ Password updated successfully.
        </p>
      )}

      {!open && status !== 'success' && (
        <p className="px-5 pb-4 text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.2)' }}>
          ••••••••
        </p>
      )}

      <AnimatePresence>
        {open && (
          <motion.form
            key="pw-form"
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            onSubmit={handleSubmit}
            className="px-5 pb-5 space-y-3"
          >
            {[
              { k: 'current', label: 'Current Password',     ph: '••••••••',      min: 1   },
              { k: 'next',    label: 'New Password',          ph: 'Min 8 chars',   min: 8   },
              { k: 'confirm', label: 'Confirm New Password',  ph: '••••••••',      min: 8   },
            ].map(({ k, label, ph, min }) => (
              <div key={k}>
                <p className="text-[10px] uppercase tracking-wider mb-1"
                  style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>{label}</p>
                <input
                  type="password"
                  value={form[k]}
                  onChange={set(k)}
                  placeholder={ph}
                  required
                  minLength={min}
                  maxLength={128}
                  {...fieldStyle}
                />
              </div>
            ))}

            {status && status !== 'success' && (
              <p className="text-red-400 text-xs" style={{ fontFamily: INT }}>{status}</p>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
              style={{ fontFamily: INT, background: YLW, color: '#0A0A0A' }}>
              {loading
                ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                : 'Update Password'
              }
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function MemberProfile() {
  const { profile, user } = useAuth()
  const navigate     = useNavigate()
  const [editing, setEditing]     = useState(false)
  const [saved,   setSaved]       = useState(false)
  const [logoutConfirm, setLogoutConfirm] = useState(false)

  const [form, setForm] = useState({
    full_name:    '',
    phone:        '',
    date_of_birth:'',
    goal:         '',
    slot:         '',
  })

  const { data: memberships = [] } = useMemberSubscription()
  const { mutate: updateProfile, isPending, error: saveError } = useUpdateMemberProfile()

  useEffect(() => {
    if (profile) {
      setForm({
        full_name:     profile.full_name     ?? '',
        phone:         profile.phone         ?? '',
        date_of_birth: profile.date_of_birth ?? '',
        goal:          profile.goal          ?? '',
        slot:          profile.slot          ?? '',
      })
    }
  }, [profile])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSave = () => {
    updateProfile(form, {
      onSuccess: () => {
        setSaved(true)
        setEditing(false)
        setTimeout(() => setSaved(false), 2000)
      },
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const activePlan = memberships.find(m => m.is_active && daysLeft(m.end_date) > 0)
  const goalLabel  = GOALS.find(g => g.value === profile?.goal)?.label
  const slotLabel  = profile?.slot ? profile.slot.charAt(0).toUpperCase() + profile.slot.slice(1) : null
  const initials   = profile?.full_name
    ?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() ?? '?'

  return (
    <div className="max-w-lg mx-auto pb-6">

      {/* ── Hero ── */}
      <div
        className="relative px-4 pt-10 pb-8 flex flex-col items-center"
        style={{ background: 'linear-gradient(180deg, #1E1C18 0%, #0A0A0A 100%)' }}
      >
        {/* Avatar */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black mb-4 relative"
          style={{ background: YLW, color: '#0A0A0A', fontFamily: BC }}
        >
          {initials}
          {saved && (
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: '#34D399' }}
            >
              <Check className="w-3.5 h-3.5 text-white" />
            </motion.div>
          )}
        </div>

        {/* Name */}
        <h1 className="text-2xl font-black text-white mb-2 text-center" style={{ fontFamily: BC }}>
          {profile?.full_name ?? 'Your Name'}
        </h1>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap justify-center mb-3">
          {slotLabel && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ fontFamily: INT, color: profile.slot === 'morning' ? YLW : '#60A5FA', background: profile.slot === 'morning' ? 'rgba(250,204,21,0.12)' : 'rgba(96,165,250,0.12)' }}>
              {slotLabel} Slot
            </span>
          )}
          {goalLabel && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ fontFamily: INT, color: '#34D399', background: 'rgba(52,211,153,0.12)' }}>
              {goalLabel}
            </span>
          )}
        </div>

        {/* Member since */}
        <p className="text-xs" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>
          Member since {fmtDate(profile?.created_at)}
        </p>
      </div>

      <div className="px-4 space-y-4 mt-4">

        {/* ── Profile Info ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: CRD, border: `1px solid ${BRD}` }}>
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <p className="text-xs font-semibold uppercase tracking-wider"
              style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>
              Personal Info
            </p>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-70"
                style={{ fontFamily: INT, color: YLW }}
              >
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
            ) : (
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-70"
                style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
            )}
          </div>

          <div className="px-5 pb-4">
            <AnimatePresence mode="wait">
              {!editing ? (
                <motion.div key="view"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <InfoRow label="Full Name"    value={profile?.full_name} />
                  <InfoRow label="Phone"        value={profile?.phone} />
                  <InfoRow label="Date of Birth" value={profile?.date_of_birth ? fmtDate(profile.date_of_birth) : null} />
                  <InfoRow label="Goal"         value={goalLabel} />
                  <div className="flex items-center justify-between pt-3.5">
                    <span className="text-xs font-semibold uppercase tracking-wider"
                      style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>Slot</span>
                    <span className="text-sm" style={{ fontFamily: INT, color: slotLabel ? 'rgba(249,250,251,0.85)' : 'rgba(249,250,251,0.25)' }}>
                      {slotLabel ?? 'Not set'}
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="edit"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="space-y-3 pt-1">
                  {[
                    { k: 'full_name',     label: 'Full Name',    type: 'text',   ph: 'Rahul Sharma',    maxLength: 100 },
                    { k: 'phone',         label: 'Phone',        type: 'tel',    ph: '+91 98765 43210', maxLength: 20  },
                    { k: 'date_of_birth', label: 'Date of Birth', type: 'date',  ph: '',                maxLength: undefined },
                  ].map(({ k, label, type, ph, maxLength }) => (
                    <div key={k}>
                      <p className="text-[10px] uppercase tracking-wider mb-1"
                        style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>{label}</p>
                      <input type={type} value={form[k]} onChange={set(k)} placeholder={ph} maxLength={maxLength} {...fieldStyle} />
                    </div>
                  ))}

                  <div>
                    <p className="text-[10px] uppercase tracking-wider mb-1"
                      style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>Goal</p>
                    <select value={form.goal} onChange={set('goal')} {...selStyle}>
                      <option value="">Select goal</option>
                      {GOALS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                    </select>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider mb-1"
                      style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>Slot</p>
                    <select value={form.slot} onChange={set('slot')} {...selStyle}>
                      <option value="">Select slot</option>
                      <option value="morning">Morning</option>
                      <option value="evening">Evening</option>
                      <option value="both">Both</option>
                    </select>
                  </div>

                  {saveError && (
                    <p className="text-red-400 text-xs" style={{ fontFamily: INT }}>{friendlyError(saveError)}</p>
                  )}

                  <button
                    onClick={handleSave}
                    disabled={isPending}
                    className="w-full py-3 rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
                    style={{ fontFamily: INT, background: YLW, color: '#0A0A0A' }}
                  >
                    {isPending
                      ? <Loader className="w-4 h-4 animate-spin" />
                      : <><Save className="w-4 h-4" /> Save Changes</>
                    }
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Membership ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: CRD, border: `1px solid ${BRD}` }}>
          <div className="px-5 pt-4 pb-2">
            <p className="text-xs font-semibold uppercase tracking-wider"
              style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>Membership</p>
          </div>
          <div className="px-5 pb-4">
            {activePlan ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-base font-black capitalize"
                      style={{ fontFamily: BC, color: PLAN_COLOR[activePlan.plan_type] ?? YLW }}>
                      {activePlan.plan_type} Plan
                    </p>
                    <p className="text-xs mt-0.5"
                      style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>
                      {fmtRs(activePlan.amount)} · Expires {fmtDate(activePlan.end_date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black"
                      style={{ fontFamily: IBP, color: daysLeft(activePlan.end_date) <= 7 ? '#FB923C' : 'rgba(249,250,251,0.85)' }}>
                      {daysLeft(activePlan.end_date)}
                    </p>
                    <p className="text-[10px]" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>
                      days left
                    </p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 rounded-full overflow-hidden mb-3"
                  style={{ background: 'rgba(249,250,251,0.07)' }}>
                  <div className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, Math.round(
                        (Math.max(0, Math.ceil((new Date() - new Date(activePlan.start_date)) / 86400000)) /
                        (activePlan.plan_type === 'monthly' ? 30 : activePlan.plan_type === 'quarterly' ? 90 : 365)) * 100
                      ))}%`,
                      background: daysLeft(activePlan.end_date) <= 7 ? '#FB923C' : PLAN_COLOR[activePlan.plan_type] ?? YLW,
                    }} />
                </div>
                {daysLeft(activePlan.end_date) <= 7 && (
                  <p className="text-xs mb-2" style={{ fontFamily: INT, color: '#FB923C' }}>
                    ⚠ Expiring soon — contact your trainer to renew
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm py-2" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>
                No active plan — contact your trainer.
              </p>
            )}
            <Link to="/member/subscription"
              className="flex items-center justify-between py-2.5 -mx-1 px-1 rounded-xl transition-colors hover:bg-white/5"
              style={{ color: 'rgba(249,250,251,0.45)' }}>
              <span className="text-sm" style={{ fontFamily: INT }}>View payment history</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ── Password ── */}
        <ChangePasswordSection userEmail={user?.email} />

        {/* ── Account / Sign Out ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: CRD, border: `1px solid ${BRD}` }}>
          <div className="px-5 pt-4 pb-2">
            <p className="text-xs font-semibold uppercase tracking-wider"
              style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>Account</p>
          </div>

          {/* App version info */}
          <div className="flex items-center justify-between px-5 py-3"
            style={{ borderBottom: `1px solid ${BRD}` }}>
            <span className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.6)' }}>
              Golden Biceps
            </span>
            <span className="text-xs" style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.3)' }}>v1.0</span>
          </div>

          <div className="px-5 py-3 pb-4">
            {!logoutConfirm ? (
              <button
                onClick={() => setLogoutConfirm(true)}
                className="flex items-center gap-3 w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-150 hover:bg-red-400/10"
                style={{ fontFamily: INT, color: '#F87171', border: '1px solid rgba(248,113,113,0.2)' }}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl p-4 space-y-3"
                style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}
              >
                <p className="text-sm font-semibold text-white text-center" style={{ fontFamily: INT }}>
                  Sign out of Golden Biceps?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setLogoutConfirm(false)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-70"
                    style={{ fontFamily: INT, background: 'rgba(249,250,251,0.08)', color: 'rgba(249,250,251,0.7)' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-80"
                    style={{ fontFamily: INT, background: '#F87171', color: 'white' }}
                  >
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
