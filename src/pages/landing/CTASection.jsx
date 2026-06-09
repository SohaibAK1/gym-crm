import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Magnet from '../../components/bits/Magnet'
import { BC, INT, IBP, BG } from './constants'

export default function CTASection() {
  return (
    <section className="relative py-32 overflow-hidden" style={{ background: BG }}>
      {/* CSS animated blob — replaces WebGL Orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        aria-hidden="true"
        style={{
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(52,211,153,0.35) 0%, rgba(250,204,21,0.15) 45%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.55, 0.8, 0.55] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(10,10,10,0.15) 0%, rgba(10,10,10,0.65) 65%, rgba(10,10,10,0.88) 100%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span
            className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.18em] uppercase px-3 py-1.5 rounded-full mb-6"
            style={{ fontFamily: IBP, color: '#FACC15', border: '1px solid rgba(250,204,21,0.3)', background: 'rgba(250,204,21,0.07)' }}
          >
            No credit card required
          </span>
          <h2
            className="font-black text-white uppercase leading-[0.88] mb-6"
            style={{ fontFamily: BC, fontSize: 'clamp(3rem, 7vw, 6rem)', letterSpacing: '-0.02em' }}
          >
            READY TO BUILD YOUR <span style={{ color: '#FACC15' }}>ELITE GYM?</span>
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.65)' }}>
            Join IronHub today. Setup takes 5 minutes. Results are permanent.
          </p>
          <Magnet strength={0.35}>
            <motion.div whileTap={{ scale: 0.97 }} className="inline-block">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-12 py-5 font-bold text-base rounded-xl transition-colors duration-200 cursor-pointer"
                style={{ fontFamily: INT, background: '#FACC15', color: '#0A0A0A', boxShadow: '0 0 55px rgba(250,204,21,0.45)' }}
              >
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </Magnet>
          <p className="text-sm mt-6" style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.45)' }}>
            14-day trial · No credit card · Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  )
}
