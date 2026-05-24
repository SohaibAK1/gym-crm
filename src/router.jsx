import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/DashboardLayout'
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
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      { path: '/dashboard',     element: <Dashboard /> },
      { path: '/attendance',    element: <Attendance /> },
      { path: '/subscriptions', element: <Subscriptions /> },
      { path: '/routines',      element: <Routines /> },
    ],
  },
])

export default router
