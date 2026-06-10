import { Link } from 'react-router-dom'
import { Dumbbell } from 'lucide-react'
import { BC, IBP, SRF, BDR } from './constants'

export default function Footer() {
  return (
    <footer style={{ background: SRF, borderTop: `1px solid ${BDR}` }} className="py-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Dumbbell className="w-4 h-4" style={{ color: 'rgba(250,204,21,0.5)' }} aria-hidden="true" />
              <span className="font-black text-white/50 text-base" style={{ fontFamily: BC }}>Iron</span>
              <span className="font-black text-base" style={{ fontFamily: BC, color: 'rgba(250,204,21,0.5)' }}>Hub</span>
            </div>
            <p className="text-xs" style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.35)' }}>Built for members who show up.</p>
          </div>
          <div className="flex items-center gap-8">
            {[{ label: 'Features', href: '#features' }, { label: 'How It Works', href: '#how-it-works' }].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={e => { e.preventDefault(); document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }) }}
                className="text-xs transition-colors duration-200 cursor-pointer"
                style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.4)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(250,204,21,0.75)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(249,250,251,0.4)'}
              >
                {label}
              </a>
            ))}
            <Link
              to="/login"
              className="text-xs transition-colors duration-200"
              style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.4)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(250,204,21,0.75)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(249,250,251,0.4)'}
            >
              Login
            </Link>
          </div>
          <p className="text-xs" style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.3)' }}>© 2025 IronHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
