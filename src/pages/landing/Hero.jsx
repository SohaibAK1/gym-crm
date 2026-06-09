import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown, Zap } from 'lucide-react'
import Aurora       from '../../components/bits/Aurora'
import BlurText     from '../../components/bits/BlurText'
import ShinyText    from '../../components/bits/ShinyText'
import CountUp      from '../../components/bits/CountUp'
import Threads      from '../../components/bits/Threads'
import GlitchText   from '../../components/bits/GlitchText'
import RotatingText from '../../components/bits/RotatingText'
import TiltCard     from '../../components/bits/TiltCard'
import Magnet       from '../../components/bits/Magnet'
import { BC, INT, IBP, V, BG, BDR, CRD } from './constants'

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

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden" style={{ background: BG }}>
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ opacity: 0.28 }}>
        <Threads color={[0.98, 0.8, 0.08]} amplitude={1.5} distance={0} enableMouseInteraction={false} />
      </div>
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <Aurora colorStops={['#92400E', '#FACC15', '#92400E']} amplitude={1.2} blend={0.6} speed={0.5} />
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.2) 40%, rgba(10,10,10,0.78) 100%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
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
                  fontFamily:    BC,
                  fontSize:      'clamp(3.8rem, 8vw, 7.5rem)',
                  letterSpacing: '-0.02em',
                  color:         '#FACC15',
                  lineHeight:    '0.9',
                  whiteSpace:    'normal',
                  margin:        0,
                  display:       'block',
                }}
              >
                DOMINATE YOUR MARKET.
              </GlitchText>
            </div>

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
