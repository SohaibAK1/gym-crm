import { CheckSquare, Square } from 'lucide-react'

const BC  = "'Barlow Condensed', sans-serif"
const INT = 'Inter, system-ui, sans-serif'
const YLW = '#FACC15'
const CRD = '#1E1C18'
const BRD = 'rgba(250,204,21,0.1)'

// Placeholder exercises for visual structure
const SAMPLE_EXERCISES = [
  { name: 'Bench Press',    sets: 4, reps: '8-10', weight: '60 kg' },
  { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', weight: '20 kg' },
  { name: 'Cable Fly',      sets: 3, reps: '12-15', weight: 'as needed' },
  { name: 'Tricep Pushdown', sets: 3, reps: '12', weight: 'cable' },
]

export default function MemberRoutine() {
  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      <h1 className="text-4xl font-black text-white mb-1" style={{ fontFamily: BC }}>MY ROUTINE</h1>
      <p className="text-sm mb-6" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>
        Today&apos;s workout checklist
      </p>

      {/* Day tabs placeholder */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 no-scrollbar">
        {['Day 1 – Push', 'Day 2 – Pull', 'Day 3 – Legs', 'Day 4 – Rest'].map((day, i) => (
          <button
            key={day}
            className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150"
            style={{
              fontFamily: INT,
              background: i === 0 ? YLW : CRD,
              color:      i === 0 ? '#0A0A0A' : 'rgba(249,250,251,0.45)',
              border:     i === 0 ? 'none' : `1px solid ${BRD}`,
            }}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Exercise checklist */}
      <div className="space-y-3">
        {SAMPLE_EXERCISES.map(({ name, sets, reps, weight }) => (
          <div
            key={name}
            className="flex items-center gap-4 p-4 rounded-2xl"
            style={{ background: CRD, border: `1px solid ${BRD}` }}
          >
            <Square className="w-5 h-5 flex-shrink-0" style={{ color: 'rgba(249,250,251,0.25)' }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate" style={{ fontFamily: INT }}>{name}</p>
              <p className="text-xs mt-0.5" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>
                {sets} sets · {reps} reps · {weight}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.3)' }}>
          Routine assigned by your trainer
        </p>
      </div>
    </div>
  )
}
