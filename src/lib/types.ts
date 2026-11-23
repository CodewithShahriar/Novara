export type SeatTier = 'Executive VIP' | 'Panorama Window' | 'Cyber Business' | 'Standard';
export type SeatStatus = 'AVAILABLE' | 'SELECTED' | 'BOOKED' | 'HOVERED';

export interface SeatData {
  id: string;
  seatNumber: string;
  row: number;
  col: number; // 0, 1 = Left side; 2, 3 = Right side (with aisle in between: 0,1 | aisle | 2,3)
  tier: SeatTier;
  price: number;
  isBooked: boolean;
  isWindow: boolean;
  features: string[];
  deck?: 'lower' | 'upper';
  // 3D coordinates in the bus model space:
  position: [number, number, number];
  rotation?: [number, number, number];
}

export interface BusAmenity {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface BusDetails {
  id: string;
  name: string;
  operator: string;
  model: string;
  type: string;
  totalSeats: number;
  availableSeats: number;
  basePrice: number;
  rating: number;
  reviewsCount: number;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  fromCity: string;
  toCity: string;
  date: string;
  amenities: string[];
  imageUrl: string;
  seats: SeatData[];
  features: {
    electricAutonomous: boolean;
    panoramicRoof: boolean;
    hepaFilterAir: boolean;
    noiseCancellingCabin: boolean;
    fastChargePorts: boolean;
  };
}

export interface BookingRecord {
  id: string;
  bookingRef: string;
  busId: string;
  busName: string;
  operator: string;
  model: string;
  fromCity: string;
  toCity: string;
  departureTime: string;
  arrivalTime: string;
  journeyDate: string;
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  seats: string[];
  totalPrice: number;
  status: 'CONFIRMED' | 'CANCELLED';
  paymentMethod: string;
  paymentStatus: 'PAID' | 'REFUNDED';
  createdAt: string;
  qrCodeData: string;
}

export interface SearchParams {
  from: string;
  to: string;
  date: string;
  passengers: number;
}
