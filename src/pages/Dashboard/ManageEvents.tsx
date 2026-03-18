import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { Event } from '../../types'

function StatusBadge({ status }: { status: Event['status'] }) {
  const cls = status === 'approved' ? 'bg-green-100 text-green-700' :
    status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
  return <span className={`badge ${cls}`}>{status}</span>
}

export default function ManageEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    api.get('/events/my/list').then(setEvents).catch(() => setEvents([])).finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function deleteEvent(id: number) {
    if (!confirm('Delete this event?')) return
    await api.delete(`/events/${id}`)
    setEvents(ev => ev.filter(e => e.id !== id))
  }

  if (loading) return <div className="animate-pulse space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded-lg" />)}</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
        <Link to="/dashboard/events/new" className="btn-primary">+ Submit Event</Link>
      </div>

      {events.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">
          <p className="mb-3">No events yet</p>
          <Link to="/dashboard/events/new" className="btn-primary">Submit Your First Event</Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Event</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {events.map(ev => (
                <tr key={ev.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-xs">
                    <p className="truncate">{ev.title}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell whitespace-nowrap">
                    {new Date(ev.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-gray-500">{ev.category}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={ev.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link to={`/dashboard/events/${ev.id}/edit`} className="text-xs text-primary-600 hover:text-primary-700 font-medium">Edit</Link>
                      <button onClick={() => deleteEvent(ev.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
