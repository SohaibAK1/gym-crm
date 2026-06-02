import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Eye, EyeOff, QrCode, CreditCard, TrendingUp, CheckCircle, Dumbbell } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import Aurora from '../components/bits/Aurora'
import BlurText from '../components/bits/BlurText'
import CountUp from '../components/bits/CountUp'

const BC  = "'Barlow Condensed', sans-serif"
const INT = 'Inter, system-ui, sans-serif'
const IBP = "'IBM Plex Mono', ui-monospace, monospace"

const V   = '#FACC15'
const BG  = '#0A0A0A'
const CRD = '#1E1C18'

const FEATURES = [
  { icon: CheckCircle, text: 'Member Management & Profiles' },
  { icon: QrCode,      text: 'QR Code Check-in Tracking'    },
  { icon: CreditCard,  text: 'Subscription & Billing'        },
  { icon: TrendingUp,  text: 'Analytics & Reporting'         },
]

const PANEL_STATS = [
  { to: 500, suffix: '+',  label: 'Members'   },
  { to: 98,  suffix: '%',  label: 'Retention' },
  { to: 3,   suffix: '×',  label: 'Faster'    },
]

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const fadeUp  = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export default function Login() {
  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) throw new Error(err.message)

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle()

      if (!profile) throw new Error('Account not set up. Contact your administrator.')

      if (profile.role === 'admin') navigate('/admin/dashboard')
      else navigate('/member/home')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: BG }}>

      {/* ── LEFT PANEL ────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden flex-col">
        <div className="absolute inset-0" aria-hidden="true">
          <Aurora colorStops={['#92400E', '#FACC15', '#92400E']} amplitude={1.0} blend={0.55} speed={0.4} />
        </div>
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(10,10,10,0.82) 0%, rgba(10,10,10,0.5) 55%, rgba(10,10,10,0.75) 100%)' }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-y-0 right-0 w-40 pointer-events-none"
          style={{ background: 'linear-gradient(to right, transparent, rgba(10,10,10,0.8))' }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">
          <Link to="/" className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5" style={{ color: V }} aria-hidden="true" />
            <span className="text-xl font-black text-white leading-none" style={{ fontFamily: BC }}>Golden</span>
            <span className="text-xl font-black leading-none" style={{ fontFamily: BC, color: V }}>Biceps</span>
          </Link>

          <motion.div className="my-auto" initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp}>
              <span
                className="inline-flex items-center gap-1.5 text-xs font-medium tracking-[0.2em] uppercase px-3 py-1.5 rounded-full mb-5"
                style={{ fontFamily: IBP, color: V, border: '1px solid rgba(250,204,21,0.3)', background: 'rgba(250,204,21,0.08)' }}
              >
                GOLDEN BICEPS GYM
              </span>
            </motion.div>

            <div className="mb-5">
              <BlurText
                text="MANAGE YOUR GYM SMARTER."
                delay={80}
                animateBy="words"
                direction="top"
                stepDuration={0.35}
                className="font-black text-white uppercase leading-[0.9]"
                style={{ fontFamily: BC, fontSize: 'clamp(2.5rem, 4vw, 3.8rem)', letterSpacing: '-0.02em' }}
              />
            </div>

            <motion.p variants={fadeUp} className="text-sm leading-relaxed mb-8 max-w-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.65)' }}>
              Everything you need to run a world-class gym — member management,
              attendance tracking, subscriptions, and workout routines in one place.
            </motion.p>

            <motion.div variants={stagger} className="space-y-3 mb-9">
              {FEATURES.map(({ icon: Icon, text }) => (
                <motion.div key={text} variants={fadeUp} className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.25)' }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: V }} aria-hidden="true" />
                  </div>
                  <span className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.75)' }}>{text}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="flex gap-8">
              {PANEL_STATS.map(({ to, suffix, label }) => (
                <div key={label}>
                  <div className="text-2xl font-black leading-none mb-0.5" style={{ fontFamily: IBP, color: V }}>
                    <CountUp to={to} duration={2} delay={0.8} />{suffix}
                  </div>
                  <div className="text-xs" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.55)' }}>{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="text-xs mt-auto italic"
            style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}
          >
            "The all-in-one platform built for serious gym operators."
          </motion.p>
        </div>
      </div>

      {/* ── RIGHT PANEL ───────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-10 relative overflow-hidden" style={{ background: BG }}>
        <div
          className="absolute -top-48 -right-48 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(250,204,21,0.1) 0%, transparent 65%)' }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -left-24 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(250,204,21,0.05) 0%, transparent 65%)' }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(250,204,21,0.07) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-sm"
        >
          <Link to="/" className="flex items-center justify-center gap-1.5 mb-8 lg:hidden">
            <Dumbbell className="w-5 h-5" style={{ color: V }} aria-hidden="true" />
            <span className="text-2xl font-black text-white" style={{ fontFamily: BC }}>Golden</span>
            <span className="text-2xl font-black" style={{ fontFamily: BC, color: V }}>Biceps</span>
          </Link>

          <div
            className="rounded-2xl p-8 shadow-2xl"
            style={{ background: CRD, border: '1px solid rgba(250,204,21,0.18)', boxShadow: '0 0 60px rgba(250,204,21,0.06)' }}
          >
            <div className="text-center mb-7">
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: BC }}>WELCOME BACK</h1>
              <p className="text-sm mt-1" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.55)' }}>
                Sign in to your Golden Biceps account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.55)' }}>
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'rgba(249,250,251,0.4)' }} aria-hidden="true" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none transition-colors duration-200"
                    style={{ fontFamily: INT, background: 'rgba(249,250,251,0.04)', border: '1px solid rgba(250,204,21,0.18)' }}
                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(250,204,21,0.6)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(250,204,21,0.18)'}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.55)' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'rgba(249,250,251,0.4)' }} aria-hidden="true" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none transition-colors duration-200"
                    style={{ fontFamily: INT, background: 'rgba(249,250,251,0.04)', border: '1px solid rgba(250,204,21,0.18)' }}
                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(250,204,21,0.6)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(250,204,21,0.18)'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200 cursor-pointer"
                    style={{ color: 'rgba(249,250,251,0.4)' }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm text-center"
                  style={{ fontFamily: INT }}
                  role="alert"
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full py-3.5 mt-2 rounded-xl font-bold text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200"
                style={{ fontFamily: INT, background: V, color: '#0A0A0A', boxShadow: '0 0 24px rgba(250,204,21,0.3)' }}
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" aria-label="Signing in" />
                ) : (
                  <>SIGN IN <ArrowRight className="w-4 h-4" /></>
                )}
              </motion.button>
            </form>
          </div>

          <p className="text-center text-sm mt-6" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>
            <Link to="/" className="transition-colors duration-200 hover:text-white">
              ← Back to Home
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
