import { QrCode, CreditCard, TrendingUp, Dumbbell, Users, Shield } from 'lucide-react'
import DecryptedText from '../../components/bits/DecryptedText'
import TiltCard      from '../../components/bits/TiltCard'
import SpotlightCard from '../../components/bits/SpotlightCard'
import { BC, INT, IBP, BG, CRD, BDR } from './constants'

const FEATURES = [
  { icon: QrCode,     tag: 'ATTENDANCE',    title: 'QR Check-In',         desc: 'Members scan a QR code for instant attendance logging. Track daily check-ins and spot drop-offs before they become churn.',   metric: '1,240 check-ins today' },
  { icon: CreditCard, tag: 'SUBSCRIPTIONS', title: 'Subscription Engine', desc: 'Monitor active plans, expiry dates, and payment history. Automated alerts fire before memberships lapse.',                   metric: '18 renewals this week' },
  { icon: TrendingUp, tag: 'ANALYTICS',     title: 'Live Analytics',      desc: 'Revenue trends, peak hours, retention rates, and plan performance — surfaced in real time.',                                  metric: '+12% retention MoM'   },
  { icon: Dumbbell,   tag: 'ROUTINES',      title: 'Workout Programs',    desc: '3 predefined programs with daily checklists and streak tracking. Assign to any member in one click.',                        metric: '3 programs ready'      },
  { icon: Users,      tag: 'MEMBERS',       title: 'Member Hub',          desc: 'Full profiles with history, subscriptions, and assigned routines. Everything about a member, one place.',                    metric: 'Full profile view'     },
  { icon: Shield,     tag: 'SECURITY',      title: 'Enterprise Security', desc: 'Row-level security via Supabase. 99.9% uptime, zero compromise. Your member data stays yours.',                              metric: '99.9% uptime SLA'      },
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
            EVERYTHING YOUR GYM NEEDS.{' '}
            <span style={{ color: '#FACC15' }}>NOTHING IT DOESN'T.</span>
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
                  <h3 className="font-black text-white uppercase mb-2 text-lg" style={{ fontFamily: BC, letterSpacing: '-0.01em' }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-6" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.65)' }}>
                    {desc}
                  </p>
                  <div className="text-xs font-medium mt-auto" style={{ fontFamily: IBP, color: '#FACC15' }}>
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
