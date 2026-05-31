import { motion } from 'framer-motion'
import { Dumbbell, Zap, Award, TrendingUp, ChevronRight } from 'lucide-react'
import SpotlightCard from '../components/bits/SpotlightCard'
import TiltCard from '../components/bits/TiltCard'

const BC  = "'Barlow Condensed', sans-serif"
const INT = 'Inter, system-ui, sans-serif'
const IBP = "'IBM Plex Mono', ui-monospace, monospace"

const V   = '#FACC15'
const BDR = 'rgba(250,204,21,0.14)'
const CRD = '#1E1C18'

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
    color: '#34D399',
    spotColor: 'rgba(52,211,153,0.12)',
    border: 'rgba(52,211,153,0.2)',
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
    color: V,
    spotColor: 'rgba(250,204,21,0.12)',
    border: 'rgba(250,204,21,0.22)',
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
    color: '#FB923C',
    spotColor: 'rgba(251,146,60,0.12)',
    border: 'rgba(251,146,60,0.22)',
    exercises: [
      { name: 'Deadlift',            sets: '5 × 5'  },
      { name: 'Weighted Pull-ups',   sets: '5 × 5'  },
      { name: 'Barbell Squat',       sets: '5 × 5'  },
      { name: 'Incline Bench Press', sets: '4 × 8'  },
      { name: 'Cable Rows',          sets: '4 × 10' },
    ],
  },
]

export default function Routines() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-full relative overflow-hidden" style={{ background: '#0A0A0A' }}>

      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(250,204,21,0.06) 0%, transparent 65%)' }} aria-hidden="true" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(250,204,21,0.03) 0%, transparent 65%)' }} aria-hidden="true" />

      {/* Page header */}
      <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="text-xs font-medium tracking-[0.2em] uppercase mb-1" style={{ fontFamily: IBP, color: 'rgba(250,204,21,0.7)' }}>
          Programs
        </p>
        <h1 className="text-3xl font-black text-white" style={{ fontFamily: BC }}>WORKOUT ROUTINES</h1>
        <p className="text-sm mt-1" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.55)' }}>
          3 predefined programs to assign to your members.
        </p>
      </motion.div>

      {/* Program cards */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-5" variants={stagger} initial="hidden" animate="visible">
        {PROGRAMS.map(({ id, icon: Icon, level, name, desc, duration, sessions, color, spotColor, border, exercises }) => (
          <motion.div key={id} variants={fadeUp}>
            <TiltCard className="h-full" rotateAmplitude={6} scaleOnHover={1.03}>
              <SpotlightCard
                className="h-full flex flex-col rounded-xl overflow-hidden cursor-default"
                style={{ background: CRD, border: `1px solid ${border}` }}
                spotlightColor={spotColor}
              >
              {/* Card header */}
              <div className="px-6 py-5" style={{ background: `${color}06`, borderBottom: `1px solid ${border}` }}>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${color}12`, border: `1px solid ${color}28` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} aria-hidden="true" />
                  </div>
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide"
                    style={{ fontFamily: IBP, background: `${color}12`, border: `1px solid ${color}28`, color }}
                  >
                    {level}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white mb-1" style={{ fontFamily: BC }}>{name}</h3>
                <p className="text-sm leading-relaxed" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.6)' }}>{desc}</p>
              </div>

              {/* Meta info */}
              <div className="px-6 py-4 grid grid-cols-2 gap-3" style={{ borderBottom: `1px solid ${BDR}` }}>
                {[{ label: 'Duration', val: duration }, { label: 'Frequency', val: sessions }].map(({ label, val }) => (
                  <div key={label}>
                    <p className="text-[10px] uppercase tracking-widest font-semibold mb-0.5" style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.4)' }}>{label}</p>
                    <p className="text-base font-black" style={{ fontFamily: BC, color }}>{val}</p>
                  </div>
                ))}
              </div>

              {/* Exercise list */}
              <div className="px-6 py-5 flex-1">
                <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.4)' }}>
                  Exercises
                </p>
                <div className="space-y-2.5">
                  {exercises.map(({ name: exName, sets }) => (
                    <div key={exName} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Dumbbell className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} aria-hidden="true" />
                        <span className="text-sm truncate" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.7)' }}>{exName}</span>
                      </div>
                      <span className="text-xs font-semibold flex-shrink-0 ml-2" style={{ fontFamily: IBP, color }}>{sets}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assign button */}
              <div className="px-6 pb-5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                  style={{ fontFamily: INT, background: `${color}12`, border: `1px solid ${border}`, color }}
                >
                  Assign to Member
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </motion.button>
              </div>
            </SpotlightCard>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
