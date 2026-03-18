import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { Event, Church } from '../types'
import EventCard from '../components/EventCard'

const FEATURES = [
  {
    icon: '📅',
    title: 'Find Events Near You',
    desc: 'Browse worship services, youth programs, community outreach, and more — all in one place.'
  },
  {
    icon: '⛪',
    title: 'Discover Local Churches',
    desc: 'Explore churches in your area, learn about their ministry, and connect with their community.'
  },
  {
    icon: '✉️',
    title: 'Stay Connected',
    desc: 'Never miss an event. Organizers can easily submit and manage their upcoming programs.'
  },
]

const CATEGORIES = [
  { name: 'Worship',   icon: '🙏', color: 'bg-purple-50 text-purple-700 border-purple-100' },
  { name: 'Youth',     icon: '🌱', color: 'bg-green-50 text-green-700 border-green-100' },
  { name: 'Music',     icon: '🎵', color: 'bg-pink-50 text-pink-700 border-pink-100' },
  { name: 'Community', icon: '🤝', color: 'bg-blue-50 text-blue-700 border-blue-100' },
  { name: 'Outreach',  icon: '❤️', color: 'bg-orange-50 text-orange-700 border-orange-100' },
  { name: 'Education', icon: '📖', color: 'bg-yellow-50 text-yellow-800 border-yellow-100' },
  { name: 'Family',    icon: '👨‍👩‍👧', color: 'bg-red-50 text-red-700 border-red-100' },
  { name: 'Sports',    icon: '⚽', color: 'bg-teal-50 text-teal-700 border-teal-100' },
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
      <section className="bg-navy-800 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}/>
        </div>
        <div className="section relative py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-white/10">
              <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse"/>
              Free for churches &amp; communities
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-5">
              Your community,<br/>
              <span className="text-brand-400">all in one place.</span>
            </h1>
            <p className="text-lg sm:text-xl text-navy-200 mb-8 max-w-xl mx-auto leading-relaxed">
              Discover church events, connect with local communities, and never miss what matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-6">
              <input
                type="text"
                placeholder="Search events or churches..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && navigate(`/events${search ? `?search=${search}` : ''}`)}
                className="input flex-1 text-gray-900 !rounded-xl shadow-lg"
              />
              <button
                onClick={() => navigate(`/events${search ? `?search=${search}` : ''}`)}
                className="btn-primary shadow-lg px-6"
              >
                Search Events
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-navy-300">
              <span className="flex items-center gap-1.5"><span className="text-brand-400">✓</span> Free to browse</span>
              <span className="flex items-center gap-1.5"><span className="text-brand-400">✓</span> No account needed</span>
              <span className="flex items-center gap-1.5"><span className="text-brand-400">✓</span> Updated daily</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category pills */}
      <section className="border-b border-gray-100 bg-white sticky top-16 z-40">
        <div className="section py-3">
          <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.name}
                to={`/events?category=${cat.name}`}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap ${cat.color} hover:opacity-80`}
              >
                <span>{cat.icon}</span> {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section py-14">
        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Upcoming Events</h2>
            <p className="text-sm text-gray-500 mt-0.5">What's happening in your community</p>
          </div>
          <Link to="/events" className="text-sm font-semibold text-navy-700 hover:text-navy-900 flex items-center gap-1">
            View all <span>→</span>
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
            <div className="text-5xl mb-3">📅</div>
            <p className="font-medium text-gray-500">No upcoming events yet</p>
            <p className="text-sm mt-1">
              <Link to="/register" className="text-brand-600 font-semibold hover:underline">Register your church</Link> to add the first one
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {events.slice(0, 8).map(ev => <EventCard key={ev.id} event={ev} />)}
          </div>
        )}
      </section>

      {/* Feature rows */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="section py-14">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-gray-900">Everything your community needs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="card p-6">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured churches */}
      {churches.length > 0 && (
        <section className="section py-14">
          <div className="flex items-center justify-between mb-7">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Featured Churches</h2>
              <p className="text-sm text-gray-500 mt-0.5">Explore local faith communities</p>
            </div>
            <Link to="/churches" className="text-sm font-semibold text-navy-700 hover:text-navy-900 flex items-center gap-1">View all →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {churches.slice(0, 6).map(ch => (
              <Link key={ch.id} to={`/churches/${ch.id}`} className="card-hover p-4 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-navy-100 flex items-center justify-center mb-3 overflow-hidden">
                  {ch.logo_url
                    ? <img src={ch.logo_url} alt={ch.name} className="w-full h-full object-cover"/>
                    : <span className="text-xl font-extrabold text-navy-600">{ch.name[0]}</span>
                  }
                </div>
                <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">{ch.name}</p>
                {(ch.city || ch.state) && <p className="text-xs text-gray-400 mt-0.5">{ch.city}{ch.city && ch.state ? ', ' : ''}{ch.state}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA banner */}
      <section className="bg-navy-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}/>
        </div>
        <div className="section relative py-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
            Are you a church or organizer?
          </h2>
          <p className="text-navy-200 mb-8 max-w-lg mx-auto">
            Create a free account, set up your church profile, and start sharing events with your community in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="btn bg-brand-500 text-white hover:bg-brand-600 px-8 py-3 text-base shadow-lg">
              Register for Free
            </Link>
            <Link to="/events" className="btn-outline-white px-8 py-3 text-base">
              Browse Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
