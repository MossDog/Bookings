import { Booking } from "@/types/types";
import { Calendar } from "lucide-react";
import { DateTime } from "luxon";
import { useState } from "react";

interface BookingsListProps {
  bookings: Booking[];
  isLoading: boolean;
  handleStatusChange: (bookingId: number, newStatus: 'confirmed' | 'cancelled') => void;
  getServiceName: (serviceId: number) => string;
  setSelectedBooking: React.Dispatch<React.SetStateAction<Booking | null>>;
}

export default function BookingsList({
  bookings, isLoading, handleStatusChange, getServiceName, setSelectedBooking
}: BookingsListProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming');

  // Filter bookings based on active tab
  const filteredBookings = (() => {
    const now = new Date().toISOString();
    
    if (activeTab === 'upcoming') {
      return bookings.filter(booking => 
        booking.start_time > now && booking.status !== 'cancelled'
      );
    } else if (activeTab === 'past') {
      return bookings.filter(booking => 
        booking.start_time <= now || booking.status === 'cancelled'
      );
    } else {
      return bookings;
    }
  })();

  

  return (
    <div className="lg:col-span-3">
      <div className="bg-base-100 rounded-box shadow-lg overflow-hidden">
        <div className="bg-base-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-base-content">Bookings</h2>
          <div className="tabs tabs-boxed bg-base-300">
            <a 
              className={`tab ${activeTab === 'upcoming' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming
            </a>
            <a 
              className={`tab ${activeTab === 'past' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('past')}
            >
              Past
            </a>
            <a 
              className={`tab ${activeTab === 'all' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </a>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-6">
            <Calendar className="w-16 h-16 text-base-300 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No {activeTab} bookings found</h3>
            <p className="text-base-content/70 max-w-md">
              {activeTab === 'upcoming' 
                ? "You don't have any upcoming bookings at the moment." 
                : activeTab === 'past' 
                ? "You don't have any past bookings yet."
                : "You don't have any bookings yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map(booking => (
                  <tr key={booking.id} className="hover">
                    <td>{booking.user_id}</td>
                    <td>{getServiceName(booking.service_id)}</td>
                    <td>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {DateTime.fromISO(booking.start_time).toFormat('dd LLL yyyy')}
                        </span>
                        <span className="text-xs text-base-content/70">
                          {DateTime.fromISO(booking.start_time).toFormat('HH:mm')} - 
                          {DateTime.fromISO(booking.end_time).toFormat('HH:mm')}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className={`badge ${
                        booking.status === 'confirmed' ? 'badge-success' : 
                        booking.status === 'pending' ? 'badge-warning' : 
                        'badge-error'
                      } badge-outline`}>
                        {booking.status}
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button 
                          className="btn btn-xs btn-primary"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          Details
                        </button>
                        {booking.status === 'pending' && (
                          <button 
                            className="btn btn-xs btn-success"
                            onClick={() => handleStatusChange(booking.id, 'confirmed')}
                          >
                            Confirm
                          </button>
                        )}
                        {booking.status !== 'cancelled' && (
                          <button 
                            className="btn btn-xs btn-error"
                            onClick={() => handleStatusChange(booking.id, 'cancelled')}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
