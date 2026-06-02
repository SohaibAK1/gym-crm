import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: '#0A0A0A' }}>
      <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, role, loading, profileReady } = useAuth()

  // Initial session check in progress
  if (loading) return <Spinner />

  // Not logged in
  if (!user) return <Navigate to="/login" replace />

  // Logged in but profile fetch not finished yet (race condition after sign-in)
  if (!profileReady) return <Spinner />

  // Profile loaded but no row exists — account not set up
  if (!role) return <Navigate to="/login" replace />

  // Logged in but wrong portal — redirect to correct one
  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/member/home'} replace />
  }

  return children
}
