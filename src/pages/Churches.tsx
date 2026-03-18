import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { Church } from '../types'

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']

export default function Churches() {
  const [churches, setChurches] = useState<Church[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [state, setState] = useState('')

  function load() {
    setLoading(true)
    const q = new URLSearchParams()
    if (search) q.set('search', search)
    if (state) q.set('state', state)
    api.get('/churches?' + q).then(setChurches).catch(() => setChurches([])).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [state])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Churches Directory</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="Search churches..."
          className="input flex-1"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && load()}
        />
        <select className="input sm:w-40" value={state} onChange={e => setState(e.target.value)}>
          <option value="">All States</option>
          {US_STATES.map(s => <option key={s}>{s}</option>)}
        </select>
        <button className="btn-primary" onClick={load}>Search</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse flex gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : churches.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No churches found</p>
          <Link to="/register" className="btn-primary mt-4 inline-flex">Register Your Church</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {churches.map(ch => (
            <Link key={ch.id} to={`/churches/${ch.id}`} className="card p-5 hover:shadow-md transition-shadow flex gap-4">
              <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden shrink-0">
                {ch.logo_url ? <img src={ch.logo_url} alt="" className="w-full h-full object-cover" />
                  : <span className="text-xl font-bold text-primary-600">{ch.name[0]}</span>}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{ch.name}</h3>
                {ch.denomination && <p className="text-xs text-primary-600 mb-1">{ch.denomination}</p>}
                <p className="text-sm text-gray-500">{ch.city}, {ch.state}</p>
                {ch.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{ch.description}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
