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
    `flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)]">
      {/* Stats bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="section py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Admin Panel</h1>
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: 'Users', value: stats.users },
                { label: 'Churches', value: stats.churches },
                { label: 'Pending Churches', value: stats.pending_churches, warn: stats.pending_churches > 0 },
                { label: 'Events', value: stats.events },
                { label: 'Pending Events', value: stats.pending_events, warn: stats.pending_events > 0 },
              ].map(s => (
                <div key={s.label} className={`card p-4 text-center ${s.warn ? 'border-yellow-300 bg-yellow-50' : ''}`}>
                  <p className={`text-2xl font-bold ${s.warn ? 'text-yellow-600' : 'text-gray-900'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
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
              {[
                { to: '/admin', end: true, label: 'Overview' },
                { to: '/admin/churches', end: false, label: `Churches${stats?.pending_churches ? ` (${stats.pending_churches})` : ''}` },
                { to: '/admin/events', end: false, label: `Events${stats?.pending_events ? ` (${stats.pending_events})` : ''}` },
                { to: '/admin/users', end: false, label: 'Users' },
              ].map(item => (
                <NavLink key={item.to} to={item.to} end={item.end}
                  className={navCls}
                  style={({ isActive }) => isActive ? { backgroundColor: '#1e88e5' } : {}}
                >
                  {item.label}
                </NavLink>
              ))}
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
      <p className="font-semibold text-gray-700 text-lg mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Welcome to the Admin Panel</p>
      <p className="text-sm">Use the sidebar to manage churches, events, and users.</p>
    </div>
  )
}
