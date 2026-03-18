import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'
import { Church, Event } from '../types'
import EventCard from '../components/EventCard'

export default function ChurchProfile() {
  const { id } = useParams()
  const [church, setChurch] = useState<Church | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/churches/${id}`)
      .then(({ church, events }) => { setChurch(church); setEvents(events) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse"><div className="h-40 bg-gray-200 rounded-xl" /></div>
  if (!church) return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-500"><p>Church not found</p></div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/churches" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        ← Back to Churches
      </Link>

      {/* Church header */}
      <div className="card p-6 sm:p-8 mb-8 flex flex-col sm:flex-row gap-6">
        <div className="w-24 h-24 rounded-2xl bg-primary-100 flex items-center justify-center overflow-hidden shrink-0">
          {church.logo_url ? <img src={church.logo_url} alt="" className="w-full h-full object-cover" />
            : <span className="text-4xl font-bold text-primary-600">{church.name[0]}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">{church.name}</h1>
          {church.denomination && <p className="text-primary-600 font-medium mb-2">{church.denomination}</p>}
          {church.description && <p className="text-gray-600 mb-4">{church.description}</p>}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            {church.address && <span>📍 {church.address}, {church.city}, {church.state} {church.zip}</span>}
            {church.phone && <span>📞 {church.phone}</span>}
            {church.email && <a href={`mailto:${church.email}`} className="text-primary-600 hover:underline">✉ {church.email}</a>}
            {church.website && <a href={church.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">🌐 Website</a>}
          </div>
        </div>
      </div>

      {/* Events */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events ({events.length})</h2>
      {events.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No upcoming events from this church.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map(ev => <EventCard key={ev.id} event={ev} />)}
        </div>
      )}
    </div>
  )
}
