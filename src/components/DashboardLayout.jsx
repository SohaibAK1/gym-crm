import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, QrCode, CreditCard, Dumbbell,
  Menu, X, LogOut, ChevronRight,
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import CustomCursor from './bits/CustomCursor'

const BC  = "'Barlow Condensed', sans-serif"
const INT = 'Inter, system-ui, sans-serif'
const IBP = "'IBM Plex Mono', ui-monospace, monospace"

const V   = '#FACC15'
const BG  = '#0A0A0A'
const CRD = '#1E1C18'
const BDR = 'rgba(250,204,21,0.14)'

const NAV_ITEMS = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard'     },
  { to: '/attendance',    icon: QrCode,          label: 'Attendance'    },
  { to: '/subscriptions', icon: CreditCard,      label: 'Subscriptions' },
  { to: '/routines',      icon: Dumbbell,        label: 'Routines'      },
]

function SidebarContent({ user, onSignOut, onClose }) {
  return (
    <div className="flex flex-col h-full w-64" style={{ background: CRD, borderRight: `1px solid ${BDR}` }}>
      {/* Logo */}
      <div
        className="flex items-center justify-between px-5 h-16 shrink-0"
        style={{ borderBottom: `1px solid ${BDR}` }}
      >
        <div className="flex items-center gap-2">
          <Dumbbell className="w-4 h-4" style={{ color: V }} aria-hidden="true" />
          <span className="text-lg font-black text-white leading-none" style={{ fontFamily: BC }}>Iron</span>
          <span className="text-lg font-black leading-none" style={{ fontFamily: BC, color: V }}>Hub</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 transition-colors duration-200 cursor-pointer"
            style={{ color: 'rgba(249,250,251,0.4)' }}
            aria-label="Close sidebar"
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(249,250,251,0.4)'}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg transition-all duration-150 cursor-pointer"
            style={({ isActive }) => ({
              fontFamily: INT,
              background: isActive ? 'rgba(250,204,21,0.1)' : 'transparent',
              color: isActive ? V : 'rgba(249,250,251,0.5)',
              borderLeft: isActive ? `2px solid ${V}` : '2px solid transparent',
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.getAttribute('aria-current')) {
                e.currentTarget.style.background = 'rgba(249,250,251,0.04)'
                e.currentTarget.style.color = 'rgba(249,250,251,0.8)'
              }
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.getAttribute('aria-current')) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'rgba(249,250,251,0.5)'
              }
            }}
          >
            {({ isActive }) => (
              <>
                <Icon className="w-4 h-4 shrink-0" style={{ color: isActive ? V : 'rgba(249,250,251,0.4)' }} aria-hidden="true" />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0" style={{ color: V }} aria-hidden="true" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="px-3 pb-4 pt-3 shrink-0" style={{ borderTop: `1px solid ${BDR}` }}>
        <div className="px-3 py-2 mb-1">
          <p className="text-xs truncate" style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.35)' }}>
            {user?.email ?? 'User'}
          </p>
        </div>
        <button
          onClick={onSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-semibold rounded-lg transition-all duration-150 cursor-pointer"
          style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#FF453A'; e.currentTarget.style.background = 'rgba(255,69,58,0.08)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(249,250,251,0.4)'; e.currentTarget.style.background = 'transparent' }}
        >
          <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()
  const navigate  = useNavigate()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: BG }}>
      <CustomCursor />
      {/* Desktop sidebar */}
      <div className="hidden md:flex shrink-0">
        <SidebarContent user={user} onSignOut={handleSignOut} onClose={null} />
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-30 md:hidden"
              style={{ background: 'rgba(0,0,0,0.75)' }}
              aria-hidden="true"
            />
            <motion.div
              key="drawer"
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-40 md:hidden"
            >
              <SidebarContent user={user} onSignOut={handleSignOut} onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <header
          className="flex items-center h-16 px-4 sm:px-6 shrink-0"
          style={{ background: CRD, borderBottom: `1px solid ${BDR}` }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 mr-3 transition-colors duration-200 cursor-pointer"
            style={{ color: 'rgba(249,250,251,0.4)' }}
            aria-label="Open sidebar"
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(249,250,251,0.4)'}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5 md:hidden">
            <Dumbbell className="w-4 h-4" style={{ color: V }} aria-hidden="true" />
            <span className="text-base font-black text-white" style={{ fontFamily: BC }}>Iron</span>
            <span className="text-base font-black" style={{ fontFamily: BC, color: V }}>Hub</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
              style={{ fontFamily: IBP, background: 'rgba(250,204,21,0.1)', color: V, border: `1px solid rgba(250,204,21,0.2)` }}
              aria-label="User avatar"
            >
              {user?.email?.[0]?.toUpperCase() ?? 'U'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto" style={{ background: BG }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
