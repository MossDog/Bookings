import { Booking } from "@/types/types";
import { CheckSquare, Clock, XCircle } from "lucide-react";

interface BookingStatsSummaryProps {
  bookings: Booking[];
}

export default function BookingStatsSummary({ bookings }: BookingStatsSummaryProps) {
  return (
    <div className="mt-6 bg-base-100 rounded-box shadow-lg p-4">
      <h3 className="font-bold mb-4">Booking Stats</h3>
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm flex items-center gap-1">
          <CheckSquare className="w-4 h-4 text-success" />
          Confirmed
        </span>
        <span className="font-semibold">
          {bookings.filter(b => b.status === 'confirmed').length}
        </span>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm flex items-center gap-1">
          <Clock className="w-4 h-4 text-warning" />
          Pending
        </span>
        <span className="font-semibold">
          {bookings.filter(b => b.status === 'pending').length}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm flex items-center gap-1">
          <XCircle className="w-4 h-4 text-error" />
          Cancelled
        </span>
        <span className="font-semibold">
          {bookings.filter(b => b.status === 'cancelled').length}
        </span>
      </div>
    </div>
  )
}
