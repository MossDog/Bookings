import { Booking } from "@/types/types";
import {
  AlertTriangle,
  Calendar,
  CheckSquare,
  Clock,
  XCircle,
} from "lucide-react";
import { DateTime } from "luxon";

interface BookingDetailsModalProps {
  handleStatusChange: (
    bookingId: number,
    newStatus: "confirmed" | "cancelled",
  ) => void;
  getServiceName: (serviceId: number) => string;
  setSelectedBooking: React.Dispatch<React.SetStateAction<Booking | null>>;
  selectedBooking: Booking;
}

export default function BookingDetailsModal({
  handleStatusChange,
  getServiceName,
  setSelectedBooking,
  selectedBooking,
}: BookingDetailsModalProps) {
  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Booking Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-base-200 p-4 rounded-lg">
              <h4 className="font-semibold text-base-content/70 mb-2">
                Booking Info
              </h4>
              <p>
                <span className="font-medium">Service:</span>{" "}
                {getServiceName(selectedBooking.service_id)}
              </p>
              <p>
                <span className="font-medium">Reference:</span>{" "}
                {selectedBooking.id}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-medium">Status:</span>
                <div
                  className={`badge ${
                    selectedBooking.status === "confirmed"
                      ? "badge-success"
                      : selectedBooking.status === "pending"
                        ? "badge-warning"
                        : "badge-error"
                  }`}
                >
                  {selectedBooking.status}
                </div>
              </div>
            </div>

            <div className="bg-base-200 p-4 rounded-lg">
              <h4 className="font-semibold text-base-content/70 mb-2">
                Customer Info
              </h4>
              <p>
                <span className="font-medium">User ID:</span>{" "}
                {selectedBooking.user_id}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-base-200 p-4 rounded-lg">
              <h4 className="font-semibold text-base-content/70 mb-2">
                Date & Time
              </h4>
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {DateTime.fromISO(selectedBooking.start_time).toFormat(
                    "cccc, dd LLLL yyyy",
                  )}
                </span>
              </p>
              <p className="flex items-center gap-2 mt-2">
                <Clock className="w-4 h-4" />
                <span>
                  {DateTime.fromISO(selectedBooking.start_time).toFormat(
                    "HH:mm",
                  )}{" "}
                  -{" "}
                  {DateTime.fromISO(selectedBooking.end_time).toFormat("HH:mm")}
                </span>
              </p>
            </div>

            <div className="bg-base-200 p-4 rounded-lg">
              <h4 className="font-semibold text-base-content/70 mb-2">
                Actions
              </h4>
              <div className="space-y-2">
                {selectedBooking.status === "pending" && (
                  <button
                    className="btn btn-success btn-block"
                    onClick={() =>
                      handleStatusChange(selectedBooking.id, "confirmed")
                    }
                  >
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Confirm Booking
                  </button>
                )}

                {selectedBooking.status !== "cancelled" && (
                  <button
                    className="btn btn-outline btn-error btn-block"
                    onClick={() =>
                      handleStatusChange(selectedBooking.id, "cancelled")
                    }
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel Booking
                  </button>
                )}

                {selectedBooking.status === "cancelled" && (
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
          <button className="btn" onClick={() => setSelectedBooking(null)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
