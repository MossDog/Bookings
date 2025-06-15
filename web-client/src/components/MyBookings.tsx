import { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import { DateTime } from "luxon";
import { toast } from "sonner";
import { Booking } from "@/types/types";
import MyBookingsModal from "./MyBookingsModal";

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        toast.error("Authentication error");
        return;
      }

      const { data, error } = await supabase
        .from("bookings")
        .select("id, start_time, end_time, status, service_name")
        .eq("user_id", user.id)
        .order("start_time", { ascending: true });

      if (error) {
        toast.error("Failed to fetch bookings");
      } else {
        setBookings(data as Booking[]);
      }

      setLoading(false);
    };

    fetchBookings();
  }, []);

  const handleCancelSuccess = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
    );
  };

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold text-center">My Bookings</h1>

      {loading ? (
        <p className="text-center text-base-content/60">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-base-content/60">No bookings found.</p>
      ) : (
        bookings.map((b) => (
          <div
            key={b.id}
            onClick={() => setSelectedBooking(b)}
            className="p-4 border border-base-300 rounded-xl shadow cursor-pointer hover:bg-base-100 transition"
          >
            <div>
              <p className="font-semibold">{b.service_name || "Unnamed Service"}</p>
              <p className="text-sm text-base-content/60">
                {DateTime.fromISO(b.start_time).toLocaleString(DateTime.DATETIME_MED)} →{" "}
                {DateTime.fromISO(b.end_time).toLocaleString(DateTime.TIME_SIMPLE)}
              </p>
              <p
                className={`text-sm mt-1 ${
                  b.status === "cancelled" ? "text-error" : "text-primary"
                }`}
              >
                {b.status.toUpperCase()}
              </p>
            </div>
          </div>
        ))
      )}

      {/* Booking detail modal */}
      {selectedBooking && (
        <MyBookingsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onCancelSuccess={handleCancelSuccess}
        />
      )}
    </div>
  );
}