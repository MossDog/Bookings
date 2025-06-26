import { Booking, Service } from '@/types/types';
import { Clock, Calendar, User, CheckCircle2, AlertCircle, XCircle, Info, Eye } from 'lucide-react';
import { useState } from 'react';
import BookingDetailsModal from '../BookingDetailsModal';

interface DateSelectModalProps {
  selectedDate: Date | null;
  bookings: Booking[];
  services: Service[];
  isOpen: boolean;
  onClose: () => void;
  handleStatusChange?: (bookingId: number, newStatus: "confirmed" | "cancelled") => void;
}

export default function DateSelectModal({
  selectedDate,
  bookings,
  services,
  isOpen,
  onClose,
  handleStatusChange
}: DateSelectModalProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  if (!isOpen || !selectedDate) return null;

  // Get service name by ID
  const getServiceName = (serviceId: number) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Unknown Service';
  };

  // Format time
  const formatTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status icon and color
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { icon: CheckCircle2, color: 'text-success', bgColor: 'bg-success/10' };
      case 'pending':
        return { icon: AlertCircle, color: 'text-warning', bgColor: 'bg-warning/10' };
      case 'completed':
        return { icon: Info, color: 'text-info', bgColor: 'bg-info/10' };
      case 'cancelled':
        return { icon: XCircle, color: 'text-error', bgColor: 'bg-error/10' };
      default:
        return { icon: Clock, color: 'text-base-content/60', bgColor: 'bg-base-200' };
    }
  };

  // Calculate duration
  const getDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = Math.round(durationMs / (1000 * 60));
    
    if (durationMinutes < 60) {
      return `${durationMinutes}m`;
    } else {
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-base-content">
              Schedule for {formatDate(selectedDate)}
            </h3>
            <p className="text-sm text-base-content/60 mt-1">
              {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'} scheduled
            </p>
          </div>
          <button 
            className="btn btn-circle btn-ghost btn-sm"
            onClick={onClose}
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {bookings.length === 0 ? (
            // No bookings state
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-base-content/40" />
              </div>
              <h4 className="text-lg font-semibold text-base-content mb-2">
                No bookings scheduled
              </h4>
              <p className="text-base-content/60 max-w-sm">
                There are no appointments or bookings scheduled for this date.
              </p>
            </div>
          ) : (
            // Bookings list
            <div className="space-y-3">
              {bookings
                .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
                .map((booking) => {
                  const statusDisplay = getStatusDisplay(booking.status);
                  const StatusIcon = statusDisplay.icon;
                  
                  return (
                    <div
                      key={booking.id}
                      className="card bg-base-100 border border-base-300 p-4 transition-all duration-200"
                    >
                      <div className="flex items-start gap-4">
                        {/* Status Icon */}
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center
                          ${statusDisplay.bgColor}
                        `}>
                          <StatusIcon className={`w-5 h-5 ${statusDisplay.color}`} />
                        </div>

                        {/* Booking Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h5 className="font-semibold text-base-content truncate">
                                {getServiceName(booking.service_id)}
                              </h5>
                              <div className="flex items-center gap-4 text-sm text-base-content/60 mt-1">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>
                                    {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  <span>ID: {booking.user_id.slice(0, 8)}...</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="flex flex-col items-end gap-1">
                                <span className={`
                                  badge badge-sm
                                  ${booking.status === 'confirmed' ? 'badge-success' : ''}
                                  ${booking.status === 'pending' ? 'badge-warning' : ''}
                                  ${booking.status === 'completed' ? 'badge-info' : ''}
                                  ${booking.status === 'cancelled' ? 'badge-error' : ''}
                                `}>
                                  {booking.status}
                                </span>
                                <span className="text-xs text-base-content/50">
                                  {getDuration(booking.start_time, booking.end_time)}
                                </span>
                              </div>
                              
                              <button
                                className="btn btn-ghost btn-sm btn-circle"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedBooking(booking);
                                }}
                                title="View booking details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Booking ID */}
                          <div className="text-xs text-base-content/40">
                            Booking #{booking.id}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-base-300 mt-6">
          <button 
            className="btn btn-ghost"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
      
      {/* Modal backdrop */}
      <div className="modal-backdrop" onClick={onClose}></div>

      {/* Booking Details Modal */}
      {selectedBooking && handleStatusChange && (
        <BookingDetailsModal
          selectedBooking={selectedBooking}
          setSelectedBooking={setSelectedBooking}
          handleStatusChange={handleStatusChange}
          getServiceName={getServiceName}
        />
      )}
    </div>
  );
}
