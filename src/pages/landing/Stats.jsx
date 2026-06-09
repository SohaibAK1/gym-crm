import { motion } from 'framer-motion'
import CountUp from '../../components/bits/CountUp'
import { BC, INT, IBP, SRF, BDR } from './constants'

const STATS = [
  { val: 500, suffix: '+',   label: 'GYMS RUNNING ON IRONHUB',   sub: 'Across 18 countries' },
  { val: 50,  suffix: 'K+',  label: 'MEMBERS TRACKED EVERY DAY', sub: 'Real-time data' },
  { val: 98,  suffix: '%',   label: 'AVERAGE MEMBER RETENTION',  sub: 'Industry avg: 72%' },
  { val: 99,  suffix: '.9%', label: 'UPTIME SERVICE LEVEL',      sub: 'Enterprise grade' },
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
            <span className="text-xs tracking-[0.2em] uppercase" style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.4)' }}>
              {sub}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
