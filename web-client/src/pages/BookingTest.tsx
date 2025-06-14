import React, { useState } from "react";
import { getAvailableSlots } from "../utils/availabilityUtils";
import { bookSlot } from "../utils/bookingsUtils";

const TestAvailability: React.FC = () => {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [error, setError] = useState("");

  const sellerId = "01019cd6-a1f1-404c-887c-da0a1fbd0b01";
  const userId = "01019cd6-a1f1-404c-887c-da0a1fbd0b01"; // Replace this with actual logged-in user ID
  const serviceId = 8; // Replace with actual service ID you want to test

  const date = new Date("2025-06-17");

  const handleFetchSlots = async () => {
    setLoading(true);
    setError("");
    setBookingMessage("");
    setSlots([]);

    try {
      const availableSlots = await getAvailableSlots(sellerId, date);
      setSlots(availableSlots);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleBookSlot = async (slot: string) => {
    setBookingMessage("Booking...");
    const result = await bookSlot(sellerId, userId, serviceId, date, slot);
    setBookingMessage(result.message);
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Test Availability</h2>

      <button className="btn btn-primary" onClick={handleFetchSlots} disabled={loading}>
        {loading ? "Loading..." : "Fetch Available Slots"}
      </button>

      {error && <p className="text-error">{error}</p>}
      {bookingMessage && <p className="text-success">{bookingMessage}</p>}

      <div className="mt-4 space-y-2">
        {slots.length > 0 ? (
          slots.map((slot, idx) => (
            <div key={idx} className="flex items-center justify-between bg-base-200 p-2 rounded">
              <span>{slot}</span>
              <button
                className="btn btn-sm btn-accent"
                onClick={() => handleBookSlot(slot)}
              >
                Book
              </button>
            </div>
          ))
        ) : (
          !loading && <p className="text-base-content/60">No slots found.</p>
        )}
      </div>
    </div>
  );
};

export default TestAvailability;