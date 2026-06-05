import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckSquare, Square, Dumbbell } from 'lucide-react'
import { useMemberRoutine, useTodayExerciseLogs, useToggleExercise } from '../../hooks/useMemberData'

const BC  = "'Barlow Condensed', sans-serif"
const INT = 'Inter, system-ui, sans-serif'
const IBP = "'IBM Plex Mono', ui-monospace, monospace"
const YLW = '#FACC15'
const CRD = '#1E1C18'
const BRD = 'rgba(250,204,21,0.1)'

function ExerciseItem({ ex, dayId, log, onToggle, isPending }) {
  const done = log?.completed ?? false

  return (
    <motion.button
      layout
      onClick={() => onToggle(ex, dayId, log)}
      disabled={isPending}
      className="flex items-center gap-4 w-full px-4 py-4 rounded-2xl text-left transition-all duration-200"
      style={{
        background: done ? 'rgba(250,204,21,0.08)' : 'rgba(249,250,251,0.03)',
        border: done ? '1px solid rgba(250,204,21,0.2)' : `1px solid ${BRD}`,
        opacity: isPending ? 0.6 : 1,
      }}
    >
      <div className="flex-shrink-0">
        {done
          ? <CheckSquare className="w-5 h-5" style={{ color: YLW }} />
          : <Square      className="w-5 h-5" style={{ color: 'rgba(249,250,251,0.3)' }} />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate"
          style={{ fontFamily: INT, color: done ? YLW : 'white',
            textDecoration: done ? 'line-through' : 'none' }}>
          {ex.name}
        </p>
        <p className="text-xs mt-0.5" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>
          {[
            ex.sets  && `${ex.sets} sets`,
            ex.reps  && ex.reps,
            ex.weight && ex.weight,
          ].filter(Boolean).join(' · ')}
          {ex.rest_seconds && ` · ${ex.rest_seconds}s rest`}
        </p>
        {ex.notes && (
          <p className="text-xs mt-0.5 italic" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.3)' }}>
            {ex.notes}
          </p>
        )}
      </div>
    </motion.button>
  )
}

export default function MemberRoutine() {
  const { data: routine, isLoading }       = useMemberRoutine()
  const { data: todayLogs = [] }           = useTodayExerciseLogs()
  const { mutate: toggleEx, isPending }    = useToggleExercise()
  const [selectedDay, setSelectedDay]      = useState(0)

  const days        = routine?.routine_days ?? []
  const currentDay  = days[selectedDay]
  const exercises   = currentDay?.exercises ?? []

  const logFor  = (exId) => todayLogs.find(l => l.exercise_id === exId)
  const isDone  = (exId) => logFor(exId)?.completed ?? false

  const doneCount = exercises.filter(ex => isDone(ex.id)).length
  const progress  = exercises.length > 0 ? Math.round((doneCount / exercises.length) * 100) : 0

  const handleToggle = (ex, dayId, log) => {
    toggleEx({ exercise_id: ex.id, routine_day_id: dayId, log_id: log?.id, completed: !isDone(ex.id) })
  }

  if (isLoading) return (
    <div className="px-4 pt-6 space-y-3">
      {[1,2,3].map(i => (
        <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: CRD }} />
      ))}
    </div>
  )

  if (!routine) return (
    <div className="px-4 pt-10 max-w-lg mx-auto text-center">
      <Dumbbell className="w-12 h-12 mx-auto mb-4" style={{ color: 'rgba(249,250,251,0.15)' }} />
      <p className="text-xl font-black text-white mb-2" style={{ fontFamily: BC }}>NO ROUTINE YET</p>
      <p className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>
        Your trainer will assign a workout routine soon.
      </p>
    </div>
  )

  return (
    <div className="px-4 pt-6 pb-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-4xl font-black text-white mb-0.5" style={{ fontFamily: BC }}>
          {routine.name.toUpperCase()}
        </h1>
        {routine.description && (
          <p className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>
            {routine.description}
          </p>
        )}
      </div>

      {/* Day tabs */}
      {days.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 mb-5 no-scrollbar">
          {days.map((day, i) => (
            <button key={day.id} onClick={() => setSelectedDay(i)}
              className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150"
              style={{
                fontFamily: INT,
                background: selectedDay === i ? YLW : CRD,
                color:      selectedDay === i ? '#0A0A0A' : 'rgba(249,250,251,0.5)',
                border:     selectedDay === i ? 'none' : `1px solid ${BRD}`,
              }}>
              {day.day_name}
            </button>
          ))}
        </div>
      )}

      {/* Progress bar */}
      {exercises.length > 0 && (
        <div className="rounded-2xl p-4 mb-4" style={{ background: CRD, border: `1px solid ${BRD}` }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-white" style={{ fontFamily: INT }}>
              {days.length === 1 ? days[0]?.day_name : currentDay?.day_name}
            </p>
            <p className="text-sm font-black" style={{ fontFamily: IBP, color: YLW }}>
              {doneCount}/{exercises.length}
            </p>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(249,250,251,0.07)' }}>
            <motion.div className="h-full rounded-full" style={{ background: YLW }}
              animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
          </div>
          {progress === 100 && (
            <p className="text-xs mt-2 text-center font-semibold" style={{ fontFamily: INT, color: YLW }}>
              🎉 All done for today!
            </p>
          )}
        </div>
      )}

      {/* Exercise list */}
      {exercises.length === 0 ? (
        <div className="rounded-2xl py-12 text-center" style={{ background: CRD, border: `1px solid ${BRD}` }}>
          <p className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>
            No exercises in this day yet.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {exercises.map(ex => (
            <ExerciseItem
              key={ex.id}
              ex={ex}
              dayId={currentDay.id}
              log={logFor(ex.id)}
              onToggle={handleToggle}
              isPending={isPending}
            />
          ))}
        </div>
      )}
    </div>
  )
}
