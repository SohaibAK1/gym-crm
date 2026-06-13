import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown, Zap } from 'lucide-react'
import Aurora       from '../../components/bits/Aurora'
import BlurText     from '../../components/bits/BlurText'
import CountUp      from '../../components/bits/CountUp'
import Threads      from '../../components/bits/Threads'
import GlitchText   from '../../components/bits/GlitchText'
import RotatingText from '../../components/bits/RotatingText'
import Magnet       from '../../components/bits/Magnet'
import WorkoutSessionCard from './WorkoutSessionCard'
import { BC, INT, IBP, BG } from './constants'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: BG }}>
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
                  texts={['QR Check-In', 'Daily Workouts', 'Track Progress', 'Build Streaks']}
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
                text="YOUR GYM."
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
                YOUR PROGRESS.
              </GlitchText>
            </div>

            {/* Sub-label */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.55 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="w-5 h-px" style={{ background: 'rgba(250,204,21,0.4)' }} aria-hidden="true" />
              <RotatingText
                texts={['SCAN & CHECK IN', 'FOLLOW YOUR ROUTINE', 'TRACK YOUR STREAK', 'LOG YOUR STATS']}
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
              style={{ fontFamily: INT, color: 'rgba(249,250,251,0.82)' }}
            >
              IronHub keeps your gym life organised. Check in with a scan,
              follow your workout plan, and see your progress — all in one place.
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
                    Get Started Free <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </Magnet>
              <a
                href="#how-it-works"
                onClick={(e) => { e.preventDefault(); document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' }) }}
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
                { val: 2400,  suffix: '+', label: 'Members' },
                { val: 4.9,   suffix: '',  label: 'Rating'  },
                { val: 100,   suffix: '%', label: 'Free to join' },
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

          {/* Live workout session card */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full"
          >
            <div
              className="absolute -inset-12 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse, rgba(250,204,21,0.12) 0%, transparent 70%)', filter: 'blur(32px)' }}
              aria-hidden="true"
            />
            <WorkoutSessionCard />
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
