import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, UserCheck, Clock, Search, CheckCircle } from 'lucide-react'
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
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }

const SAMPLE_CHECKINS = [
  { name: 'Alex Rahman',  plan: 'Pro Monthly',     time: '2 min ago',  initials: 'AR' },
  { name: 'Maria Santos', plan: 'Elite Annual',    time: '8 min ago',  initials: 'MS' },
  { name: 'John Kim',     plan: 'Starter Monthly', time: '15 min ago', initials: 'JK' },
  { name: 'Priya Patel',  plan: 'Pro Monthly',     time: '31 min ago', initials: 'PP' },
  { name: 'Omar Hassan',  plan: 'Pro Monthly',     time: '47 min ago', initials: 'OH' },
]

const STAT_CARDS = [
  { label: "Today's Check-ins", icon: UserCheck, color: V,          spotColor: 'rgba(250,204,21,0.15)'  },
  { label: 'This Week',         icon: Clock,     color: '#60A5FA',  spotColor: 'rgba(96,165,250,0.15)'  },
  { label: 'Peak Hour',         icon: QrCode,    color: '#34D399',  spotColor: 'rgba(52,211,153,0.15)'  },
]

export default function Attendance() {
  const [query, setQuery] = useState('')

  const filtered = SAMPLE_CHECKINS.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-full relative overflow-hidden" style={{ background: '#0A0A0A' }}>

      <div className="absolute -top-28 -right-28 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(250,204,21,0.06) 0%, transparent 65%)' }} aria-hidden="true" />
      <div className="absolute bottom-10 -left-20 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(250,204,21,0.04) 0%, transparent 65%)' }} aria-hidden="true" />

      {/* Page header */}
      <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="text-xs font-medium tracking-[0.2em] uppercase mb-1" style={{ fontFamily: IBP, color: 'rgba(250,204,21,0.7)' }}>
          Track
        </p>
        <h1 className="text-3xl font-black text-white" style={{ fontFamily: BC }}>ATTENDANCE</h1>
        <p className="text-sm mt-1" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.55)' }}>Member check-ins and daily tracking.</p>
      </motion.div>

      {/* Stats row */}
      <motion.div className="grid grid-cols-3 gap-4 mb-6" variants={stagger} initial="hidden" animate="visible">
        {STAT_CARDS.map(({ label, icon: Icon, color, spotColor }) => (
          <motion.div key={label} variants={fadeUp}>
            <TiltCard rotateAmplitude={8} scaleOnHover={1.04}>
              <SpotlightCard
                className="rounded-xl p-4 sm:p-5 relative overflow-hidden"
                style={{ background: CRD, border: `1px solid ${BDR}` }}
                spotlightColor={spotColor}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                >
                  <Icon className="w-4 h-4" style={{ color }} aria-hidden="true" />
                </div>
                <div className="text-2xl font-black text-white" style={{ fontFamily: BC }}>—</div>
                <div className="text-xs mt-0.5" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.55)' }}>{label}</div>
              </SpotlightCard>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Manual check-in */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-6"
      >
        <SpotlightCard
          className="rounded-xl p-6"
          style={{ background: CRD, border: `1px solid rgba(250,204,21,0.2)` }}
          spotlightColor="rgba(250,204,21,0.1)"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(250,204,21,0.08)', border: '1px solid rgba(250,204,21,0.2)' }}>
              <QrCode className="w-5 h-5" style={{ color: V }} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-black text-white" style={{ fontFamily: BC }}>MANUAL CHECK-IN</h2>
              <p className="text-xs" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.55)' }}>Log a member check-in manually</p>
            </div>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search member name or ID…"
              className="flex-1 px-4 py-3 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none transition-colors duration-200"
              style={{
                fontFamily: INT,
                background: 'rgba(249,250,251,0.04)',
                border: '1px solid rgba(250,204,21,0.18)',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(250,204,21,0.5)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(250,204,21,0.18)'}
              aria-label="Search member for check-in"
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3 rounded-xl font-bold text-sm transition-colors duration-200 cursor-pointer flex-shrink-0"
              style={{ fontFamily: INT, background: V, color: '#0A0A0A', boxShadow: '0 0 20px rgba(250,204,21,0.25)' }}
            >
              Check In
            </motion.button>
          </div>
        </SpotlightCard>
      </motion.div>

      {/* Recent check-ins */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
        <SpotlightCard
          className="rounded-xl overflow-hidden"
          style={{ background: CRD, border: `1px solid ${BDR}` }}
          spotlightColor="rgba(250,204,21,0.08)"
        >
          <div className="flex items-center justify-between p-5" style={{ borderBottom: `1px solid ${BDR}` }}>
            <h2 className="text-base font-black text-white" style={{ fontFamily: BC }}>RECENT CHECK-INS</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'rgba(249,250,251,0.35)' }} aria-hidden="true" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Filter…"
                className="pl-9 pr-4 py-2 rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none transition-colors duration-200 w-32 sm:w-40"
                style={{ fontFamily: INT, background: 'rgba(249,250,251,0.04)', border: `1px solid ${BDR}` }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(250,204,21,0.4)'}
                onBlur={e => e.currentTarget.style.borderColor = BDR}
                aria-label="Filter check-ins"
              />
            </div>
          </div>

          <div className="divide-y" style={{ borderColor: BDR }}>
            <AnimatePresence mode="popLayout">
              {filtered.map(({ name, plan, time, initials }) => (
                <motion.div
                  key={name}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{ background: 'rgba(250,204,21,0.12)', color: V, fontFamily: BC }}
                    aria-hidden="true"
                  >
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate" style={{ fontFamily: INT }}>{name}</p>
                    <p className="text-xs truncate" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.5)' }}>{plan}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>{time}</span>
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: V }} aria-hidden="true" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="px-5 py-10 text-center text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>
                No check-ins match your search.
              </div>
            )}
          </div>
        </SpotlightCard>
      </motion.div>
    </div>
  )
}
