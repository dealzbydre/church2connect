import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  function handleLogout() { logout(); navigate('/') }

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white border-b border-gray-100 shadow-sm' : 'bg-white border-b border-gray-100'}`}>
      <div className="section">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-navy-700 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 9.5V22h7v-7h6v7h7V9.5L12 2z"/>
              </svg>
            </div>
            <span className="font-bold text-navy-800 text-lg tracking-tight">Church2Connect</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/events" className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-navy-700 bg-navy-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`
            }>Events</NavLink>
            <NavLink to="/churches" className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-navy-700 bg-navy-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`
            }>Churches</NavLink>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <NavLink
                  to={isAdmin ? '/admin' : '/dashboard'}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-navy-700 bg-navy-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`
                  }
                >
                  {isAdmin ? 'Admin' : 'Dashboard'}
                </NavLink>
                <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-navy-700">{user.name[0].toUpperCase()}</span>
                  </div>
                  <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-800 font-medium">Sign out</button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">Sign in</Link>
                <Link to="/register" className="btn-navy text-sm px-4 py-2">Get Started Free</Link>
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
          <Link to="/events" className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl" onClick={() => setOpen(false)}>Events</Link>
          <Link to="/churches" className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl" onClick={() => setOpen(false)}>Churches</Link>
          {user ? (
            <>
              <Link to={isAdmin ? '/admin' : '/dashboard'} className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl" onClick={() => setOpen(false)}>
                {isAdmin ? 'Admin' : 'Dashboard'}
              </Link>
              <button onClick={() => { handleLogout(); setOpen(false) }} className="block w-full text-left px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-gray-50 rounded-xl">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl" onClick={() => setOpen(false)}>Sign in</Link>
              <Link to="/register" className="block px-3 py-2.5 text-sm font-medium text-navy-700 bg-navy-50 rounded-xl" onClick={() => setOpen(false)}>Get Started Free</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
