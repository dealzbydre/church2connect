import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { Event } from '../../types'

function StatusBadge({ status }: { status: Event['status'] }) {
  const cls = status === 'approved' ? 'bg-green-100 text-green-700' :
    status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
  return <span className={`badge ${cls}`}>{status}</span>
}

export default function AdminManageEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  useEffect(() => {
    api.get('/admin/events').then(setEvents).catch(() => setEvents([])).finally(() => setLoading(false))
  }, [])

  async function setStatus(id: number, status: 'approved' | 'rejected' | 'pending') {
    await api.put(`/admin/events/${id}/status`, { status })
    setEvents(evs => evs.map(e => e.id === id ? { ...e, status } : e))
  }

  async function deleteEvent(id: number) {
    if (!confirm('Delete this event?')) return
    await api.delete(`/admin/events/${id}`)
    setEvents(evs => evs.filter(e => e.id !== id))
  }

  const filtered = filter === 'all' ? events : events.filter(e => e.status === filter)

  if (loading) return <div className="animate-pulse space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded-lg" />)}</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Events ({events.length})</h2>
        <div className="flex gap-1">
          {(['pending', 'all', 'approved', 'rejected'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${filter === f ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">No events found</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Event</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Church</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(ev => (
                  <tr key={ev.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link to={`/events/${ev.id}`} className="font-medium text-gray-900 hover:text-primary-600">{ev.title}</Link>
                      <p className="text-xs text-gray-400">{ev.category}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{ev.church_name}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell whitespace-nowrap">
                      {new Date(ev.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={ev.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end whitespace-nowrap">
                        {ev.status !== 'approved' && (
                          <button onClick={() => setStatus(ev.id, 'approved')} className="text-xs text-green-600 hover:text-green-700 font-medium">Approve</button>
                        )}
                        {ev.status !== 'rejected' && (
                          <button onClick={() => setStatus(ev.id, 'rejected')} className="text-xs text-orange-500 hover:text-orange-700 font-medium">Reject</button>
                        )}
                        <button onClick={() => deleteEvent(ev.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>
                      </div>
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
