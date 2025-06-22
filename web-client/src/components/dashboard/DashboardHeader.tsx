import { Booking, Seller } from "@/types/types";
import { Calendar, Users } from "lucide-react";
import { DateTime } from "luxon";

interface DashboardHeaderProps {
  bookings: Booking[];
  seller?: Seller;
}

export default function DashboardHeader({ bookings, seller }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-base-content">Hi, {seller?.name}!</h1>
        <p className="text-base-content/70 mt-1">Manage your bookings and services</p>
      </div>
      
      <div className="stats shadow bg-base-100">
        <div className="stat">
          <div className="stat-figure text-primary">
            <Users className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Bookings</div>
          <div className="stat-value text-primary">{bookings.length}</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-secondary">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="stat-title">Today</div>
          <div className="stat-value text-secondary">
            {bookings.filter(b => 
              DateTime.fromISO(b.start_time).hasSame(DateTime.now(), 'day') && 
              b.status !== 'cancelled'
            ).length}
          </div>
        </div>
      </div>
    </div>
  )
}
