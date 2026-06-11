import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp, Save, Loader } from 'lucide-react'
import {
  useRoutine, useUpdateRoutine,
  useAddRoutineDay, useDeleteRoutineDay,
  useAddExercise, useUpdateExercise, useDeleteExercise,
} from '../../hooks/useRoutines'

const BC  = "'Barlow Condensed', sans-serif"
const INT = 'Inter, system-ui, sans-serif'
const YLW = '#FACC15'
const CRD = '#1E1C18'
const BRD = 'rgba(250,204,21,0.1)'
const SRF = '#141414'

const inp = (extra = {}) => ({
  className: 'w-full px-3 py-2 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none transition-colors',
  style: { fontFamily: INT, background: 'rgba(249,250,251,0.05)', border: '1px solid rgba(249,250,251,0.08)', ...extra.style },
  onFocus: e => { e.target.style.borderColor = 'rgba(250,204,21,0.4)' },
  onBlur:  e => { e.target.style.borderColor = 'rgba(249,250,251,0.08)' },
  ...extra,
})

function ExerciseRow({ ex, routineId, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm]       = useState({ name: ex.name, sets: ex.sets ?? '', reps: ex.reps ?? '', weight: ex.weight ?? '', rest_seconds: ex.rest_seconds ?? '', notes: ex.notes ?? '' })
  const { mutate: update, isPending } = useUpdateExercise()
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const save = () => {
    update({ id: ex.id, routine_id: routineId, ...form, sets: form.sets ? parseInt(form.sets) : null, rest_seconds: form.rest_seconds ? parseInt(form.rest_seconds) : null },
      { onSuccess: () => setEditing(false) })
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: SRF, border: '1px solid rgba(249,250,251,0.06)' }}>
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => setEditing(v => !v)} className="flex items-center gap-3 flex-1 text-left min-w-0">
          <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(250,204,21,0.12)' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: YLW }} />
          </div>
          <span className="text-sm font-medium text-white truncate" style={{ fontFamily: INT }}>{ex.name}</span>
          {!editing && (
            <span className="text-xs flex-shrink-0" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>
              {[ex.sets && `${ex.sets} sets`, ex.reps, ex.weight].filter(Boolean).join(' · ')}
            </span>
          )}
        </button>
        <div className="flex items-center gap-1 ml-2">
          {editing && (
            <button onClick={save} disabled={isPending}
              className="p-1.5 rounded-lg transition-colors text-yellow-400 hover:text-yellow-300">
              {isPending ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            </button>
          )}
          <button onClick={onDelete} className="p-1.5 rounded-lg transition-colors text-gray-600 hover:text-red-400">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setEditing(v => !v)} className="p-1.5 text-gray-600 hover:text-white transition-colors">
            {editing ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden">
            <div className="px-4 pb-4 grid grid-cols-2 sm:grid-cols-4 gap-2 border-t" style={{ borderColor: 'rgba(249,250,251,0.06)' }}>
              {[
                { k: 'name',         label: 'Exercise',  span: 'col-span-2 sm:col-span-4', type: 'text',   maxLength: 100, min: undefined, max: undefined },
                { k: 'sets',         label: 'Sets',       span: '',                          type: 'number', maxLength: undefined, min: 1, max: 100 },
                { k: 'reps',         label: 'Reps',       span: '',                          type: 'text',   maxLength: 30,  min: undefined, max: undefined },
                { k: 'weight',       label: 'Weight',     span: '',                          type: 'text',   maxLength: 30,  min: undefined, max: undefined },
                { k: 'rest_seconds', label: 'Rest (sec)', span: '',                          type: 'number', maxLength: undefined, min: 0, max: 3600 },
                { k: 'notes',        label: 'Notes',      span: 'col-span-2 sm:col-span-4', type: 'text',   maxLength: 200, min: undefined, max: undefined },
              ].map(({ k, label, span, type, maxLength, min, max }) => (
                <div key={k} className={`mt-3 ${span}`}>
                  <p className="text-[10px] uppercase tracking-wider mb-1" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>{label}</p>
                  <input type={type} value={form[k]} onChange={set(k)} maxLength={maxLength} min={min} max={max} {...inp()} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function AddExerciseForm({ dayId, routineId, onDone }) {
  const blank = { name: '', sets: '', reps: '', weight: '', rest_seconds: '', notes: '' }
  const [form, setForm] = useState(blank)
  const { mutate, isPending } = useAddExercise()
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleAdd = e => {
    e.preventDefault()
    if (!form.name.trim()) return
    mutate({
      routine_day_id: dayId, routine_id: routineId,
      ...form,
      sets: form.sets ? parseInt(form.sets) : null,
      rest_seconds: form.rest_seconds ? parseInt(form.rest_seconds) : null,
      sort_order: 0,
    }, { onSuccess: () => { setForm(blank); onDone?.() } })
  }

  return (
    <form onSubmit={handleAdd} className="rounded-xl p-3" style={{ background: 'rgba(250,204,21,0.05)', border: '1px dashed rgba(250,204,21,0.2)' }}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
        <div className="col-span-2 sm:col-span-4">
          <input value={form.name} onChange={set('name')} required placeholder="Exercise name *" maxLength={100} {...inp()} />
        </div>
        <input type="number" value={form.sets} onChange={set('sets')} placeholder="Sets" min={1} max={100} {...inp()} />
        <input value={form.reps} onChange={set('reps')} placeholder="Reps" maxLength={30} {...inp()} />
        <input value={form.weight} onChange={set('weight')} placeholder="Weight" maxLength={30} {...inp()} />
        <input type="number" value={form.rest_seconds} onChange={set('rest_seconds')} placeholder="Rest (s)" min={0} max={3600} {...inp()} />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={isPending || !form.name.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50 transition-opacity hover:opacity-80"
          style={{ fontFamily: INT, background: YLW, color: '#0A0A0A' }}>
          {isPending ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <><Plus className="w-3.5 h-3.5" /> Add</>}
        </button>
        <button type="button" onClick={onDone}
          className="px-3 py-1.5 rounded-lg text-xs transition-colors text-gray-500 hover:text-white"
          style={{ fontFamily: INT }}>
          Cancel
        </button>
      </div>
    </form>
  )
}

function DayCard({ day, routineId }) {
  const [open, setOpen]         = useState(true)
  const [addingEx, setAddingEx] = useState(false)
  const { mutate: deleteDay }   = useDeleteRoutineDay()
  const { mutate: deleteEx }    = useDeleteExercise()

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: CRD, border: `1px solid ${BRD}` }}>
      {/* Day header */}
      <div className="flex items-center justify-between px-5 py-4">
        <button onClick={() => setOpen(v => !v)} className="flex items-center gap-3 flex-1 text-left">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ background: 'rgba(250,204,21,0.15)', color: YLW, fontFamily: "'IBM Plex Mono', monospace" }}>
            {day.sort_order + 1}
          </div>
          <span className="font-black text-white" style={{ fontFamily: BC }}>{day.day_name.toUpperCase()}</span>
          <span className="text-xs" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>
            {day.exercises?.length ?? 0} exercises
          </span>
        </button>
        <div className="flex items-center gap-1">
          <button onClick={() => setOpen(v => !v)} className="p-2 text-gray-500 hover:text-white transition-colors">
            {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button onClick={() => window.confirm(`Delete "${day.day_name}"?`) && deleteDay({ id: day.id, routine_id: routineId })}
            className="p-2 text-gray-600 hover:text-red-400 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden">
            <div className="px-5 pb-5 space-y-2 border-t" style={{ borderColor: BRD }}>
              <div className="pt-3 space-y-2">
                {day.exercises?.map(ex => (
                  <ExerciseRow key={ex.id} ex={ex} routineId={routineId}
                    onDelete={() => deleteEx({ id: ex.id, routine_id: routineId })} />
                ))}
              </div>

              {addingEx ? (
                <AddExerciseForm dayId={day.id} routineId={routineId} onDone={() => setAddingEx(false)} />
              ) : (
                <button onClick={() => setAddingEx(true)}
                  className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm transition-colors text-gray-500 hover:text-white hover:bg-white/5"
                  style={{ fontFamily: INT, border: '1px dashed rgba(249,250,251,0.1)' }}>
                  <Plus className="w-4 h-4" /> Add exercise
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function RoutineBuilder() {
  const { id }               = useParams()
  const { data: routine, isLoading } = useRoutine(id)
  const { mutate: addDay, isPending: addingDay } = useAddRoutineDay()
  const [newDayName, setNewDayName] = useState('')
  const [showAddDay, setShowAddDay] = useState(false)

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!routine) return (
    <div className="max-w-3xl mx-auto">
      <p className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.5)' }}>Routine not found.</p>
    </div>
  )

  const handleAddDay = e => {
    e.preventDefault()
    if (!newDayName.trim()) return
    addDay(
      { routine_id: id, day_name: newDayName.trim(), sort_order: routine.routine_days?.length ?? 0 },
      { onSuccess: () => { setNewDayName(''); setShowAddDay(false) } }
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/admin/routines" className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:text-white"
        style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>
        <ArrowLeft className="w-4 h-4" /> Back to Routines
      </Link>

      {/* Routine header */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: CRD, border: `1px solid rgba(250,204,21,0.2)` }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black text-white mb-1" style={{ fontFamily: BC }}>{routine.name}</h1>
            {routine.description && (
              <p className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.5)' }}>{routine.description}</p>
            )}
            <p className="text-xs mt-2" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>
              Assigned to: <span style={{ color: 'rgba(249,250,251,0.7)' }}>{routine.member?.full_name ?? 'Unassigned'}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>
              {routine.routine_days?.length ?? 0} days
            </p>
            <p className="text-xs" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>
              {routine.routine_days?.reduce((s, d) => s + (d.exercises?.length ?? 0), 0) ?? 0} exercises
            </p>
          </div>
        </div>
      </div>

      {/* Days */}
      <div className="space-y-4 mb-4">
        {routine.routine_days?.length === 0 && (
          <p className="text-sm text-center py-4" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>
            No days yet — add your first training day below.
          </p>
        )}
        {routine.routine_days?.map(day => (
          <DayCard key={day.id} day={day} routineId={id} />
        ))}
      </div>

      {/* Add day */}
      {showAddDay ? (
        <form onSubmit={handleAddDay} className="rounded-2xl p-4 flex gap-3"
          style={{ background: CRD, border: `1px solid rgba(250,204,21,0.2)` }}>
          <input value={newDayName} onChange={e => setNewDayName(e.target.value)} required
            placeholder="e.g. Day 1 – Push" autoFocus maxLength={50}
            className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none"
            style={{ fontFamily: INT, background: 'rgba(249,250,251,0.05)', border: '1px solid rgba(250,204,21,0.2)' }} />
          <button type="submit" disabled={addingDay || !newDayName.trim()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 transition-opacity hover:opacity-80"
            style={{ fontFamily: INT, background: YLW, color: '#0A0A0A' }}>
            {addingDay ? <Loader className="w-4 h-4 animate-spin" /> : 'Add Day'}
          </button>
          <button type="button" onClick={() => setShowAddDay(false)}
            className="px-4 py-2.5 rounded-xl text-sm transition-colors text-gray-500 hover:text-white"
            style={{ fontFamily: INT }}>
            Cancel
          </button>
        </form>
      ) : (
        <button onClick={() => setShowAddDay(true)}
          className="flex items-center gap-2 w-full px-5 py-3.5 rounded-2xl text-sm font-medium transition-all hover:border-yellow-400/25"
          style={{ fontFamily: INT, border: `1.5px dashed rgba(249,250,251,0.1)`, color: 'rgba(249,250,251,0.4)' }}>
          <Plus className="w-4 h-4" /> Add training day
        </button>
      )}
    </div>
  )
}
