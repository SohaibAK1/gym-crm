import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Eye, EyeOff, QrCode, CreditCard, TrendingUp, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

const BC = "'Barlow Condensed', sans-serif"
const BL = "'Barlow', sans-serif"

const GYM_IMG =
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&auto=format&fit=crop&q=60'

function DumbbellSVG({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 160 60" fill="none" className={className} style={style} aria-hidden="true">
      <rect x="0"   y="10" width="20" height="40" rx="4" fill="#374151" />
      <rect x="23"  y="18" width="13" height="24" rx="3" fill="#4B5563" />
      <rect x="39"  y="25" width="82" height="10" rx="4" fill="#6B7280" />
      <rect x="124" y="18" width="13" height="24" rx="3" fill="#4B5563" />
      <rect x="140" y="10" width="20" height="40" rx="4" fill="#374151" />
      <rect x="0"   y="10" width="5"  height="40" rx="3" fill="#F97316" opacity="0.8" />
      <rect x="155" y="10" width="5"  height="40" rx="3" fill="#F97316" opacity="0.8" />
    </svg>
  )
}

function FloatingCube({ size = 55, delay = 0 }) {
  const h = size / 2
  const faces = [
    { transform: `translateZ(${h}px)` },
    { transform: `translateZ(-${h}px) rotateY(180deg)` },
    { transform: `translateX(${h}px) rotateY(90deg)` },
    { transform: `translateX(-${h}px) rotateY(-90deg)` },
    { transform: `translateY(-${h}px) rotateX(90deg)` },
    { transform: `translateY(${h}px) rotateX(-90deg)` },
  ]
  return (
    <motion.div
      className="pointer-events-none"
      style={{ width: size, height: size, perspective: 600 }}
      animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
      transition={{ duration: 18, delay, repeat: Infinity, ease: 'linear' }}
    >
      <div style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d', position: 'relative' }}>
        {faces.map((f, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              border: '1px solid rgba(249,115,22,0.45)',
              background: 'rgba(249,115,22,0.04)',
              backfaceVisibility: 'hidden',
              ...f,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

const FEATURES = [
  { icon: CheckCircle, text: 'Member Management & Profiles' },
  { icon: QrCode,      text: 'QR Code Check-in Tracking'    },
  { icon: CreditCard,  text: 'Subscription & Billing'        },
  { icon: TrendingUp,  text: 'Analytics & Reporting'         },
]

const PANEL_STATS = [
  { value: '500+', label: 'Members'   },
  { value: '98%',  label: 'Retention' },
  { value: '3×',   label: 'Faster'    },
]

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const fadeUp  = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export default function Login() {
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (err) {
      setError(err.message)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-900 overflow-hidden">

      {/* ── LEFT PANEL — gym photo + features ──────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[58%] relative overflow-hidden flex-col">

        {/* Gym background */}
        <img
          src={GYM_IMG}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
        {/* Dark + orange gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.65) 55%, rgba(249,115,22,0.14) 100%)',
          }}
          aria-hidden="true"
        />
        {/* Bottom fade */}
        <div
          className="absolute inset-x-0 bottom-0 h-48"
          style={{ background: 'linear-gradient(to top, rgba(17,24,39,0.55), transparent)' }}
          aria-hidden="true"
        />
        {/* Glow orb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 right-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.11) 0%, transparent 65%)' }}
          aria-hidden="true"
        />

        {/* 3D floating cubes */}
        <motion.div
          className="absolute top-16 right-12 opacity-60"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <FloatingCube size={52} delay={0} />
        </motion.div>
        <motion.div
          className="absolute bottom-32 right-20 opacity-35"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        >
          <FloatingCube size={32} delay={2.5} />
        </motion.div>

        {/* Animated orange line accent */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-0.5"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(249,115,22,0.6), transparent)' }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <DumbbellSVG className="w-10 h-6" />
            <span className="text-xl font-black text-white"        style={{ fontFamily: BC }}>Iron</span>
            <span className="text-xl font-black text-orange-500"   style={{ fontFamily: BC }}>Hub</span>
          </div>

          {/* Hero content */}
          <motion.div
            className="my-auto"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              className="text-orange-400 text-xs font-black tracking-[0.25em] uppercase mb-3"
              style={{ fontFamily: BC }}
            >
              GYM MANAGEMENT PLATFORM
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl xl:text-5xl font-black text-white leading-[1.1] mb-5"
              style={{ fontFamily: BC }}
            >
              MANAGE YOUR<br />
              <span className="text-orange-400">GYM SMARTER.</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-gray-300 text-sm leading-relaxed mb-8 max-w-sm"
              style={{ fontFamily: BL }}
            >
              Everything you need to run a world-class gym — member management,
              attendance tracking, subscriptions, and workout routines in one place.
            </motion.p>

            {/* Feature list */}
            <motion.div variants={stagger} className="space-y-2.5 mb-9">
              {FEATURES.map(({ icon: Icon, text }) => (
                <motion.div key={text} variants={fadeUp} className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)' }}
                  >
                    <Icon className="w-3.5 h-3.5 text-orange-400" aria-hidden="true" />
                  </div>
                  <span className="text-sm text-gray-300" style={{ fontFamily: BL }}>{text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats row */}
            <motion.div variants={fadeUp} className="flex gap-8">
              {PANEL_STATS.map(({ value, label }) => (
                <div key={label}>
                  <div className="text-2xl font-black text-orange-400" style={{ fontFamily: BC }}>{value}</div>
                  <div className="text-xs text-gray-400 mt-0.5"        style={{ fontFamily: BL }}>{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Bottom quote */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-xs text-gray-500 mt-auto italic"
            style={{ fontFamily: BL }}
          >
            "The all-in-one platform built for serious gym operators."
          </motion.p>
        </div>
      </div>

      {/* ── RIGHT PANEL — login form ─────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-10 relative overflow-hidden">

        {/* Background blobs */}
        <div
          className="absolute -top-44 -right-32 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.13) 0%, transparent 65%)' }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -left-24 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 65%)' }}
          aria-hidden="true"
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
          aria-hidden="true"
        />
        {/* Tiny corner cube decoration */}
        <div className="absolute bottom-8 right-8 opacity-25 pointer-events-none" aria-hidden="true">
          <FloatingCube size={28} delay={1} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-1.5 mb-8 lg:hidden">
            <DumbbellSVG className="w-10 h-6" />
            <span className="text-2xl font-black text-white"      style={{ fontFamily: BC }}>Iron</span>
            <span className="text-2xl font-black text-orange-500" style={{ fontFamily: BC }}>Hub</span>
          </div>

          {/* Card */}
          <div
            className="bg-gray-800 rounded-2xl p-8 shadow-2xl"
            style={{ border: '1px solid rgba(249,115,22,0.2)' }}
          >
            <div className="text-center mb-7">
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: BC }}>
                WELCOME BACK
              </h1>
              <p className="text-gray-400 text-sm mt-1" style={{ fontFamily: BL }}>
                Sign in to your IronHub account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5"
                  style={{ fontFamily: BC }}
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors duration-200"
                    style={{ fontFamily: BL }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5"
                  style={{ fontFamily: BC }}
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors duration-200"
                    style={{ fontFamily: BL }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors duration-200 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm text-center"
                  style={{ fontFamily: BL }}
                  role="alert"
                >
                  {error}
                </motion.p>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full py-3.5 mt-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-base transition-colors duration-200 shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer"
                style={{ fontFamily: BC, letterSpacing: '0.08em' }}
              >
                {loading ? (
                  <span
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                    aria-label="Signing in"
                  />
                ) : (
                  <>
                    SIGN IN <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </>
                )}
              </motion.button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6" style={{ fontFamily: BL }}>
            <Link to="/" className="hover:text-orange-400 transition-colors duration-200">
              ← Back to IronHub
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
