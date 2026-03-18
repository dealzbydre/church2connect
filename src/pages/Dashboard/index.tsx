import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
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
    `flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="section py-8">
        <div className="flex flex-col lg:flex-row gap-7">
          <aside className="lg:w-60 shrink-0 space-y-3">
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <span className="font-bold text-sm" style={{ color: '#1e88e5' }}>{user?.name[0]}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>{user?.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            <nav className="card p-2 space-y-0.5">
              {[
                { to: '/dashboard', end: true, label: 'Overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
                { to: '/dashboard/profile', end: false, label: 'Church Profile', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                { to: '/dashboard/events', end: false, label: 'My Events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                { to: '/dashboard/events/new', end: false, label: 'Submit Event', icon: 'M12 4v16m8-8H4' },
              ].map(item => (
                <NavLink key={item.to} to={item.to} end={item.end}
                  className={navCls}
                  style={({ isActive }) => isActive ? { backgroundColor: '#1e88e5' } : {}}
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon}/>
                  </svg>
                  {item.label}
                </NavLink>
              ))}
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
      <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Dashboard</h1>
      <p className="text-gray-500 text-sm mb-6">Welcome back, {user?.name}!</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { to: '/dashboard/profile', icon: '⛪', title: 'Church Profile', desc: 'Set up your church details' },
          { to: '/dashboard/events', icon: '📅', title: 'My Events', desc: 'View and manage events' },
          { to: '/dashboard/events/new', icon: '➕', title: 'Submit Event', desc: 'Submit a new event' },
        ].map(item => (
          <Link key={item.to} to={item.to} className="card-hover p-6 flex items-start gap-4">
            <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 text-xl">{item.icon}</div>
            <div>
              <p className="font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>{item.title}</p>
              <p className="text-sm text-gray-400 mt-0.5">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
