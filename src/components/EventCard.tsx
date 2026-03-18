import { Link } from 'react-router-dom'
import { Event } from '../types'

const CATEGORY_COLORS: Record<string, string> = {
  Worship:   'bg-purple-100 text-purple-700',
  Youth:     'bg-green-100 text-green-700',
  Community: 'bg-blue-100 text-blue-700',
  Education: 'bg-yellow-100 text-yellow-800',
  Music:     'bg-pink-100 text-pink-700',
  Outreach:  'bg-orange-100 text-orange-700',
  Prayer:    'bg-indigo-100 text-indigo-700',
  Sports:    'bg-teal-100 text-teal-700',
  Family:    'bg-red-100 text-red-700',
  General:   'bg-gray-100 text-gray-600',
}

const CATEGORY_BG: Record<string, string> = {
  Worship:   'from-purple-400 to-purple-600',
  Youth:     'from-green-400 to-green-600',
  Community: 'from-blue-400 to-blue-600',
  Education: 'from-yellow-400 to-yellow-600',
  Music:     'from-pink-400 to-pink-600',
  Outreach:  'from-orange-400 to-orange-600',
  Prayer:    'from-indigo-400 to-indigo-600',
  Sports:    'from-teal-400 to-teal-600',
  Family:    'from-red-400 to-red-600',
  General:   'from-navy-500 to-navy-700',
}

export function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}
export function formatTime(d: string) {
  return new Date(d).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}
export { CATEGORY_COLORS }

export default function EventCard({ event }: { event: Event }) {
  const colorClass = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.General
  const bgGrad = CATEGORY_BG[event.category] || CATEGORY_BG.General
  const dateObj = new Date(event.start_date)
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  const day = dateObj.getDate()

  return (
    <Link to={`/events/${event.id}`} className="card-hover overflow-hidden flex flex-col group">
      {/* Image / gradient header */}
      <div className={`relative h-40 bg-gradient-to-br ${bgGrad} overflow-hidden`}>
        {event.image_url ? (
          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90" />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-20">
            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 9.5V22h7v-7h6v7h7V9.5L12 2z"/>
            </svg>
          </div>
        )}
        {/* Date badge */}
        <div className="absolute top-3 left-3 bg-white rounded-xl shadow px-2.5 py-1.5 text-center min-w-[44px]">
          <p className="text-[10px] font-bold text-navy-600 leading-none">{month}</p>
          <p className="text-lg font-extrabold text-navy-800 leading-none">{day}</p>
        </div>
        {event.is_free ? (
          <span className="badge absolute top-3 right-3 bg-brand-500 text-white text-[10px] shadow">FREE</span>
        ) : event.cost ? (
          <span className="badge absolute top-3 right-3 bg-white text-gray-800 text-[10px] shadow">{event.cost}</span>
        ) : null}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <span className={`badge self-start mb-2 text-[10px] ${colorClass}`}>{event.category}</span>
        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-navy-700 transition-colors">{event.title}</h3>
        <p className="text-xs font-semibold text-brand-600 mb-3">{event.church_name}</p>
        <div className="mt-auto flex items-center gap-1 text-xs text-gray-400">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>{formatTime(event.start_date)}</span>
          {(event.city || event.church_city) && (
            <>
              <span className="mx-1">·</span>
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              </svg>
              <span>{event.city || event.church_city}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
