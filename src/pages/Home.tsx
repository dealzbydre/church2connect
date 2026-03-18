import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { Event, Church } from '../types'
import EventCard from '../components/EventCard'

const CATEGORIES = [
  { name: 'Worship',   icon: '🙏' },
  { name: 'Youth',     icon: '🌱' },
  { name: 'Music',     icon: '🎵' },
  { name: 'Community', icon: '🤝' },
  { name: 'Outreach',  icon: '❤️' },
  { name: 'Education', icon: '📖' },
  { name: 'Family',    icon: '👨‍👩‍👧' },
  { name: 'Sports',    icon: '⚽' },
]

const FEATURES = [
  { icon: '📅', title: 'Find Events Near You', desc: 'Browse worship services, youth programs, community outreach, and more — all in one place.' },
  { icon: '⛪', title: 'Discover Local Churches', desc: 'Explore churches in your area, learn about their ministry, and connect with their community.' },
  { icon: '✉️', title: 'Stay Connected', desc: 'Never miss an event. Organizers can easily submit and manage their upcoming programs.' },
]

export default function Home() {
  const [events, setEvents] = useState<Event[]>([])
  const [churches, setChurches] = useState<Church[]>([])
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    api.get(`/events?from=${today}`).then(setEvents).catch(() => {})
    api.get('/churches').then(setChurches).catch(() => {})
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white z-10">
          <img
            src="https://horizons-cdn.hostinger.com/e454d0e1-fdcb-45e0-a41c-da9fd4c33489/b7d6670d911969a6a90ffadb0eaafbdb.png"
            alt="Church2Connect"
            className="h-20 w-auto mx-auto mb-8 drop-shadow-lg"
          />
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Connect Your Community
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover and share meaningful church events in your community. Connect with fellow believers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-6">
            <input
              type="text"
              placeholder="Search events or churches..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && navigate(`/events${search ? `?search=${search}` : ''}`)}
              className="input flex-1 shadow-lg"
            />
            <button
              onClick={() => navigate(`/events${search ? `?search=${search}` : ''}`)}
              className="btn-primary px-8 shadow-xl text-base"
            >
              Search Events
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/70">
            <span className="flex items-center gap-1.5"><span className="text-white">✓</span> Free to browse</span>
            <span className="flex items-center gap-1.5"><span className="text-white">✓</span> No account needed</span>
            <span className="flex items-center gap-1.5"><span className="text-white">✓</span> Updated daily</span>
          </div>
        </div>
      </section>

      {/* Category pills */}
      <section className="bg-white border-b border-gray-100">
        <div className="section py-4">
          <div className="flex gap-2 overflow-x-auto pb-0.5">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.name}
                to={`/events?category=${cat.name}`}
                className="shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                <span>{cat.icon}</span> {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Upcoming Events</h2>
            <p className="text-sm text-gray-500 mt-0.5">What's happening in your community</p>
          </div>
          <Link to="/events" className="text-sm font-semibold hover:underline" style={{ color: '#1e88e5' }}>View all →</Link>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
            <div className="text-4xl mb-3">📅</div>
            <p className="font-medium text-gray-500">No upcoming events yet</p>
            <p className="text-sm mt-1">
              <Link to="/register" className="font-semibold hover:underline" style={{ color: '#1e88e5' }}>Register your church</Link> to add the first one
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {events.slice(0, 8).map(ev => <EventCard key={ev.id} event={ev} />)}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="section py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Everything your community needs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="card p-6">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1.5" style={{ fontFamily: 'Poppins, sans-serif' }}>{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Churches */}
      {churches.length > 0 && (
        <section className="section py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Featured Churches</h2>
            <Link to="/churches" className="text-sm font-semibold hover:underline" style={{ color: '#1e88e5' }}>View all →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {churches.slice(0, 6).map(ch => (
              <Link key={ch.id} to={`/churches/${ch.id}`} className="card-hover p-4 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-2 overflow-hidden">
                  {ch.logo_url
                    ? <img src={ch.logo_url} alt={ch.name} className="w-full h-full object-cover"/>
                    : <span className="text-xl font-bold" style={{ color: '#1e88e5' }}>{ch.name[0]}</span>
                  }
                </div>
                <p className="text-sm font-semibold text-gray-900 line-clamp-2">{ch.name}</p>
                {(ch.city || ch.state) && <p className="text-xs text-gray-400 mt-0.5">{ch.city}{ch.city && ch.state ? ', ' : ''}{ch.state}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-gray-100" style={{ background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)' }}>
        <div className="section py-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Are you a church or organizer?
          </h2>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto">
            Create a free account, set up your church profile, and start sharing events with your community in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="btn bg-white font-semibold px-8 py-3 text-base rounded-lg" style={{ color: '#1e88e5' }}>
              Register for Free
            </Link>
            <Link to="/events" className="btn border-2 border-white text-white px-8 py-3 text-base rounded-lg hover:bg-white transition-colors" style={{} as React.CSSProperties}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#1e88e5' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'white' }}
            >
              Browse Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
