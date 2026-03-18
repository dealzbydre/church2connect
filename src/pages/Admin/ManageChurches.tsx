import { useState, useEffect } from 'react'
import { api } from '../../lib/api'
import { Church } from '../../types'

function StatusBadge({ status }: { status: Church['status'] }) {
  const cls = status === 'approved' ? 'bg-green-100 text-green-700' :
    status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
  return <span className={`badge ${cls}`}>{status}</span>
}

export default function ManageChurches() {
  const [churches, setChurches] = useState<Church[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  useEffect(() => {
    api.get('/admin/churches').then(setChurches).catch(() => setChurches([])).finally(() => setLoading(false))
  }, [])

  async function setStatus(id: number, status: 'approved' | 'rejected' | 'pending') {
    await api.put(`/admin/churches/${id}/status`, { status })
    setChurches(cs => cs.map(c => c.id === id ? { ...c, status } : c))
  }

  async function deleteChurch(id: number) {
    if (!confirm('Delete this church and all its events?')) return
    await api.delete(`/admin/churches/${id}`)
    setChurches(cs => cs.filter(c => c.id !== id))
  }

  const filtered = filter === 'all' ? churches : churches.filter(c => c.status === filter)

  if (loading) return <div className="animate-pulse space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded-lg" />)}</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Churches ({churches.length})</h2>
        <div className="flex gap-1">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${filter === f ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">No churches found</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Church</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Owner</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Location</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(ch => (
                  <tr key={ch.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{ch.name}</p>
                      {ch.denomination && <p className="text-xs text-gray-400">{ch.denomination}</p>}
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                      <p>{ch.owner_name}</p>
                      <p className="text-xs text-gray-400">{ch.owner_email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                      {ch.city && `${ch.city}, ${ch.state}`}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={ch.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end whitespace-nowrap">
                        {ch.status !== 'approved' && (
                          <button onClick={() => setStatus(ch.id, 'approved')} className="text-xs text-green-600 hover:text-green-700 font-medium">Approve</button>
                        )}
                        {ch.status !== 'rejected' && (
                          <button onClick={() => setStatus(ch.id, 'rejected')} className="text-xs text-orange-500 hover:text-orange-700 font-medium">Reject</button>
                        )}
                        <button onClick={() => deleteChurch(ch.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>
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
