import { useState, useEffect } from 'react'
import { api } from '../../lib/api'
import { User } from '../../types'

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/users').then(setUsers).catch(() => setUsers([])).finally(() => setLoading(false))
  }, [])

  async function deleteUser(id: number) {
    if (!confirm('Delete this user and all their churches/events?')) return
    await api.delete(`/admin/users/${id}`)
    setUsers(us => us.filter(u => u.id !== id))
  }

  if (loading) return <div className="animate-pulse space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded-lg" />)}</div>

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Users ({users.length})</h2>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Role</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Joined</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className={`badge ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</span>
                </td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                  {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  {u.role !== 'admin' && (
                    <button onClick={() => deleteUser(u.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
