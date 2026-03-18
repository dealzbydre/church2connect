import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'

import Home from './pages/Home'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Churches from './pages/Churches'
import ChurchProfile from './pages/ChurchProfile'
import Login from './pages/Login'
import Register from './pages/Register'

import Dashboard, { DashboardHome } from './pages/Dashboard/index'
import ChurchProfileEdit from './pages/Dashboard/ChurchProfileEdit'
import ManageEvents from './pages/Dashboard/ManageEvents'
import CreateEvent from './pages/Dashboard/CreateEvent'

import Admin, { AdminHome } from './pages/Admin/index'
import ManageChurches from './pages/Admin/ManageChurches'
import AdminManageEvents from './pages/Admin/ManageEvents'
import ManageUsers from './pages/Admin/ManageUsers'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/churches" element={<Churches />} />
          <Route path="/churches/:id" element={<ChurchProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Organizer Dashboard */}
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>}>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<ChurchProfileEdit />} />
            <Route path="events" element={<ManageEvents />} />
            <Route path="events/new" element={<CreateEvent />} />
            <Route path="events/:id/edit" element={<CreateEvent />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>}>
            <Route index element={<AdminHome />} />
            <Route path="churches" element={<ManageChurches />} />
            <Route path="events" element={<AdminManageEvents />} />
            <Route path="users" element={<ManageUsers />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
