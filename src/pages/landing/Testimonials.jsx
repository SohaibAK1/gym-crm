import { Star } from 'lucide-react'
import DecryptedText from '../../components/bits/DecryptedText'
import TiltCard      from '../../components/bits/TiltCard'
import SpotlightCard from '../../components/bits/SpotlightCard'
import { BC, INT, IBP, SRF, CRD, BDR } from './constants'

const TESTIMONIALS = [
  { name: 'Bilal Ahmed',  role: 'Member, Iron Temple Gym',       quote: 'I hit a 63-day streak last month. I never tracked my attendance before — now I actually feel bad skipping.', stars: 5 },
  { name: 'Sana Malik',   role: 'Member, Peak Performance Gym',  quote: 'My trainer assigns the workout and I just open the app and follow it. No more wondering what to do next.',   stars: 5 },
  { name: 'Omar Farooq',  role: 'Member, FitZone Lahore',        quote: 'Seeing my weight and measurements go down on the charts is the only motivation I need to keep coming.',       stars: 5 },
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
            REAL MEMBERS. <span style={{ color: '#FACC15' }}>REAL RESULTS.</span>
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
                  <p className="text-base font-medium leading-relaxed mb-7" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.88)', fontStyle: 'italic' }}>
                    "{quote}"
                  </p>
                  <div style={{ borderTop: `1px solid ${BDR}` }} className="pt-5">
                    <div className="font-bold text-white text-sm" style={{ fontFamily: INT }}>{name}</div>
                    <div className="text-xs font-medium mt-0.5" style={{ fontFamily: INT, color: 'rgba(250,204,21,0.85)' }}>{role}</div>
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
