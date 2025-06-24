import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { getAvailableSlots } from "@/utils/availability";
import { bookSlot } from "@/utils/bookings";
import { getAvailableDates } from "@/utils/seller";
import { toast } from "sonner";
import type { Service } from "@/types/types";
import { useUser } from "@supabase/auth-helpers-react";
import { format } from "date-fns";
import { X } from "lucide-react";

interface BookServiceModalProps {
  service: Service | null;
  onClose: () => void;
}

const BookServiceModal: React.FC<BookServiceModalProps> = ({
  service,
  onClose,
}) => {
  const user = useUser();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (!service) return;

    getAvailableDates(service.user_id)
      .then((dateStrings: string[]) => {
        const dates = dateStrings.map((str) => new Date(str));
        setAvailableDates(dates);
      })
      .catch(console.error);
  }, [service]);

  useEffect(() => {
    if (!service || !selectedDate) return;

    setLoadingSlots(true);
    setSelectedSlot(null); // <-- Reset selected slot when day changes

    getAvailableSlots(service.user_id, selectedDate, "Europe/Dublin")
      .then(setSlots)
      .catch((err) => {
        console.error(err);
        setSlots([]);
      })
      .finally(() => setLoadingSlots(false));
  }, [selectedDate, service]);

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedSlot || !service || !user) return;

    if (!service.id) {
      toast.error("Service ID is required.");
      return;
    }
    const result = await bookSlot(
      user.id,
      service.user_id,
      service.id,
      selectedDate,
      selectedSlot
    );

    if (result.success) {
      toast.success("Booking successful!");
      onClose();
    } else {
      toast.error(result.message);
    }
  };

  if (!service) return null;

  return (
    <>
      <input type="checkbox" className="modal-toggle" checked readOnly />
      <div className="modal modal-open">
        <div className="modal-box max-h-[90vh] overflow-y-auto p-6 space-y-6">

          {/* Close Button */}
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & Price */}
          <div className="space-y-1 text-center">
            <h3 className="text-xl font-bold">Book: {service.name}</h3>
            <p className="text-base-content/70 text-sm">
              €{service.price.toFixed(2)} • {service.duration} min
            </p>
          </div>

          {/* Calendar */}
          <div className="flex justify-center">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) =>
                !availableDates.some(
                  (available) =>
                    format(available, "yyyy-MM-dd") ===
                    format(date, "yyyy-MM-dd")
                )
              }
              modifiersClassNames={{
                disabled: "opacity-30 pointer-events-none",
              }}
            />
          </div>

          {/* Time Slots */}
          {loadingSlots ? (
            <p className="text-center text-sm text-base-content/60">
              Loading slots...
            </p>
          ) : slots.length === 0 ? (
            <p className="text-center text-sm text-base-content/60">
              No slots available for this date.
            </p>
          ) : (
            <div className="flex overflow-x-auto gap-2 pb-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`btn btn-sm min-w-[80px] rounded-md flex-shrink-0 ${selectedSlot === slot ? "btn-primary" : "btn-outline"
                    }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-between gap-2 pt-4">
            <button
              onClick={onClose}
              className="btn btn-ghost flex-1 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmBooking}
              disabled={!selectedSlot}
              className="btn btn-primary flex-1 rounded-xl"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookServiceModal;