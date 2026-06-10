import { Users, QrCode, TrendingUp } from 'lucide-react'
import DecryptedText from '../../components/bits/DecryptedText'
import TiltCard      from '../../components/bits/TiltCard'
import SpotlightCard from '../../components/bits/SpotlightCard'
import TrueFocus     from '../../components/bits/TrueFocus'
import { BC, INT, IBP, SRF, CRD, BDR } from './constants'

const STEPS = [
  { n: '01', icon: Users,       title: 'Your Gym Adds You',    desc: 'Your gym creates your profile and assigns your membership plan. You get a login and you\'re ready to go.' },
  { n: '02', icon: QrCode,      title: 'Check In & Train',     desc: 'Walk in, scan the QR code at the door, and follow your daily workout routine — everything is already set up for you.' },
  { n: '03', icon: TrendingUp,  title: 'Watch Yourself Grow',  desc: 'Log your body stats, keep your check-in streak alive, and watch your progress build week by week.' },
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
              sentence="SIMPLE. SCAN. TRAIN. IMPROVE."
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
                  <h3 className="font-extrabold text-white mb-3 text-xl" style={{ fontFamily: INT }}>
                    {title}
                  </h3>
                  <p className="text-sm font-medium leading-relaxed" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.82)' }}>
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
