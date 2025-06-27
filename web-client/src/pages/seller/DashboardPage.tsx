import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useUser } from "@supabase/auth-helpers-react";
import { Booking, BookingStatus, Seller, Service } from "@/types/types";
import { useNavigate } from "react-router-dom";
import { fetchAllSellerData } from "@/utils/seller";
import BookingsList from "@/components/dashboard/BookingsList";
import BookingStatsSummary from "@/components/dashboard/BookingStatsSummary";
import QuickActions from "@/components/dashboard/QuickActions";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import BookingDetailsModal from "@/components/dashboard/BookingDetailsModal";
import { updateBookingStatus } from "@/utils/bookings";
import BusinessQrCode from "@/components/QRCodeWidget";

export default function DashboardPage() {
  const user = useUser();
  const [seller, setSeller] = useState<Seller>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    if (!user) {
      console.log("User not authenticated");
      return;
    }

    fetchAllSellerData(user.id)
      .then((data) => {
        if (!data.seller) {
          console.log("Seller not found");
          setIsLoading(false);
          navigate("/");
          return;
        }

        setSeller(data.seller);
        setBookings(data.bookings);
        setServices(data.services);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [user, navigate]);

  const getServiceName = (serviceId: number) => {
    const service = services.find((s) => s.id === serviceId);
    return service ? service.name : "Unknown Service";
  };

  const handleStatusChange = async (bookingId: number, newStatus: BookingStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );

      if (selectedBooking?.id === bookingId) {
        setSelectedBooking(null);
      }
    } catch (err) {
      console.error("Error updating booking status:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-base-200 min-h-[calc(100vh-64px)]">
        <div className="container mx-auto p-4">
          {seller && <DashboardHeader bookings={bookings} seller={seller} />}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <QuickActions />
              <BookingStatsSummary bookings={bookings} />
              {seller && <BusinessQrCode seller={seller} />}
            </div>

            <BookingsList
              bookings={bookings}
              isLoading={isLoading}
              setSelectedBooking={setSelectedBooking}
              handleStatusChange={handleStatusChange}
              getServiceName={getServiceName}
            />
          </div>
        </div>
      </div>

      {selectedBooking && (
        <BookingDetailsModal
          handleStatusChange={handleStatusChange}
          getServiceName={getServiceName}
          selectedBooking={selectedBooking}
          setSelectedBooking={setSelectedBooking}
        />
      )}
    </>
  );
}