import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Service } from "../types/types";
import { getAvailableSlots } from "@/utils/availabilityUtils";
import { bookSlot } from "@/utils/bookingsUtils";
import { format } from "date-fns";
import { toast } from "sonner"; // ✅ Make sure this is installed

interface BookServiceModalProps {
  service: Service | null;
  onClose: () => void;
  userId: string;
}

const BookServiceModal: React.FC<BookServiceModalProps> = ({ service, onClose, userId }) => {
  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!service) return;
    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const available = await getAvailableSlots(service.user_id, new Date(date));
        setSlots(available);
      } catch (err) {
        console.error(err);
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [service, date]);

  const handleConfirmBooking = async () => {
    if (!service || !selectedSlot || typeof service.id !== 'number') return;
  
    const result = await bookSlot(
      service.user_id,      // sellerId
      userId,               // userId
      service.id,           // serviceId (now guaranteed to be number)
      new Date(date),       // Date object
      selectedSlot
    );
  
    if (result.success) {
      toast.success("Booking successful!");
      setStatus("Booking confirmed!");
      onClose();
    } else {
      toast.error(result.message);
      setStatus(result.message);
    }
  };

  if (!service) return null;

  return (
    <Dialog open={!!service} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book: {service.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <label className="form-control w-full">
            <span className="label-text">Select Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input input-bordered w-full"
            />
          </label>

          {loadingSlots ? (
            <p className="text-base-content/60">Loading slots...</p>
          ) : slots.length === 0 ? (
            <p className="text-base-content/60">No slots available for this date.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`btn btn-sm ${
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
            className="btn btn-success w-full"
          >
            Confirm Booking
          </button>

          {status && <p className="text-sm text-center mt-2">{status}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookServiceModal;