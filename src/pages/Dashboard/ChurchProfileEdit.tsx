import { useState, useEffect } from 'react'
import { api } from '../../lib/api'
import { Church } from '../../types'

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']

export default function ChurchProfileEdit() {
  const [form, setForm] = useState({
    name: '', description: '', address: '', city: '', state: '', zip: '',
    phone: '', email: '', website: '', denomination: ''
  })
  const [status, setStatus] = useState<Church['status'] | null>(null)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/churches/my/profile').then(church => {
      if (church) {
        setForm({
          name: church.name || '', description: church.description || '',
          address: church.address || '', city: church.city || '',
          state: church.state || '', zip: church.zip || '',
          phone: church.phone || '', email: church.email || '',
          website: church.website || '', denomination: church.denomination || ''
        })
        setStatus(church.status)
      }
    }).catch(() => {})
  }, [])

  function set(key: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setSaving(true)
    try {
      const ch = await api.post('/churches/my/profile', form)
      setStatus(ch.status)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Church Profile</h1>
        {status && (
          <span className={`badge text-sm px-3 py-1 ${
            status === 'approved' ? 'bg-green-100 text-green-700' :
            status === 'rejected' ? 'bg-red-100 text-red-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>
            {status === 'pending' ? '⏳ Pending Review' : status === 'approved' ? '✓ Approved' : '✗ Rejected'}
          </span>
        )}
      </div>


      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-800 mb-6">
          Profile saved successfully!
        </div>
      )}
      {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div>
          <label className="label">Church Name *</label>
          <input type="text" className="input" value={form.name} onChange={set('name')} required />
        </div>
        <div>
          <label className="label">Denomination</label>
          <input type="text" className="input" placeholder="e.g. Baptist, Catholic, Non-denominational..." value={form.denomination} onChange={set('denomination')} />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input" rows={3} value={form.description} onChange={set('description')} placeholder="Tell the community about your church..." />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div>
            <label className="label">ZIP Code</label>
            <input type="text" className="input" value={form.zip} onChange={set('zip')} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input type="tel" className="input" value={form.phone} onChange={set('phone')} />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" value={form.email} onChange={set('email')} />
          </div>
        </div>
        <div>
          <label className="label">Website</label>
          <input type="url" className="input" placeholder="https://..." value={form.website} onChange={set('website')} />
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary px-6">
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}
