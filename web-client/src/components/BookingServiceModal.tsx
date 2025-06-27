import React, { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { getAvailableSlots } from "@/utils/availability";
import { bookSlot } from "@/utils/bookings";
import { getAvailableDates } from "@/utils/seller";
import { toast } from "sonner";
import type { Service } from "@/types/types";
import { useUser } from "@supabase/auth-helpers-react";

import { X } from "lucide-react";
import {
  isDateAvailable,
  updateScrollGradients,
  updateProgressDots,
} from "@/utils/scrolling";

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

  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!service) return;
    getAvailableDates(service.user_id)
      .then((dateStrings) => setAvailableDates(dateStrings.map((str) => new Date(str))))
      .catch(console.error);
  }, [service]);

  useEffect(() => {
    if (!service || !selectedDate) return;
    setLoadingSlots(true);
    setSelectedSlot(null);

    getAvailableSlots(service.user_id, selectedDate, "Europe/Dublin")
      .then(setSlots)
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate, service]);

  useEffect(() => {
  if (!modalRef.current) return;

  const container = modalRef.current.querySelector(".scroll-container") as HTMLElement;
  const leftGradient = modalRef.current.querySelector(".left-gradient") as HTMLElement;
  const rightGradient = modalRef.current.querySelector(".right-gradient") as HTMLElement;
  const dots = modalRef.current.querySelectorAll(".progress-dot");

  if (!container) return;

  updateScrollGradients(container, leftGradient, rightGradient);
  updateProgressDots(container, dots);  // <-- Make sure first dot is active immediately
}, [slots]);

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedSlot || !service || !user || service.id === undefined) {
      toast.error("Please select all required information.");
      return;
    }

    const result = await bookSlot(
      user.id,
      service.user_id,
      service.id,
      selectedDate,
      selectedSlot,
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
        <div ref={modalRef} className="modal-box max-h-[90vh] overflow-y-auto p-6 space-y-6">
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-2 text-left border-b border-base-content/20 pb-4">
            <h3 className="text-2xl font-semibold text-primary">{service.name}</h3>
            <p className="text-lg text-base-content/70">
              <span className="font-medium">€{service.price.toFixed(2)}</span>
              <span className="mx-2">•</span>
              <span className="font-medium">{service.duration} min</span>
            </p>
          </div>

          <div className="flex justify-center">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => !isDateAvailable(date, availableDates)}
              modifiersClassNames={{ disabled: "opacity-30 pointer-events-none" }}
            />
          </div>

          {loadingSlots ? (
            <p className="text-center text-sm text-base-content/60">Loading slots...</p>
          ) : slots.length === 0 ? (
            <p className="text-center text-sm text-base-content/60">No slots available for this date.</p>
          ) : (
            <div className="relative">
              <div
                className="flex overflow-x-auto gap-2 pb-2 scroll-container"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                onScroll={(e) => {
                  const container = e.target as HTMLElement;
                  const leftGradient = modalRef.current?.querySelector(".left-gradient") as HTMLElement;
                  const rightGradient = modalRef.current?.querySelector(".right-gradient") as HTMLElement;
                  const dots = modalRef.current?.querySelectorAll(".progress-dot") as NodeListOf<Element>;

                  updateScrollGradients(container, leftGradient, rightGradient);
                  updateProgressDots(container, dots);
                }}
              >
                {slots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`btn btn-sm min-w-[80px] rounded-md flex-shrink-0 ${selectedSlot === slot ? "btn-primary" : "btn-outline"}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <div className="left-gradient absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-base-100 to-transparent pointer-events-none"></div>
              <div className="right-gradient absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-base-100 to-transparent pointer-events-none"></div>
              <div className="flex justify-center mt-2">
                {[...Array(5)].map((_, index) => (
                  <span key={index} className="progress-dot w-2 h-2 rounded-full bg-base-content/30 mx-1"></span>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between gap-2 pt-4">
            <button onClick={onClose} className="btn btn-ghost flex-1 rounded-xl">Cancel</button>
            <button onClick={handleConfirmBooking} disabled={!selectedSlot} className="btn btn-primary flex-1 rounded-xl">Confirm</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookServiceModal;