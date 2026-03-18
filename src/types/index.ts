export interface User {
  id: number
  email: string
  name: string
  role: 'visitor' | 'organizer' | 'admin'
  created_at?: string
}

export interface Church {
  id: number
  user_id: number
  name: string
  description?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  phone?: string
  email?: string
  website?: string
  logo_url?: string
  denomination?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  owner_email?: string
  owner_name?: string
}

export interface Event {
  id: number
  church_id: number
  title: string
  description?: string
  category: string
  start_date: string
  end_date?: string
  location?: string
  address?: string
  city?: string
  state?: string
  image_url?: string
  registration_url?: string
  is_free: number
  cost?: string
  contact_email?: string
  contact_phone?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  church_name?: string
  church_city?: string
  church_state?: string
  church_logo?: string
}

export interface AuthState {
  user: User | null
  token: string | null
}
