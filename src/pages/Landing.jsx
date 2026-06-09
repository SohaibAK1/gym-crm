import { lazy, Suspense } from 'react'
import CustomCursor  from '../components/bits/CustomCursor'
import { useReveal } from '../hooks/useReveal'
import { BG }        from './landing/constants'

// Above-fold: eager
import Navbar from './landing/Navbar'
import Hero   from './landing/Hero'
import Tape   from './landing/Tape'

// Below-fold: lazy-loaded after hero renders
const Stats        = lazy(() => import('./landing/Stats'))
const Features     = lazy(() => import('./landing/Features'))
const HowItWorks   = lazy(() => import('./landing/HowItWorks'))
const Pricing      = lazy(() => import('./landing/Pricing'))
const Testimonials = lazy(() => import('./landing/Testimonials'))
const CTASection   = lazy(() => import('./landing/CTASection'))
const Footer       = lazy(() => import('./landing/Footer'))

export default function Landing() {
  useReveal()
  return (
    <div className="min-h-screen antialiased overflow-x-hidden" style={{ background: BG }}>
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <Tape />
        <Suspense>
          <Stats />
          <Features />
          <HowItWorks />
          <Pricing />
          <Testimonials />
          <CTASection />
        </Suspense>
      </main>
      <Suspense>
        <Footer />
      </Suspense>
    </div>
  )
}
