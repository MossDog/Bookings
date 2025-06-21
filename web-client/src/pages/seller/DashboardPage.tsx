import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useUser } from "@supabase/auth-helpers-react";
import supabase from "@/utils/supabase";
import { Booking, Seller, Service } from "@/types/types";
import { Calendar, Users, Clock, Settings, CreditCard, CalendarDays, CheckSquare, XCircle, AlertTriangle } from "lucide-react";
import { DateTime } from "luxon";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const user = useUser();
  const [seller, setSeller] = useState<Seller>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  const navigate = useNavigate();

  // Fetch seller data and bookings
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        console.log("User not authenticated");
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Get seller ID
        const { data: sellerData } = await supabase
          .from('seller')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (!sellerData) {
          console.log("Seller not found");
          setIsLoading(false);
          navigate("/");
          return;
        }

        setSeller(sellerData);
        
        // Get bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .eq('seller_id', sellerData.user_id)
          .order('start_time', { ascending: true });
          
        if (bookingsError) {
          console.error("Failed to fetch bookings:", bookingsError);
        } else {
          setBookings(bookingsData || []);
        }
        
        // Get services
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .eq('user_id', user.id);
          
        if (servicesError) {
          console.error("Failed to fetch services:", servicesError);
        } else {
          setServices(servicesData || []);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  // Filter bookings based on active tab
  const filteredBookings = (() => {
    const now = new Date().toISOString();
    
    if (activeTab === 'upcoming') {
      return bookings.filter(booking => 
        booking.start_time > now && booking.status !== 'cancelled'
      );
    } else if (activeTab === 'past') {
      return bookings.filter(booking => 
        booking.start_time <= now || booking.status === 'cancelled'
      );
    } else {
      return bookings;
    }
  })();
  
  // Get service name by ID
  const getServiceName = (serviceId: number) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : "Unknown Service";
  };
  
  // Handle booking status change
  const handleStatusChange = async (bookingId: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);
      
      if (error) {
        console.error("Failed to update booking:", error);
        return;
      }
      
      // Update the local state
      setBookings(bookings.map(booking => {
        if (booking.id === bookingId) {
          return { ...booking, status: newStatus };
        }
        return booking;
      }));
      
      // Close the modal if open
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
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-base-content">Seller Dashboard</h1>
              <p className="text-base-content/70 mt-1">Manage your bookings and services</p>
            </div>
            
            <div className="stats shadow bg-base-100">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <Users className="w-8 h-8" />
                </div>
                <div className="stat-title">Total Bookings</div>
                <div className="stat-value text-primary">{bookings.length}</div>
              </div>
              
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <Calendar className="w-8 h-8" />
                </div>
                <div className="stat-title">Today</div>
                <div className="stat-value text-secondary">
                  {bookings.filter(b => 
                    DateTime.fromISO(b.start_time).hasSame(DateTime.now(), 'day') && 
                    b.status !== 'cancelled'
                  ).length}
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-base-100 rounded-box shadow-lg overflow-hidden">
                <div className="bg-primary text-primary-content p-4">
                  <h2 className="text-xl font-bold">Quick Actions</h2>
                </div>
                <ul className="menu bg-base-100 w-full p-2 rounded-box">
                  <li>
                    <a className="flex items-center gap-3">
                      <Calendar className="w-5 h-5" />
                      <span>View Calendar</span>
                    </a>
                  </li>
                  <li>
                    <a className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5" />
                      <span>Manage Services</span>
                    </a>
                  </li>
                  <li>
                    <a className="flex items-center gap-3">
                      <CalendarDays className="w-5 h-5" />
                      <span>Opening Hours</span>
                    </a>
                  </li>
                  <li>
                    <a className="flex items-center gap-3">
                      <Settings className="w-5 h-5" />
                      <span>Settings</span>
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Stats Summary */}
              <div className="mt-6 bg-base-100 rounded-box shadow-lg p-4">
                <h3 className="font-bold mb-4">Booking Stats</h3>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm flex items-center gap-1">
                    <CheckSquare className="w-4 h-4 text-success" />
                    Confirmed
                  </span>
                  <span className="font-semibold">
                    {bookings.filter(b => b.status === 'confirmed').length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4 text-warning" />
                    Pending
                  </span>
                  <span className="font-semibold">
                    {bookings.filter(b => b.status === 'pending').length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-1">
                    <XCircle className="w-4 h-4 text-error" />
                    Cancelled
                  </span>
                  <span className="font-semibold">
                    {bookings.filter(b => b.status === 'cancelled').length}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Bookings List */}
            <div className="lg:col-span-3">
              <div className="bg-base-100 rounded-box shadow-lg overflow-hidden">
                <div className="bg-base-200 p-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-base-content">Bookings</h2>
                  <div className="tabs tabs-boxed bg-base-300">
                    <a 
                      className={`tab ${activeTab === 'upcoming' ? 'tab-active' : ''}`}
                      onClick={() => setActiveTab('upcoming')}
                    >
                      Upcoming
                    </a>
                    <a 
                      className={`tab ${activeTab === 'past' ? 'tab-active' : ''}`}
                      onClick={() => setActiveTab('past')}
                    >
                      Past
                    </a>
                    <a 
                      className={`tab ${activeTab === 'all' ? 'tab-active' : ''}`}
                      onClick={() => setActiveTab('all')}
                    >
                      All
                    </a>
                  </div>
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                  </div>
                ) : filteredBookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                    <Calendar className="w-16 h-16 text-base-300 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No {activeTab} bookings found</h3>
                    <p className="text-base-content/70 max-w-md">
                      {activeTab === 'upcoming' 
                        ? "You don't have any upcoming bookings at the moment." 
                        : activeTab === 'past' 
                        ? "You don't have any past bookings yet."
                        : "You don't have any bookings yet."}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Service</th>
                          <th>Date & Time</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.map(booking => (
                          <tr key={booking.id} className="hover">
                            <td>{booking.user_id}</td>
                            <td>{getServiceName(booking.service_id)}</td>
                            <td>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {DateTime.fromISO(booking.start_time).toFormat('dd LLL yyyy')}
                                </span>
                                <span className="text-xs text-base-content/70">
                                  {DateTime.fromISO(booking.start_time).toFormat('HH:mm')} - 
                                  {DateTime.fromISO(booking.end_time).toFormat('HH:mm')}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className={`badge ${
                                booking.status === 'confirmed' ? 'badge-success' : 
                                booking.status === 'pending' ? 'badge-warning' : 
                                'badge-error'
                              } badge-outline`}>
                                {booking.status}
                              </div>
                            </td>
                            <td>
                              <div className="flex gap-2">
                                <button 
                                  className="btn btn-xs btn-primary"
                                  onClick={() => setSelectedBooking(booking)}
                                >
                                  Details
                                </button>
                                {booking.status === 'pending' && (
                                  <button 
                                    className="btn btn-xs btn-success"
                                    onClick={() => handleStatusChange(booking.id, 'confirmed')}
                                  >
                                    Confirm
                                  </button>
                                )}
                                {booking.status !== 'cancelled' && (
                                  <button 
                                    className="btn btn-xs btn-error"
                                    onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Booking Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-base-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-base-content/70 mb-2">Booking Info</h4>
                  <p><span className="font-medium">Service:</span> {getServiceName(selectedBooking.service_id)}</p>
                  <p><span className="font-medium">Reference:</span> {selectedBooking.id}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-medium">Status:</span>
                    <div className={`badge ${
                      selectedBooking.status === 'confirmed' ? 'badge-success' : 
                      selectedBooking.status === 'pending' ? 'badge-warning' : 
                      'badge-error'
                    }`}>
                      {selectedBooking.status}
                    </div>
                  </div>
                </div>
                
                <div className="bg-base-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-base-content/70 mb-2">Customer Info</h4>
                  <p><span className="font-medium">User ID:</span> {selectedBooking.user_id}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-base-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-base-content/70 mb-2">Date & Time</h4>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> 
                    <span>{DateTime.fromISO(selectedBooking.start_time).toFormat('cccc, dd LLLL yyyy')}</span>
                  </p>
                  <p className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4" /> 
                    <span>{DateTime.fromISO(selectedBooking.start_time).toFormat('HH:mm')} - {DateTime.fromISO(selectedBooking.end_time).toFormat('HH:mm')}</span>
                  </p>
                </div>
                
                <div className="bg-base-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-base-content/70 mb-2">Actions</h4>
                  <div className="space-y-2">
                    {selectedBooking.status === 'pending' && (
                      <button 
                        className="btn btn-success btn-block"
                        onClick={() => handleStatusChange(selectedBooking.id, 'confirmed')}
                      >
                        <CheckSquare className="w-4 h-4 mr-2" />
                        Confirm Booking
                      </button>
                    )}
                    
                    {selectedBooking.status !== 'cancelled' && (
                      <button 
                        className="btn btn-outline btn-error btn-block"
                        onClick={() => handleStatusChange(selectedBooking.id, 'cancelled')}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel Booking
                      </button>
                    )}
                    
                    {selectedBooking.status === 'cancelled' && (
                      <div className="alert alert-error">
                        <AlertTriangle className="w-5 h-5" />
                        <span>This booking has been cancelled</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedBooking(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
