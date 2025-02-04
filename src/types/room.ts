export interface Room {
  id: string;
  room_number: string;
  type: 'single' | 'double' | 'suite';
  price_per_night: number;
  status: 'available' | 'occupied' | 'maintenance';
  floor: number;
  amenities: string[];
  description: string;
  image_url?: string;
}

export interface Booking {
  id: string;
  user_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_price: number;
  created_at: string;
  guest_count: number;
  special_requests?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  room_number: string | null;
  check_in_date: string | null;
  status: 'checked-in' | 'checked-out';
  pending_requests: number;
} 