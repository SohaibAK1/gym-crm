import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X } from 'lucide-react'
import DecryptedText from '../../components/bits/DecryptedText'
import TiltCard      from '../../components/bits/TiltCard'
import SpotlightCard from '../../components/bits/SpotlightCard'
import { BC, INT, IBP, BG, CRD, BDR } from './constants'

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

export default function Pricing() {
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
