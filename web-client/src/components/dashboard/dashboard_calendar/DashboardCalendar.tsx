import { Booking, Seller, Service } from '@/types/types';
import { useState, useMemo } from 'react';
import DateSelectModal from './DateSelectModal';

interface DashboardCalendarProps {
  seller: Seller;
  bookings: Booking[];
  services: Service[];
  handleStatusChange?: (bookingId: number, newStatus: "confirmed" | "cancelled") => void;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  bookings: Booking[];
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function DashboardCalendar({
  bookings,
  services,
  handleStatusChange
}: DashboardCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get calendar days for the current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Days from previous month to fill the week
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Days from next month to complete the grid
    const endDate = new Date(lastDay);
    const remainingDays = 6 - lastDay.getDay();
    endDate.setDate(endDate.getDate() + remainingDays);
    
    const days: CalendarDay[] = [];
    const today = new Date();
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      // Create date string in local timezone to match booking dates
      const year = date.getFullYear();
      const monthStr = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const localDateStr = `${year}-${monthStr}-${day}`;
      
      const dayBookings = bookings.filter(booking => {
        // Extract date part from booking start_time (handles both UTC and local times)
        const bookingDate = new Date(booking.start_time);
        const bookingYear = bookingDate.getFullYear();
        const bookingMonth = String(bookingDate.getMonth() + 1).padStart(2, '0');
        const bookingDay = String(bookingDate.getDate()).padStart(2, '0');
        const bookingDateStr = `${bookingYear}-${bookingMonth}-${bookingDay}`;
        
        return bookingDateStr === localDateStr;
      });
      
      days.push({
        date: new Date(date),
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString(),
        bookings: dayBookings
      });
    }
    
    return days;
  }, [currentDate, bookings]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-success';
      case 'pending': return 'bg-warning';
      case 'completed': return 'bg-info';
      case 'cancelled': return 'bg-error';
      default: return 'bg-base-300';
    }
  };

  const formatTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Handle day click
  const handleDayClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
    setIsModalOpen(true);
  };

  // Get bookings for selected date
  const getSelectedDateBookings = () => {
    if (!selectedDate) return [];
    
    const year = selectedDate.getFullYear();
    const monthStr = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(selectedDate.getDate()).padStart(2, '0');
    const selectedDateStr = `${year}-${monthStr}-${dayStr}`;
    
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.start_time);
      const bookingYear = bookingDate.getFullYear();
      const bookingMonth = String(bookingDate.getMonth() + 1).padStart(2, '0');
      const bookingDay = String(bookingDate.getDate()).padStart(2, '0');
      const bookingDateStr = `${bookingYear}-${bookingMonth}-${bookingDay}`;
      
      return bookingDateStr === selectedDateStr;
    });
  };

  return (
    <div className="lg:col-span-3 h-full">
      <div className="card bg-base-100 shadow-xl h-full  border border-base-300">
        <div className="card-body p-3 sm:p-4 lg:p-6 h-full flex flex-col">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="card-title text-lg sm:text-xl lg:text-2xl font-bold text-base-content">
              <span className="hidden sm:inline">{MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
              <span className="sm:hidden">{MONTHS[currentDate.getMonth()].slice(0, 3)} {currentDate.getFullYear()}</span>
            </h2>
            
            <div className="flex gap-2">
              <button 
                className="btn btn-circle btn-outline btn-sm"
                onClick={() => navigateMonth('prev')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                className="btn btn-circle btn-outline btn-sm"
                onClick={() => setCurrentDate(new Date())}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              
              <button 
                className="btn btn-circle btn-outline btn-sm"
                onClick={() => navigateMonth('next')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3 sm:mb-4">
            {DAYS.map(day => (
              <div key={day} className="text-center text-xs sm:text-sm font-semibold text-base-content/70 py-1 sm:py-2">
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.slice(0, 1)}</span>
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 flex-1">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`
                  border border-base-300 rounded-lg p-1 sm:p-2 min-h-[80px] sm:min-h-[100px] lg:min-h-[120px] transition-all duration-200
                  ${day.isCurrentMonth ? 'bg-base-100' : 'bg-base-50 opacity-50'}
                  ${day.isToday ? 'ring-2 ring-primary' : ''}
                  hover:bg-base-200 cursor-pointer
                `}
                onClick={() => handleDayClick(day)}
              >
                {/* Date Number */}
                <div className={`
                  text-xs sm:text-sm font-medium mb-1 sm:mb-2 flex justify-center items-center w-5 h-5 sm:w-6 sm:h-6 rounded-full
                  ${day.isToday ? 'bg-primary text-primary-content' : 'text-base-content'}
                  ${!day.isCurrentMonth ? 'text-base-content/40' : ''}
                `}>
                  {day.date.getDate()}
                </div>

                {/* Bookings */}
                <div className="space-y-0.5 sm:space-y-1">
                  {day.bookings.slice(0, window.innerWidth < 640 ? 2 : 3).map((booking) => (
                    <div
                      key={booking.id}
                      className={`
                        text-xs p-0.5 sm:p-1 rounded text-white truncate
                        ${getBookingStatusColor(booking.status)}
                      `}
                      title={`${formatTime(booking.start_time)} - ${booking.status}`}
                    >
                      <span className="hidden sm:inline">{formatTime(booking.start_time)}</span>
                      <span className="sm:hidden text-xs">•</span>
                    </div>
                  ))}
                  
                  {day.bookings.length > (window.innerWidth < 640 ? 2 : 3) && (
                    <div className="text-xs text-base-content/60 font-medium">
                      +{day.bookings.length - (window.innerWidth < 640 ? 2 : 3)} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-base-300">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded bg-success"></div>
              <span className="text-xs sm:text-sm text-base-content/70">Confirmed</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded bg-warning"></div>
              <span className="text-xs sm:text-sm text-base-content/70">Pending</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded bg-info"></div>
              <span className="text-xs sm:text-sm text-base-content/70">Completed</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded bg-error"></div>
              <span className="text-xs sm:text-sm text-base-content/70">Cancelled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Date Select Modal */}
      <DateSelectModal
        selectedDate={selectedDate}
        bookings={getSelectedDateBookings()}
        services={services}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleStatusChange={handleStatusChange}
      />
    </div>
  );
}
