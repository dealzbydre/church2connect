import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import { useAuth } from '../../contexts/AuthContext'
import { Church, Event } from '../../types'

export default function Dashboard() {
  const { user } = useAuth()
  const [church, setChurch] = useState<Church | null | undefined>(undefined)
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    api.get('/churches/my/profile').then(setChurch).catch(() => setChurch(null))
    api.get('/events/my/list').then(setEvents).catch(() => {})
  }, [])

  const navCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
      isActive ? 'bg-navy-700 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="section py-8">
        <div className="flex flex-col lg:flex-row gap-7">
          {/* Sidebar */}
          <aside className="lg:w-60 shrink-0 space-y-3">
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-navy-100 flex items-center justify-center shrink-0">
                  <span className="font-extrabold text-navy-700">{user?.name[0]}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 truncate text-sm">{user?.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
              {church && (
                <div className={`mt-3 text-xs px-3 py-1.5 rounded-lg font-semibold text-center ${
                  church.status === 'approved' ? 'bg-brand-50 text-brand-700' :
                  church.status === 'rejected' ? 'bg-red-50 text-red-700' :
                  'bg-yellow-50 text-yellow-700'
                }`}>
                  {church.status === 'approved' ? '✓ Church approved' :
                   church.status === 'rejected' ? '✗ Church rejected' : '⏳ Pending approval'}
                </div>
              )}
            </div>

            <nav className="card p-2 space-y-0.5">
              <NavLink to="/dashboard" end className={navCls}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                </svg>
                Overview
              </NavLink>
              <NavLink to="/dashboard/profile" className={navCls}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                Church Profile
              </NavLink>
              <NavLink to="/dashboard/events" className={navCls}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                My Events
                {events.length > 0 && (
                  <span className="ml-auto bg-gray-200 text-gray-600 text-xs font-bold rounded-full px-2 py-0.5">{events.length}</span>
                )}
              </NavLink>
              <NavLink to="/dashboard/events/new" className={navCls}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                </svg>
                Submit Event
              </NavLink>
            </nav>
          </aside>

          <div className="flex-1 min-w-0">
            <Outlet context={{ church, setChurch, events, setEvents }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function DashboardHome() {
  const { user } = useAuth()
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-gray-500 text-sm mb-7">Welcome back, {user?.name}!</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/dashboard/profile" className="card-hover p-6 flex items-start gap-4">
          <div className="w-11 h-11 bg-navy-100 rounded-xl flex items-center justify-center shrink-0 text-xl">⛪</div>
          <div>
            <p className="font-bold text-gray-900">Church Profile</p>
            <p className="text-sm text-gray-400 mt-0.5">Set up your church details</p>
          </div>
        </Link>
        <Link to="/dashboard/events" className="card-hover p-6 flex items-start gap-4">
          <div className="w-11 h-11 bg-brand-100 rounded-xl flex items-center justify-center shrink-0 text-xl">📅</div>
          <div>
            <p className="font-bold text-gray-900">My Events</p>
            <p className="text-sm text-gray-400 mt-0.5">View and manage events</p>
          </div>
        </Link>
        <Link to="/dashboard/events/new" className="card-hover p-6 flex items-start gap-4">
          <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center shrink-0 text-xl">➕</div>
          <div>
            <p className="font-bold text-gray-900">Submit Event</p>
            <p className="text-sm text-gray-400 mt-0.5">Submit a new event</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
