import { QrCode, CreditCard, TrendingUp, Dumbbell, Users, Activity } from 'lucide-react'
import DecryptedText from '../../components/bits/DecryptedText'
import TiltCard      from '../../components/bits/TiltCard'
import SpotlightCard from '../../components/bits/SpotlightCard'
import { BC, INT, IBP, BG, CRD, BDR } from './constants'

const FEATURES = [
  { icon: QrCode,     tag: 'CHECK-IN',      title: 'Scan & You\'re In',      desc: 'Walk up to the door, scan the QR code, and your attendance is logged instantly. No paper, no waiting, no hassle.',       metric: 'Takes under 3 seconds'    },
  { icon: Dumbbell,   tag: 'WORKOUTS',      title: 'Your Daily Routine',     desc: 'Your trainer assigns your workout plan. Open the app each day and see exactly what to do — sets, reps, and all.',        metric: 'Assigned by your trainer'  },
  { icon: TrendingUp, tag: 'PROGRESS',      title: 'See Yourself Improve',   desc: 'Log your weight, measurements, and body stats over time. Charts show you exactly how far you\'ve come.',                metric: 'Visual progress charts'    },
  { icon: Activity,   tag: 'ATTENDANCE',    title: 'Track Your Streak',      desc: 'See your full check-in calendar and keep your streak alive. Missing a day hurts — which is kind of the point.',          metric: 'Day-by-day calendar'       },
  { icon: CreditCard, tag: 'MEMBERSHIP',    title: 'Know Your Plan',         desc: 'See your active membership, what it includes, and when it expires. No surprises, no confusion.',                         metric: 'Always up to date'         },
  { icon: Users,      tag: 'ANNOUNCEMENTS', title: 'Stay in the Loop',       desc: 'Get updates from your gym directly in the app — schedule changes, holiday hours, events, and more.',                     metric: 'From your gym, instantly'  },
]

export default function Features() {
  return (
    <section id="features" className="py-28" style={{ background: BG }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div data-reveal className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <DecryptedText
              text="CORE FEATURES"
              animateOn="view"
              speed={55}
              sequential={true}
              revealDirection="start"
              className="text-xs tracking-[0.28em] uppercase font-medium"
              style={{ fontFamily: IBP, color: 'rgba(250,204,21,0.75)' }}
              encryptedClassName="opacity-30"
            />
          </div>
          <h2
            className="font-black text-white uppercase leading-[0.9]"
            style={{ fontFamily: BC, fontSize: 'clamp(2.8rem, 6vw, 5rem)', letterSpacing: '-0.02em' }}
          >
            EVERYTHING YOU NEED.{' '}
            <span style={{ color: '#FACC15' }}>ALL IN ONE PLACE.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, tag, title, desc, metric }, i) => (
            <div key={title} data-reveal style={{ '--si': i }}>
              <TiltCard className="h-full" rotateAmplitude={7} scaleOnHover={1.03}>
                <SpotlightCard
                  className="h-full rounded-xl p-6 cursor-default"
                  style={{ background: CRD, border: `1px solid ${BDR}` }}
                  spotlightColor="rgba(250,204,21,0.1)"
                >
                  <div
                    className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.25em] uppercase px-2 py-1 rounded mb-4"
                    style={{ fontFamily: IBP, color: '#FACC15', background: 'rgba(250,204,21,0.08)', border: '1px solid rgba(250,204,21,0.2)' }}
                  >
                    {tag}
                  </div>
                  <Icon className="w-6 h-6 mb-4" style={{ color: '#FACC15' }} aria-hidden="true" />
                  <h3 className="font-extrabold text-white mb-2 text-xl" style={{ fontFamily: INT }}>
                    {title}
                  </h3>
                  <p className="text-sm font-medium leading-relaxed mb-6" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.82)' }}>
                    {desc}
                  </p>
                  <div className="text-sm font-semibold mt-auto" style={{ fontFamily: INT, color: '#FACC15' }}>
                    {metric}
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
