import { useState, useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { api } from '../../lib/api'

interface Stats {
  users: number
  churches: number
  pending_churches: number
  events: number
  pending_events: number
}

export default function Admin() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    api.get('/admin/stats').then(setStats).catch(() => {})
  }, [])

  const navCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
      isActive ? 'bg-navy-700 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="bg-navy-800 border-b">
        <div className="section py-6">
          <h1 className="text-xl font-extrabold text-white mb-4">Admin Panel</h1>
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: 'Users', value: stats.users, icon: '👤' },
                { label: 'Churches', value: stats.churches, icon: '⛪' },
                { label: 'Pending Churches', value: stats.pending_churches, icon: '⏳', warn: stats.pending_churches > 0 },
                { label: 'Events', value: stats.events, icon: '📅' },
                { label: 'Pending Events', value: stats.pending_events, icon: '⏳', warn: stats.pending_events > 0 },
              ].map(s => (
                <div key={s.label} className={`rounded-xl px-4 py-3 ${s.warn ? 'bg-yellow-400/20 border border-yellow-300/30' : 'bg-white/10'}`}>
                  <p className={`text-2xl font-extrabold ${s.warn ? 'text-yellow-300' : 'text-white'}`}>{s.value}</p>
                  <p className="text-xs text-navy-300 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="section py-8">
        <div className="flex flex-col lg:flex-row gap-7">
          <aside className="lg:w-52 shrink-0">
            <nav className="card p-2 space-y-0.5">
              <NavLink to="/admin" end className={navCls}>Overview</NavLink>
              <NavLink to="/admin/churches" className={navCls}>
                Churches
                {stats?.pending_churches ? (
                  <span className="ml-auto bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full px-2 py-0.5">{stats.pending_churches}</span>
                ) : null}
              </NavLink>
              <NavLink to="/admin/events" className={navCls}>
                Events
                {stats?.pending_events ? (
                  <span className="ml-auto bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full px-2 py-0.5">{stats.pending_events}</span>
                ) : null}
              </NavLink>
              <NavLink to="/admin/users" className={navCls}>Users</NavLink>
            </nav>
          </aside>

          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export function AdminHome() {
  return (
    <div className="card p-10 text-center text-gray-400">
      <div className="text-4xl mb-3">🛠️</div>
      <p className="font-bold text-gray-700 text-lg mb-1">Welcome to the Admin Panel</p>
      <p className="text-sm">Use the sidebar to manage churches, events, and users.</p>
    </div>
  )
}
