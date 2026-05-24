import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  QrCode,
  CreditCard,
  Dumbbell,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

const BC = "'Barlow Condensed', sans-serif"
const BL = "'Barlow', sans-serif"

function DumbbellSVG({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 160 60" fill="none" className={className} style={style} aria-hidden="true">
      <rect x="0" y="10" width="20" height="40" rx="4" fill="#374151" />
      <rect x="23" y="18" width="13" height="24" rx="3" fill="#4B5563" />
      <rect x="39" y="25" width="82" height="10" rx="4" fill="#6B7280" />
      <rect x="124" y="18" width="13" height="24" rx="3" fill="#4B5563" />
      <rect x="140" y="10" width="20" height="40" rx="4" fill="#374151" />
      <rect x="0" y="10" width="5" height="40" rx="3" fill="#F97316" opacity="0.8" />
      <rect x="155" y="10" width="5" height="40" rx="3" fill="#F97316" opacity="0.8" />
    </svg>
  )
}

const NAV_ITEMS = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/attendance',    icon: QrCode,          label: 'Attendance' },
  { to: '/subscriptions', icon: CreditCard,      label: 'Subscriptions' },
  { to: '/routines',      icon: Dumbbell,        label: 'Routines' },
]

function SidebarContent({ user, onSignOut, onClose }) {
  return (
    <div
      className="flex flex-col h-full w-64 bg-gray-900"
      style={{ borderRight: '1px solid rgba(249,115,22,0.15)' }}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-between px-5 h-16 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(249,115,22,0.1)' }}
      >
        <div className="flex items-center gap-1.5">
          <DumbbellSVG className="w-10 h-6" />
          <span className="text-xl font-black text-white leading-none" style={{ fontFamily: BC }}>Iron</span>
          <span className="text-xl font-black text-orange-500 leading-none" style={{ fontFamily: BC }}>Hub</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-black transition-all duration-200 cursor-pointer group border ${
                isActive
                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800 border-transparent'
              }`
            }
            style={{ fontFamily: BC, letterSpacing: '0.05em' }}
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-colors ${
                    isActive ? 'text-orange-400' : 'text-gray-500 group-hover:text-gray-300'
                  }`}
                  aria-hidden="true"
                />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight className="w-4 h-4 text-orange-400 flex-shrink-0" aria-hidden="true" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div
        className="px-3 pb-4 pt-3 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(249,115,22,0.1)' }}
      >
        <div className="px-3 py-2 mb-1">
          <p className="text-xs text-gray-500 truncate" style={{ fontFamily: BL }}>
            {user?.email ?? 'User'}
          </p>
        </div>
        <button
          onClick={onSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-black text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer border border-transparent"
          style={{ fontFamily: BC, letterSpacing: '0.05em' }}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-800 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <SidebarContent user={user} onSignOut={handleSignOut} onClose={null} />
      </div>

      {/* Mobile sidebar overlay */}
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
              className="fixed inset-0 z-30 bg-black/60 md:hidden"
              aria-hidden="true"
            />
            <motion.div
              key="drawer"
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-40 md:hidden"
            >
              <SidebarContent
                user={user}
                onSignOut={handleSignOut}
                onClose={() => setSidebarOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <header
          className="flex items-center h-16 px-4 sm:px-6 bg-gray-900 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(249,115,22,0.1)' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 mr-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1 md:hidden">
            <span className="text-base font-black text-white" style={{ fontFamily: BC }}>Iron</span>
            <span className="text-base font-black text-orange-500" style={{ fontFamily: BC }}>Hub</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-black flex-shrink-0"
              style={{ fontFamily: BC }}
              aria-label="User avatar"
            >
              {user?.email?.[0]?.toUpperCase() ?? 'U'}
            </div>
          </div>
        </header>

        {/* Page content via Outlet */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
