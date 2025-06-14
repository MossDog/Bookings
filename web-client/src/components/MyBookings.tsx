import { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import { DateTime } from "luxon";
import { toast } from "sonner";
import { cancelBooking } from "../utils/cancelBookingUtil";

interface Booking {
  id: number;
  start_time: string;
  end_time: string;
  status: string;
  service_name: string;
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleCancel = async (id: number) => {
    const res = await cancelBooking(id);
    if (res.success) {
      toast.success(res.message);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
      );
    } else {
      toast.error(res.message);
    }
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
            className="p-4 border border-base-300 rounded-xl shadow flex justify-between items-start"
          >
            <div>
              <p className="font-semibold">{b.service_name || "Unnamed Service"}</p>
              <p className="text-sm text-base-content/60">
                {DateTime.fromISO(b.start_time).toLocaleString(DateTime.DATETIME_MED)} →{" "}
                {DateTime.fromISO(b.end_time).toLocaleString(DateTime.TIME_SIMPLE)}
              </p>
              <p
                className={`text-sm mt-1 ${
                  b.status === "cancelled" ? "text-error" : "text-success"
                }`}
              >
                {b.status.toUpperCase()}
              </p>
            </div>

            {b.status !== "cancelled" && (
              <button
                onClick={() => handleCancel(b.id)}
                className="btn btn-warning btn-sm rounded-xl"
              >
                Cancel
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}