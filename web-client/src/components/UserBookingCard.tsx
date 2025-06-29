import { Booking, Seller, Service } from "@/types/types";
import { useEffect, useState } from "react";
import UserBookingModal from "./UserBookingModal";
import { fetchBookingDetails } from "@/utils/bookings";
import { Calendar, Clock, Euro, Store } from "lucide-react";
import ReviewModal from "./ReviewModal";

interface UserBookingCardProps {
  booking: Booking;
}

export default function UserBookingCard({ booking }: UserBookingCardProps) {
  const [service, setService] = useState<Service | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { service, seller } = await fetchBookingDetails(booking);
      setService(service);
      setSeller(seller);
      setLoading(false);
    }

    load();
  }, [booking]);

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-sm p-6 animate-pulse rounded-xl">
        <div className="h-6 bg-base-200 rounded w-1/3 mb-3"></div>
        <div className="h-4 bg-base-200 rounded w-1/2 mb-1"></div>
        <div className="h-4 bg-base-200 rounded w-1/4"></div>
      </div>
    );
  }

  if (!service || !seller) {
    return (
      <div className="card bg-red-50 border border-red-200 text-red-600 shadow-sm p-6 rounded-xl">
        <p>⚠️ Booking details could not be loaded.</p>
      </div>
    );
  }

  return (
    <>
      <div
        className="card bg-base-100 shadow-sm p-6 rounded-xl hover:shadow-lg transition cursor-pointer space-y-4"
        onClick={() => setOpenModal(true)}
      >
        {/* Service name and status */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{service.name}</h3>
            <p className="text-sm text-base-content/60 capitalize">
              Status: {booking.status}
            </p>
          </div>
          <div className="text-xs badge badge-outline">
            {seller?.category || "Service"}
          </div>
        </div>

        {/* Date & Time */}
        <div className="flex items-center gap-2 text-sm text-base-content/70">
          <Calendar size={16} />
          {new Date(booking.start_time).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2 text-sm text-base-content/70">
          <Clock size={16} />
          {new Date(booking.start_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          –{" "}
          {new Date(booking.end_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        {/* Seller */}
        <div className="flex items-center gap-2 text-sm text-base-content/70">
          <Store size={16} />
          With {seller.name}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 text-sm font-medium text-base-content">
          <Euro size={16} />€{service.price}
        </div>

        {/* Leave a Review Button */}
        {booking.status === "completed" && (
          <button
            className="btn btn-primary w-full mt-4"
            onClick={(e) => {
              e.stopPropagation(); // Prevent opening modal when clicking the button
              setShowReviewModal(true);
            }}
          >
            Leave a Review
          </button>
        )}
      </div>

      {/* Booking Details Modal */}
      {openModal && (
        <UserBookingModal
          booking={booking}
          service={service}
          seller={seller}
          onClose={() => setOpenModal(false)}
        />
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          bookingId={booking.id}
          sellerId={seller.id}
          userId={booking.user_id}
          onClose={() => setShowReviewModal(false)}
          onSubmitSuccess={() => {
            setShowReviewModal(false);
          }}
        />
      )}
    </>
  );
}