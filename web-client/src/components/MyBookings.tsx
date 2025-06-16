import { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import { DateTime } from "luxon";
import { toast } from "sonner";

export default function MyBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
  
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
  
      if (authError || !user) {
        toast.error("Authentication error");
        setLoading(false);
        return;
      }
  
      console.log("Authenticated user ID:", user.id); // ✅ Add this
  
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          start_time,
          end_time,
          status,
          seller (
            id,
            name,
            business_name
          ),
          service (
            id,
            name,
            price
          )
        `)
        .eq("user_id", user.id) // Compare this to what's stored in your table
        .order("start_time", { ascending: true });
  
      console.log("Fetched bookings:", data); // ✅ Add this
  
      if (error) {
        toast.error("Failed to fetch bookings");
        setLoading(false);
        return;
      }
  
      setBookings(data);
      setLoading(false);
    };
  
    fetchBookings();
  }, []);

  if (loading) return <p>Loading your bookings...</p>;

  return (
    <div className="space-y-4">
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking.id}
            className="p-4 border rounded-lg shadow-sm flex flex-col gap-1"
          >
            <h2 className="text-lg font-semibold">
              {booking.service?.name || "Unnamed service"}
            </h2>

            <p className="text-sm text-gray-700">
              {DateTime.fromISO(booking.start_time).toLocaleString(
                DateTime.DATETIME_MED
              )}{" "}
              –{" "}
              {DateTime.fromISO(booking.end_time).toLocaleString(
                DateTime.TIME_SIMPLE
              )}
            </p>

            <p className="text-sm">Status: {booking.status}</p>

            <p className="text-sm text-gray-600">
              With: {booking.seller?.business_name || booking.seller?.name}
            </p>

            <button
              className="mt-2 w-fit text-blue-600 underline text-sm"
              onClick={() => {
                window.location.href = `/seller/${booking.seller?.id}`;
              }}
            >
              Visit business page
            </button>
          </div>
        ))
      )}
    </div>
  );
}