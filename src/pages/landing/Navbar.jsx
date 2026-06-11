import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Dumbbell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon'
import { useScroll } from '@/components/ui/use-scroll'
import { BC, INT } from './constants'

const NAV_LINKS = [
  { label: 'Features',     href: '#features'     },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing',      href: '#pricing'      },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const scrolled = useScroll(40)

  const anchor = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      setOpen(false)
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 mx-auto w-full border-b border-transparent',
        'md:rounded-xl md:border',
        'transition-[background-color,border-color,box-shadow] duration-300 ease-out',
        scrolled && !open && 'border-white/10 backdrop-blur-lg md:top-4 md:max-w-5xl md:shadow-2xl',
        open && 'border-transparent',
      )}
      style={{
        backgroundColor: scrolled || open ? 'rgba(10,10,10,0.95)' : 'transparent',
      }}
    >
      <nav className="flex h-14 w-full items-center justify-between px-5 sm:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-[#FACC15]" aria-hidden="true" />
          <span className="text-lg font-black text-white leading-none" style={{ fontFamily: BC }}>Iron</span>
          <span className="text-lg font-black text-[#FACC15] leading-none" style={{ fontFamily: BC }}>Hub</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => anchor(e, link.href)}
              className={buttonVariants({ variant: 'ghost' })}
              style={{ fontFamily: INT }}
            >
              {link.label}
            </a>
          ))}
          <Button
            variant="outline"
            asChild
            className="ml-2"
            style={{ fontFamily: INT }}
          >
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild style={{ fontFamily: INT }}>
            <Link to="/login">Get Started</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <Button
          size="icon"
          variant="outline"
          onClick={() => setOpen(!open)}
          className="md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </Button>
      </nav>

      {/* Mobile fullscreen drawer */}
      <div
        className={cn(
          'fixed top-14 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-t md:hidden',
          open ? 'block' : 'hidden',
        )}
        style={{ background: 'rgba(10,10,10,0.97)', borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <div
          data-slot={open ? 'open' : 'closed'}
          className="flex h-full w-full flex-col justify-between gap-y-2 p-5"
        >
          <div className="grid gap-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => anchor(e, link.href)}
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'justify-start text-base h-12',
                )}
                style={{ fontFamily: INT }}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full h-12 text-base"
              asChild
              style={{ fontFamily: INT }}
            >
              <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
            </Button>
            <Button
              className="w-full h-12 text-base"
              asChild
              style={{ fontFamily: INT }}
            >
              <Link to="/login" onClick={() => setOpen(false)}>Get Started Free</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
