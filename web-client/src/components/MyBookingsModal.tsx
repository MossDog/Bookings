import { DateTime } from "luxon";
import { cancelBooking } from "@/utils/cancelBookingUtil";
import { toast } from "sonner";
import { Booking } from "@/types/types";
import { useEffect, useState } from "react";
import { getPublicUrl } from "@/utils/bucketUtils";

interface MyBookingsModalProps {
  booking: Booking | null;
  onClose: () => void;
  onCancelSuccess: (id: string) => void;
}

export default function MyBookingsModal({
  booking,
  onClose,
  onCancelSuccess,
}: MyBookingsModalProps) {
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanner = async () => {
      if (!booking?.seller?.user_id) {
        console.warn("Seller User ID is missing");
        return;
      }

      try {
        const url = await getPublicUrl("public.images", `${booking.seller.user_id}/bannerimage`);
        setBannerUrl(url);
      } catch (error) {
        console.error("Error fetching banner URL:", error);
        setBannerUrl("/test_Restaurant.jpeg"); // Fallback to default image
      }
    };

    fetchBanner();
  }, [booking]);

  if (!booking) return null;

  const handleCancel = async () => {
    const res = await cancelBooking(booking.id);
    if (res.success) {
      toast.success(res.message);
      onCancelSuccess(booking.id);
      onClose();
    } else {
      toast.error(res.message);
    }
  };

  const date = DateTime.fromISO(booking.start_time);
  const start = date.toLocaleString(DateTime.TIME_SIMPLE);
  const end = DateTime.fromISO(booking.end_time).toLocaleString(DateTime.TIME_SIMPLE);
  const day = date.toLocaleString(DateTime.DATE_MED);

  return (
    <>
      <input type="checkbox" className="modal-toggle" checked readOnly />
      <div className="modal modal-open">
        <div className="modal-box rounded-2xl p-0 overflow-hidden">

          {/* Banner */}
          <div className="h-40 w-full bg-base-300 overflow-hidden">
            {bannerUrl ? (
              <img
                src={bannerUrl || "/test_Restaurant.jpeg"}
                alt="Business Banner"
                className="w-full h-full object-cover"
                onError={() => setBannerUrl("/test_Restaurant.jpeg")}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-base-content/60">
                Loading banner...
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            <h3 className="text-2xl font-bold text-center text-base-content">
              {booking.seller?.name || "Unknown Seller"}
            </h3>

            <div className="text-sm space-y-2 text-base-content/80">
              <p><span className="font-semibold">Date:</span> {day}</p>
              <p><span className="font-semibold">Start Time:</span> {start}</p>
              <p><span className="font-semibold">End Time:</span> {end}</p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`font-bold ${
                    booking.status === "cancelled" ? "text-error" : "text-primary"
                  }`}
                >
                  {booking.status.toUpperCase()}
                </span>
              </p>
              <p>
                <span className="font-semibold">Business Name:</span>{" "}
                {booking.seller?.name || "Unknown"}
              </p>
            </div>

            <a
              href={`/seller/${booking.seller?.user_id}`}
              className="btn btn-outline btn-primary w-full"
            >
              Visit Business Page
            </a>

            <div className="modal-action px-0 pt-4 flex justify-between">
              <button className="btn btn-ghost rounded-xl" onClick={onClose}>
                Close
              </button>

              {booking.status !== "cancelled" && (
                <button className="btn btn-warning rounded-xl" onClick={handleCancel}>
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}