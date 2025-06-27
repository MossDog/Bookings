import { DateTime } from "luxon";
import { toast } from "sonner";
import { useState } from "react";
import { Booking, Seller, Service } from "@/types/types";
import { cancelBooking } from "@/utils/bookings";
import ReviewModal from "./ReviewModal";

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
  const [showReviewModal, setShowReviewModal] = useState(false);

  const handleCancel = async () => {
    const result = await cancelBooking(booking.id);
    if (result.success) {
      toast.success(result.message);
      onClose();
    } else {
      toast.error(result.message);
    }
  };

  const startDate = DateTime.fromISO(booking.start_time);
  const endDate = DateTime.fromISO(booking.end_time);

  if (showReviewModal) {
    return (
      <ReviewModal
        bookingId={booking.id}
        sellerId={seller.id}
        userId={booking.user_id}
        onClose={() => setShowReviewModal(false)}
        onSubmitSuccess={() => {
          setShowReviewModal(false);
          onClose();
        }}
      />
    );
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box space-y-4 rounded-2xl">
        <h3 className="text-xl font-bold text-center">Book: {service.name}</h3>

        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <span className="font-medium">Date:</span>{" "}
            {startDate.toLocaleString(DateTime.DATE_MED)}
          </p>
          <p>
            <span className="font-medium">Start Time:</span>{" "}
            {startDate.toLocaleString(DateTime.TIME_SIMPLE)}
          </p>
          <p>
            <span className="font-medium">End Time:</span>{" "}
            {endDate.toLocaleString(DateTime.TIME_SIMPLE)}
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

        {booking.status === "completed" && (
          <button
            className="btn btn-primary w-full"
            onClick={() => setShowReviewModal(true)}
          >
            Leave a Review
          </button>
        )}

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
