import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useUser } from "@supabase/auth-helpers-react";
import { Booking, BookingStatus, Seller, Service } from "@/types/types";
import { useNavigate } from "react-router-dom";
import { fetchAllSellerData } from "@/utils/seller";
import BookingsList from "@/components/dashboard/BookingsList";
import BookingStatsSummary from "@/components/dashboard/BookingStatsSummary";
import QuickActions, { QuickAction } from "@/components/dashboard/QuickActions";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { updateBookingStatus } from "@/utils/bookings";
import EditWidgets from "@/components/dashboard/EditWidgets";

export default function DashboardPage() {
  const user = useUser();
  const [seller, setSeller] = useState<Seller>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  
  const [selectedAction, setSelectedAction] = useState<QuickAction>("bookingsList");

  const navigate = useNavigate();

  // Fetch seller data and bookings
  useEffect(() => {
    setIsLoading(true);

    if (!user) {
      console.log("User not authenticated");
      return;
    }

    fetchAllSellerData(user.id)
      .then(data => {
        if (!data.seller) {
          console.log("Seller not found");
          setIsLoading(false);
          navigate("/");
        }

        setSeller(data.seller);
        setBookings(data.bookings);
        setServices(data.services);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [user]);
  
  
  
  // Get service name by ID
  const getServiceName = (serviceId: number) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : "Unknown Service";
  };
  
  // Handle booking status change
  const handleStatusChange = async (bookingId: number, newStatus: BookingStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);

      setBookings(bookings.map(booking => {
        if (booking.id === bookingId) {
          return { ...booking, status: newStatus };
        }
        return booking;
      }));
      
    } catch (err) {
      console.error("Error updating booking status:", err);
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className=" flex-1 flex flex-col mb-10">
        <div className="container mx-auto p-4 w-full h-full flex-1 flex flex-col">
          {/* Dashboard Header */}
          <DashboardHeader bookings={bookings} seller={seller} />
          
          {/* Main Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full flex-1 ">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <QuickActions 
                currentAction={selectedAction}
                onChange={(val) => setSelectedAction(val)}
              />
              <BookingStatsSummary bookings={bookings} />
            </div>
            
            {/* Dashboard Content */}
            { selectedAction === "bookingsList" && (
              <BookingsList 
                bookings={bookings}
                isLoading={isLoading}
                handleStatusChange={handleStatusChange}
                getServiceName={getServiceName}
              />
            )}
            
            { selectedAction === "widgets" && seller && (
              <EditWidgets 
                seller={seller}
                enabledWidgets={seller.widget_order}
              />
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
