import { Calendar, CalendarDays, CreditCard, Settings } from 'lucide-react'


export default function QuickActions() {
  return (
    <div className="bg-base-100 rounded-box shadow-lg overflow-hidden">
      <div className="bg-primary text-primary-content p-4">
        <h2 className="text-xl font-bold">Quick Actions</h2>
      </div>
      <ul className="menu bg-base-100 w-full p-2 rounded-box">
        <li>
          <a className="flex items-center gap-3">
            <Calendar className="w-5 h-5" />
            <span>View Calendar</span>
          </a>
        </li>
        <li>
          <a className="flex items-center gap-3">
            <CreditCard className="w-5 h-5" />
            <span>Manage Services</span>
          </a>
        </li>
        <li>
          <a className="flex items-center gap-3">
            <CalendarDays className="w-5 h-5" />
            <span>Opening Hours</span>
          </a>
        </li>
        <li>
          <a className="flex items-center gap-3">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </a>
        </li>
      </ul>
    </div>
  )
}
