import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Zap } from 'lucide-react'
import DecryptedText from '../../components/bits/DecryptedText'
import TiltCard      from '../../components/bits/TiltCard'
import SpotlightCard from '../../components/bits/SpotlightCard'
import { BC, INT, IBP, BG, CRD, BDR } from './constants'

const FREE_FEATURES = [
  'QR check-in at the door',
  'View your daily workout routine',
  'Full attendance history & calendar',
  'Membership plan & expiry status',
  'Gym announcements',
  'Personal profile',
]

const PRO_FEATURES = [
  'Everything in Free',
  'Body stats tracking with charts',
  'Detailed progress analytics',
  'Workout completion history',
  'Personal goal setting',
  'Priority support',
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-28" style={{ background: BG }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div data-reveal className="mb-12 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <DecryptedText
              text="MEMBERSHIP"
              animateOn="view"
              speed={65}
              sequential={true}
              className="text-xs tracking-[0.28em] uppercase font-medium"
              style={{ fontFamily: IBP, color: 'rgba(250,204,21,0.75)' }}
              encryptedClassName="opacity-30"
            />
          </div>
          <h2 className="font-black text-white uppercase leading-[0.9] mb-4" style={{ fontFamily: BC, fontSize: 'clamp(2.8rem, 6vw, 5rem)', letterSpacing: '-0.02em' }}>
            START FREE. <span style={{ color: '#FACC15' }}>UPGRADE WHEN READY.</span>
          </h2>
          <p className="text-base leading-relaxed" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.72)' }}>
            IronHub is free with your gym membership. The Pro upgrade is a small optional add-on
            for members who want deeper progress tracking and analytics.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
          {/* Free */}
          <div data-reveal style={{ '--si': 0 }}>
            <TiltCard className="h-full" rotateAmplitude={5} scaleOnHover={1.02}>
              <SpotlightCard
                className="h-full flex flex-col rounded-xl overflow-hidden"
                style={{ background: CRD, border: `1px solid ${BDR}` }}
                spotlightColor="rgba(250,204,21,0.08)"
              >
                <div className="px-7 py-7" style={{ borderBottom: `1px solid ${BDR}` }}>
                  <h3 className="font-black text-white uppercase mb-1" style={{ fontFamily: BC, fontSize: '1.8rem', letterSpacing: '-0.01em' }}>
                    Free
                  </h3>
                  <p className="text-sm mb-5" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.6)' }}>
                    Included with your gym membership. No extra cost.
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold" style={{ fontFamily: IBP, fontSize: '2.8rem', color: 'var(--rb-text)' }}>
                      Free
                    </span>
                  </div>
                </div>
                <div className="px-7 py-7 flex flex-col flex-1">
                  <ul className="space-y-3 flex-1 mb-8">
                    {FREE_FEATURES.map(f => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#FACC15' }} aria-hidden="true" />
                        <span className="text-sm font-medium" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.88)' }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/login"
                      className="block w-full py-3.5 font-bold text-center text-sm rounded-xl transition-colors duration-200 cursor-pointer"
                      style={{ fontFamily: INT, background: 'transparent', color: '#FACC15', border: `1px solid rgba(250,204,21,0.35)` }}
                    >
                      Get Started Free
                    </Link>
                  </motion.div>
                </div>
              </SpotlightCard>
            </TiltCard>
          </div>

          {/* Pro */}
          <div data-reveal style={{ '--si': 1 }}>
            <TiltCard className="h-full" rotateAmplitude={5} scaleOnHover={1.02}>
              <SpotlightCard
                className="h-full flex flex-col rounded-xl overflow-hidden"
                style={{
                  background: `rgba(250,204,21,0.05)`,
                  border:     `1px solid rgba(250,204,21,0.35)`,
                  boxShadow:  '0 0 40px rgba(250,204,21,0.1)',
                }}
                spotlightColor="rgba(250,204,21,0.2)"
              >
                <div className="px-7 py-7" style={{ borderBottom: `1px solid ${BDR}` }}>
                  <span className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.25em] uppercase px-2 py-1 rounded mb-4" style={{ fontFamily: IBP, color: '#0A0A0A', background: '#FACC15' }}>
                    <Zap className="w-2.5 h-2.5 fill-current" aria-hidden="true" />
                    PRO MEMBER
                  </span>
                  <h3 className="font-black text-white uppercase mb-1" style={{ fontFamily: BC, fontSize: '1.8rem', letterSpacing: '-0.01em' }}>
                    Pro
                  </h3>
                  <p className="text-sm mb-5" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.6)' }}>
                    For members who want to go deeper on their progress.
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold" style={{ fontFamily: IBP, fontSize: '2.8rem', color: '#FACC15' }}>
                      INR 199
                    </span>
                    <span className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>/month</span>
                  </div>
                </div>
                <div className="px-7 py-7 flex flex-col flex-1">
                  <ul className="space-y-3 flex-1 mb-8">
                    {PRO_FEATURES.map(f => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#FACC15' }} aria-hidden="true" />
                        <span className="text-sm font-medium" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.88)' }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/login"
                      className="block w-full py-3.5 font-bold text-center text-sm rounded-xl transition-colors duration-200 cursor-pointer"
                      style={{ fontFamily: INT, background: '#FACC15', color: '#0A0A0A' }}
                    >
                      Upgrade to Pro
                    </Link>
                  </motion.div>
                </div>
              </SpotlightCard>
            </TiltCard>
          </div>
        </div>

        <p data-reveal style={{ '--si': 2, fontFamily: IBP, color: 'rgba(249,250,251,0.4)' }} className="text-sm mt-8">
          Pro is optional. The free plan covers everything you need for day-to-day gym use.
        </p>
      </div>
    </section>
  )
}
