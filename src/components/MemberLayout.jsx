import { NavLink, Outlet } from 'react-router-dom'
import { Home, CalendarCheck, Dumbbell, TrendingUp, User } from 'lucide-react'

const BC  = "'Barlow Condensed', sans-serif"
const INT = 'Inter, system-ui, sans-serif'
const BG  = '#0A0A0A'
const SRF = '#141414'
const YLW = '#FACC15'
const BRD = 'rgba(250,204,21,0.12)'

const NAV = [
  { to: '/member/home',       icon: Home,          label: 'Home'       },
  { to: '/member/attendance', icon: CalendarCheck, label: 'Attendance' },
  { to: '/member/routine',    icon: Dumbbell,      label: 'Routine'    },
  { to: '/member/progress',   icon: TrendingUp,    label: 'Progress'   },
  { to: '/member/profile',    icon: User,          label: 'Profile'    },
]

export default function MemberLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: BG }}>

      {/* ── Top header — gym brand only ── */}
      <header
        className="sticky top-0 z-20 flex items-center px-4 py-3"
        style={{ background: SRF, borderBottom: `1px solid ${BRD}` }}
      >
        <Dumbbell className="w-4 h-4 flex-shrink-0 mr-2" style={{ color: YLW }} />
        <span className="text-base font-black text-white" style={{ fontFamily: BC }}>
          Golden <span style={{ color: YLW }}>Biceps</span>
        </span>
      </header>

      {/* ── Page content ── */}
      <main className="flex-1 overflow-auto pb-[72px]">
        <Outlet />
      </main>

      {/* ── Bottom navigation ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-20"
        style={{ background: SRF, borderTop: `1px solid ${BRD}` }}
      >
        <div className="flex items-stretch justify-around px-1 pt-1 pb-safe">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 px-1 rounded-xl transition-all duration-150"
              style={({ isActive }) => ({
                color: isActive ? YLW : 'rgba(249,250,251,0.38)',
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.5 : 1.5} />
                  <span className="text-[9px] font-semibold leading-none mt-0.5"
                    style={{ fontFamily: INT }}>
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
