import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Attendance from './pages/Attendance'
import Subscriptions from './pages/Subscriptions'
import Routines from './pages/Routines'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  {
    path: '/attendance',
    element: <ProtectedRoute><Attendance /></ProtectedRoute>,
  },
  {
    path: '/subscriptions',
    element: <ProtectedRoute><Subscriptions /></ProtectedRoute>,
  },
  {
    path: '/routines',
    element: <ProtectedRoute><Routines /></ProtectedRoute>,
  },
])

export default router
