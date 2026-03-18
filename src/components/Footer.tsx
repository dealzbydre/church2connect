import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-navy-300">
      <div className="section py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-navy-600 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 9.5V22h7v-7h6v7h7V9.5L12 2z"/>
                </svg>
              </div>
              <span className="font-bold text-white">Church2Connect</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Connecting communities through faith and shared experiences. Find events, discover churches, and stay connected.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/events" className="hover:text-white transition-colors">Upcoming Events</Link></li>
              <li><Link to="/churches" className="hover:text-white transition-colors">Churches Directory</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Organizers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register" className="hover:text-white transition-colors">Register Your Church</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Submit an Event</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-navy-700 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-navy-500">
          <p>© {new Date().getFullYear()} Church2Connect. All rights reserved.</p>
          <p>Built for communities of faith ✝</p>
        </div>
      </div>
    </footer>
  )
}
