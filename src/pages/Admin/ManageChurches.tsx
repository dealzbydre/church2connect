import { useState, useEffect } from 'react'
import { api } from '../../lib/api'
import { Church } from '../../types'

export default function ManageChurches() {
  const [churches, setChurches] = useState<Church[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/churches').then(setChurches).catch(() => setChurches([])).finally(() => setLoading(false))
  }, [])

  async function deleteChurch(id: number) {
    if (!confirm('Delete this church and all its events?')) return
    await api.delete(`/admin/churches/${id}`)
    setChurches(cs => cs.filter(c => c.id !== id))
  }

  if (loading) return <div className="animate-pulse space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-lg" />)}</div>

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Churches ({churches.length})</h2>
      {churches.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">No churches yet</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Church</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Owner</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Location</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {churches.map(ch => (
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
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => deleteChurch(ch.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>
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
