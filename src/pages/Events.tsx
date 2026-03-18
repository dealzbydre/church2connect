import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { api } from '../lib/api'
import { Event } from '../types'
import EventCard from '../components/EventCard'

const CATEGORIES = ['Worship', 'Youth', 'Community', 'Education', 'Music', 'Outreach', 'Prayer', 'Sports', 'Family', 'General']
const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']

export default function Events() {
  const [params, setParams] = useSearchParams()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  const search = params.get('search') || ''
  const category = params.get('category') || ''
  const state = params.get('state') || ''
  const from = params.get('from') || ''

  function setParam(key: string, value: string) {
    const p = new URLSearchParams(params)
    if (value) p.set(key, value); else p.delete(key)
    setParams(p)
  }

  useEffect(() => {
    setLoading(true)
    const q = new URLSearchParams()
    if (search) q.set('search', search)
    if (category) q.set('category', category)
    if (state) q.set('state', state)
    if (from) q.set('from', from)
    api.get('/events?' + q.toString())
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [search, category, state, from])

  const hasFilters = search || category || state || from

  return (
    <div>
      {/* Page header */}
      <div className="bg-navy-800 border-b">
        <div className="section py-8">
          <h1 className="text-2xl font-extrabold text-white mb-4">Browse Events</h1>
          {/* Search + filters bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="lg:col-span-2 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                placeholder="Search events, churches..."
                className="input pl-9 !bg-white"
                value={search}
                onChange={e => setParam('search', e.target.value)}
              />
            </div>
            <select className="input !bg-white" value={state} onChange={e => setParam('state', e.target.value)}>
              <option value="">All States</option>
              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="flex gap-2">
              <input type="date" className="input !bg-white flex-1" value={from} onChange={e => setParam('from', e.target.value)} title="From date"/>
              {hasFilters && (
                <button onClick={() => setParams(new URLSearchParams())} className="btn-secondary text-xs px-3 whitespace-nowrap shrink-0">
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="section py-8">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-7">
          <button
            onClick={() => setParam('category', '')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${!category ? 'bg-navy-700 text-white border-navy-700' : 'border-gray-200 text-gray-600 hover:border-navy-300 bg-white'}`}
          >All</button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setParam('category', cat === category ? '' : cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${cat === category ? 'bg-navy-700 text-white border-navy-700' : 'border-gray-200 text-gray-600 hover:border-navy-300 bg-white'}`}
            >{cat}</button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="h-40 bg-gray-200"/>
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/4"/>
                  <div className="h-4 bg-gray-200 rounded w-3/4"/>
                  <div className="h-3 bg-gray-200 rounded w-1/2"/>
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
            <div className="text-5xl mb-3">🔍</div>
            <p className="font-semibold text-gray-600 text-lg">No events found</p>
            <p className="text-sm mt-1 text-gray-400">Try adjusting your filters or <button onClick={() => setParams(new URLSearchParams())} className="text-navy-600 font-semibold hover:underline">clear all</button></p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-5 font-medium">{events.length} event{events.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {events.map(ev => <EventCard key={ev.id} event={ev} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
