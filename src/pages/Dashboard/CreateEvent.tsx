import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../lib/api'

const CATEGORIES = ['Worship', 'Youth', 'Community', 'Education', 'Music', 'Outreach', 'Prayer', 'Sports', 'Family', 'General']
const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']

const EMPTY = {
  title: '', description: '', category: 'General',
  start_date: '', end_date: '', location: '', address: '',
  city: '', state: '', image_url: '', registration_url: '',
  is_free: true, cost: '', contact_email: '', contact_phone: ''
}

export default function CreateEvent() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEdit) {
      api.get('/events/my/list').then(evs => {
        const ev = evs.find((e: any) => e.id === Number(id))
        if (ev) setForm({
          title: ev.title || '', description: ev.description || '',
          category: ev.category || 'General', start_date: ev.start_date?.slice(0, 16) || '',
          end_date: ev.end_date?.slice(0, 16) || '', location: ev.location || '',
          address: ev.address || '', city: ev.city || '', state: ev.state || '',
          image_url: ev.image_url || '', registration_url: ev.registration_url || '',
          is_free: !!ev.is_free, cost: ev.cost || '',
          contact_email: ev.contact_email || '', contact_phone: ev.contact_phone || ''
        })
      })
    }
  }, [id])

  function set(key: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
      setForm(f => ({ ...f, [key]: val }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (isEdit) {
        await api.put(`/events/${id}`, form)
      } else {
        await api.post('/events', form)
      }
      navigate('/dashboard/events')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEdit ? 'Edit Event' : 'Submit New Event'}</h1>
      {!isEdit && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800 mb-6">
          Events require admin approval before appearing publicly.
        </div>
      )}
      {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div>
          <label className="label">Event Title *</label>
          <input type="text" className="input" value={form.title} onChange={set('title')} required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Category</label>
            <select className="input" value={form.category} onChange={set('category')}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input type="checkbox" id="is_free" checked={form.is_free} onChange={set('is_free')} className="w-4 h-4 text-primary-600" />
            <label htmlFor="is_free" className="text-sm font-medium text-gray-700">Free Event</label>
            {!form.is_free && (
              <input type="text" className="input flex-1" placeholder="e.g. $10" value={form.cost} onChange={set('cost')} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Start Date & Time *</label>
            <input type="datetime-local" className="input" value={form.start_date} onChange={set('start_date')} required />
          </div>
          <div>
            <label className="label">End Date & Time</label>
            <input type="datetime-local" className="input" value={form.end_date} onChange={set('end_date')} />
          </div>
        </div>

        <div>
          <label className="label">Description</label>
          <textarea className="input" rows={4} value={form.description} onChange={set('description')} placeholder="Describe the event..." />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Venue / Location Name</label>
            <input type="text" className="input" value={form.location} onChange={set('location')} placeholder="e.g. Main Sanctuary" />
          </div>
          <div>
            <label className="label">Street Address</label>
            <input type="text" className="input" value={form.address} onChange={set('address')} />
          </div>
          <div>
            <label className="label">City</label>
            <input type="text" className="input" value={form.city} onChange={set('city')} />
          </div>
          <div>
            <label className="label">State</label>
            <select className="input" value={form.state} onChange={set('state')}>
              <option value="">Select state</option>
              {US_STATES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Contact Email</label>
            <input type="email" className="input" value={form.contact_email} onChange={set('contact_email')} />
          </div>
          <div>
            <label className="label">Contact Phone</label>
            <input type="tel" className="input" value={form.contact_phone} onChange={set('contact_phone')} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Event Image URL</label>
            <input type="url" className="input" placeholder="https://..." value={form.image_url} onChange={set('image_url')} />
          </div>
          <div>
            <label className="label">Registration / Info URL</label>
            <input type="url" className="input" placeholder="https://..." value={form.registration_url} onChange={set('registration_url')} />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => navigate('/dashboard/events')} className="btn-secondary px-5">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary px-6">
            {saving ? 'Saving...' : isEdit ? 'Update Event' : 'Submit Event'}
          </button>
        </div>
      </form>
    </div>
  )
}
