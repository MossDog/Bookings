export interface Service {
    id?: number;
    name: string;
    description: string;
    price: number;
    category?: string;
    duration: number;
    user_id: string;
    seller_id: string; // UUID of the seller
  }

export interface Seller {
    id: number;
    description: string;
    name: string;
    category: string;
    email: string;
    address: string;
    user_id: string;
    seller_id: string; // UUID of the seller
    created_at: string;
    timezone: string;
}

export interface WorkingHours {
  day_of_week: number; // 0 = Sunday, 6 = Saturday
  start_time: string;  // "09:00"
  end_time: string;    // "17:00"
  seller_id: string;
}

export interface Break {
  seller_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface Holiday {
  seller_id: string;
  date: string; // ISO format: "2025-06-14"
}

export interface Booking {
  id: string;
  seller_id: string;
  seller_name: string;
  user_id: string;
  start_time: string; // ISO string: "2025-06-14T14:30:00Z"
  end_time: string;
  service_name: string;
  status: "pending" | "confirmed" | "cancelled";
}

export interface Slot {
  start: Date;
  end: Date;
}