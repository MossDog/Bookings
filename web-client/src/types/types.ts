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
  user_id: string;
  seller_id: string;
  start_time: string;
  end_time: string;
  status: "pending" | "confirmed" | "cancelled";
  banner_url?: string; // URL to the seller's banner image
  service?: {
    id: number;
    name: string;
    price: number;
  };
  seller?: {
    user_id: string;
    name: string;
  };
}

export interface Slot {
  start: Date;
  end: Date;
}