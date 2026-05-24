import { useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Dumbbell, Zap, Award, TrendingUp, ChevronRight } from 'lucide-react'

const BC = "'Barlow Condensed', sans-serif"
const BL = "'Barlow', sans-serif"

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }

const PROGRAMS = [
  {
    id: 'beginner',
    icon: Zap,
    level: 'Beginner',
    name: 'Foundation Builder',
    desc: '3 days/week full-body program designed to build base strength and establish consistent gym habits.',
    duration: '4 weeks',
    sessions: '3× / week',
    color: 'green',
    exercises: [
      { name: 'Bodyweight Squat', sets: '3 × 12' },
      { name: 'Push-ups',         sets: '3 × 10' },
      { name: 'Dumbbell Row',     sets: '3 × 10' },
      { name: 'Plank Hold',       sets: '3 × 30s' },
      { name: 'Walking Lunges',   sets: '3 × 12' },
    ],
  },
  {
    id: 'intermediate',
    icon: TrendingUp,
    level: 'Intermediate',
    name: 'Power Progress',
    desc: '4 days/week upper-lower split focused on progressive overload and muscle development.',
    duration: '6 weeks',
    sessions: '4× / week',
    color: 'orange',
    exercises: [
      { name: 'Barbell Back Squat', sets: '4 × 8'  },
      { name: 'Bench Press',        sets: '4 × 8'  },
      { name: 'Romanian Deadlift',  sets: '4 × 10' },
      { name: 'Pull-ups',           sets: '4 × 6'  },
      { name: 'Overhead Press',     sets: '3 × 10' },
    ],
  },
  {
    id: 'advanced',
    icon: Award,
    level: 'Advanced',
    name: 'Elite Performance',
    desc: '5 days/week push-pull-legs split designed for serious athletes targeting peak performance.',
    duration: '8 weeks',
    sessions: '5× / week',
    color: 'purple',
    exercises: [
      { name: 'Deadlift',            sets: '5 × 5'  },
      { name: 'Weighted Pull-ups',   sets: '5 × 5'  },
      { name: 'Barbell Squat',       sets: '5 × 5'  },
      { name: 'Incline Bench Press', sets: '4 × 8'  },
      { name: 'Cable Rows',          sets: '4 × 10' },
    ],
  },
]

const COLOR_MAP = {
  green:  {
    border: 'border-green-500/30',
    bg:     'bg-green-500/10',
    icon:   'text-green-400',
    label:  'bg-green-500/20 text-green-300 border-green-500/30',
    glow:   'rgba(34,197,94,0.1)',
  },
  orange: {
    border: 'border-orange-500/30',
    bg:     'bg-orange-500/10',
    icon:   'text-orange-400',
    label:  'bg-orange-500/20 text-orange-300 border-orange-500/30',
    glow:   'rgba(249,115,22,0.1)',
  },
  purple: {
    border: 'border-purple-500/30',
    bg:     'bg-purple-500/10',
    icon:   'text-purple-400',
    label:  'bg-purple-500/20 text-purple-300 border-purple-500/30',
    glow:   'rgba(168,85,247,0.1)',
  },
}

function TiltCard({ children, className = '' }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 28 })
  const sy = useSpring(y, { stiffness: 220, damping: 28 })
  const rotateX = useTransform(sy, [-0.5, 0.5], [6, -6])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-6, 6])

  const onMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width  - 0.5)
    y.set((e.clientY - rect.top)  / rect.height - 0.5)
  }, [x, y])

  const onLeave = useCallback(() => { x.set(0); y.set(0) }, [x, y])

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`flex ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default function Routines() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-full bg-gray-800 relative overflow-hidden">

      {/* Background glow decorations */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 65%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.05) 0%, transparent 65%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      {/* Page header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p
          className="text-orange-500 text-xs font-black tracking-[0.2em] uppercase mb-1"
          style={{ fontFamily: BC }}
        >
          Programs
        </p>
        <h1 className="text-3xl font-black text-white" style={{ fontFamily: BC }}>
          WORKOUT ROUTINES
        </h1>
        <p className="text-gray-400 text-sm mt-1" style={{ fontFamily: BL }}>
          3 predefined programs to assign to your members.
        </p>
      </motion.div>

      {/* Program cards */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-5"
        variants={stagger}
        initial="hidden"
        animate="visible"
        style={{ perspective: 1400 }}
      >
        {PROGRAMS.map(({ id, icon: Icon, level, name, desc, duration, sessions, color, exercises }) => {
          const c = COLOR_MAP[color]
          return (
            <motion.div key={id} variants={fadeUp}>
              <TiltCard>
                <div
                  className={`bg-gray-900 border ${c.border} rounded-2xl overflow-hidden transition-shadow duration-300 cursor-default flex flex-col w-full hover:shadow-2xl relative`}
                >
                  {/* Glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                    style={{ boxShadow: `0 0 40px 0 ${c.glow}` }}
                    aria-hidden="true"
                  />

                  {/* Card header */}
                  <div className={`${c.bg} border-b ${c.border} px-6 py-5`}>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}
                      >
                        <Icon className={`w-5 h-5 ${c.icon}`} aria-hidden="true" />
                      </div>
                      <span
                        className={`text-xs font-black px-3 py-1 rounded-full border ${c.label}`}
                        style={{ fontFamily: BC, letterSpacing: '0.1em' }}
                      >
                        {level.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white mb-1" style={{ fontFamily: BC }}>
                      {name}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed" style={{ fontFamily: BL }}>
                      {desc}
                    </p>
                  </div>

                  {/* Meta info */}
                  <div
                    className="px-6 py-4 grid grid-cols-2 gap-3"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    {[
                      { label: 'Duration',  val: duration },
                      { label: 'Frequency', val: sessions },
                    ].map(({ label, val }) => (
                      <div key={label}>
                        <p
                          className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-0.5"
                          style={{ fontFamily: BC }}
                        >
                          {label}
                        </p>
                        <p className={`text-base font-black ${c.icon}`} style={{ fontFamily: BC }}>
                          {val}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Exercise list */}
                  <div className="px-6 py-5 flex-1">
                    <p
                      className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3"
                      style={{ fontFamily: BC }}
                    >
                      Exercises
                    </p>
                    <div className="space-y-2.5">
                      {exercises.map(({ name: exName, sets }) => (
                        <div key={exName} className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Dumbbell className={`w-3.5 h-3.5 ${c.icon} flex-shrink-0`} aria-hidden="true" />
                            <span className="text-sm text-gray-300 truncate" style={{ fontFamily: BL }}>
                              {exName}
                            </span>
                          </div>
                          <span
                            className={`text-xs font-black flex-shrink-0 ml-2 ${c.icon}`}
                            style={{ fontFamily: BC }}
                          >
                            {sets}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Assign button */}
                  <div className="px-6 pb-5">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-3 rounded-xl font-black text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border ${c.border} ${c.bg} ${c.icon} hover:opacity-90`}
                      style={{ fontFamily: BC, letterSpacing: '0.06em' }}
                    >
                      ASSIGN TO MEMBER
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </motion.button>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
