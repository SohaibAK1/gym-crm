import { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  QrCode,
  CreditCard,
  Dumbbell,
  Menu,
  X,
  ArrowRight,
  Zap,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Shared animation variants
// ---------------------------------------------------------------------------
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------
const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleAnchor = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      setMenuOpen(false)
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-[#080808]/80 backdrop-blur-xl transition-colors duration-300 ${
        scrolled ? 'border-b border-white/10' : 'border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-0.5">
            <span className="text-xl font-extrabold text-white tracking-tight">Iron</span>
            <span className="text-xl font-extrabold text-orange-500 tracking-tight">Hub</span>
            <span className="relative ml-1.5 flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={(e) => handleAnchor(e, href)}
                className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                {label}
              </a>
            ))}
            <Link
              to="/login"
              className="text-sm text-zinc-400 hover:text-white transition-colors duration-200"
            >
              Login
            </Link>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold transition-colors duration-200 shadow-lg shadow-orange-500/20"
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </motion.div>
          </nav>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors duration-200 cursor-pointer"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[#080808]/95 backdrop-blur-xl border-t border-white/5">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={(e) => handleAnchor(e, href)}
                className="px-3 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors duration-200 cursor-pointer"
              >
                {label}
              </a>
            ))}
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="mt-2 px-4 py-2.5 rounded-full bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold text-center transition-colors duration-200"
            >
              Get Started Free
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
const heroVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
}

const heroItem = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

const HERO_STATS = [
  { value: '500+', label: 'Gyms' },
  { value: '50k+', label: 'Members Tracked' },
  { value: '99.9%', label: 'Uptime' },
]

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">

      {/* Dot-grid overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Orange radial glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(249,115,22,0.10) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Label pill */}
        <motion.div variants={heroItem} className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs tracking-widest uppercase rounded-full px-4 py-1.5 font-semibold">
            <Zap className="w-3 h-3" aria-hidden="true" />
            The all-in-one gym CRM
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={heroItem}
          className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tight text-white mb-6"
        >
          Manage Your Gym.{' '}
          <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Empower Your Members.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={heroItem}
          className="text-zinc-400 text-lg max-w-lg mx-auto leading-relaxed mb-10"
        >
          IronHub gives you attendance tracking, subscription management, and personalized
          workout routines — all in one place.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={heroItem}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-orange-500 hover:bg-orange-400 text-white font-semibold text-base transition-colors duration-200 shadow-xl shadow-orange-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/20 hover:border-white/50 text-white font-semibold text-base transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              See How It Works
            </a>
          </motion.div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={heroItem}
          className="inline-flex flex-wrap items-center justify-center"
        >
          {HERO_STATS.map(({ value, label }, idx) => (
            <Fragment key={label}>
              {idx > 0 && (
                <span aria-hidden="true" className="w-px h-8 bg-white/10 mx-6 hidden sm:block" />
              )}
              <div className="flex flex-col items-center px-4 py-2 sm:px-0 sm:py-0">
                <span className="text-2xl font-black text-white">{value}</span>
                <span className="text-xs text-zinc-500 mt-0.5">{label}</span>
              </div>
            </Fragment>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Features
// ---------------------------------------------------------------------------
const FEATURES = [
  {
    icon: QrCode,
    title: 'QR Attendance',
    description:
      'Members check in instantly with a QR code or PIN. Track daily attendance and spot drop-offs early.',
    metric: '1,240 check-ins today',
    dot: 'bg-green-500',
  },
  {
    icon: CreditCard,
    title: 'Subscription Records',
    description:
      'Monitor active plans, expiry dates, and payment history. Get alerted before memberships lapse.',
    metric: '18 renewals this week',
    dot: 'bg-blue-400',
  },
  {
    icon: Dumbbell,
    title: 'Workout Routines',
    description:
      'Assign one of 3 predefined routines to each member. They track daily exercise checklists and build streaks.',
    metric: '94% completion rate',
    dot: 'bg-orange-500',
  },
]

function Features() {
  return (
    <section id="features" className="py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeUp}
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="w-12 h-0.5 bg-orange-500 rounded-full" aria-hidden="true" />
            <span className="text-orange-500 text-xs font-semibold tracking-widest uppercase">
              Features
            </span>
            <span className="w-12 h-0.5 bg-orange-500 rounded-full" aria-hidden="true" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything your gym needs
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed">
            Built for gym owners who want less admin and more impact.
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {FEATURES.map(({ icon: Icon, title, description, metric, dot }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              whileHover={{ y: -6, borderColor: '#f97316' }}
              transition={{ duration: 0.2 }}
              className="bg-[#111111] border border-[#1f1f1f] rounded-2xl overflow-hidden cursor-default"
            >
              {/* Icon strip */}
              <div className="h-14 flex items-center justify-center bg-orange-500/10">
                <Icon className="w-[22px] h-[22px] text-orange-500" aria-hidden="true" />
              </div>

              {/* Body */}
              <div className="p-6">
                <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">{description}</p>

                {/* Live metric */}
                <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} aria-hidden="true" />
                  <span className="text-zinc-600 text-xs">{metric}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// How It Works
// ---------------------------------------------------------------------------
const STEPS = [
  {
    number: '01',
    title: 'Add your members',
    description: 'Import or manually add member profiles with contact info and plan details.',
  },
  {
    number: '02',
    title: 'Assign plans & routines',
    description: 'Set subscription plans and workout programs tailored to each member.',
  },
  {
    number: '03',
    title: 'Track everything',
    description: 'Monitor attendance, renewals, and progress daily from your dashboard.',
  },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeUp}
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="w-12 h-0.5 bg-orange-500 rounded-full" aria-hidden="true" />
            <span className="text-orange-500 text-xs font-semibold tracking-widest uppercase">
              How it works
            </span>
            <span className="w-12 h-0.5 bg-orange-500 rounded-full" aria-hidden="true" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Up and running in minutes
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed">
            No lengthy onboarding. Three steps to a fully operational gym CRM.
          </p>
        </motion.div>

        {/* Step cards + animated arrows */}
        <motion.div
          className="flex flex-col md:flex-row items-stretch gap-4"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {STEPS.map(({ number, title, description }, idx) => (
            <Fragment key={number}>
              {/* Step card */}
              <motion.div
                variants={fadeUp}
                className="relative flex-1 bg-[#111111] border border-[#1f1f1f] rounded-2xl p-8 overflow-hidden"
              >
                {/* Ghosted giant number */}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-3 -right-1 text-[8rem] font-black leading-none select-none pointer-events-none"
                  style={{ color: 'rgba(255,255,255,0.04)' }}
                >
                  {number}
                </span>

                <div className="relative z-10">
                  <span className="inline-block text-orange-500 text-xs font-semibold tracking-widest uppercase mb-4">
                    Step {number}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
                </div>
              </motion.div>

              {/* Animated arrow between steps — desktop only */}
              {idx < STEPS.length - 1 && (
                <div className="hidden md:flex items-center flex-shrink-0" aria-hidden="true">
                  <motion.div
                    animate={{ x: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    className="text-orange-500/40"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </div>
              )}
            </Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Stats Banner
// ---------------------------------------------------------------------------
const STATS = [
  { value: '2,000+', label: 'Active Members' },
  { value: '98%', label: 'Retention Rate' },
  { value: '3', label: 'Workout Plans' },
  { value: 'Real-time', label: 'Attendance Tracking' },
]

function StatsBanner() {
  return (
    <section className="border-y border-white/5 bg-[#0d0d0d] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 divide-y-2 md:divide-y-0 md:divide-x divide-white/[0.06]"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {STATS.map(({ value, label }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              className="flex flex-col items-center justify-center text-center py-10 md:py-0 px-6"
            >
              <span className="text-4xl font-black text-white mb-1.5">{value}</span>
              <span className="text-sm text-zinc-500">{label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// CTA Section
// ---------------------------------------------------------------------------
function CTASection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Grid texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),' +
            'linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Diagonal accent lines */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 80px, rgba(249,115,22,0.025) 80px, rgba(249,115,22,0.025) 81px)',
        }}
      />

      {/* Orange radial glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(249,115,22,0.14) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeUp}
            className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight"
          >
            Ready to transform how you run your gym?
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed"
          >
            Join IronHub today and take control of every member, every session, every plan.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col items-center gap-4">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-orange-500 hover:bg-orange-400 text-white font-semibold text-base transition-colors duration-200 shadow-xl shadow-orange-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </motion.div>
            <p className="text-zinc-600 text-sm">
              No credit card required · Setup in 5 minutes
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-0.5 mb-1">
              <span className="text-lg font-extrabold text-zinc-600">Iron</span>
              <span className="text-lg font-extrabold" style={{ color: 'rgba(249,115,22,0.45)' }}>
                Hub
              </span>
            </div>
            <p className="text-xs text-zinc-600">Built for serious gym owners.</p>
          </div>
          <p className="text-xs text-zinc-600">© 2025 IronHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function Landing() {
  return (
    <div
      className="min-h-screen bg-[#080808] antialiased"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <StatsBanner />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
