import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  function handleLogout() { logout(); navigate('/') }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="section">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="https://horizons-cdn.hostinger.com/e454d0e1-fdcb-45e0-a41c-da9fd4c33489/b7d6670d911969a6a90ffadb0eaafbdb.png"
              alt="Church2Connect"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/events" className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`
            }>Events</NavLink>
            <NavLink to="/churches" className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`
            }>Churches</NavLink>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <NavLink to={isAdmin ? '/admin' : '/dashboard'} className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`
                }>
                  {isAdmin ? 'Admin' : 'Dashboard'}
                </NavLink>
                <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">{user.name[0].toUpperCase()}</span>
                  </div>
                  <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-800 font-medium">Sign out</button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm px-5 py-2">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100" onClick={() => setOpen(!open)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          <Link to="/events" className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setOpen(false)}>Events</Link>
          <Link to="/churches" className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setOpen(false)}>Churches</Link>
          {user ? (
            <>
              <Link to={isAdmin ? '/admin' : '/dashboard'} className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setOpen(false)}>
                {isAdmin ? 'Admin' : 'Dashboard'}
              </Link>
              <button onClick={() => { handleLogout(); setOpen(false) }} className="block w-full text-left px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-gray-50 rounded-lg">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" className="block px-3 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg" onClick={() => setOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
