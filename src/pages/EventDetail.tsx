import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'
import { Event } from '../types'
import { formatDate, formatTime, CATEGORY_COLORS } from '../components/EventCard'

export default function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/events/${id}`)
      .then(setEvent)
      .catch(() => setError('Event not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-64 bg-gray-200 rounded-xl mb-6" />
      <div className="space-y-3">
        <div className="h-8 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded" />
      </div>
    </div>
  )

  if (error || !event) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-500">
      <p className="text-xl">{error || 'Event not found'}</p>
      <Link to="/events" className="btn-primary mt-4 inline-flex">Browse Events</Link>
    </div>
  )

  const color = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.General

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/events" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        ← Back to Events
      </Link>

      <div className="card overflow-hidden">
        {/* Image */}
        <div className="relative h-64 sm:h-80 bg-gradient-to-br from-primary-100 to-primary-200">
          {event.image_url ? (
            <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-24 h-24 text-primary-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          <span className={`badge absolute top-4 left-4 text-sm ${color}`}>{event.category}</span>
          {event.is_free ? (
            <span className="badge absolute top-4 right-4 text-sm bg-green-100 text-green-700">Free</span>
          ) : event.cost ? (
            <span className="badge absolute top-4 right-4 text-sm bg-amber-100 text-amber-700">{event.cost}</span>
          ) : null}
        </div>

        <div className="p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>

          <Link to={`/churches/${event.church_id}`} className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
              {event.church_logo ? <img src={event.church_logo} alt="" className="w-full h-full object-cover" />
                : <span className="text-xs font-bold text-primary-600">{event.church_name?.[0]}</span>}
            </div>
            <span className="text-primary-600 font-medium group-hover:text-primary-700">{event.church_name}</span>
          </Link>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Date */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary-50 rounded-lg">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Date &amp; Time</p>
                <p className="text-sm text-gray-900 font-medium">{formatDate(event.start_date)}</p>
                <p className="text-sm text-gray-600">{formatTime(event.start_date)}{event.end_date ? ` – ${formatTime(event.end_date)}` : ''}</p>
              </div>
            </div>

            {/* Location */}
            {(event.location || event.address || event.city) && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Location</p>
                  {event.location && <p className="text-sm text-gray-900 font-medium">{event.location}</p>}
                  {event.address && <p className="text-sm text-gray-600">{event.address}</p>}
                  {(event.city || event.church_city) && <p className="text-sm text-gray-600">{event.city || event.church_city}, {event.state || event.church_state}</p>}
                </div>
              </div>
            )}

            {/* Contact */}
            {(event.contact_email || event.contact_phone) && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Contact</p>
                  {event.contact_email && <p className="text-sm text-gray-900">{event.contact_email}</p>}
                  {event.contact_phone && <p className="text-sm text-gray-600">{event.contact_phone}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">About this Event</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{event.description}</p>
            </div>
          )}

          {/* CTA */}
          {event.registration_url && (
            <a
              href={event.registration_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-8 py-3 text-base"
            >
              Register / Learn More →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
