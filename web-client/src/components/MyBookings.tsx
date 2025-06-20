import { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import { DateTime } from "luxon";
import { toast } from "sonner";
import { Booking, Seller, Service } from "@/types/types";
import MyBookingsModal from "./MyBookingsModal";
import { getPublicUrl } from "@/utils/bucket";
import { useUser } from "@supabase/auth-helpers-react";
import { fetchServices, getSellers } from "@/utils/seller";

export interface BookingWithDetails extends Booking {
  service?: Service;
  seller?: Seller;
}

export default function MyBookings() {
  const user = useUser();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        toast.error("Authentication error");
        return;
      }
  
      const { data: bookingsData, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("start_time", { ascending: true });
  
      if (error) {
        toast.error("Failed to fetch bookings");
        setLoading(false);
        return;
      }
  
      const sellers = await getSellers();
  
      // Get unique seller_ids from bookings
      const sellerIds = [...new Set((bookingsData || []).map(b => b.seller_id))];
  
      // Fetch all services for each seller
      const allServices: Service[] = [];
      for (const sellerId of sellerIds) {
        const { data: sellerServices } = await fetchServices(sellerId);
        allServices.push(...(sellerServices || []));
      }
  
      const enhanced: BookingWithDetails[] = (bookingsData || []).map((b) => ({
        ...b,
        seller: sellers.find((s) => s.user_id === b.seller_id),
        service: allServices.find((s) => s.id === b.service_id),
      }));
  
      setBookings(enhanced);
  
      const sellerId = enhanced?.[0]?.seller_id;
      if (sellerId) {
        const url = await getPublicUrl("public.images", `${sellerId}/bannerimage`);
        setBannerUrl(url || "/fallback.png");
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
            <div
              key={b.id}
              onClick={() => setSelectedBooking(b)}
              className="card card-side bg-base-100 shadow-md hover:shadow-lg transition border border-base-300 cursor-pointer"
            >
              {/* Content */}
              <div className="card-body">
                <h2 className="card-title">{b.service?.name || "Unnamed Service"}</h2>
                <p className="text-sm text-base-content/70">
                  {DateTime.fromISO(b.start_time).toLocaleString(DateTime.DATETIME_MED)} →{" "}
                  {DateTime.fromISO(b.end_time).toLocaleString(DateTime.TIME_SIMPLE)}
                </p>
                {b.service?.price !== undefined && (
                  <p className="text-sm font-medium text-base-content/80">
                    €{b.service.price.toFixed(2)}
                  </p>
                )}
                <p className="text-sm text-base-content/70">
                  Seller: {b.seller?.name || "Unknown Seller"}
                </p>
                <div
                  className={`badge ${
                    b.status === "cancelled" ? "badge-error" : "badge-primary"
                  } badge-outline mt-2`}
                >
                  {b.status.toUpperCase()}
                </div>
              </div>

              {/* Image */}
              <figure className="w-1/3 min-w-[120px] max-w-[200px] overflow-hidden">
                <img
                  src={bannerUrl || "/test_Restaurant.jpeg"}
                  alt="Business Banner"
                  className="w-full h-full object-cover"
                  onError={() => setBannerUrl("/test_Restaurant.jpeg")}
                />
              </figure>
            </div>
          ))}
        </div>
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