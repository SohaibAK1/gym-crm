import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  QrCode, CreditCard, Dumbbell, Menu, X, ArrowRight,
  TrendingUp, Users, Check, Shield, Activity, ChevronDown,
  Zap, Star, Award, Package,
} from 'lucide-react'
import Aurora      from '../components/bits/Aurora'
import BlurText    from '../components/bits/BlurText'
import ShinyText   from '../components/bits/ShinyText'
import SpotlightCard from '../components/bits/SpotlightCard'
import CountUp     from '../components/bits/CountUp'
import Threads     from '../components/bits/Threads'
import GlitchText  from '../components/bits/GlitchText'
import RotatingText from '../components/bits/RotatingText'
import DecryptedText from '../components/bits/DecryptedText'
import TrueFocus   from '../components/bits/TrueFocus'
import Orb         from '../components/bits/Orb'
import Magnet      from '../components/bits/Magnet'
import TiltCard    from '../components/bits/TiltCard'
import CustomCursor from '../components/bits/CustomCursor'
import { useReveal } from '../hooks/useReveal'

const BC  = "'Barlow Condensed', sans-serif"
const INT = 'Inter, system-ui, sans-serif'
const IBP = "'IBM Plex Mono', ui-monospace, monospace"

const V   = 'var(--rb-primary)'
const BG  = 'var(--rb-bg)'
const SRF = 'var(--rb-surface)'
const CRD = 'var(--rb-card)'
const BDR = 'var(--rb-border)'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing',  href: '#pricing'  },
]

// ── Navbar ────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const anchor = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      setMenuOpen(false)
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        background:    scrolled ? 'rgba(10,10,10,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom:  scrolled ? `1px solid ${BDR}` : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5" style={{ color: V }} aria-hidden="true" />
            <span className="text-lg font-black text-white leading-none" style={{ fontFamily: BC }}>Iron</span>
            <span className="text-lg font-black leading-none" style={{ fontFamily: BC, color: V }}>Hub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={(e) => anchor(e, href)}
                className="text-sm font-medium transition-colors duration-200 cursor-pointer"
                style={{ fontFamily: INT, color: 'rgba(249,250,251,0.55)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(249,250,251,0.55)'}
              >
                {label}
              </a>
            ))}
            <Link
              to="/login"
              className="text-sm font-medium transition-colors duration-200"
              style={{ fontFamily: INT, color: 'rgba(249,250,251,0.55)' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(249,250,251,0.55)'}
            >
              Login
            </Link>
            <Magnet strength={0.3}>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                style={{ background: V, color: '#0A0A0A', fontFamily: INT }}
              >
                Get Started <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Magnet>
          </nav>

          <button
            onClick={() => setMenuOpen(o => !o)}
            className="md:hidden p-2 cursor-pointer"
            style={{ color: 'rgba(249,250,251,0.55)' }}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ background: CRD, borderTop: `1px solid ${BDR}` }}
          >
            <nav className="max-w-7xl mx-auto px-5 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={(e) => anchor(e, href)}
                  className="px-3 py-3 text-sm font-medium"
                  style={{ fontFamily: INT, color: 'rgba(249,250,251,0.65)' }}
                >
                  {label}
                </a>
              ))}
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-3 text-sm font-medium"
                style={{ fontFamily: INT, color: 'rgba(249,250,251,0.65)' }}
              >
                Login
              </Link>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="mt-2 px-4 py-3 font-bold text-center text-sm rounded-lg"
                style={{ background: V, color: '#0A0A0A', fontFamily: INT }}
              >
                Get Started Free
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

// ── Hero terminal mock-up ──────────────────────────────────────────────────
const LIVE_FEED = [
  { name: 'A. Rahman',  event: 'CHECK_IN', t: '00:02' },
  { name: 'M. Santos',  event: 'CHECK_IN', t: '00:05' },
  { name: 'J. Kim',     event: 'RENEWAL',  t: '00:11' },
  { name: 'P. Torres',  event: 'CHECK_IN', t: '00:23' },
]
const BAR_H = [38, 54, 47, 73, 62, 90, 75]

function TerminalDisplay() {
  return (
    <div
      className="w-full max-w-sm rounded-xl overflow-hidden select-none"
      style={{
        background:  CRD,
        border:      `1px solid ${BDR}`,
        borderTop:   '2px solid #FACC15',
        boxShadow:   '0 0 60px rgba(250,204,21,0.12), 0 40px 80px rgba(0,0,0,0.4)',
      }}
    >
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: `1px solid ${BDR}`, background: 'rgba(250,204,21,0.03)' }}
      >
        <div className="flex items-center gap-2">
          <motion.span
            animate={{ opacity: [1, 0.25, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="w-2 h-2 rounded-full"
            style={{ background: '#FACC15' }}
            aria-hidden="true"
          />
          <span className="text-xs tracking-[0.16em]" style={{ fontFamily: IBP, color: '#FACC15' }}>
            IRONHUB LIVE
          </span>
        </div>
        <span className="text-[10px] tracking-wider" style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.35)' }}>
          v2.4.1
        </span>
      </div>

      <div className="grid grid-cols-3" style={{ borderBottom: `1px solid ${BDR}` }}>
        {[
          { val: '247',   label: 'CHECK-INS', c: '#FACC15' },
          { val: '$3.4K', label: 'MRR',       c: '#FACC15' },
          { val: '98%',   label: 'RETENTION', c: '#34D399' },
        ].map(({ val, label, c }, i) => (
          <div
            key={label}
            className="px-4 py-4"
            style={{ borderRight: i < 2 ? `1px solid ${BDR}` : 'none' }}
          >
            <div className="text-xl font-bold mb-0.5" style={{ fontFamily: IBP, color: c }}>{val}</div>
            <div className="text-[9px] tracking-[0.2em]" style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.4)' }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-4" style={{ borderBottom: `1px solid ${BDR}` }}>
        <div className="text-[9px] tracking-[0.2em] mb-3 uppercase" style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.4)' }}>
          WEEKLY LOAD
        </div>
        <div className="flex items-end gap-1 h-10">
          {BAR_H.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                background:    i === 5 ? '#FACC15' : 'rgba(250,204,21,0.18)',
                height:        `${h}%`,
                transformOrigin: 'bottom',
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.6 + i * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </div>
        <div className="flex mt-1.5">
          {['M','T','W','T','F','S','S'].map((d, i) => (
            <span key={i} className="flex-1 text-center text-[8px]" style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.3)' }}>{d}</span>
          ))}
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="text-[9px] tracking-[0.2em] uppercase mb-3" style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.4)' }}>
          LIVE ACTIVITY
        </div>
        {LIVE_FEED.map(({ name, event, t }) => (
          <div
            key={name}
            className="flex items-center gap-3 py-2"
            style={{ borderBottom: `1px solid rgba(249,250,251,0.04)` }}
          >
            <span
              className="w-0.5 h-4 flex-shrink-0"
              style={{ background: event === 'RENEWAL' ? '#FACC15' : '#34D399' }}
              aria-hidden="true"
            />
            <span className="text-xs flex-1" style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.7)' }}>
              {name}
            </span>
            <span className="text-[9px] tracking-wider" style={{ fontFamily: IBP, color: event === 'RENEWAL' ? '#FACC15' : 'rgba(52,211,153,0.85)' }}>
              {event}
            </span>
            <span className="text-[9px]" style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.3)' }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden" style={{ background: BG }}>
      {/* Flowing lines background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ opacity: 0.28 }}>
        <Threads color={[0.98, 0.8, 0.08]} amplitude={1.5} distance={0} enableMouseInteraction={false} />
      </div>
      {/* Aurora glow overlay */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <Aurora colorStops={['#92400E', '#FACC15', '#92400E']} amplitude={1.2} blend={0.6} speed={0.5} />
      </div>
      {/* Gradient vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.2) 40%, rgba(10,10,10,0.78) 100%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6"
            >
              <span
                className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full overflow-hidden"
                style={{
                  fontFamily: IBP,
                  color:      '#FACC15',
                  border:     '1px solid rgba(250,204,21,0.3)',
                  background: 'rgba(250,204,21,0.07)',
                  minHeight:  '1.9rem',
                }}
              >
                <Zap className="w-3 h-3 fill-current flex-shrink-0" aria-hidden="true" />
                <RotatingText
                  texts={['QR Attendance', 'Subscription Plans', 'Workout Routines', 'Live Analytics']}
                  rotationInterval={2400}
                  splitBy="characters"
                  staggerDuration={0.022}
                  staggerFrom="first"
                  style={{ letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: '0.7rem' }}
                />
              </span>
            </motion.div>

            {/* Headline */}
            <div className="mb-4">
              <BlurText
                text="MANAGE YOUR GYM."
                delay={100}
                animateBy="words"
                direction="top"
                stepDuration={0.4}
                className="font-black text-white uppercase leading-[0.9]"
                style={{ fontFamily: BC, fontSize: 'clamp(3.8rem, 8vw, 7.5rem)', letterSpacing: '-0.02em' }}
              />
              <GlitchText
                speed={0.7}
                bgColor="#0A0A0A"
                style={{
                  fontFamily:   BC,
                  fontSize:     'clamp(3.8rem, 8vw, 7.5rem)',
                  letterSpacing: '-0.02em',
                  color:        '#FACC15',
                  lineHeight:   '0.9',
                  whiteSpace:   'normal',
                  margin:       0,
                  display:      'block',
                }}
              >
                DOMINATE YOUR MARKET.
              </GlitchText>
            </div>

            {/* Dynamic sub-label */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.55 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="w-5 h-px" style={{ background: 'rgba(250,204,21,0.4)' }} aria-hidden="true" />
              <RotatingText
                texts={['TRACK ATTENDANCE', 'GROW REVENUE', 'RETAIN MEMBERS', 'CRUSH GOALS']}
                rotationInterval={2200}
                splitBy="characters"
                staggerDuration={0.025}
                staggerFrom="center"
                style={{ fontFamily: IBP, fontSize: '0.7rem', letterSpacing: '0.22em', color: '#FACC15' }}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="text-lg leading-relaxed max-w-lg mb-8"
              style={{ fontFamily: INT, color: 'rgba(249,250,251,0.65)' }}
            >
              IronHub gives gym owners precision tools for attendance,
              subscriptions, and workout management — built for serious operators.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="flex flex-col sm:flex-row gap-3 mb-10"
            >
              <Magnet strength={0.3}>
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-sm rounded-xl cursor-pointer"
                    style={{ fontFamily: INT, background: '#FACC15', color: '#0A0A0A', boxShadow: '0 0 36px rgba(250,204,21,0.4)' }}
                  >
                    Start for Free <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </Magnet>
              <a
                href="#features"
                onClick={(e) => { e.preventDefault(); document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 font-medium text-sm rounded-xl cursor-pointer transition-colors duration-200"
                style={{ fontFamily: INT, color: 'rgba(249,250,251,0.7)', border: `1px solid rgba(249,250,251,0.15)` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(250,204,21,0.4)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(249,250,251,0.15)'; e.currentTarget.style.color = 'rgba(249,250,251,0.7)' }}
              >
                See How It Works
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-wrap gap-6"
            >
              {[
                { val: 500,  suffix: '+',  label: 'Gyms' },
                { val: 99.9, suffix: '%',  label: 'Uptime' },
                { val: 4.9,  suffix: '',   label: 'Rating' },
              ].map(({ val, suffix, label }) => (
                <div key={label} className="flex items-baseline gap-1.5">
                  <span className="text-base font-bold" style={{ fontFamily: IBP, color: '#FACC15' }}>
                    <CountUp to={val} duration={2} />{suffix}
                  </span>
                  <span className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.55)' }}>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Terminal with 3-D tilt */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div
                className="absolute -inset-12 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(250,204,21,0.15) 0%, transparent 70%)', filter: 'blur(24px)' }}
                aria-hidden="true"
              />
              <TiltCard rotateAmplitude={8} scaleOnHover={1.03}>
                <TerminalDisplay />
              </TiltCard>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      >
        <span className="text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.3)' }}>Scroll</span>
        <ChevronDown className="w-4 h-4" style={{ color: 'rgba(250,204,21,0.5)' }} aria-hidden="true" />
      </motion.div>
    </section>
  )
}

// ── Ticker Tape ───────────────────────────────────────────────────────────
const TAPE_ITEMS = [
  'QR Attendance', 'Subscription Plans', 'Workout Routines', 'Member Profiles',
  'Renewal Alerts', 'Progress Tracking', 'Live Dashboard', 'Revenue Analytics',
]

function Tape() {
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

// ── Stats ─────────────────────────────────────────────────────────────────
const STATS = [
  { val: 500, suffix: '+',   label: 'GYMS RUNNING ON IRONHUB',   sub: 'Across 18 countries' },
  { val: 50,  suffix: 'K+',  label: 'MEMBERS TRACKED EVERY DAY', sub: 'Real-time data' },
  { val: 98,  suffix: '%',   label: 'AVERAGE MEMBER RETENTION',  sub: 'Industry avg: 72%' },
  { val: 99,  suffix: '.9%', label: 'UPTIME SERVICE LEVEL',      sub: 'Enterprise grade' },
]

function Stats() {
  return (
    <section className="py-4" style={{ background: SRF, borderTop: `1px solid ${BDR}`, borderBottom: `1px solid ${BDR}` }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {STATS.map(({ val, suffix, label, sub }, idx) => (
          <div
            key={label}
            data-reveal
            style={{ '--si': idx, borderBottom: idx < STATS.length - 1 ? `1px solid rgba(249,250,251,0.05)` : 'none' }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-7"
          >
            <div className="flex items-baseline gap-4">
              <span className="font-bold leading-none" style={{ fontFamily: IBP, fontSize: 'clamp(3rem, 7vw, 5.5rem)', color: '#FACC15' }}>
                <CountUp to={val} duration={2.2} />{suffix}
              </span>
              <span className="font-black uppercase tracking-wider" style={{ fontFamily: BC, fontSize: 'clamp(0.9rem, 2vw, 1.3rem)', color: 'rgba(249,250,251,0.8)' }}>
                {label}
              </span>
            </div>
            <span className="text-xs tracking-[0.2em] uppercase" style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.4)' }}>
              {sub}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Features ──────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: QrCode,    tag: 'ATTENDANCE',   title: 'QR Check-In',           desc: 'Members scan a QR code for instant attendance logging. Track daily check-ins and spot drop-offs before they become churn.',    metric: '1,240 check-ins today' },
  { icon: CreditCard,tag: 'SUBSCRIPTIONS',title: 'Subscription Engine',   desc: 'Monitor active plans, expiry dates, and payment history. Automated alerts fire before memberships lapse.',                    metric: '18 renewals this week' },
  { icon: TrendingUp,tag: 'ANALYTICS',    title: 'Live Analytics',         desc: 'Revenue trends, peak hours, retention rates, and plan performance — surfaced in real time.',                                   metric: '+12% retention MoM'   },
  { icon: Dumbbell,  tag: 'ROUTINES',     title: 'Workout Programs',       desc: '3 predefined programs with daily checklists and streak tracking. Assign to any member in one click.',                         metric: '3 programs ready'      },
  { icon: Users,     tag: 'MEMBERS',      title: 'Member Hub',             desc: 'Full profiles with history, subscriptions, and assigned routines. Everything about a member, one place.',                     metric: 'Full profile view'     },
  { icon: Shield,    tag: 'SECURITY',     title: 'Enterprise Security',    desc: 'Row-level security via Supabase. 99.9% uptime, zero compromise. Your member data stays yours.',                               metric: '99.9% uptime SLA'      },
]

function Features() {
  return (
    <section id="features" className="py-28" style={{ background: BG }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div data-reveal className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <DecryptedText
              text="CORE FEATURES"
              animateOn="view"
              speed={55}
              sequential={true}
              revealDirection="start"
              className="text-xs tracking-[0.28em] uppercase font-medium"
              style={{ fontFamily: IBP, color: 'rgba(250,204,21,0.75)' }}
              encryptedClassName="opacity-30"
            />
          </div>
          <h2
            className="font-black text-white uppercase leading-[0.9]"
            style={{ fontFamily: BC, fontSize: 'clamp(2.8rem, 6vw, 5rem)', letterSpacing: '-0.02em' }}
          >
            EVERYTHING YOUR GYM NEEDS.{' '}
            <span style={{ color: '#FACC15' }}>NOTHING IT DOESN'T.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, tag, title, desc, metric }, i) => (
            <div key={title} data-reveal style={{ '--si': i }}>
              <TiltCard className="h-full" rotateAmplitude={7} scaleOnHover={1.03}>
                <SpotlightCard
                  className="h-full rounded-xl p-6 cursor-default"
                  style={{ background: CRD, border: `1px solid ${BDR}` }}
                  spotlightColor="rgba(250,204,21,0.1)"
                >
                  <div
                    className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.25em] uppercase px-2 py-1 rounded mb-4"
                    style={{ fontFamily: IBP, color: '#FACC15', background: 'rgba(250,204,21,0.08)', border: '1px solid rgba(250,204,21,0.2)' }}
                  >
                    {tag}
                  </div>
                  <Icon className="w-6 h-6 mb-4" style={{ color: '#FACC15' }} aria-hidden="true" />
                  <h3 className="font-black text-white uppercase mb-2 text-lg" style={{ fontFamily: BC, letterSpacing: '-0.01em' }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-6" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.65)' }}>
                    {desc}
                  </p>
                  <div className="text-xs font-medium mt-auto" style={{ fontFamily: IBP, color: '#FACC15' }}>
                    {metric}
                  </div>
                </SpotlightCard>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── How It Works ──────────────────────────────────────────────────────────
const STEPS = [
  { n: '01', icon: Users,      title: 'Add Your Members',        desc: 'Import or create member profiles with contact info and plan details in under a minute.' },
  { n: '02', icon: CreditCard, title: 'Assign Plans & Routines', desc: "Set subscription tiers and assign workout programs tailored to each member's goals." },
  { n: '03', icon: TrendingUp, title: 'Track Everything',        desc: 'Monitor attendance, upcoming renewals, and member progress from your real-time dashboard.' },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28" style={{ background: SRF }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div data-reveal className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <DecryptedText
              text="PROCESS"
              animateOn="view"
              speed={60}
              sequential={true}
              className="text-xs tracking-[0.28em] uppercase font-medium"
              style={{ fontFamily: IBP, color: 'rgba(250,204,21,0.75)' }}
              encryptedClassName="opacity-30"
            />
          </div>
          <div
            className="font-black text-white uppercase leading-[0.9]"
            style={{ fontFamily: BC, fontSize: 'clamp(2.8rem, 6vw, 5rem)', letterSpacing: '-0.02em' }}
          >
            <TrueFocus
              sentence="UP AND RUNNING IN 3 STEPS."
              blurAmount={4}
              borderColor="#FACC15"
              glowColor="rgba(250,204,21,0.5)"
              animationDuration={0.55}
              pauseBetweenAnimations={1.4}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {STEPS.map(({ n, icon: Icon, title, desc }, idx) => (
            <div key={n} data-reveal style={{ '--si': idx }}>
              <TiltCard className="h-full" rotateAmplitude={6} scaleOnHover={1.03}>
                <SpotlightCard
                  className="h-full relative rounded-xl p-8 cursor-default overflow-hidden"
                  style={{ background: CRD, border: `1px solid ${BDR}` }}
                  spotlightColor="rgba(250,204,21,0.1)"
                >
                  <span
                    className="absolute -bottom-4 -right-2 font-black leading-none select-none pointer-events-none"
                    style={{ fontFamily: IBP, fontSize: '8rem', color: 'rgba(250,204,21,0.05)' }}
                    aria-hidden="true"
                  >
                    {n}
                  </span>
                  <span
                    className="inline-block text-[9px] tracking-[0.25em] uppercase px-2 py-1 rounded mb-5"
                    style={{ fontFamily: IBP, color: '#FACC15', border: `1px solid ${BDR}` }}
                  >
                    Step {n}
                  </span>
                  <Icon className="w-6 h-6 mb-4" style={{ color: '#FACC15' }} aria-hidden="true" />
                  <h3 className="font-black text-white uppercase mb-3" style={{ fontFamily: BC, fontSize: '1.4rem', letterSpacing: '-0.01em' }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.65)' }}>
                    {desc}
                  </p>
                </SpotlightCard>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Pricing ───────────────────────────────────────────────────────────────
const PLANS = [
  {
    name: 'Starter', monthlyPrice: 29, annualPrice: 23,
    desc: 'For small gyms just getting started.',
    features: ['1 gym location', 'Up to 100 members', 'QR attendance', 'Basic subscriptions', 'Email support'],
    missing: ['Workout routines', 'Analytics dashboard'],
    cta: 'Get Started', featured: false,
  },
  {
    name: 'Pro', monthlyPrice: 79, annualPrice: 63,
    desc: 'The complete toolkit for serious gym owners.',
    features: ['Up to 3 locations', 'Up to 500 members', 'QR attendance', 'All subscription types', 'Workout routines', 'Analytics dashboard', 'Priority support'],
    missing: ['Unlimited members'],
    cta: 'Start Free Trial', featured: true,
  },
  {
    name: 'Elite', monthlyPrice: 149, annualPrice: 119,
    desc: 'Enterprise power for multi-location chains.',
    features: ['Unlimited locations', 'Unlimited members', 'Everything in Pro', 'White-label branding', 'API access', 'Dedicated account manager', '24/7 phone support'],
    missing: [],
    cta: 'Contact Sales', featured: false,
  },
]

function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" className="py-28" style={{ background: BG }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div data-reveal className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <DecryptedText
              text="PRICING"
              animateOn="view"
              speed={65}
              sequential={true}
              className="text-xs tracking-[0.28em] uppercase font-medium"
              style={{ fontFamily: IBP, color: 'rgba(250,204,21,0.75)' }}
              encryptedClassName="opacity-30"
            />
          </div>
          <h2 className="font-black text-white uppercase leading-[0.9] mb-8" style={{ fontFamily: BC, fontSize: 'clamp(2.8rem, 6vw, 5rem)', letterSpacing: '-0.02em' }}>
            SIMPLE, <span style={{ color: '#FACC15' }}>TRANSPARENT</span> PRICING.
          </h2>

          <div className="flex items-center gap-2 p-1 rounded-xl w-fit" style={{ background: CRD, border: `1px solid ${BDR}` }}>
            {[{ label: 'Monthly', val: false }, { label: 'Annual  −20%', val: true }].map(({ label, val }) => (
              <button
                key={label}
                onClick={() => setAnnual(val)}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer"
                style={{
                  fontFamily: INT,
                  background: annual === val ? '#FACC15' : 'transparent',
                  color:      annual === val ? '#0A0A0A' : 'rgba(249,250,251,0.55)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {PLANS.map(({ name, monthlyPrice, annualPrice, desc, features, missing, cta, featured }, planIdx) => (
            <div key={name} data-reveal style={{ '--si': planIdx }}>
              <TiltCard className="h-full" rotateAmplitude={5} scaleOnHover={1.02}>
                <SpotlightCard
                  className="h-full flex flex-col rounded-xl overflow-hidden"
                  style={{
                    background:  featured ? `rgba(250,204,21,0.05)` : CRD,
                    border:      featured ? `1px solid rgba(250,204,21,0.35)` : `1px solid ${BDR}`,
                    boxShadow:   featured ? '0 0 40px rgba(250,204,21,0.1)' : 'none',
                  }}
                  spotlightColor={featured ? 'rgba(250,204,21,0.2)' : 'rgba(250,204,21,0.08)'}
                >
                  <div className="px-7 py-7" style={{ borderBottom: `1px solid ${BDR}` }}>
                    {featured && (
                      <span className="inline-block text-[9px] tracking-[0.25em] uppercase px-2 py-1 rounded mb-4" style={{ fontFamily: IBP, color: '#0A0A0A', background: '#FACC15' }}>
                        MOST POPULAR
                      </span>
                    )}
                    <h3 className="font-black text-white uppercase mb-1" style={{ fontFamily: BC, fontSize: '1.8rem', letterSpacing: '-0.01em' }}>
                      {name}
                    </h3>
                    <p className="text-sm mb-5" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.6)' }}>{desc}</p>
                    <div className="flex items-baseline gap-1">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={annual ? 'annual' : 'monthly'}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                          className="font-bold"
                          style={{ fontFamily: IBP, fontSize: '2.8rem', color: featured ? '#FACC15' : 'var(--rb-text)' }}
                        >
                          ${annual ? annualPrice : monthlyPrice}
                        </motion.span>
                      </AnimatePresence>
                      <span className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>/mo</span>
                    </div>
                  </div>

                  <div className="px-7 py-7 flex flex-col flex-1">
                    <ul className="space-y-3 flex-1 mb-8">
                      {features.map(f => (
                        <li key={f} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#FACC15' }} aria-hidden="true" />
                          <span className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.75)' }}>{f}</span>
                        </li>
                      ))}
                      {missing.map(f => (
                        <li key={f} className="flex items-start gap-2.5 opacity-30">
                          <X className="w-4 h-4 flex-shrink-0 mt-0.5 text-white" aria-hidden="true" />
                          <span className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.6)' }}>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link
                        to="/login"
                        className="block w-full py-3.5 font-bold text-center text-sm rounded-xl transition-colors duration-200 cursor-pointer"
                        style={{
                          fontFamily: INT,
                          background: featured ? '#FACC15' : 'transparent',
                          color:      featured ? '#0A0A0A' : '#FACC15',
                          border:     `1px solid ${featured ? '#FACC15' : 'rgba(250,204,21,0.35)'}`,
                        }}
                      >
                        {cta}
                      </Link>
                    </motion.div>
                  </div>
                </SpotlightCard>
              </TiltCard>
            </div>
          ))}
        </div>

        <p data-reveal style={{ '--si': 3, fontFamily: IBP, color: 'rgba(249,250,251,0.4)' }} className="text-center text-sm mt-6">
          All plans include a 14-day free trial — no credit card required.
        </p>
      </div>
    </section>
  )
}

// ── Testimonials ──────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: 'Marcus Thompson', role: 'Owner, Iron Temple Gym',    quote: 'IronHub cut my admin time by 70%. Renewals are automated, data is accurate, decisions are faster.', stars: 5 },
  { name: 'Sarah Malik',     role: 'Manager, Peak Performance', quote: 'The QR check-in alone was worth switching. Members love it. I finally have real attendance data.',  stars: 5 },
  { name: 'David Chen',      role: 'Founder, Elevate CrossFit', quote: 'Setup took 20 minutes. Dashboard is clean, routine assignment keeps members engaged.',               stars: 5 },
]

function Testimonials() {
  return (
    <section className="py-28" style={{ background: SRF }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div data-reveal className="mb-16">
          <DecryptedText
            text="TESTIMONIALS"
            animateOn="view"
            speed={60}
            sequential={true}
            parentClassName="mb-4 inline-block"
            className="text-xs tracking-[0.28em] uppercase font-medium"
            style={{ fontFamily: IBP, color: 'rgba(250,204,21,0.75)' }}
            encryptedClassName="opacity-30"
          />
          <h2 className="font-black text-white uppercase leading-[0.9]" style={{ fontFamily: BC, fontSize: 'clamp(2.8rem, 6vw, 5rem)', letterSpacing: '-0.02em' }}>
            REAL OWNERS. <span style={{ color: '#FACC15' }}>REAL RESULTS.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {TESTIMONIALS.map(({ name, role, quote, stars }, i) => (
            <div key={name} data-reveal style={{ '--si': i }}>
              <TiltCard className="h-full" rotateAmplitude={7} scaleOnHover={1.03}>
                <SpotlightCard
                  className="h-full rounded-xl p-8 cursor-default"
                  style={{ background: CRD, border: `1px solid ${BDR}` }}
                  spotlightColor="rgba(250,204,21,0.1)"
                >
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: stars }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5" style={{ fill: '#FACC15', color: '#FACC15' }} aria-hidden="true" />
                    ))}
                  </div>
                  <p className="text-base leading-relaxed mb-7" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.75)', fontStyle: 'italic' }}>
                    "{quote}"
                  </p>
                  <div style={{ borderTop: `1px solid ${BDR}` }} className="pt-5">
                    <div className="font-black text-white text-sm uppercase" style={{ fontFamily: BC }}>{name}</div>
                    <div className="text-xs mt-0.5" style={{ fontFamily: IBP, color: 'rgba(250,204,21,0.65)' }}>{role}</div>
                  </div>
                </SpotlightCard>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA ───────────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="relative py-32 overflow-hidden" style={{ background: BG }}>
      {/* Orb background */}
      <div className="absolute inset-0" aria-hidden="true" style={{ opacity: 0.75 }}>
        <Orb hue={150} hoverIntensity={0.35} rotateOnHover={true} backgroundColor="transparent" />
      </div>
      {/* Radial vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(10,10,10,0.15) 0%, rgba(10,10,10,0.65) 65%, rgba(10,10,10,0.88) 100%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span
            className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.18em] uppercase px-3 py-1.5 rounded-full mb-6"
            style={{ fontFamily: IBP, color: '#FACC15', border: '1px solid rgba(250,204,21,0.3)', background: 'rgba(250,204,21,0.07)' }}
          >
            No credit card required
          </span>
          <h2
            className="font-black text-white uppercase leading-[0.88] mb-6"
            style={{ fontFamily: BC, fontSize: 'clamp(3rem, 7vw, 6rem)', letterSpacing: '-0.02em' }}
          >
            READY TO BUILD YOUR <span style={{ color: '#FACC15' }}>ELITE GYM?</span>
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.65)' }}>
            Join IronHub today. Setup takes 5 minutes. Results are permanent.
          </p>
          <Magnet strength={0.35}>
            <motion.div whileTap={{ scale: 0.97 }} className="inline-block">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-12 py-5 font-bold text-base rounded-xl transition-colors duration-200 cursor-pointer"
                style={{ fontFamily: INT, background: '#FACC15', color: '#0A0A0A', boxShadow: '0 0 55px rgba(250,204,21,0.45)' }}
              >
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </Magnet>
          <p className="text-sm mt-6" style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.45)' }}>
            14-day trial · No credit card · Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: SRF, borderTop: `1px solid ${BDR}` }} className="py-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Dumbbell className="w-4 h-4" style={{ color: 'rgba(250,204,21,0.5)' }} aria-hidden="true" />
              <span className="font-black text-white/50 text-base" style={{ fontFamily: BC }}>Iron</span>
              <span className="font-black text-base" style={{ fontFamily: BC, color: 'rgba(250,204,21,0.5)' }}>Hub</span>
            </div>
            <p className="text-xs" style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.35)' }}>Built for serious gym operators.</p>
          </div>
          <div className="flex items-center gap-8">
            {[{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={e => { e.preventDefault(); document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }) }}
                className="text-xs transition-colors duration-200 cursor-pointer"
                style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.4)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(250,204,21,0.75)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(249,250,251,0.4)'}
              >
                {label}
              </a>
            ))}
            <Link
              to="/login"
              className="text-xs transition-colors duration-200"
              style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.4)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(250,204,21,0.75)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(249,250,251,0.4)'}
            >
              Login
            </Link>
          </div>
          <p className="text-xs" style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.3)' }}>© 2025 IronHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function Landing() {
  useReveal()
  return (
    <div className="min-h-screen antialiased overflow-x-hidden" style={{ background: BG }}>
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <Tape />
        <Stats />
        <Features />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
