import { motion } from 'framer-motion'
import CountUp from '../../components/bits/CountUp'
import { BC, INT, IBP, SRF, BDR } from './constants'

const STATS = [
  { val: 2400, suffix: '+',  label: 'ACTIVE MEMBERS',          sub: 'And growing every month' },
  { val: 85,   suffix: 'K+', label: 'WORKOUTS LOGGED',         sub: 'Across all members'       },
  { val: 93,   suffix: '%',  label: 'WEEKLY ATTENDANCE RATE',  sub: 'Members who show up'      },
  { val: 4.9,  suffix: '/5', label: 'AVERAGE MEMBER RATING',   sub: 'Based on member feedback' },
]

export default function Stats() {
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
            <span className="text-xs tracking-[0.2em] uppercase" style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.62)' }}>
              {sub}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
