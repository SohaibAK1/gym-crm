import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'
import MemberLayout from './components/MemberLayout'
import Landing from './pages/Landing'
import Login from './pages/Login'

// Admin pages
import AdminDashboard     from './pages/admin/Dashboard'
import AdminMembers       from './pages/admin/Members'
import AdminMemberDetail  from './pages/admin/MemberDetail'
import AdminAttendance    from './pages/admin/Attendance'
import AdminSubscriptions from './pages/admin/Subscriptions'
import AdminRoutines      from './pages/admin/Routines'
import RoutineBuilder     from './pages/admin/RoutineBuilder'
import AdminAnnouncements from './pages/admin/Announcements'

// Member pages
import MemberHome         from './pages/member/Home'
import MemberAttendance   from './pages/member/Attendance'
import MemberSubscription from './pages/member/Subscription'
import MemberRoutine      from './pages/member/Routine'
import MemberProgress     from './pages/member/Progress'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/login',
    element: <Login />,
  },

  // ── Admin portal ──────────────────────────────────────────────────
  {
    element: (
      <ProtectedRoute allowedRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/admin/dashboard',     element: <AdminDashboard />     },
      { path: '/admin/members',        element: <AdminMembers />       },
      { path: '/admin/members/:id',    element: <AdminMemberDetail />  },
      { path: '/admin/attendance',     element: <AdminAttendance />    },
      { path: '/admin/subscriptions',  element: <AdminSubscriptions /> },
      { path: '/admin/routines',        element: <AdminRoutines />      },
      { path: '/admin/routines/:id',   element: <RoutineBuilder />     },
      { path: '/admin/announcements',  element: <AdminAnnouncements /> },
    ],
  },

  // ── Member portal ─────────────────────────────────────────────────
  {
    element: (
      <ProtectedRoute allowedRole="member">
        <MemberLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/member/home',         element: <MemberHome />         },
      { path: '/member/attendance',   element: <MemberAttendance />   },
      { path: '/member/subscription', element: <MemberSubscription /> },
      { path: '/member/routine',      element: <MemberRoutine />      },
      { path: '/member/progress',     element: <MemberProgress />     },
    ],
  },
])

export default router
