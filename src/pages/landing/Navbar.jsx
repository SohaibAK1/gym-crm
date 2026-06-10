import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Dumbbell, Menu, X, ArrowRight } from 'lucide-react'
import Magnet from '../../components/bits/Magnet'
import { BC, INT, IBP, V, BDR, CRD } from './constants'

const NAV_LINKS = [
  { label: 'Features',     href: '#features'     },
  { label: 'How It Works', href: '#how-it-works' },
]

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const anchor = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      setMenuOpen(false)
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        background:    scrolled ? 'rgba(10,10,10,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom:  scrolled ? `1px solid ${BDR}` : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5" style={{ color: V }} aria-hidden="true" />
            <span className="text-lg font-black text-white leading-none" style={{ fontFamily: BC }}>Iron</span>
            <span className="text-lg font-black leading-none" style={{ fontFamily: BC, color: V }}>Hub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={(e) => anchor(e, href)}
                className="text-sm font-medium transition-colors duration-200 cursor-pointer"
                style={{ fontFamily: INT, color: 'rgba(249,250,251,0.75)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(249,250,251,0.75)'}
              >
                {label}
              </a>
            ))}
            <Link
              to="/login"
              className="text-sm font-medium transition-colors duration-200"
              style={{ fontFamily: INT, color: 'rgba(249,250,251,0.75)' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(249,250,251,0.75)'}
            >
              Login
            </Link>
            <Magnet strength={0.3}>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                style={{ background: V, color: '#0A0A0A', fontFamily: INT }}
              >
                Get Started <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Magnet>
          </nav>

          <button
            onClick={() => setMenuOpen(o => !o)}
            className="md:hidden p-2 cursor-pointer"
            style={{ color: 'rgba(249,250,251,0.75)' }}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ background: CRD, borderTop: `1px solid ${BDR}` }}
          >
            <nav className="max-w-7xl mx-auto px-5 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={(e) => anchor(e, href)}
                  className="px-3 py-3 text-sm font-medium"
                  style={{ fontFamily: INT, color: 'rgba(249,250,251,0.82)' }}
                >
                  {label}
                </a>
              ))}
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-3 text-sm font-medium"
                style={{ fontFamily: INT, color: 'rgba(249,250,251,0.82)' }}
              >
                Login
              </Link>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="mt-2 px-4 py-3 font-bold text-center text-sm rounded-lg"
                style={{ background: V, color: '#0A0A0A', fontFamily: INT }}
              >
                Get Started Free
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
