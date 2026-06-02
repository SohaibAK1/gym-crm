import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Home, CalendarCheck, CreditCard, Dumbbell, TrendingUp } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

const BC  = "'Barlow Condensed', sans-serif"
const INT = 'Inter, system-ui, sans-serif'
const BG  = '#0A0A0A'
const SRF = '#141414'
const YLW = '#FACC15'
const BRD = 'rgba(250,204,21,0.12)'

const NAV = [
  { to: '/member/home',         icon: Home,          label: 'Home'         },
  { to: '/member/attendance',   icon: CalendarCheck, label: 'Attendance'   },
  { to: '/member/subscription', icon: CreditCard,    label: 'Membership'   },
  { to: '/member/routine',      icon: Dumbbell,      label: 'Routine'      },
  { to: '/member/progress',     icon: TrendingUp,    label: 'Progress'     },
]

export default function MemberLayout() {
  const { profile } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: BG }}>
      {/* ── Top header ── */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between px-4 py-3"
        style={{ background: SRF, borderBottom: `1px solid ${BRD}` }}
      >
        <div className="flex items-center gap-2">
          <Dumbbell className="w-4 h-4 flex-shrink-0" style={{ color: YLW }} />
          <span className="text-base font-black text-white" style={{ fontFamily: BC }}>
            Golden <span style={{ color: YLW }}>Biceps</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {profile?.full_name && (
            <span className="text-sm hidden sm:block" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.55)' }}>
              {profile.full_name.split(' ')[0]}
            </span>
          )}
          <button
            onClick={handleSignOut}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-opacity hover:opacity-75"
            style={{ background: YLW, color: '#0A0A0A', fontFamily: INT }}
            title="Sign Out"
            aria-label="Sign out"
          >
            {profile?.full_name?.[0]?.toUpperCase() ?? 'M'}
          </button>
        </div>
      </header>

      {/* ── Page content (padded above bottom nav) ── */}
      <main className="flex-1 overflow-auto pb-20">
        <Outlet />
      </main>

      {/* ── Bottom navigation ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-20"
        style={{ background: SRF, borderTop: `1px solid ${BRD}` }}
      >
        <div className="flex items-stretch justify-around px-1 py-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 px-1 rounded-xl transition-all duration-150"
              style={({ isActive }) => ({
                color: isActive ? YLW : 'rgba(249,250,251,0.4)',
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className="w-[22px] h-[22px]"
                    strokeWidth={isActive ? 2.5 : 1.5}
                  />
                  <span
                    className="text-[9px] font-semibold leading-none mt-0.5"
                    style={{ fontFamily: INT }}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
