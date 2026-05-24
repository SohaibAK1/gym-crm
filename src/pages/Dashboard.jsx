import { useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Users, TrendingUp, QrCode, CreditCard, ArrowUpRight, Activity, Bell } from 'lucide-react'

const BC = "'Barlow Condensed', sans-serif"
const BL = "'Barlow', sans-serif"

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }

const STATS = [
  { label: 'Total Members',   icon: Users,      color: 'orange', sub: 'Active memberships' },
  { label: 'Check-ins Today', icon: QrCode,     color: 'green',  sub: 'Scanned or manual'  },
  { label: 'Active Plans',    icon: CreditCard, color: 'blue',   sub: 'Paid subscriptions' },
  { label: 'Monthly Revenue', icon: TrendingUp, color: 'purple', sub: 'Current month'       },
]

const COLOR_MAP = {
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: 'text-orange-400' },
  green:  { bg: 'bg-green-500/10',  border: 'border-green-500/20',  icon: 'text-green-400'  },
  blue:   { bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   icon: 'text-blue-400'   },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: 'text-purple-400' },
}

const QUICK_ACTIONS = [
  { label: 'Log Check-In', to: '/attendance',    icon: QrCode,    color: 'text-orange-400' },
  { label: 'Add Member',   to: '/subscriptions', icon: Users,     color: 'text-green-400'  },
  { label: 'Routines',     to: '/routines',      icon: Activity,  color: 'text-blue-400'   },
  { label: 'Renewals',     to: '/subscriptions', icon: Bell,      color: 'text-purple-400' },
]

const SETUP_STEPS = [
  { step: '01', label: 'Add your first member'       },
  { step: '02', label: 'Set up subscription plans'   },
  { step: '03', label: 'Assign a workout routine'    },
  { step: '04', label: 'Enable QR check-in'          },
]

function TiltCard({ children, className = '' }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 28 })
  const sy = useSpring(y, { stiffness: 220, damping: 28 })
  const rotateX = useTransform(sy, [-0.5, 0.5], [7, -7])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-7, 7])

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
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function Dashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-full bg-gray-800 relative overflow-hidden">

      {/* Background glow decorations */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 65%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full pointer-events-none"
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
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <p
          className="text-orange-500 text-xs font-black tracking-[0.2em] uppercase mb-1"
          style={{ fontFamily: BC }}
        >
          Overview
        </p>
        <h1 className="text-3xl font-black text-white" style={{ fontFamily: BC }}>
          DASHBOARD
        </h1>
        <p className="text-gray-400 text-sm mt-1" style={{ fontFamily: BL }}>
          Your gym at a glance.
        </p>
      </motion.div>

      {/* Stats grid — with 3D tilt */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8"
        variants={stagger}
        initial="hidden"
        animate="visible"
        style={{ perspective: 1200 }}
      >
        {STATS.map(({ label, icon: Icon, color, sub }) => {
          const c = COLOR_MAP[color]
          return (
            <motion.div key={label} variants={fadeUp}>
              <TiltCard>
                <div
                  className={`bg-gray-900 border ${c.border} rounded-2xl p-5 hover:border-orange-500/40 transition-colors duration-200 cursor-default relative overflow-hidden`}
                >
                  {/* Shimmer sweep on hover */}
                  <div
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.05), transparent)' }}
                    aria-hidden="true"
                  />
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}
                    >
                      <Icon className={`w-5 h-5 ${c.icon}`} aria-hidden="true" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-600" aria-hidden="true" />
                  </div>
                  <div className="text-3xl font-black text-white mb-0.5" style={{ fontFamily: BC }}>
                    —
                  </div>
                  <div className="text-sm font-black text-gray-300 mb-0.5" style={{ fontFamily: BC }}>
                    {label}
                  </div>
                  <div className="text-xs text-gray-500" style={{ fontFamily: BL }}>
                    {sub}
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Bottom two-column grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Quick actions */}
        <motion.div
          className="bg-gray-900 border border-gray-700/50 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-base font-black text-white mb-4" style={{ fontFamily: BC }}>
            QUICK ACTIONS
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map(({ label, to, icon: Icon, color }) => (
              <Link
                key={label}
                to={to}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-800 border border-gray-700/50 hover:border-orange-500/30 hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group"
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${color}`} aria-hidden="true" />
                <span
                  className="text-sm font-black text-gray-300 group-hover:text-white transition-colors duration-200"
                  style={{ fontFamily: BC }}
                >
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Getting started checklist */}
        <motion.div
          className="bg-gray-900 rounded-2xl p-6 relative overflow-hidden"
          style={{ border: '1px solid rgba(249,115,22,0.2)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {/* Animated glow pulse */}
          <motion.div
            className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 65%)' }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />
          <h2 className="text-base font-black text-white mb-1 relative" style={{ fontFamily: BC }}>
            GETTING STARTED
          </h2>
          <p className="text-gray-400 text-sm mb-5 relative" style={{ fontFamily: BL }}>
            Complete these steps to set up your gym CRM.
          </p>
          <div className="space-y-3 relative">
            {SETUP_STEPS.map(({ step, label }) => (
              <div key={step} className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 bg-gray-800 border border-gray-600 text-gray-400"
                  style={{ fontFamily: BC }}
                >
                  {step}
                </div>
                <span className="text-sm text-gray-300" style={{ fontFamily: BL }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
