import { motion } from 'framer-motion'
import { CreditCard, Users, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react'
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

const SAMPLE_MEMBERS = [
  { name: 'Alex Rahman',  plan: 'Pro Monthly',     status: 'active',   expires: 'Jun 12, 2025', initials: 'AR' },
  { name: 'Maria Santos', plan: 'Elite Annual',    status: 'active',   expires: 'Mar 1, 2026',  initials: 'MS' },
  { name: 'John Kim',     plan: 'Starter Monthly', status: 'expiring', expires: 'May 28, 2025', initials: 'JK' },
  { name: 'Priya Patel',  plan: 'Pro Monthly',     status: 'active',   expires: 'Jul 3, 2025',  initials: 'PP' },
  { name: 'Omar Hassan',  plan: 'Starter Monthly', status: 'expired',  expires: 'May 1, 2025',  initials: 'OH' },
]

const STATUS_MAP = {
  active:   { label: 'Active',   color: '#34D399',  bg: 'rgba(52,211,153,0.1)',   border: 'rgba(52,211,153,0.3)'   },
  expiring: { label: 'Expiring', color: '#FB923C',  bg: 'rgba(251,146,60,0.1)',   border: 'rgba(251,146,60,0.3)'   },
  expired:  { label: 'Expired',  color: '#F87171',  bg: 'rgba(248,113,113,0.1)',  border: 'rgba(248,113,113,0.3)'  },
}

const STAT_CARDS = [
  { label: 'Active Plans',    icon: CheckCircle,   color: '#34D399',  spotColor: 'rgba(52,211,153,0.12)'   },
  { label: 'Expiring Soon',   icon: Clock,         color: '#FB923C',  spotColor: 'rgba(251,146,60,0.12)'   },
  { label: 'Expired',         icon: AlertTriangle, color: '#F87171',  spotColor: 'rgba(248,113,113,0.12)'  },
  { label: 'Monthly Revenue', icon: TrendingUp,    color: V,          spotColor: 'rgba(250,204,21,0.15)'   },
]

const PLANS = [
  { name: 'Starter', price: '$29/mo', color: '#60A5FA', spotColor: 'rgba(96,165,250,0.12)'    },
  { name: 'Pro',     price: '$79/mo', color: V,          spotColor: 'rgba(250,204,21,0.15)'   },
  { name: 'Elite',   price: '$149/mo', color: '#FB923C', spotColor: 'rgba(251,146,60,0.12)'   },
]

export default function Subscriptions() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-full relative overflow-hidden" style={{ background: '#0A0A0A' }}>

      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(250,204,21,0.06) 0%, transparent 65%)' }} aria-hidden="true" />
      <div className="absolute bottom-10 left-1/3 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(250,204,21,0.03) 0%, transparent 65%)' }} aria-hidden="true" />

      {/* Page header */}
      <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="text-xs font-medium tracking-[0.2em] uppercase mb-1" style={{ fontFamily: IBP, color: 'rgba(250,204,21,0.7)' }}>
          Manage
        </p>
        <h1 className="text-3xl font-black text-white" style={{ fontFamily: BC }}>SUBSCRIPTIONS</h1>
        <p className="text-sm mt-1" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.55)' }}>Membership plans and billing overview.</p>
      </motion.div>

      {/* Stats row */}
      <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6" variants={stagger} initial="hidden" animate="visible">
        {STAT_CARDS.map(({ label, icon: Icon, color, spotColor }) => (
          <motion.div key={label} variants={fadeUp}>
            <TiltCard rotateAmplitude={8} scaleOnHover={1.04}>
              <SpotlightCard
                className="rounded-xl p-4 sm:p-5"
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

      {/* Plan overview cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {PLANS.map(({ name, price, color, spotColor }) => (
          <SpotlightCard
            key={name}
            className="rounded-xl p-5"
            style={{ background: CRD, border: `1px solid ${color}25` }}
            spotlightColor={spotColor}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-black uppercase" style={{ fontFamily: BC, color }}>{name}</h3>
              <CreditCard className="w-4 h-4" style={{ color }} aria-hidden="true" />
            </div>
            <div className="text-2xl font-black text-white mb-1" style={{ fontFamily: BC }}>{price}</div>
            <div className="text-xs" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>— members</div>
          </SpotlightCard>
        ))}
      </motion.div>

      {/* Members table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
        <SpotlightCard
          className="rounded-xl overflow-hidden"
          style={{ background: CRD, border: `1px solid ${BDR}` }}
          spotlightColor="rgba(250,204,21,0.08)"
        >
          <div className="flex items-center justify-between p-5" style={{ borderBottom: `1px solid ${BDR}` }}>
            <h2 className="text-base font-black text-white" style={{ fontFamily: BC }}>MEMBERS</h2>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-2 rounded-lg font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-colors duration-200"
              style={{ fontFamily: INT, background: V, color: '#0A0A0A' }}
            >
              <Users className="w-3.5 h-3.5" aria-hidden="true" /> Add Member
            </motion.button>
          </div>

          <div className="divide-y" style={{ borderColor: BDR }}>
            {SAMPLE_MEMBERS.map(({ name, plan, status, expires, initials }) => {
              const s = STATUS_MAP[status]
              return (
                <div key={name} className="flex items-center gap-4 px-5 py-4">
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
                  <div className="hidden sm:block text-xs flex-shrink-0" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>
                    Exp: {expires}
                  </div>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{ fontFamily: INT, background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
                  >
                    {s.label}
                  </span>
                </div>
              )
            })}
          </div>
        </SpotlightCard>
      </motion.div>
    </div>
  )
}
