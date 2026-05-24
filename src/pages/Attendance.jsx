import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, UserCheck, Clock, Search, CheckCircle } from 'lucide-react'

const BC = "'Barlow Condensed', sans-serif"
const BL = "'Barlow', sans-serif"

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
  { label: "Today's Check-ins", icon: UserCheck, color: 'text-orange-400', border: 'border-orange-500/20', bg: 'bg-orange-500/10' },
  { label: 'This Week',         icon: Clock,     color: 'text-blue-400',   border: 'border-blue-500/20',   bg: 'bg-blue-500/10'   },
  { label: 'Peak Hour',         icon: QrCode,    color: 'text-green-400',  border: 'border-green-500/20',  bg: 'bg-green-500/10'  },
]

export default function Attendance() {
  const [query, setQuery] = useState('')

  const filtered = SAMPLE_CHECKINS.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-full bg-gray-800 relative overflow-hidden">

      {/* Background glow decorations */}
      <div
        className="absolute -top-28 -right-28 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 65%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 -left-20 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 65%)' }}
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
          Track
        </p>
        <h1 className="text-3xl font-black text-white" style={{ fontFamily: BC }}>
          ATTENDANCE
        </h1>
        <p className="text-gray-400 text-sm mt-1" style={{ fontFamily: BL }}>
          Member check-ins and daily tracking.
        </p>
      </motion.div>

      {/* Stats row */}
      <motion.div
        className="grid grid-cols-3 gap-4 mb-8"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {STAT_CARDS.map(({ label, icon: Icon, color, border, bg }, idx) => (
          <motion.div key={label} variants={fadeUp}>
            <div className={`bg-gray-900 border ${border} rounded-2xl p-4 sm:p-5 relative overflow-hidden`}>
              {/* Subtle inner glow */}
              <motion.div
                className="absolute -top-4 -right-4 w-16 h-16 rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 65%)` }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.5 }}
                aria-hidden="true"
              />
              <div className={`w-9 h-9 rounded-xl ${bg} border ${border} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${color}`} aria-hidden="true" />
              </div>
              <div className="text-2xl font-black text-white" style={{ fontFamily: BC }}>—</div>
              <div className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: BL }}>{label}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Manual check-in */}
      <motion.div
        className="bg-gray-900 rounded-2xl p-6 mb-6 relative overflow-hidden"
        style={{ border: '1px solid rgba(249,115,22,0.2)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* Corner glow */}
        <motion.div
          className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 65%)' }}
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        />
        <div className="flex items-center gap-3 mb-4 relative">
          <div
            className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center"
            style={{ border: '1px solid rgba(249,115,22,0.2)' }}
          >
            <QrCode className="w-5 h-5 text-orange-400" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-black text-white" style={{ fontFamily: BC }}>
              MANUAL CHECK-IN
            </h2>
            <p className="text-xs text-gray-400" style={{ fontFamily: BL }}>
              Log a member check-in manually
            </p>
          </div>
        </div>
        <div className="flex gap-3 relative">
          <input
            type="text"
            placeholder="Search member name or ID…"
            className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors duration-200"
            style={{ fontFamily: BL }}
            aria-label="Search member for check-in"
          />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm transition-colors duration-200 shadow-lg shadow-orange-500/20 cursor-pointer flex-shrink-0"
            style={{ fontFamily: BC, letterSpacing: '0.06em' }}
          >
            CHECK IN
          </motion.button>
        </div>
      </motion.div>

      {/* Recent check-ins list */}
      <motion.div
        className="bg-gray-900 border border-gray-700/50 rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div
          className="flex items-center justify-between p-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <h2 className="text-base font-black text-white" style={{ fontFamily: BC }}>
            RECENT CHECK-INS
          </h2>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter…"
              className="pl-9 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-orange-500 transition-colors duration-200 w-32 sm:w-40"
              style={{ fontFamily: BL }}
              aria-label="Filter check-ins"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-700/50">
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
                  className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-black text-xs flex-shrink-0"
                  style={{ fontFamily: BC }}
                  aria-hidden="true"
                >
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-white truncate" style={{ fontFamily: BC }}>
                    {name}
                  </p>
                  <p className="text-xs text-gray-400 truncate" style={{ fontFamily: BL }}>
                    {plan}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-500" style={{ fontFamily: BL }}>{time}</span>
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="px-5 py-10 text-center text-gray-500 text-sm" style={{ fontFamily: BL }}>
              No check-ins match your search.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
