export interface Service {
  id?: number;
  name: string;
  description: string;
  price: number;
  category?: string;
  duration: number;
  user_id: string;
}

export interface Seller {
  id: number;
  description: string;
  name: string;
  category: string;
  email: string;
  address: string;
  user_id: string;
  slug: string;
  created_at: string;
  timezone: string;
  average_rating: number;
  popularity_score: number;
  widget_order?: string[];
  about_us?: string;
}

export interface WorkingHours {
  day_of_week: number; // 0 = Sunday, 6 = Saturday
  start_time: string; // "09:00"
  end_time: string; // "17:00"
  seller_id: string;
}

export interface Break {
  seller_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface Holiday {
  id: number;
  date: string;
  note: string;
  user_id: string;
}

interface BreakTime {
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  isClosed: boolean;
  openTime: string;
  closeTime: string;
  breaks: BreakTime[];
}

export type WeekSchedule = {
  [key: string]: DaySchedule;
};

export interface Booking {
  id: number;
  user_id: string;
  seller_id: number;
  service_id: number;
  start_time: string;
  end_time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export interface AllSellerData {
  seller: Seller;
  bookings: Booking[];
  services: Service[];
}

export type BookingStatus = "confirmed" | "cancelled" | "pending" | "completed";

export interface Review {
  id: string;
  booking_id: string;
  seller_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  verified: boolean;
  created_at: string;
}

// types/SellerPreview.ts
export interface SellerPreview {
  user_id: string;
  name: string;
  slug: string;
  category: string;
}

export interface DisplayReview {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
}
