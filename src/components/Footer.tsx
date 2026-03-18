import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="section py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="mb-3">
              <img
                src="https://horizons-cdn.hostinger.com/e454d0e1-fdcb-45e0-a41c-da9fd4c33489/b7d6670d911969a6a90ffadb0eaafbdb.png"
                alt="Church2Connect"
                className="h-10 w-auto brightness-0 invert"
                onError={e => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                  (e.currentTarget.nextSibling as HTMLElement).style.display = 'block';
                }}
              />
              <span className="font-bold text-white hidden" style={{ fontFamily: 'Poppins, sans-serif' }}>Church2Connect</span>
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
              <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 text-xs text-center text-gray-500">
          © {new Date().getFullYear()} Church2Connect. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
