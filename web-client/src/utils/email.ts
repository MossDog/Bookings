import axios from "axios";
import { Booking, Seller, Service } from "@/types/types";

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;

export async function sendBookingConfirmation(
  userEmail: string,
  booking: Booking,
  service: Service,
  seller: Seller
) {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #111827;">Booking Confirmed</h2>
        <p>Thank you for booking <strong>${service.name}</strong> at <strong>${seller.name}</strong>.</p>
        <p><strong>Date:</strong> ${new Date(booking.start_time).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        <p><strong>Duration:</strong> ${service.duration} min</p>
        <hr style="margin: 16px 0;" />
        <p style="font-size: 12px; color: #6b7280;">If you need to cancel, please contact ${seller.name} directly.</p>
      </div>
    `;

    await axios.post(
      "https://api.resend.com/emails",
      {
        from: "Bookeo <onboarding@resend.dev>",
        to: userEmail,
        subject: `Booking Confirmation - ${seller.name}`,
        html,
      },
      {
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
      }
    );

    console.log("Booking confirmation email sent");
  } catch (err) {
    console.error("Failed to send booking confirmation email:", err);
  }
}