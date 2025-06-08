export interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
  }

export interface Seller {
    id: number;
    description: string;
    name: string;
    category: string;
    email: string;
    address: string;
    user_id: string;
    created_at: string;
}