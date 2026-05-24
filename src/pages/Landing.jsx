import { Fragment, useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  AnimatePresence,
} from 'framer-motion'
import {
  QrCode,
  CreditCard,
  Dumbbell,
  Menu,
  X,
  ArrowRight,
  Zap,
  TrendingUp,
  Users,
  CheckCircle,
  ChevronDown,
  Shield,
  Star,
  Check,
  Calculator,
  Package,
  ShoppingBag,
  Award,
  Activity,
} from 'lucide-react'

// ─── Typography ────────────────────────────────────────────────────────────
const BC = "'Barlow Condensed', sans-serif"
const BL = "'Barlow', sans-serif"

// ─── Unsplash image assets ─────────────────────────────────────────────────
const IMG = {
  heroBg:    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&auto=format&fit=crop&q=50',
  statsBg:   'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&auto=format&fit=crop&q=50',
  pricingBg: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1920&auto=format&fit=crop&q=50',
  feat1:     'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=800&auto=format&fit=crop&q=60',
  feat2:     'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&auto=format&fit=crop&q=60',
  feat3:     'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=60',
  tm1:       'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=96&h=96&auto=format&fit=crop&q=80',
  tm2:       'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&auto=format&fit=crop&q=80',
  tm3:       'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&auto=format&fit=crop&q=80',
}

// ─── Animation variants ────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}
const stagger     = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const staggerFast = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }

// ─── Canvas Particle Network ───────────────────────────────────────────────
function ParticleCanvas({ color = 'rgba(249,115,22,' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let rafId
    let particles = []

    const count = () => (window.innerWidth < 768 ? 28 : 60)

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      particles = Array.from({ length: count() }, () => ({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r:  Math.random() * 1.5 + 0.8,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx;  p.y += p.vy
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = color + '0.7)'
        ctx.fill()
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x, dy = p.y - p2.y
          const d2 = dx * dx + dy * dy
          if (d2 < 14400) {
            const a = (1 - d2 / 14400) * 0.28
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = color + a.toFixed(2) + ')'
            ctx.lineWidth = 0.8; ctx.stroke()
          }
        }
      }
      rafId = requestAnimationFrame(draw)
    }

    window.addEventListener('resize', resize)
    resize(); draw()
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [color])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
      aria-hidden="true"
    />
  )
}

// ─── CSS 3D Wireframe Cube ─────────────────────────────────────────────────
function FloatingCube({ size = 55, delay = 0, className = '' }) {
  const h = size / 2
  const FACES = [
    { transform: `translateZ(${h}px)` },
    { transform: `rotateY(180deg) translateZ(${h}px)` },
    { transform: `rotateY(90deg) translateZ(${h}px)` },
    { transform: `rotateY(-90deg) translateZ(${h}px)` },
    { transform: `rotateX(90deg) translateZ(${h}px)` },
    { transform: `rotateX(-90deg) translateZ(${h}px)` },
  ]
  return (
    <motion.div
      className={`pointer-events-none ${className}`}
      animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
      transition={{ duration: 16, repeat: Infinity, ease: 'linear', delay }}
      style={{ width: size, height: size, transformStyle: 'preserve-3d' }}
    >
      {FACES.map((f, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', width: size, height: size,
            border: '1.5px solid rgba(249,115,22,0.5)',
            background: 'rgba(249,115,22,0.06)',
            ...f,
          }}
        />
      ))}
    </motion.div>
  )
}

// ─── CSS 3D Floating Ring ──────────────────────────────────────────────────
function FloatingRing({ size = 110, delay = 0, className = '' }) {
  return (
    <motion.div
      className={`pointer-events-none relative ${className}`}
      animate={{ rotateZ: [0, 360] }}
      transition={{ duration: 14, repeat: Infinity, ease: 'linear', delay }}
      style={{ width: size, height: size }}
    >
      <motion.div
        animate={{ scaleY: [0.28, 0.52, 0.28] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay }}
        style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '3px solid rgba(249,115,22,0.6)',
          boxShadow: '0 0 22px rgba(249,115,22,0.3)',
        }}
      />
      <motion.div
        animate={{ scaleY: [0.28, 0.52, 0.28] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.4 }}
        style={{
          position: 'absolute', inset: size * 0.22, borderRadius: '50%',
          border: '1.5px solid rgba(249,115,22,0.25)',
        }}
      />
    </motion.div>
  )
}

// ─── Enhanced TiltCard with gloss ─────────────────────────────────────────
function TiltCard({ children, className = '' }) {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 200, damping: 25 })
  const sy = useSpring(my, { stiffness: 200, damping: 25 })
  const rotateX = useTransform(sy, [-0.5, 0.5], [8, -8])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-8, 8])
  const [gloss, setGloss] = useState({ x: 50, y: 50, show: false })

  const onMove = useCallback((e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const relX = (e.clientX - rect.left) / rect.width
    const relY = (e.clientY - rect.top)  / rect.height
    mx.set(relX - 0.5); my.set(relY - 0.5)
    setGloss({ x: relX * 100, y: relY * 100, show: true })
  }, [mx, my])

  const onLeave = useCallback(() => {
    mx.set(0); my.set(0)
    setGloss((g) => ({ ...g, show: false }))
  }, [mx, my])

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative ${className}`}
    >
      {gloss.show && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-10"
          style={{
            background: `radial-gradient(circle at ${gloss.x}% ${gloss.y}%, rgba(249,115,22,0.13) 0%, transparent 55%)`,
          }}
          aria-hidden="true"
        />
      )}
      {children}
    </motion.div>
  )
}

// ─── Barbell SVG ───────────────────────────────────────────────────────────
function BarbellSVG({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 320 80" fill="none" className={className} style={style} aria-hidden="true">
      <rect x="0"   y="14" width="24" height="52" rx="5" fill="#1F2937" />
      <rect x="28"  y="22" width="15" height="36" rx="3" fill="#374151" />
      <rect x="47"  y="33" width="226" height="14" rx="6" fill="#6B7280" />
      <rect x="44"  y="26" width="12" height="28" rx="3" fill="#4B5563" />
      <rect x="264" y="26" width="12" height="28" rx="3" fill="#4B5563" />
      <rect x="277" y="22" width="15" height="36" rx="3" fill="#374151" />
      <rect x="296" y="14" width="24" height="52" rx="5" fill="#1F2937" />
      {[136,144,152,160,168,176,184].map((x) => (
        <rect key={x} x={x} y="33" width="2" height="14" rx="1" fill="rgba(0,0,0,0.2)" />
      ))}
      <rect x="0"   y="14" width="5" height="52" rx="3" fill="#F97316" opacity="0.7" />
      <rect x="315" y="14" width="5" height="52" rx="3" fill="#F97316" opacity="0.7" />
    </svg>
  )
}

// ─── Dumbbell SVG ──────────────────────────────────────────────────────────
function DumbbellSVG({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 160 60" fill="none" className={className} style={style} aria-hidden="true">
      <rect x="0"   y="10" width="20" height="40" rx="4" fill="#1F2937" />
      <rect x="23"  y="18" width="13" height="24" rx="3" fill="#374151" />
      <rect x="39"  y="25" width="82" height="10" rx="4" fill="#6B7280" />
      <rect x="124" y="18" width="13" height="24" rx="3" fill="#374151" />
      <rect x="140" y="10" width="20" height="40" rx="4" fill="#1F2937" />
      <rect x="0"   y="10" width="5"  height="40" rx="3" fill="#F97316" opacity="0.7" />
      <rect x="155" y="10" width="5"  height="40" rx="3" fill="#F97316" opacity="0.7" />
    </svg>
  )
}

// ─── Animated counter ──────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '', duration = 1800 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1)
            const ease = 1 - Math.pow(1 - p, 3)
            setCount(Math.floor(ease * target))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

// ─── Section label ─────────────────────────────────────────────────────────
function SectionLabel({ text }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-4">
      <span className="w-10 h-px bg-orange-500/60" aria-hidden="true" />
      <span className="text-orange-400 text-xs font-black tracking-[0.25em] uppercase" style={{ fontFamily: BC }}>
        {text}
      </span>
      <span className="w-10 h-px bg-orange-500/60" aria-hidden="true" />
    </div>
  )
}

// ─── Dashboard mockup (dark) ───────────────────────────────────────────────
const BAR_HEIGHTS = [45, 68, 55, 82, 72, 90, 78]

function DashboardMockup() {
  return (
    <div
      className="rounded-2xl shadow-2xl p-5 w-full max-w-sm select-none"
      style={{ background: '#111827', border: '1px solid rgba(249,115,22,0.25)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DumbbellSVG className="w-8 h-5" />
          <span className="text-xs font-black text-white uppercase tracking-wider" style={{ fontFamily: BC }}>
            IronHub Dashboard
          </span>
        </div>
        <span className="text-xs text-green-400 font-semibold flex items-center gap-1.5" style={{ fontFamily: BL }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse flex-shrink-0" aria-hidden="true" />
          Live
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'Check-ins', value: '247',   bg: 'rgba(249,115,22,0.15)', text: '#f97316' },
          { label: 'Revenue',   value: '$3.4k', bg: 'rgba(59,130,246,0.15)', text: '#60a5fa' },
          { label: 'Retention', value: '98%',   bg: 'rgba(34,197,94,0.15)',  text: '#4ade80' },
        ].map(({ label, value, bg, text }) => (
          <div key={label} className="rounded-xl p-2.5 text-center" style={{ background: bg }}>
            <div className="text-lg font-black" style={{ fontFamily: BC, color: text }}>{value}</div>
            <div className="text-[10px] text-gray-500 mt-0.5" style={{ fontFamily: BL }}>{label}</div>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <div className="text-[10px] text-gray-500 font-semibold mb-2 uppercase tracking-wider" style={{ fontFamily: BC }}>
          Weekly Check-ins
        </div>
        <div className="flex items-end gap-1 h-14">
          {BAR_HEIGHTS.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-sm"
              style={{ background: i === 5 ? '#F97316' : 'rgba(249,115,22,0.25)' }}
              initial={{ scaleY: 0, originY: 1 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.3 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div style={{ height: `${h}%` }} className="w-full" />
            </motion.div>
          ))}
        </div>
        <div className="flex mt-1">
          {['M','T','W','T','F','S','S'].map((d, i) => (
            <span key={i} className="flex-1 text-center text-[9px] text-gray-600" style={{ fontFamily: BL }}>{d}</span>
          ))}
        </div>
      </div>
      <div>
        <div className="text-[10px] text-gray-500 font-semibold mb-2 uppercase tracking-wider" style={{ fontFamily: BC }}>
          Recent Check-ins
        </div>
        {[
          { name: 'Alex Rahman',  time: '2m ago' },
          { name: 'Maria Santos', time: '5m ago' },
          { name: 'John Kim',     time: '11m ago' },
        ].map(({ name, time }) => (
          <div key={name} className="flex items-center gap-2.5 py-2 border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div
              className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white font-black flex-shrink-0"
              style={{ fontSize: 10, fontFamily: BC }}
            >
              {name[0]}
            </div>
            <span className="text-xs text-gray-300 flex-1 font-medium" style={{ fontFamily: BL }}>{name}</span>
            <span className="text-[10px] text-gray-500" style={{ fontFamily: BL }}>{time}</span>
            <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Navbar ────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Products', href: '#products' },
  { label: 'Pricing',  href: '#pricing'  },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const anchor = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault(); setMenuOpen(false)
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-gray-950/95 backdrop-blur-md border-b border-orange-500/15 shadow-lg shadow-black/20'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-1.5 cursor-pointer">
            <DumbbellSVG className="w-10 h-6" />
            <span className="text-xl font-black text-white leading-none"      style={{ fontFamily: BC }}>Iron</span>
            <span className="text-xl font-black text-orange-500 leading-none" style={{ fontFamily: BC }}>Hub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label} href={href} onClick={(e) => anchor(e, href)}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                style={{ fontFamily: BL }}
              >
                {label}
              </a>
            ))}
            <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200" style={{ fontFamily: BL }}>
              Login
            </Link>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-black transition-colors duration-200 shadow-lg shadow-orange-500/30 cursor-pointer"
                style={{ fontFamily: BC, letterSpacing: '0.04em' }}
              >
                Get Started <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </motion.div>
          </nav>

          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
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
            style={{ background: 'rgba(10,14,23,0.98)', borderTop: '1px solid rgba(249,115,22,0.15)' }}
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(({ label, href }) => (
                <a key={label} href={href} onClick={(e) => anchor(e, href)}
                  className="px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 text-sm font-medium transition-colors duration-200 cursor-pointer"
                  style={{ fontFamily: BL }}
                >
                  {label}
                </a>
              ))}
              <Link to="/login" onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 text-sm font-medium"
                style={{ fontFamily: BL }}
              >
                Login
              </Link>
              <Link to="/login" onClick={() => setMenuOpen(false)}
                className="mt-1 px-4 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-black text-center transition-colors"
                style={{ fontFamily: BC }}
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

// ─── Hero ──────────────────────────────────────────────────────────────────
function Hero() {
  const ref = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 70, damping: 22 })
  const springY = useSpring(mouseY, { stiffness: 70, damping: 22 })

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textY   = useTransform(scrollYProgress, [0, 1], [0, 80])
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, 40])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])

  const cube1X = useTransform(springX, v => v * 22)
  const cube1Y = useTransform(springY, v => v * 14)
  const ring1X = useTransform(springX, v => v * -14)
  const ring1Y = useTransform(springY, v => v * -10)

  const handleMouseMove = useCallback((e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2))
    mouseY.set((e.clientY - rect.top  - rect.height / 2) / (rect.height / 2))
  }, [mouseX, mouseY])

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      style={{ background: '#0a0e17' }}
    >
      {/* Gym background image — now clearly visible */}
      <motion.div style={{ scale: bgScale }} className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${IMG.heroBg})`, opacity: 0.32 }}
        />
        {/* Multi-layer dark gradient over photo */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,14,23,0.92) 0%, rgba(10,14,23,0.7) 50%, rgba(10,14,23,0.85) 100%)' }} />
      </motion.div>

      {/* Large glow blobs */}
      <motion.div style={{ scale: bgScale }} className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-20 -right-20 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 65%)' }} />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 65%)' }} />
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </motion.div>

      {/* Canvas particle network */}
      <ParticleCanvas />

      {/* Mouse-parallax 3D decorations */}
      <motion.div className="absolute top-28 right-[8%] z-0" style={{ x: cube1X, y: cube1Y }} aria-hidden="true">
        <FloatingCube size={58} delay={0} />
      </motion.div>
      <motion.div className="absolute bottom-36 right-[22%] z-0 hidden md:block" style={{ x: cube1X, y: ring1Y }} aria-hidden="true">
        <FloatingCube size={36} delay={3.5} />
      </motion.div>
      <motion.div className="absolute top-44 left-[4%] z-0 hidden md:block" style={{ x: ring1X, y: ring1Y }} aria-hidden="true">
        <FloatingRing size={96} delay={1} />
      </motion.div>
      <motion.div className="absolute bottom-44 left-[22%] z-0 hidden lg:block" style={{ x: ring1X, y: cube1Y }} aria-hidden="true">
        <FloatingRing size={58} delay={2.5} />
      </motion.div>

      {/* Floating barbell */}
      <motion.div
        animate={{ y: [0, -18, 0], rotate: [-3, 3, -3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-24 right-4 md:right-[52%] pointer-events-none opacity-15"
        aria-hidden="true"
      >
        <BarbellSVG className="w-52" />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — text */}
          <motion.div style={{ y: textY }}>
            <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
              <motion.div variants={fadeUp}>
                <span
                  className="inline-flex items-center gap-2 text-orange-400 text-xs font-black tracking-[0.2em] uppercase rounded-full px-4 py-2"
                  style={{ fontFamily: BC, background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)' }}
                >
                  <Zap className="w-3.5 h-3.5 fill-orange-500" aria-hidden="true" /> All-in-One Gym CRM
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="font-black leading-[0.9] text-white"
                style={{ fontFamily: BC, fontSize: 'clamp(3.2rem, 7vw, 6rem)' }}
              >
                MANAGE YOUR GYM.{' '}
                <span style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  DOMINATE YOUR MARKET.
                </span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-gray-400 text-lg leading-relaxed max-w-lg" style={{ fontFamily: BL }}>
                IronHub gives gym owners a razor-sharp platform for attendance tracking,
                subscription management, and personalized workout routines — all in one place.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-black text-base transition-all duration-200 shadow-xl shadow-orange-500/35 cursor-pointer"
                    style={{ fontFamily: BC, letterSpacing: '0.06em' }}
                  >
                    START FOR FREE <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <a
                    href="#features"
                    onClick={(e) => { e.preventDefault(); document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' }) }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-gray-300 font-black text-base transition-all duration-200 cursor-pointer"
                    style={{ fontFamily: BC, letterSpacing: '0.06em', border: '2px solid rgba(255,255,255,0.15)' }}
                  >
                    SEE HOW IT WORKS
                  </a>
                </motion.div>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-5 pt-2">
                {[
                  { icon: Users,  text: '500+ Gyms' },
                  { icon: Shield, text: '99.9% Uptime' },
                  { icon: Star,   text: '4.9 / 5 Rating' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-sm text-gray-400" style={{ fontFamily: BL }}>
                    <Icon className="w-4 h-4 text-orange-500" aria-hidden="true" />
                    <span>{text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right — dashboard mockup */}
          <motion.div
            style={{ y: mockupY }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Glow behind mockup */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.3) 0%, transparent 70%)', filter: 'blur(40px)', transform: 'scale(1.3)' }}
              aria-hidden="true"
            />
            {/* Floating dumbbells */}
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-8 -left-4 pointer-events-none" aria-hidden="true">
              <DumbbellSVG className="w-24 opacity-40" />
            </motion.div>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              className="absolute -bottom-6 -right-2 pointer-events-none" aria-hidden="true">
              <DumbbellSVG className="w-16 opacity-25" />
            </motion.div>

            {/* 3D depth stack */}
            <div className="relative">
              <div className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl" style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.2)' }} aria-hidden="true" />
              <div className="absolute -bottom-1.5 -right-1.5 w-full h-full rounded-2xl" style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.12)' }} aria-hidden="true" />
              <DashboardMockup />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs text-gray-500 font-medium" style={{ fontFamily: BL }}>Scroll</span>
        <ChevronDown className="w-4 h-4 text-orange-400" aria-hidden="true" />
      </motion.div>
    </section>
  )
}

// ─── Power Strip Marquee ───────────────────────────────────────────────────
const MARQUEE = [
  'QR Attendance', 'Subscription Plans', 'Workout Routines', 'Member Profiles',
  'Renewal Alerts', 'Progress Tracking', 'Live Dashboard', 'Revenue Analytics',
]

function PowerStrip() {
  return (
    <div className="bg-orange-500 py-4 overflow-hidden">
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      >
        {[...MARQUEE, ...MARQUEE].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 text-sm font-black text-white/90 uppercase tracking-[0.2em]" style={{ fontFamily: BC }}>
            <span className="w-1.5 h-1.5 rounded-full bg-white/70 flex-shrink-0" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ─── Features ──────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: QrCode,     title: 'QR Check-In',        desc: 'Members scan a QR code or enter a PIN for instant attendance. Track daily check-ins and spot drop-offs before they happen.',                                  metric: '1,240 check-ins today',  dot: 'bg-green-500',  img: IMG.feat1 },
  { icon: CreditCard, title: 'Subscriptions',       desc: 'Monitor active plans, expiry dates, and payment history. Automated alerts fire before memberships lapse so you never miss a renewal.',                      metric: '18 renewals this week',  dot: 'bg-blue-500',   img: IMG.feat2 },
  { icon: Dumbbell,   title: 'Workout Routines',    desc: 'Assign one of 3 predefined programs to each member. Daily exercise checklists and streak tracking keep them engaged.',                                        metric: '94% completion rate',    dot: 'bg-orange-500', img: IMG.feat3 },
  { icon: TrendingUp, title: 'Analytics',           desc: 'Revenue trends, peak hours, retention rates, and plan performance — all in real time on a single dashboard.',                                               metric: '+12% retention MoM',     dot: 'bg-purple-500', img: IMG.feat1 },
  { icon: Users,      title: 'Member Hub',          desc: 'Full member profiles with contact info, subscription history, and assigned routines. Search, filter, and act in seconds.',                                  metric: '2,000+ active members',  dot: 'bg-cyan-500',   img: IMG.feat2 },
  { icon: Shield,     title: 'Enterprise Security', desc: 'Built on Supabase with row-level security and encrypted storage. Your data is protected by enterprise-grade infrastructure.',                               metric: '99.9% uptime SLA',       dot: 'bg-rose-500',   img: IMG.feat3 },
]

function Features() {
  return (
    <section id="features" className="py-28 relative overflow-hidden" style={{ background: '#0a0e17' }}>
      {/* Background decorations */}
      <div className="absolute top-10 right-10 opacity-20 pointer-events-none" aria-hidden="true">
        <FloatingRing size={100} delay={0.5} />
      </div>
      <div className="absolute bottom-10 left-10 opacity-15 pointer-events-none" aria-hidden="true">
        <FloatingCube size={44} delay={1.5} />
      </div>
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        aria-hidden="true"
      />
      {/* Orange glow top-center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center top, rgba(249,115,22,0.12) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <SectionLabel text="Features" />
          <h2 className="font-black text-white leading-none" style={{ fontFamily: BC, fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}>
            EVERYTHING YOUR GYM NEEDS
          </h2>
          <p className="text-gray-400 text-lg mt-4 max-w-xl mx-auto" style={{ fontFamily: BL }}>
            Built for gym owners who want less admin and more impact.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        >
          {FEATURES.map(({ icon: Icon, title, desc, metric, dot, img }) => (
            <motion.div key={title} variants={fadeUp}>
              <TiltCard className="h-full">
                <motion.div
                  whileHover={{ y: -5, boxShadow: '0 24px 48px rgba(249,115,22,0.18), 0 0 0 1px rgba(249,115,22,0.12)' }}
                  transition={{ duration: 0.2 }}
                  className="h-full rounded-2xl overflow-hidden cursor-default group flex flex-col"
                  style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  {/* Shimmer sweep */}
                  <div
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none z-10"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.08), transparent)' }}
                    aria-hidden="true"
                  />
                  {/* Card header — gym photo background */}
                  <div className="relative h-32 overflow-hidden flex items-center justify-center flex-shrink-0">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${img})`, opacity: 0.22 }}
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(17,24,39,0.4) 0%, rgba(17,24,39,0.85) 100%)' }} />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: 'radial-gradient(circle at 50% 100%, rgba(249,115,22,0.18), transparent 70%)' }}
                      aria-hidden="true"
                    />
                    <div
                      className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ background: 'rgba(249,115,22,0.2)', border: '1px solid rgba(249,115,22,0.4)' }}
                    >
                      <Icon className="w-7 h-7 text-orange-400" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-black text-white mb-2 tracking-wide" style={{ fontFamily: BC, fontSize: '1.05rem' }}>{title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-5 flex-1" style={{ fontFamily: BL }}>{desc}</p>
                    <div className="flex items-center gap-2 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} aria-hidden="true" />
                      <span className="text-gray-500 text-xs" style={{ fontFamily: BL }}>{metric}</span>
                    </div>
                  </div>
                </motion.div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Products ──────────────────────────────────────────────────────────────
const PRODUCTS = [
  { icon: Package,     label: 'NEW',     title: 'Supplement Inventory', desc: "Track your gym's protein powders, pre-workouts, and nutrition products. Manage stock, set reorder alerts, and sell to members.", price: 'Pro & Elite',  color: 'orange' },
  { icon: ShoppingBag, label: 'POPULAR', title: 'Merchandise Store',    desc: 'Sell branded apparel, water bottles, and accessories. IronHub tracks inventory, processes orders, and updates stock.',              price: 'Pro & Elite',  color: 'blue'   },
  { icon: Award,       label: 'HOT',     title: 'Personal Training',    desc: 'Package and sell PT sessions per trainer. Schedule, track progress, and manage client-trainer assignments within IronHub.',           price: 'All plans',    color: 'purple' },
  { icon: Activity,    label: 'CORE',    title: 'Membership Plans',     desc: 'Create unlimited membership tiers — monthly, quarterly, annual. Automated billing reminders and one-click renewals.',                 price: 'All plans',    color: 'green'  },
]

const PROD_COLORS = {
  orange: { bg: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.3)',  icon: '#f97316', label: 'bg-orange-500 text-white' },
  blue:   { bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.3)',  icon: '#60a5fa', label: 'bg-blue-500 text-white'   },
  purple: { bg: 'rgba(168,85,247,0.12)',  border: 'rgba(168,85,247,0.3)',  icon: '#c084fc', label: 'bg-purple-500 text-white' },
  green:  { bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.3)',   icon: '#4ade80', label: 'bg-green-500 text-white'  },
}

function Products() {
  return (
    <section id="products" className="py-28 relative overflow-hidden" style={{ background: '#0f1420' }}>
      {/* Glow at bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-48 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center bottom, rgba(249,115,22,0.10) 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <SectionLabel text="Products" />
          <h2 className="font-black text-white leading-none" style={{ fontFamily: BC, fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}>
            EVERYTHING YOUR GYM{' '}
            <span style={{ background: 'linear-gradient(135deg,#F97316,#EA580C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SELLS & MANAGES
            </span>
          </h2>
          <p className="text-gray-400 text-lg mt-4 max-w-xl mx-auto" style={{ fontFamily: BL }}>
            One platform to run your entire gym business — memberships, products, training, and more.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        >
          {PRODUCTS.map(({ icon: Icon, label, title, desc, price, color }) => {
            const c = PROD_COLORS[color]
            return (
              <motion.div key={title} variants={fadeUp}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: `0 24px 48px rgba(0,0,0,0.3)` }}
                  transition={{ duration: 0.2 }}
                  className="h-full rounded-2xl overflow-hidden cursor-default flex flex-col relative group"
                  style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  {/* Shimmer */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none z-10"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)' }}
                    aria-hidden="true"
                  />
                  <div className="px-5 py-4 flex items-center justify-between flex-shrink-0" style={{ background: c.bg, borderBottom: `1px solid ${c.border}` }}>
                    <Icon className="w-7 h-7" style={{ color: c.icon }} aria-hidden="true" />
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${c.label}`} style={{ fontFamily: BC, letterSpacing: '0.1em' }}>{label}</span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-black text-white mb-2" style={{ fontFamily: BC, fontSize: '1.05rem' }}>{title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed flex-1" style={{ fontFamily: BL }}>{desc}</p>
                    <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                      <span className="text-xs font-semibold text-gray-500" style={{ fontFamily: BL }}>{price}</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Stats Banner ──────────────────────────────────────────────────────────
function StatsBanner() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const barbellX = useTransform(scrollYProgress, [0, 1], [-60, 60])
  const bgY      = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section ref={ref} className="relative py-24 overflow-hidden" style={{ background: '#080b12' }}>
      {/* Parallax gym background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${IMG.statsBg})`, opacity: 0.28 }}
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/80 pointer-events-none" aria-hidden="true" />

      {/* Animated barbell overlay */}
      <motion.div style={{ x: barbellX }} className="absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-[0.08] flex justify-center" aria-hidden="true">
        <BarbellSVG className="w-full max-w-3xl" style={{ filter: 'invert(1)' }} />
      </motion.div>

      {/* Orange side accents */}
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: 'linear-gradient(180deg, transparent, #F97316, transparent)' }} aria-hidden="true" />
      <div className="absolute right-0 top-0 bottom-0 w-1" style={{ background: 'linear-gradient(180deg, transparent, #F97316, transparent)' }} aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-0"
          variants={staggerFast} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          {[
            { value: 500, suffix: '+',   label: 'Gyms Using IronHub' },
            { value: 50,  suffix: 'k+',  label: 'Members Tracked'    },
            { value: 98,  suffix: '%',   label: 'Retention Rate'      },
            { value: 99,  suffix: '.9%', label: 'Uptime SLA'          },
          ].map(({ value, suffix, label }, idx) => (
            <motion.div key={label} variants={fadeUp} className="flex flex-col items-center text-center py-8 px-4 relative">
              {idx < 3 && <div className="absolute right-0 top-1/4 h-1/2 w-px bg-white/10 hidden md:block" aria-hidden="true" />}
              <span className="text-5xl font-black text-white mb-1" style={{ fontFamily: BC, textShadow: '0 0 40px rgba(249,115,22,0.6)' }}>
                <AnimatedCounter target={value} suffix={suffix} />
              </span>
              <span className="text-sm text-gray-400 uppercase tracking-widest" style={{ fontFamily: BC }}>{label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── How It Works ──────────────────────────────────────────────────────────
const STEPS = [
  { n: '01', icon: Users,      title: 'Add Your Members',       desc: 'Import or add member profiles with contact info, emergency contacts, and plan details in under a minute.' },
  { n: '02', icon: CreditCard, title: 'Assign Plans & Routines', desc: "Set subscription tiers and assign one of 3 workout programs tailored to each member's fitness goals." },
  { n: '03', icon: TrendingUp, title: 'Track Everything',        desc: 'Monitor attendance, upcoming renewals, and member progress daily from your real-time dashboard.' },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 relative overflow-hidden" style={{ background: '#0a0e17' }}>
      <div className="absolute bottom-10 left-10 opacity-20 pointer-events-none" aria-hidden="true">
        <FloatingCube size={44} delay={1} />
      </div>
      <div className="absolute top-10 right-10 opacity-15 pointer-events-none" aria-hidden="true">
        <FloatingRing size={80} delay={2} />
      </div>
      {/* Glow center */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-64 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.07) 0%, transparent 65%)' }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}>
          <SectionLabel text="How It Works" />
          <h2 className="font-black text-white leading-none" style={{ fontFamily: BC, fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}>
            UP AND RUNNING IN{' '}
            <span style={{ background: 'linear-gradient(135deg,#F97316,#EA580C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              3 STEPS
            </span>
          </h2>
          <p className="text-gray-400 text-lg mt-4 max-w-xl mx-auto" style={{ fontFamily: BL }}>
            Zero lengthy onboarding. Three steps to a fully operational gym CRM.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col md:flex-row items-stretch gap-4"
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        >
          {STEPS.map(({ n, icon: Icon, title, desc }, idx) => (
            <Fragment key={n}>
              <motion.div variants={fadeUp} className="flex-1">
                <TiltCard className="h-full">
                  <div
                    className="h-full rounded-2xl p-8 relative overflow-hidden group cursor-default transition-all duration-300"
                    style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)' }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
                  >
                    <span
                      className="absolute -bottom-3 -right-1 font-black leading-none select-none pointer-events-none text-white"
                      style={{ fontFamily: BC, fontSize: '9rem', opacity: 0.05 }}
                      aria-hidden="true"
                    >
                      {n}
                    </span>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                      style={{ background: 'radial-gradient(circle at 50% 0%, rgba(249,115,22,0.08) 0%, transparent 60%)' }}
                      aria-hidden="true"
                    />
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none z-10"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.07), transparent)' }}
                      aria-hidden="true"
                    />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-5">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.25)' }}
                        >
                          <Icon className="w-5 h-5 text-orange-400" aria-hidden="true" />
                        </div>
                        <span className="text-orange-400 text-xs font-black tracking-[0.2em] uppercase" style={{ fontFamily: BC }}>Step {n}</span>
                      </div>
                      <h3 className="text-xl font-black text-white mb-3" style={{ fontFamily: BC }}>{title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed" style={{ fontFamily: BL }}>{desc}</p>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
              {idx < STEPS.length - 1 && (
                <div className="hidden md:flex items-center flex-shrink-0" aria-hidden="true">
                  <motion.div animate={{ x: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }} className="text-orange-500/60">
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

// ─── BMI Calculator ────────────────────────────────────────────────────────
function getBMICategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight',   color: '#3B82F6', pct: 10 }
  if (bmi < 25)   return { label: 'Normal Weight', color: '#22C55E', pct: 35 }
  if (bmi < 30)   return { label: 'Overweight',    color: '#F59E0B', pct: 62 }
  return                  { label: 'Obese',         color: '#EF4444', pct: 85 }
}

function BMICalculator() {
  const [height, setHeight]         = useState(175)
  const [weight, setWeight]         = useState(75)
  const [result, setResult]         = useState(null)
  const [calculated, setCalculated] = useState(false)
  const springBmi = useSpring(0, { stiffness: 60, damping: 15 })

  const calculate = () => {
    const h = parseFloat(height), w = parseFloat(weight)
    if (!h || !w || h <= 0 || w <= 0) return
    const bmi = w / ((h / 100) * (h / 100))
    const rounded = Math.round(bmi * 10) / 10
    setResult(rounded); setCalculated(true); springBmi.set(rounded)
  }

  const category = result ? getBMICategory(result) : null

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: '#0f1420' }}>
      <div className="absolute top-12 right-12 opacity-20 pointer-events-none" aria-hidden="true">
        <FloatingRing size={80} delay={0} />
      </div>
      <div className="absolute bottom-12 left-12 opacity-15 pointer-events-none" aria-hidden="true">
        <FloatingCube size={40} delay={1} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}>
          <SectionLabel text="BMI Calculator" />
          <h2 className="font-black text-white leading-none" style={{ fontFamily: BC, fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}>
            KNOW YOUR{' '}
            <span style={{ background: 'linear-gradient(135deg,#F97316,#EA580C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              NUMBERS
            </span>
          </h2>
          <p className="text-gray-400 text-lg mt-4 max-w-lg mx-auto" style={{ fontFamily: BL }}>
            IronHub helps your members track their fitness journey. Use this BMI tool as a quick health check.
          </p>
        </motion.div>

        <motion.div
          className="rounded-3xl overflow-hidden shadow-2xl"
          style={{ background: '#111827', border: '1px solid rgba(249,115,22,0.2)' }}
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid md:grid-cols-2">
            <div className="p-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-black text-white" style={{ fontFamily: BC }}>Enter Your Stats</h3>
              </div>
              <div className="space-y-7">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-gray-300" style={{ fontFamily: BC }}>HEIGHT</label>
                    <span className="text-sm font-black text-orange-400" style={{ fontFamily: BC }}>{height} cm</span>
                  </div>
                  <input
                    type="range" min="100" max="230" step="1" value={height}
                    onChange={(e) => { setHeight(e.target.value); setCalculated(false) }}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: '#F97316', background: `linear-gradient(to right, #F97316 ${((height - 100) / 130) * 100}%, #374151 ${((height - 100) / 130) * 100}%)` }}
                    aria-label="Height in centimeters"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 mt-1" style={{ fontFamily: BL }}>
                    <span>100 cm</span><span>230 cm</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-gray-300" style={{ fontFamily: BC }}>WEIGHT</label>
                    <span className="text-sm font-black text-orange-400" style={{ fontFamily: BC }}>{weight} kg</span>
                  </div>
                  <input
                    type="range" min="30" max="200" step="1" value={weight}
                    onChange={(e) => { setWeight(e.target.value); setCalculated(false) }}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: '#F97316', background: `linear-gradient(to right, #F97316 ${((weight - 30) / 170) * 100}%, #374151 ${((weight - 30) / 170) * 100}%)` }}
                    aria-label="Weight in kilograms"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 mt-1" style={{ fontFamily: BL }}>
                    <span>30 kg</span><span>200 kg</span>
                  </div>
                </div>
                <motion.button
                  onClick={calculate} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-base transition-colors duration-200 shadow-lg shadow-orange-500/25 cursor-pointer"
                  style={{ fontFamily: BC, letterSpacing: '0.08em' }}
                >
                  CALCULATE BMI
                </motion.button>
              </div>
            </div>

            <div className="p-8 flex flex-col justify-center" style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
              <AnimatePresence mode="wait">
                {!calculated ? (
                  <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center h-full py-8">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                      style={{ background: 'rgba(249,115,22,0.12)', border: '2px solid rgba(249,115,22,0.25)' }}
                    >
                      <Activity className="w-9 h-9 text-orange-400/60" aria-hidden="true" />
                    </div>
                    <p className="text-gray-500 text-sm" style={{ fontFamily: BL }}>Enter your height and weight,<br />then press Calculate.</p>
                  </motion.div>
                ) : (
                  <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="space-y-6">
                    <div className="text-center">
                      <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1" style={{ fontFamily: BC }}>Your BMI</div>
                      <motion.div className="text-7xl font-black" style={{ fontFamily: BC, color: category?.color }}
                        initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
                        {result}
                      </motion.div>
                      <span className="inline-block mt-2 px-4 py-1.5 rounded-full text-sm font-black text-white" style={{ background: category?.color, fontFamily: BC }}>
                        {category?.label}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-2 text-center" style={{ fontFamily: BL }}>BMI Scale</div>
                      <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'linear-gradient(to right, #3B82F6, #22C55E, #F59E0B, #EF4444)' }}>
                        <motion.div className="h-full w-1 bg-white rounded-full shadow-md" initial={{ marginLeft: '0%' }}
                          animate={{ marginLeft: `${Math.min(Math.max(category?.pct ?? 0, 0), 96)}%` }}
                          transition={{ type: 'spring', stiffness: 80, damping: 18 }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { range: '< 18.5',     cat: 'Underweight', c: '#3B82F6' },
                        { range: '18.5 – 24.9', cat: 'Normal',      c: '#22C55E' },
                        { range: '25 – 29.9',  cat: 'Overweight',  c: '#F59E0B' },
                        { range: '≥ 30',       cat: 'Obese',       c: '#EF4444' },
                      ].map(({ range, cat, c }) => (
                        <div key={cat} className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c }} aria-hidden="true" />
                          <span className="text-xs text-gray-500" style={{ fontFamily: BL }}>{range} — {cat}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Pricing ───────────────────────────────────────────────────────────────
const PLANS = [
  {
    name: 'Starter', monthlyPrice: 29, annualPrice: 23,
    desc: 'Perfect for small gyms just getting started.',
    features: ['1 gym location','Up to 100 members','QR attendance','Basic subscriptions','Email support'],
    missing: ['Workout routines','Product inventory','Analytics dashboard'],
    cta: 'Get Started', featured: false,
  },
  {
    name: 'Pro', monthlyPrice: 79, annualPrice: 63,
    desc: 'The complete toolkit for serious gym owners.',
    features: ['Up to 3 locations','Up to 500 members','QR attendance','All subscription types','Workout routines','Product inventory','Analytics dashboard','Priority support'],
    missing: ['Unlimited members','White-label'],
    cta: 'Start Free Trial', featured: true,
  },
  {
    name: 'Elite', monthlyPrice: 149, annualPrice: 119,
    desc: 'Enterprise power for multi-location gym chains.',
    features: ['Unlimited locations','Unlimited members','Everything in Pro','White-label branding','API access','Dedicated account manager','24/7 phone support'],
    missing: [],
    cta: 'Contact Sales', featured: false,
  },
]

function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" className="py-28 relative overflow-hidden" style={{ background: '#080b12' }}>
      {/* Gym photo background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${IMG.pricingBg})`, opacity: 0.1 }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(8,11,18,0.6) 0%, rgba(8,11,18,0.9) 100%)' }} />
      </div>
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-64 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center top, rgba(249,115,22,0.12) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}>
          <SectionLabel text="Pricing" />
          <h2 className="font-black text-white leading-none mb-4" style={{ fontFamily: BC, fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}>
            SIMPLE,{' '}
            <span style={{ background: 'linear-gradient(135deg,#F97316,#EA580C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              TRANSPARENT
            </span>{' '}PRICING
          </h2>
          <p className="text-gray-400 text-lg max-w-md mx-auto mb-8" style={{ fontFamily: BL }}>
            No hidden fees. No long-term contracts. Cancel anytime.
          </p>
          <div className="inline-flex items-center gap-3 rounded-full p-1" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-black transition-all duration-200 cursor-pointer ${!annual ? 'bg-orange-500 text-white shadow' : 'text-gray-400'}`}
              style={{ fontFamily: BC }}>Monthly</button>
            <button onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-black transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${annual ? 'bg-orange-500 text-white shadow' : 'text-gray-400'}`}
              style={{ fontFamily: BC }}>
              Annual
              <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full font-black">-20%</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start"
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        >
          {PLANS.map(({ name, monthlyPrice, annualPrice, desc, features, missing, cta, featured }) => (
            <motion.div key={name} variants={fadeUp}>
              <TiltCard className="h-full">
                <div className={`relative h-full rounded-2xl overflow-hidden flex flex-col ${
                  featured
                    ? 'bg-orange-500 text-white shadow-2xl shadow-orange-500/40'
                    : ''
                }`}
                  style={!featured ? { background: '#111827', border: '1px solid rgba(255,255,255,0.1)' } : {}}
                >
                  {/* Featured glow pulse */}
                  {featured && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.18) 0%, transparent 60%)' }}
                      aria-hidden="true"
                    />
                  )}
                  {featured && (
                    <div className="absolute top-4 right-4">
                      <span className="text-[10px] font-black bg-white/20 text-white px-3 py-1 rounded-full uppercase tracking-widest" style={{ fontFamily: BC }}>
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className={`p-7 ${featured ? 'border-b border-white/20' : ''}`} style={!featured ? { borderBottom: '1px solid rgba(255,255,255,0.07)' } : {}}>
                    <h3 className={`text-2xl font-black mb-1 ${featured ? 'text-white' : 'text-white'}`} style={{ fontFamily: BC }}>{name}</h3>
                    <p className={`text-sm mb-5 ${featured ? 'text-white/80' : 'text-gray-400'}`} style={{ fontFamily: BL }}>{desc}</p>
                    <div className="flex items-end gap-1">
                      <AnimatePresence mode="wait">
                        <motion.span key={annual ? 'annual' : 'monthly'}
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                          className="text-5xl font-black text-white"
                          style={{ fontFamily: BC }}>
                          ${annual ? annualPrice : monthlyPrice}
                        </motion.span>
                      </AnimatePresence>
                      <span className={`text-sm mb-2 ${featured ? 'text-white/70' : 'text-gray-500'}`} style={{ fontFamily: BL }}>/mo</span>
                    </div>
                    {annual && (
                      <p className={`text-xs mt-1 ${featured ? 'text-white/70' : 'text-gray-500'}`} style={{ fontFamily: BL }}>
                        Billed annually (${(annual ? annualPrice : monthlyPrice) * 12}/yr)
                      </p>
                    )}
                  </div>
                  <div className="p-7 flex flex-col flex-1">
                    <ul className="space-y-3 flex-1 mb-6">
                      {features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5">
                          <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${featured ? 'text-white' : 'text-orange-400'}`} aria-hidden="true" />
                          <span className={`text-sm ${featured ? 'text-white/90' : 'text-gray-300'}`} style={{ fontFamily: BL }}>{f}</span>
                        </li>
                      ))}
                      {missing.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 opacity-35">
                          <X className={`w-4 h-4 flex-shrink-0 mt-0.5 ${featured ? 'text-white' : 'text-gray-500'}`} aria-hidden="true" />
                          <span className={`text-sm ${featured ? 'text-white/70' : 'text-gray-500'}`} style={{ fontFamily: BL }}>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Link to="/login"
                        className={`block w-full py-3.5 rounded-xl font-black text-center text-base transition-all duration-200 cursor-pointer ${
                          featured
                            ? 'bg-white text-orange-500 hover:bg-orange-50 shadow-lg'
                            : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25'
                        }`}
                        style={{ fontFamily: BC, letterSpacing: '0.06em' }}>
                        {cta}
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>

        <motion.p className="text-center text-sm text-gray-500 mt-8"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
          style={{ fontFamily: BL }}>
          All plans include a 14-day free trial. No credit card required.
        </motion.p>
      </div>
    </section>
  )
}

// ─── Testimonials ──────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: 'Marcus Thompson', role: 'Owner, Iron Temple Gym',
    quote: "IronHub cut my admin time by 70%. I used to spend 3 hours a week chasing renewals — now it's fully automated. Complete game changer for my business.",
    stars: 5, img: IMG.tm1,
  },
  {
    name: 'Sarah Malik', role: 'Manager, Peak Performance Fitness',
    quote: "The QR check-in alone was worth switching. Members love it, and I finally have real attendance data to make decisions with.",
    stars: 5, img: IMG.tm2,
  },
  {
    name: 'David Chen', role: 'Founder, Elevate CrossFit',
    quote: "Setup took 20 minutes. The dashboard is clean, the data is accurate, and the routine assignment keeps members engaged long-term.",
    stars: 5, img: IMG.tm3,
  },
]

function Testimonials() {
  return (
    <section className="py-28 relative overflow-hidden" style={{ background: '#0a0e17' }}>
      {/* Gym photo background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${IMG.heroBg})`, opacity: 0.07 }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,14,23,0.5), rgba(10,14,23,0.8))' }} />
      </div>
      {/* Orange glow bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-48 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center bottom, rgba(249,115,22,0.10) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}>
          <SectionLabel text="Testimonials" />
          <h2 className="font-black text-white leading-none" style={{ fontFamily: BC, fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}>
            REAL OWNERS.{' '}
            <span style={{ background: 'linear-gradient(135deg,#F97316,#EA580C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              REAL RESULTS.
            </span>
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        >
          {TESTIMONIALS.map(({ name, role, quote, stars, img }) => (
            <motion.div key={name} variants={fadeUp}>
              <TiltCard className="h-full">
                <motion.div
                  whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(249,115,22,0.1)' }}
                  transition={{ duration: 0.2 }}
                  className="h-full rounded-2xl p-7 flex flex-col cursor-default group overflow-hidden relative"
                  style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {/* Shimmer sweep */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none z-10"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.06), transparent)' }}
                    aria-hidden="true"
                  />
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed flex-1 italic mb-6" style={{ fontFamily: BL }}>"{quote}"</p>
                  <div className="flex items-center gap-3 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <img
                      src={img}
                      alt={name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      style={{ boxShadow: '0 0 0 2px rgba(249,115,22,0.4)' }}
                      loading="lazy"
                    />
                    <div>
                      <div className="text-sm font-black text-white" style={{ fontFamily: BC }}>{name}</div>
                      <div className="text-xs text-gray-500" style={{ fontFamily: BL }}>{role}</div>
                    </div>
                  </div>
                </motion.div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── CTA Section ───────────────────────────────────────────────────────────
function CTASection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const barbellScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.05, 0.9])

  return (
    <section ref={ref} className="relative py-28 overflow-hidden bg-orange-500">
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 60px, rgba(255,255,255,0.04) 60px, rgba(255,255,255,0.04) 61px)' }}
        aria-hidden="true"
      />

      {/* Animated barbell */}
      <motion.div style={{ scaleX: barbellScale }}
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-10 flex justify-center" aria-hidden="true">
        <BarbellSVG className="w-full max-w-4xl" style={{ filter: 'invert(1)' }} />
      </motion.div>

      {/* Floating dumbbells */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [-5, 5, -5] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-20" aria-hidden="true">
        <DumbbellSVG className="w-36" style={{ filter: 'invert(1)' }} />
      </motion.div>
      <motion.div
        animate={{ y: [0, 16, 0], rotate: [5, -5, 5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute -right-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-20" aria-hidden="true">
        <DumbbellSVG className="w-28" style={{ filter: 'invert(1)' }} />
      </motion.div>

      <div className="absolute top-8 right-16 opacity-30 pointer-events-none" aria-hidden="true">
        <FloatingCube size={40} delay={0} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
          <motion.div variants={fadeUp} className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-black tracking-[0.2em] uppercase rounded-full px-4 py-2" style={{ fontFamily: BC }}>
              <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" /> No credit card required
            </span>
          </motion.div>
          <motion.h2 variants={fadeUp}
            className="font-black text-white leading-[0.9] mb-5"
            style={{ fontFamily: BC, fontSize: 'clamp(2.8rem, 7vw, 5.5rem)' }}>
            READY TO TRANSFORM HOW YOU RUN YOUR GYM?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-white/80 text-lg mb-10 max-w-xl mx-auto" style={{ fontFamily: BL }}>
            Join IronHub today. Setup takes 5 minutes. Results last forever.
          </motion.p>
          <motion.div variants={fadeUp}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link to="/login"
                className="inline-flex items-center gap-2 px-12 py-5 rounded-full bg-white hover:bg-orange-50 text-orange-500 font-black text-lg transition-all duration-200 shadow-2xl cursor-pointer"
                style={{ fontFamily: BC, letterSpacing: '0.08em' }}>
                GET STARTED FREE <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </motion.div>
          </motion.div>
          <motion.p variants={fadeUp} className="text-white/60 text-sm mt-5" style={{ fontFamily: BL }}>
            14-day free trial · No credit card · Cancel anytime
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Footer ────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: '#040608' }} className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <DumbbellSVG className="w-9 h-5 opacity-50" style={{ filter: 'invert(1)' }} />
              <span className="text-lg font-black text-white/60 ml-1" style={{ fontFamily: BC }}>Iron</span>
              <span className="text-lg font-black text-orange-500/70"  style={{ fontFamily: BC }}>Hub</span>
            </div>
            <p className="text-xs text-gray-600" style={{ fontFamily: BL }}>Built for serious gym owners.</p>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600" style={{ fontFamily: BL }}>
            <a href="#features" className="hover:text-white transition-colors duration-200 cursor-pointer">Features</a>
            <a href="#pricing"  className="hover:text-white transition-colors duration-200 cursor-pointer">Pricing</a>
            <Link to="/login"  className="hover:text-white transition-colors duration-200">Login</Link>
          </div>
          <p className="text-xs text-gray-700" style={{ fontFamily: BL }}>© 2025 IronHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function Landing() {
  return (
    <div className="min-h-screen antialiased overflow-x-hidden" style={{ background: '#0a0e17' }}>
      <Navbar />
      <main>
        <Hero />
        <PowerStrip />
        <Features />
        <Products />
        <StatsBanner />
        <HowItWorks />
        <BMICalculator />
        <Pricing />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
