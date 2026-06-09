import { Users, CreditCard, TrendingUp } from 'lucide-react'
import DecryptedText from '../../components/bits/DecryptedText'
import TiltCard      from '../../components/bits/TiltCard'
import SpotlightCard from '../../components/bits/SpotlightCard'
import TrueFocus     from '../../components/bits/TrueFocus'
import { BC, INT, IBP, SRF, CRD, BDR } from './constants'

const STEPS = [
  { n: '01', icon: Users,       title: 'Add Your Members',        desc: 'Import or create member profiles with contact info and plan details in under a minute.' },
  { n: '02', icon: CreditCard,  title: 'Assign Plans & Routines', desc: "Set subscription tiers and assign workout programs tailored to each member's goals." },
  { n: '03', icon: TrendingUp,  title: 'Track Everything',        desc: 'Monitor attendance, upcoming renewals, and member progress from your real-time dashboard.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28" style={{ background: SRF }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div data-reveal className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <DecryptedText
              text="PROCESS"
              animateOn="view"
              speed={60}
              sequential={true}
              className="text-xs tracking-[0.28em] uppercase font-medium"
              style={{ fontFamily: IBP, color: 'rgba(250,204,21,0.75)' }}
              encryptedClassName="opacity-30"
            />
          </div>
          <div
            className="font-black text-white uppercase leading-[0.9]"
            style={{ fontFamily: BC, fontSize: 'clamp(2.8rem, 6vw, 5rem)', letterSpacing: '-0.02em' }}
          >
            <TrueFocus
              sentence="UP AND RUNNING IN 3 STEPS."
              blurAmount={4}
              borderColor="#FACC15"
              glowColor="rgba(250,204,21,0.5)"
              animationDuration={0.55}
              pauseBetweenAnimations={1.4}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {STEPS.map(({ n, icon: Icon, title, desc }, idx) => (
            <div key={n} data-reveal style={{ '--si': idx }}>
              <TiltCard className="h-full" rotateAmplitude={6} scaleOnHover={1.03}>
                <SpotlightCard
                  className="h-full relative rounded-xl p-8 cursor-default overflow-hidden"
                  style={{ background: CRD, border: `1px solid ${BDR}` }}
                  spotlightColor="rgba(250,204,21,0.1)"
                >
                  <span
                    className="absolute -bottom-4 -right-2 font-black leading-none select-none pointer-events-none"
                    style={{ fontFamily: IBP, fontSize: '8rem', color: 'rgba(250,204,21,0.05)' }}
                    aria-hidden="true"
                  >
                    {n}
                  </span>
                  <span
                    className="inline-block text-[9px] tracking-[0.25em] uppercase px-2 py-1 rounded mb-5"
                    style={{ fontFamily: IBP, color: '#FACC15', border: `1px solid ${BDR}` }}
                  >
                    Step {n}
                  </span>
                  <Icon className="w-6 h-6 mb-4" style={{ color: '#FACC15' }} aria-hidden="true" />
                  <h3 className="font-black text-white uppercase mb-3" style={{ fontFamily: BC, fontSize: '1.4rem', letterSpacing: '-0.01em' }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.65)' }}>
                    {desc}
                  </p>
                </SpotlightCard>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
