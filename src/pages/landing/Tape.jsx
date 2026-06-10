import { motion } from 'framer-motion'
import { IBP, BG, BDR } from './constants'

const TAPE_ITEMS = [
  'QR Check-In', 'Daily Workouts', 'Attendance Streak', 'Body Stats',
  'Progress Charts', 'Gym Announcements', 'Membership Status', 'Personal Profile',
]

export default function Tape() {
  return (
    <div
      className="overflow-hidden py-3"
      style={{ background: BG, borderTop: `1px solid ${BDR}`, borderBottom: `1px solid ${BDR}` }}
    >
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      >
        {[...TAPE_ITEMS, ...TAPE_ITEMS].map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 text-xs font-medium tracking-[0.22em] uppercase"
            style={{ fontFamily: IBP, color: 'rgba(250,204,21,0.6)' }}
          >
            <span className="w-1 h-1 rounded-full" style={{ background: '#FACC15' }} aria-hidden="true" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
