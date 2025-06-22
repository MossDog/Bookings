import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { Booking } from "@/types/types";
import UserBookingCard from "@/components/UserBookingCard";
import { fetchUserBookings } from "@/utils/bookings";

export default function ViewUserBookings() {
  const user = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetchUserBookings(user.id)
      .then((data) => setBookings(data))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">My Bookings</h1>
          <p className="text-base-content/70 mt-2">Manage your upcoming reservations</p>
        </div>

        {loading ? (
          <p className="text-center text-base-content/60">Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-base-content/60">No bookings found.</p>
        ) : (
          <div className="space-y-6">
            {bookings.map((b) => (
              <UserBookingCard key={b.id} booking={b} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}