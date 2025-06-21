import { DateTime } from "luxon";
import { cancelBooking } from "@/utils/bookings";
import { toast } from "sonner";
import { Booking, Seller, Service } from "@/types/types";

interface UserBookingModalProps {
  booking: Booking;
  service: Service;
  seller: Seller;
  onClose: () => void;
}

export default function UserBookingModal({
  booking,
  service,
  seller,
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
  const end = DateTime.fromISO(booking.end_time).toLocaleString(
    DateTime.TIME_SIMPLE,
  );
  const day = date.toLocaleString(DateTime.DATE_MED);

  return (
    <div className="modal modal-open">
      <div className="modal-box space-y-4 rounded-2xl">
        <h3 className="text-xl font-bold text-center">Book : {service.name}</h3>

        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <span className="font-medium">Date:</span> {day}
          </p>
          <p>
            <span className="font-medium">Start Time:</span> {start}
          </p>
          <p>
            <span className="font-medium">End Time:</span> {end}
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            <span
              className={
                booking.status === "cancelled"
                  ? "text-error font-semibold"
                  : "text-primary font-semibold"
              }
            >
              {booking.status.toUpperCase()}
            </span>
          </p>
        </div>

        <a
          href={`/${seller.slug}`}
          className="btn btn-outline btn-primary w-full"
        >
          Visit Business Page
        </a>

        <div className="modal-action justify-between">
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>

          {booking.status !== "cancelled" && (
            <button className="btn btn-warning" onClick={handleCancel}>
              Cancel Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
}