import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusCircle, X, Dumbbell, ChevronRight, Users } from 'lucide-react'
import { useRoutines, useCreateRoutine, useUpdateRoutine } from '../../hooks/useRoutines'
import { useMembers } from '../../hooks/useMembers'

const BC  = "'Barlow Condensed', sans-serif"
const INT = 'Inter, system-ui, sans-serif'
const YLW = '#FACC15'
const CRD = '#1E1C18'
const BRD = 'rgba(250,204,21,0.1)'

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

function NewRoutineModal({ open, onClose }) {
  const blank = { member_id: '', name: '', description: '' }
  const [form, setForm]       = useState(blank)
  const [createdId, setCreatedId] = useState(null)
  const { data: members = [] }    = useMembers()
  const { mutate, isPending, error, reset } = useCreateRoutine()
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    mutate(form, {
      onSuccess: (data) => setCreatedId(data.id),
    })
  }
  const handleClose = () => { reset(); setCreatedId(null); setForm(blank); onClose() }

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
                <h2 className="text-2xl font-black text-white" style={{ fontFamily: BC }}>NEW ROUTINE</h2>
                <button onClick={handleClose} className="p-1.5 rounded-lg text-gray-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {createdId ? (
                <div className="py-8 text-center">
                  <p className="text-4xl mb-3">💪</p>
                  <p className="text-xl font-black text-white mb-2" style={{ fontFamily: BC }}>ROUTINE CREATED!</p>
                  <p className="text-sm mb-6" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.5)' }}>
                    Now add days and exercises.
                  </p>
                  <Link to={`/admin/routines/${createdId}`} onClick={handleClose}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-opacity hover:opacity-80"
                    style={{ fontFamily: INT, background: YLW, color: '#0A0A0A' }}>
                    Open Builder <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Field label="Assign to Member" required>
                    <select value={form.member_id} onChange={set('member_id')} required
                      className="w-full px-4 py-2.5 rounded-xl text-white text-sm focus:outline-none transition-colors"
                      style={{ fontFamily: INT, background: '#141414', border: '1px solid rgba(250,204,21,0.15)' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(250,204,21,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(250,204,21,0.15)'}>
                      <option value="">Select member</option>
                      {members.map(m => <option key={m.id} value={m.id}>{m.full_name ?? m.id}</option>)}
                    </select>
                  </Field>
                  <Field label="Routine Name" required>
                    <input value={form.name} onChange={set('name')} required placeholder="e.g. Push Pull Legs" {...inp} />
                  </Field>
                  <Field label="Description">
                    <input value={form.description} onChange={set('description')} placeholder="Optional notes" {...inp} />
                  </Field>
                  {error && <p className="text-red-400 text-sm" style={{ fontFamily: INT }}>{error.message}</p>}
                  <button type="submit" disabled={isPending}
                    className="w-full py-3 rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
                    style={{ fontFamily: INT, background: YLW, color: '#0A0A0A' }}>
                    {isPending
                      ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      : 'Create Routine'}
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

export default function AdminRoutines() {
  const { data: routines = [], isLoading } = useRoutines()
  const { mutate: updateRoutine }          = useUpdateRoutine()
  const [showModal, setShowModal]          = useState(false)

  const totalExercises = (r) => r.routine_days?.reduce((s, d) => s + (d.exercises?.length ?? 0), 0) ?? 0

  const toggleActive = (e, r) => {
    e.preventDefault()   // stop the Link navigation
    e.stopPropagation()
    updateRoutine({ id: r.id, is_active: !r.is_active })
  }

  return (
    <div className="max-w-7xl mx-auto">
      <NewRoutineModal open={showModal} onClose={() => setShowModal(false)} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black text-white mb-1" style={{ fontFamily: BC }}>ROUTINES</h1>
          <p className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>
            Build and assign workout routines to members
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-80"
          style={{ fontFamily: INT, background: YLW, color: '#0A0A0A' }}>
          <PlusCircle className="w-4 h-4" /> New Routine
        </button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-44 rounded-2xl animate-pulse" style={{ background: CRD, border: `1px solid ${BRD}` }} />)}
        </div>
      ) : routines.length === 0 ? (
        <div className="rounded-2xl py-20 flex flex-col items-center justify-center gap-4"
          style={{ background: CRD, border: `1px solid ${BRD}` }}>
          <Dumbbell className="w-10 h-10" style={{ color: 'rgba(249,250,251,0.15)' }} />
          <div className="text-center">
            <p className="text-base font-black text-white mb-1" style={{ fontFamily: BC }}>NO ROUTINES YET</p>
            <p className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>
              Create a routine and assign it to a member.
            </p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-80"
            style={{ fontFamily: INT, background: YLW, color: '#0A0A0A' }}>
            <PlusCircle className="w-4 h-4" /> Create First Routine
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {routines.map(r => (
            <Link key={r.id} to={`/admin/routines/${r.id}`}
              className="group rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200 hover:border-yellow-400/30"
              style={{ background: CRD, border: `1px solid ${BRD}` }}>
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(250,204,21,0.1)' }}>
                  <Dumbbell className="w-4 h-4" style={{ color: YLW }} />
                </div>
                <button
                  onClick={e => toggleActive(e, r)}
                  className="text-xs px-2 py-0.5 rounded-full font-medium transition-opacity hover:opacity-70"
                  style={{ fontFamily: INT, color: r.is_active ? '#34D399' : 'rgba(249,250,251,0.4)', background: r.is_active ? 'rgba(52,211,153,0.1)' : 'rgba(249,250,251,0.05)' }}
                  title={r.is_active ? 'Click to deactivate' : 'Click to activate'}>
                  {r.is_active ? 'Active' : 'Inactive'}
                </button>
              </div>

              <div>
                <h3 className="text-base font-black text-white mb-1" style={{ fontFamily: BC }}>{r.name}</h3>
                {r.description && (
                  <p className="text-xs line-clamp-2" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>{r.description}</p>
                )}
              </div>

              <div className="flex items-center gap-4 mt-auto">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" style={{ color: 'rgba(249,250,251,0.35)' }} />
                  <span className="text-xs" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.55)' }}>
                    {r.member?.full_name ?? 'Unassigned'}
                  </span>
                </div>
                <span className="text-xs" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>
                  {r.routine_days?.length ?? 0} days · {totalExercises(r)} exercises
                </span>
              </div>

              <div className="flex items-center justify-end gap-1 text-xs group-hover:text-yellow-400 transition-colors"
                style={{ color: 'rgba(249,250,251,0.3)', fontFamily: INT }}>
                Open builder <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}

          {/* Add new card */}
          <button onClick={() => setShowModal(true)}
            className="rounded-2xl p-5 h-44 flex flex-col items-center justify-center gap-3 transition-all duration-200 hover:border-yellow-400/20"
            style={{ background: 'transparent', border: `1.5px dashed rgba(249,250,251,0.08)` }}>
            <PlusCircle className="w-7 h-7" style={{ color: 'rgba(249,250,251,0.2)' }} />
            <span className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.3)' }}>New routine</span>
          </button>
        </div>
      )}
    </div>
  )
}
