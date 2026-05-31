import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, TrendingUp, QrCode, CreditCard, Activity, Bell, ArrowUpRight } from 'lucide-react'
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
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }

const STATS = [
  { label: 'Total Members',   icon: Users,      color: V,          spotColor: 'rgba(250,204,21,0.15)',  sub: 'Active memberships' },
  { label: 'Check-ins Today', icon: QrCode,     color: '#34D399',  spotColor: 'rgba(52,211,153,0.15)',  sub: 'Scanned or manual'  },
  { label: 'Active Plans',    icon: CreditCard, color: '#60A5FA',  spotColor: 'rgba(96,165,250,0.15)',  sub: 'Paid subscriptions' },
  { label: 'Monthly Revenue', icon: TrendingUp, color: '#FB923C',  spotColor: 'rgba(251,146,60,0.15)',  sub: 'Current month'      },
]

const QUICK_ACTIONS = [
  { label: 'Log Check-In', to: '/attendance',    icon: QrCode,    color: '#34D399'  },
  { label: 'Add Member',   to: '/subscriptions', icon: Users,     color: V          },
  { label: 'Routines',     to: '/routines',      icon: Activity,  color: '#60A5FA'  },
  { label: 'Renewals',     to: '/subscriptions', icon: Bell,      color: '#FB923C'  },
]

const SETUP_STEPS = [
  { step: '01', label: 'Add your first member'    },
  { step: '02', label: 'Set up subscription plans' },
  { step: '03', label: 'Assign a workout routine'  },
  { step: '04', label: 'Enable QR check-in'        },
]

export default function Dashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-full relative overflow-hidden" style={{ background: '#0A0A0A' }}>

      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(250,204,21,0.07) 0%, transparent 65%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(250,204,21,0.04) 0%, transparent 65%)' }}
        aria-hidden="true"
      />

      {/* Page header */}
      <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeUp}>
        <p className="text-xs font-medium tracking-[0.2em] uppercase mb-1" style={{ fontFamily: IBP, color: 'rgba(250,204,21,0.7)' }}>
          Overview
        </p>
        <h1 className="text-3xl font-black text-white" style={{ fontFamily: BC }}>DASHBOARD</h1>
        <p className="text-sm mt-1" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.55)' }}>
          Your gym at a glance.
        </p>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {STATS.map(({ label, icon: Icon, color, spotColor, sub }) => (
          <motion.div key={label} variants={fadeUp}>
            <TiltCard rotateAmplitude={8} scaleOnHover={1.04}>
              <SpotlightCard
                className="rounded-xl p-5 cursor-default"
                style={{ background: CRD, border: `1px solid ${BDR}` }}
                spotlightColor={spotColor}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} aria-hidden="true" />
                  </div>
                  <ArrowUpRight className="w-4 h-4" style={{ color: 'rgba(249,250,251,0.2)' }} aria-hidden="true" />
                </div>
                <div className="text-3xl font-black text-white mb-0.5" style={{ fontFamily: BC }}>—</div>
                <div className="text-sm font-semibold text-white mb-0.5" style={{ fontFamily: INT }}>{label}</div>
                <div className="text-xs" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.55)' }}>{sub}</div>
              </SpotlightCard>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom two-column grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Quick actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
          <SpotlightCard
            className="rounded-xl p-6"
            style={{ background: CRD, border: `1px solid ${BDR}` }}
            spotlightColor="rgba(250,204,21,0.1)"
          >
            <h2 className="text-base font-black text-white mb-4" style={{ fontFamily: BC }}>QUICK ACTIONS</h2>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map(({ label, to, icon: Icon, color }) => (
                <Link
                  key={label}
                  to={to}
                  className="flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 cursor-pointer"
                  style={{ background: 'rgba(249,250,251,0.03)', border: `1px solid ${BDR}` }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(250,204,21,0.05)'; e.currentTarget.style.borderColor = 'rgba(250,204,21,0.25)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(249,250,251,0.03)'; e.currentTarget.style.borderColor = BDR }}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" style={{ color }} aria-hidden="true" />
                  <span className="text-sm font-semibold text-white" style={{ fontFamily: INT }}>{label}</span>
                </Link>
              ))}
            </div>
          </SpotlightCard>
        </motion.div>

        {/* Getting started */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
          <SpotlightCard
            className="rounded-xl p-6 relative overflow-hidden"
            style={{ background: CRD, border: `1px solid rgba(250,204,21,0.2)` }}
            spotlightColor="rgba(250,204,21,0.12)"
          >
            <motion.div
              className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(250,204,21,0.1) 0%, transparent 65%)' }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            />
            <h2 className="text-base font-black text-white mb-1 relative" style={{ fontFamily: BC }}>GETTING STARTED</h2>
            <p className="text-sm mb-5 relative" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.55)' }}>
              Complete these steps to set up your gym CRM.
            </p>
            <div className="space-y-3 relative">
              {SETUP_STEPS.map(({ step, label }) => (
                <div key={step} className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{ fontFamily: IBP, background: 'rgba(250,204,21,0.08)', border: `1px solid ${BDR}`, color: V }}
                  >
                    {step}
                  </div>
                  <span className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.65)' }}>{label}</span>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </motion.div>
      </div>
    </div>
  )
}
