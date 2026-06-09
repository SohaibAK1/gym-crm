import { Star } from 'lucide-react'
import DecryptedText from '../../components/bits/DecryptedText'
import TiltCard      from '../../components/bits/TiltCard'
import SpotlightCard from '../../components/bits/SpotlightCard'
import { BC, INT, IBP, SRF, CRD, BDR } from './constants'

const TESTIMONIALS = [
  { name: 'Marcus Thompson', role: 'Owner, Iron Temple Gym',    quote: 'IronHub cut my admin time by 70%. Renewals are automated, data is accurate, decisions are faster.', stars: 5 },
  { name: 'Sarah Malik',     role: 'Manager, Peak Performance', quote: 'The QR check-in alone was worth switching. Members love it. I finally have real attendance data.',  stars: 5 },
  { name: 'David Chen',      role: 'Founder, Elevate CrossFit', quote: 'Setup took 20 minutes. Dashboard is clean, routine assignment keeps members engaged.',               stars: 5 },
]

export default function Testimonials() {
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
