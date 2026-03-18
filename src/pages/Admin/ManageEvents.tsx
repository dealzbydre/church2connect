import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { Event } from '../../types'

export default function AdminManageEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/events').then(setEvents).catch(() => setEvents([])).finally(() => setLoading(false))
  }, [])

  async function deleteEvent(id: number) {
    if (!confirm('Delete this event?')) return
    await api.delete(`/admin/events/${id}`)
    setEvents(evs => evs.filter(e => e.id !== id))
  }

  if (loading) return <div className="animate-pulse space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-lg" />)}</div>

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Events ({events.length})</h2>
      {events.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">No events yet</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Event</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Church</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {events.map(ev => (
                  <tr key={ev.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link to={`/events/${ev.id}`} className="font-medium text-gray-900 hover:underline" style={{ color: '#1e88e5' }}>{ev.title}</Link>
                      <p className="text-xs text-gray-400">{ev.category}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{ev.church_name}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell whitespace-nowrap">
                      {new Date(ev.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => deleteEvent(ev.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
