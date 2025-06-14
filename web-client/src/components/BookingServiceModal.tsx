import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { getAvailableSlots } from "@/utils/availabilityUtils";
import { bookSlot } from "@/utils/bookingsUtils";
import { getAvailableDates } from "@/utils/getAvailableDatesUtils";
import { toast } from "sonner";
import type { Service } from "@/types/types";


interface BookServiceModalProps {
  service: Service | null;
  onClose: () => void;
}

const BookServiceModal: React.FC<BookServiceModalProps> = ({ service, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (!service) return;
  
    getAvailableDates(service.user_id)
      .then((dateStrings: string[]) => {
        const dates: Date[] = dateStrings.map((str) => new Date(str));
        setAvailableDates(dates);
      })
      .catch(console.error);
  }, [service]);

  useEffect(() => {
    if (!service || !selectedDate) return;

    setLoadingSlots(true);
    getAvailableSlots(service.user_id, selectedDate)
      .then(setSlots)
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate, service]);

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedSlot || !service || !service.id) return;

    const result = await bookSlot(
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
        <div className="modal-box rounded-2xl space-y-5">
          <h3 className="text-xl font-semibold text-center">Book: {service.name}</h3>

          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) =>
              !availableDates.some(
                (available) =>
                  format(available, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
              )
            }
            modifiersClassNames={{
              disabled: "opacity-30 pointer-events-none", // greyed out
            }}
            className="mx-auto"
          />

          {loadingSlots ? (
            <p className="text-center text-sm text-base-content/60">Loading slots...</p>
          ) : slots.length === 0 ? (
            <p className="text-center text-sm text-base-content/60">
              No slots available for this date.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`btn btn-sm rounded-xl transition ${
                    selectedSlot === slot ? "btn-primary" : "btn-outline"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={handleConfirmBooking}
            disabled={!selectedSlot}
            className="btn btn-success w-full rounded-xl"
          >
            Confirm Booking
          </button>

          <div className="modal-action">
            <button
              onClick={onClose}
              className="btn btn-ghost rounded-xl text-base-content/80"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookServiceModal;