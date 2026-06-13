import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { INT, IBP } from './constants'

const EXERCISES = [
  { name: 'Bench Press',      sets: '4 × 10' },
  { name: 'Shoulder Press',   sets: '3 × 12' },
  { name: 'Incline DB Press', sets: '3 × 10' },
  { name: 'Tricep Dips',      sets: '3 × 15' },
  { name: 'Cable Fly',        sets: '3 × 12' },
]

const AUTO_DELAY    = 2500 // ms between auto-checks
const RESET_PAUSE   = 3000 // ms to show "COMPLETE" before resetting
const MANUAL_FREEZE = 5000 // ms auto-loop pauses after a manual click

export default function WorkoutSessionCard() {
  const [done, setDone]             = useState(EXERCISES.map(() => false))
  const [elapsed, setElapsed]       = useState(23 * 60 + 41)
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const [resetting, setResetting]   = useState(false)
  const frozenUntilRef              = useRef(0) // epoch ms — no re-render needed

  const completedCount = done.filter(Boolean).length
  const allDone        = completedCount === EXERCISES.length
  const activeIndex    = done.indexOf(false)
  const progress       = Math.round((completedCount / EXERCISES.length) * 100)

  // Running timer
  useEffect(() => {
    const id = setInterval(() => setElapsed(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  // Auto-complete loop — re-runs whenever `done` changes
  useEffect(() => {
    if (allDone) {
      const id = setTimeout(() => {
        setResetting(true)
        setTimeout(() => { setDone(EXERCISES.map(() => false)); setResetting(false) }, 400)
      }, RESET_PAUSE)
      return () => clearTimeout(id)
    }

    if (activeIndex === -1) return

    // Honour any manual-click freeze period
    const delay = Math.max(AUTO_DELAY, frozenUntilRef.current - Date.now())
    const id = setTimeout(() => {
      setDone(d => d.map((v, i) => i === activeIndex ? true : v))
    }, delay)
    return () => clearTimeout(id)
  }, [done, allDone, activeIndex])

  // Manual toggle — writes freeze timestamp to ref (no extra re-render).
  // Date.now() is intentional here: this runs in an onClick, never during render.
  const toggle = (index) => {
    // eslint-disable-next-line react-hooks/purity
    frozenUntilRef.current = Date.now() + MANUAL_FREEZE
    setDone(d => d.map((v, i) => i === index ? !v : v))
  }

  const mins = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const secs = String(elapsed % 60).padStart(2, '0')

  return (
    <div>
      <div
        className="w-full rounded-2xl overflow-hidden"
        style={{
          background: '#141414',
          border:     '1px solid rgba(250,204,21,0.1)',
          borderTop:  '2px solid #FACC15',
          boxShadow:  '0 0 80px rgba(250,204,21,0.08), 0 32px 64px rgba(0,0,0,0.5)',
        }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-2.5">
            <motion.span
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-[#FACC15]"
            />
            <span style={{ fontFamily: IBP, color: '#FACC15', fontSize: '11px', letterSpacing: '0.18em' }}>
              PUSH DAY — LIVE
            </span>
          </div>
          <span style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.45)', fontSize: '12px' }}>
            {mins}:{secs}
          </span>
        </div>

        {/* ── Exercise list ── */}
        <div className="px-5 py-4">
          <p style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.3)', fontSize: '9px', letterSpacing: '0.22em', marginBottom: '10px' }}>
            TODAY'S EXERCISES
          </p>

          <div className="flex flex-col gap-0.5">
            {EXERCISES.map((ex, i) => {
              const isDone    = done[i]
              const isActive  = i === activeIndex
              const isHovered = i === hoveredIdx

              return (
                <motion.div
                  key={ex.name}
                  animate={{ opacity: resetting ? 0.2 : 1, x: resetting ? -6 : 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  onClick={() => toggle(i)}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-xl transition-colors duration-150"
                  style={{
                    cursor:     'pointer',
                    background: isHovered
                      ? isDone
                        ? 'rgba(255,255,255,0.04)'
                        : 'rgba(250,204,21,0.07)'
                      : isActive
                        ? 'rgba(250,204,21,0.04)'
                        : 'transparent',
                    borderLeft: isActive && !isDone
                      ? '2px solid rgba(250,204,21,0.45)'
                      : '2px solid transparent',
                  }}
                >
                  {/* Checkbox */}
                  <motion.div
                    whileTap={{ scale: 0.85 }}
                    className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-all duration-200"
                    style={{
                      background: isDone ? '#FACC15' : 'transparent',
                      border: isDone
                        ? 'none'
                        : isHovered || isActive
                          ? '1.5px solid rgba(250,204,21,0.5)'
                          : '1.5px solid rgba(255,255,255,0.12)',
                    }}
                  >
                    <AnimatePresence>
                      {isDone && (
                        <motion.svg
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                          width="11" height="9" viewBox="0 0 11 9" fill="none"
                        >
                          <path
                            d="M1 4L4 7L10 1"
                            stroke="#0A0A0A"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </motion.svg>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Exercise name */}
                  <span
                    className="flex-1 text-sm transition-all duration-200"
                    style={{
                      fontFamily:          INT,
                      color:               isDone
                        ? 'rgba(249,250,251,0.28)'
                        : isHovered || isActive
                          ? '#F9FAFB'
                          : 'rgba(249,250,251,0.6)',
                      textDecoration:      isDone ? 'line-through' : 'none',
                      textDecorationColor: 'rgba(249,250,251,0.18)',
                    }}
                  >
                    {ex.name}
                  </span>

                  {/* Sets */}
                  <span style={{ fontFamily: IBP, fontSize: '10px', color: 'rgba(249,250,251,0.25)' }}>
                    {ex.sets}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* ── Progress ── */}
        <div
          className="px-5 py-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontFamily: IBP, fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(249,250,251,0.3)' }}>
              PROGRESS
            </span>
            <span style={{ fontFamily: IBP, fontSize: '11px', color: '#FACC15' }}>
              {completedCount} / {EXERCISES.length}
            </span>
          </div>

          <div
            className="w-full rounded-full overflow-hidden"
            style={{ height: '3px', background: 'rgba(255,255,255,0.07)' }}
          >
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: '#FACC15', boxShadow: '0 0 8px rgba(250,204,21,0.55)' }}
            />
          </div>

          <div className="mt-3 h-4">
            <AnimatePresence mode="wait">
              {!allDone ? (
                <motion.p
                  key="next"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  style={{ fontFamily: IBP, fontSize: '10px', color: 'rgba(249,250,251,0.35)' }}
                >
                  NEXT UP{' '}
                  <span style={{ color: 'rgba(249,250,251,0.7)' }}>
                    {EXERCISES[activeIndex]?.name}
                  </span>
                </motion.p>
              ) : (
                <motion.p
                  key="done"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  style={{ fontFamily: IBP, fontSize: '10px', color: '#FACC15', letterSpacing: '0.12em' }}
                >
                  WORKOUT COMPLETE 🔥
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Interaction hint */}
      <p
        className="mt-3 text-center text-xs"
        style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.2)', letterSpacing: '0.1em' }}
      >
        Click exercises to check them off
      </p>
    </div>
  )
}
