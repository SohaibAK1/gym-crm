import { motion } from 'framer-motion'
import { CreditCard, Users, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react'

const BC = "'Barlow Condensed', sans-serif"
const BL = "'Barlow', sans-serif"

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }

const SAMPLE_MEMBERS = [
  { name: 'Alex Rahman',  plan: 'Pro Monthly',     status: 'active',   expires: 'Jun 12, 2025', initials: 'AR' },
  { name: 'Maria Santos', plan: 'Elite Annual',    status: 'active',   expires: 'Mar 1, 2026',  initials: 'MS' },
  { name: 'John Kim',     plan: 'Starter Monthly', status: 'expiring', expires: 'May 28, 2025', initials: 'JK' },
  { name: 'Priya Patel',  plan: 'Pro Monthly',     status: 'active',   expires: 'Jul 3, 2025',  initials: 'PP' },
  { name: 'Omar Hassan',  plan: 'Starter Monthly', status: 'expired',  expires: 'May 1, 2025',  initials: 'OH' },
]

const STATUS_MAP = {
  active:   { label: 'Active',   color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/30'  },
  expiring: { label: 'Expiring', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  expired:  { label: 'Expired',  color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30'    },
}

const STAT_CARDS = [
  { label: 'Active Plans',    icon: CheckCircle,   color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20',  glow: 'rgba(34,197,94,0.15)'    },
  { label: 'Expiring Soon',   icon: Clock,         color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', glow: 'rgba(234,179,8,0.15)'    },
  { label: 'Expired',         icon: AlertTriangle, color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20',    glow: 'rgba(239,68,68,0.15)'    },
  { label: 'Monthly Revenue', icon: TrendingUp,    color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', glow: 'rgba(168,85,247,0.15)'   },
]

const PLANS = [
  { name: 'Starter', price: '$29/mo',  border: 'border-blue-500/30',   bg: 'bg-blue-500/5',   label: 'text-blue-400'   },
  { name: 'Pro',     price: '$79/mo',  border: 'border-orange-500/30', bg: 'bg-orange-500/5', label: 'text-orange-400' },
  { name: 'Elite',   price: '$149/mo', border: 'border-purple-500/30', bg: 'bg-purple-500/5', label: 'text-purple-400' },
]

export default function Subscriptions() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-full bg-gray-800 relative overflow-hidden">

      {/* Background glow decorations */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 65%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 left-1/3 w-72 h-72 rounded-full pointer-events-none"
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
          Manage
        </p>
        <h1 className="text-3xl font-black text-white" style={{ fontFamily: BC }}>
          SUBSCRIPTIONS
        </h1>
        <p className="text-gray-400 text-sm mt-1" style={{ fontFamily: BL }}>
          Membership plans and billing overview.
        </p>
      </motion.div>

      {/* Stats row */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {STAT_CARDS.map(({ label, icon: Icon, color, bg, border, glow }, idx) => (
          <motion.div key={label} variants={fadeUp}>
            <div className={`bg-gray-900 border ${border} rounded-2xl p-4 sm:p-5 relative overflow-hidden`}>
              {/* Pulse glow */}
              <motion.div
                className="absolute -top-4 -right-4 w-16 h-16 rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 65%)` }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.4 }}
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

      {/* Plan overview cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {PLANS.map(({ name, price, border, bg, label }) => (
          <div key={name} className={`bg-gray-900 border ${border} ${bg} rounded-2xl p-5 relative overflow-hidden`}>
            {/* Shimmer on hover */}
            <div
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)' }}
              aria-hidden="true"
            />
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-base font-black ${label}`} style={{ fontFamily: BC }}>
                {name}
              </h3>
              <CreditCard className={`w-4 h-4 ${label}`} aria-hidden="true" />
            </div>
            <div className="text-2xl font-black text-white mb-1" style={{ fontFamily: BC }}>
              {price}
            </div>
            <div className="text-xs text-gray-500" style={{ fontFamily: BL }}>— members</div>
          </div>
        ))}
      </motion.div>

      {/* Members table */}
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
            MEMBERS
          </h2>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-black text-xs transition-colors duration-200 cursor-pointer flex items-center gap-1.5"
            style={{ fontFamily: BC, letterSpacing: '0.06em' }}
          >
            <Users className="w-3.5 h-3.5" aria-hidden="true" /> ADD MEMBER
          </motion.button>
        </div>

        <div className="divide-y divide-gray-700/50">
          {SAMPLE_MEMBERS.map(({ name, plan, status, expires, initials }) => {
            const s = STATUS_MAP[status]
            return (
              <div key={name} className="flex items-center gap-4 px-5 py-4">
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
                <div className="hidden sm:block text-xs text-gray-500 flex-shrink-0" style={{ fontFamily: BL }}>
                  Exp: {expires}
                </div>
                <span
                  className={`text-xs font-black px-2.5 py-1 rounded-full border flex-shrink-0 ${s.bg} ${s.border} ${s.color}`}
                  style={{ fontFamily: BC }}
                >
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
