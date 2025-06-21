import { DateTime } from "luxon";
import { cancelBooking } from "@/utils/bookings";
import { toast } from "sonner";
import { Booking, Service } from "@/types/types";
import { BadgeCheck, XCircle, Clock, Calendar, Store } from "lucide-react";

interface UserBookingModalProps {
  booking: Booking;
  service: Service;
  onClose: () => void;
}

export default function UserBookingModal({
  booking,
  service,
  onClose,
}: UserBookingModalProps) {
  if (!booking) return null;

  const handleCancel = async () => {
    const res = await cancelBooking(booking.id);
    if (res.success) {
      toast.success(res.message);
      onClose();
    } else {
      toast.error(res.message);
    }
  };

  const date = DateTime.fromISO(booking.start_time);
  const start = date.toLocaleString(DateTime.TIME_SIMPLE);
  const end = DateTime.fromISO(booking.end_time).toLocaleString(DateTime.TIME_SIMPLE);
  const day = date.toLocaleString(DateTime.DATE_MED);

  let statusColor = "badge-ghost";
  let statusIcon = null;
  if (booking.status === "confirmed") {
    statusColor = "badge-success";
    statusIcon = <BadgeCheck className="w-5 h-5 mr-1" />;
  } else if (booking.status === "pending") {
    statusColor = "badge-warning";
    statusIcon = <Clock className="w-5 h-5 mr-1" />;
  } else if (booking.status === "cancelled") {
    statusColor = "badge-error";
    statusIcon = <XCircle className="w-5 h-5 mr-1" />;
  }

  return (
    <>
      <input type="checkbox" className="modal-toggle" checked readOnly />
      <div className="modal modal-open">
        <div className="modal-box rounded-2xl bg-base-100 max-w-md mx-auto p-0 overflow-hidden">
          {/* Header with icon and status */}
          <div className="flex flex-col items-center justify-center bg-base-200 py-6 px-4 border-b border-base-300">
            <div className="flex items-center gap-2 mb-2">
              <Store className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-base-content">{service.name}</span>
            </div>
            <span className={`badge ${statusColor} badge-lg flex items-center gap-1 text-base`}>{statusIcon}{booking.status}</span>
          </div>

          {/* Details section */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-base-content/80">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">{day}</span>
              <Clock className="w-5 h-5 ml-4" />
              <span className="font-medium">{start} - {end}</span>
            </div>
            <div className="flex items-center gap-2 text-base-content/70">
              <span className="font-medium">Status:</span>
              <span className={`capitalize font-semibold ${statusColor}`}>{booking.status}</span>
            </div>
          </div>

          {/* Visit business page */}
          <div className="px-6 pb-2">
            <a
              href={`/seller/${booking.seller_id}`}
              className="btn btn-outline btn-primary w-full"
            >
              Visit Business Page
            </a>
          </div>

          {/* Actions */}
          <div className="modal-action flex justify-between items-center px-6 pb-6 pt-2">
            <div onClick={(e) => e.stopPropagation()}>
              <button className="btn btn-ghost" onClick={onClose}>
                Close
              </button>
            </div>
            {booking.status !== "cancelled" && (
              <button className="btn btn-warning" onClick={handleCancel}>
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
