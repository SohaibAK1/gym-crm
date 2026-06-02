import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, CalendarCheck, CreditCard,
  Dumbbell, Megaphone, LogOut, Menu, X, ChevronRight,
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import CustomCursor from './bits/CustomCursor'

const BC  = "'Barlow Condensed', sans-serif"
const INT = 'Inter, system-ui, sans-serif'
const BG  = '#0A0A0A'
const SRF = '#141414'
const YLW = '#FACC15'
const BRD = 'rgba(250,204,21,0.12)'

const NAV = [
  { to: '/admin/dashboard',     icon: LayoutDashboard, label: 'Dashboard'     },
  { to: '/admin/members',       icon: Users,           label: 'Members'       },
  { to: '/admin/attendance',    icon: CalendarCheck,   label: 'Attendance'    },
  { to: '/admin/subscriptions', icon: CreditCard,      label: 'Subscriptions' },
  { to: '/admin/routines',      icon: Dumbbell,        label: 'Routines'      },
  { to: '/admin/announcements', icon: Megaphone,       label: 'Announcements' },
]

function SidebarInner({ profile, onClose, onSignOut }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${BRD}` }}>
        <div>
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4 flex-shrink-0" style={{ color: YLW }} />
            <span className="text-lg font-black text-white leading-none" style={{ fontFamily: BC }}>
              Golden <span style={{ color: YLW }}>Biceps</span>
            </span>
          </div>
          <p className="text-[10px] mt-0.5 pl-6" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>
            Admin Portal
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
            style={({ isActive }) => ({
              fontFamily: INT,
              background: isActive ? YLW : 'transparent',
              color:      isActive ? '#0A0A0A' : 'rgba(249,250,251,0.5)',
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.style.background.includes('250,204,21')) {
                e.currentTarget.style.background = 'rgba(249,250,251,0.05)'
                e.currentTarget.style.color = 'rgba(249,250,251,0.85)'
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.style.background.includes('250,204,21')) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'rgba(249,250,251,0.5)'
              }
            }}
          >
            {({ isActive }) => (
              <>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + sign out */}
      <div className="px-3 pb-4 pt-3" style={{ borderTop: `1px solid ${BRD}` }}>
        <div
          className="flex items-center gap-3 px-3 py-2 mb-1 rounded-xl"
          style={{ background: 'rgba(249,250,251,0.04)' }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
            style={{ background: YLW, color: '#0A0A0A', fontFamily: INT }}
          >
            {profile?.full_name?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate" style={{ fontFamily: INT }}>
              {profile?.full_name ?? 'Admin'}
            </p>
            <p className="text-[10px]" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>
              Administrator
            </p>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm w-full transition-all duration-150 text-gray-500 hover:text-red-400 hover:bg-red-400/5"
          style={{ fontFamily: INT }}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { profile } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen" style={{ background: BG }}>
      <CustomCursor />

      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden lg:flex flex-col w-60 xl:w-64 fixed inset-y-0 left-0 z-30"
        style={{ background: SRF, borderRight: `1px solid ${BRD}` }}
      >
        <SidebarInner profile={profile} onClose={null} onSignOut={handleSignOut} />
      </aside>

      {/* ── Mobile sidebar overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: 'rgba(0,0,0,0.75)' }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-60 lg:hidden"
              style={{ background: SRF, borderRight: `1px solid ${BRD}` }}
            >
              <SidebarInner
                profile={profile}
                onClose={() => setMobileOpen(false)}
                onSignOut={handleSignOut}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-60 xl:ml-64">
        {/* Mobile top bar */}
        <header
          className="lg:hidden sticky top-0 z-20 flex items-center justify-between px-4 py-3"
          style={{ background: SRF, borderBottom: `1px solid ${BRD}` }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4" style={{ color: YLW }} />
            <span className="text-base font-black text-white" style={{ fontFamily: BC }}>
              Golden <span style={{ color: YLW }}>Biceps</span>
            </span>
          </div>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: YLW, color: '#0A0A0A', fontFamily: INT }}
          >
            {profile?.full_name?.[0]?.toUpperCase() ?? 'A'}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
