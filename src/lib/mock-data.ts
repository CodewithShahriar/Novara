import { BusDetails, SeatData, BookingRecord } from './types';

export const CITIES = [
  'Neo-San Francisco',
  'Cyber-Seattle',
  'Neo-Tokyo Bay',
  'Metro Los Angeles',
  'Silicon Austin',
  'Neo-Chicago Transit',
  'Vegas SkyPort',
  'Denver HyperHub'
];

export function generateSeatsForBus(busId: string, basePrice: number): SeatData[] {
  const seats: SeatData[] = [];
  const rowsCount = 7; // 7 rows x 4 seats = 28 luxury seats
  
  // Specific pre-booked seats for realistic demonstration
  const preBookedMap: Record<string, string[]> = {
    'bus-1': ['1B', '2D', '4A', '5C', '6B'],
    'bus-2': ['1A', '3B', '3C', '6A'],
    'bus-3': ['2A', '2B', '5D', '7C'],
    'bus-4': ['1D', '4C', '7A', '7B'],
  };

  const bookedList = preBookedMap[busId] || ['2B', '4C', '6A'];

  const colNames = ['A', 'B', 'C', 'D'];
  // Coordinates in Three.js bus coordinate space:
  // Perfectly aligned with window walls (no gap) and standard center aisle:
  // X: -0.92 (Window Left), -0.38 (Aisle Left), +0.38 (Aisle Right), +0.92 (Window Right)
  const xCoords = [-0.92, -0.38, 0.38, 0.92];
  // Z starts behind front cockpit cabin (-3.4) and steps comfortably backward
  const zStart = -3.4;
  const zStep = 1.25;

  for (let r = 1; r <= rowsCount; r++) {
    const zPos = zStart + (r - 1) * zStep;
    
    for (let c = 0; c < 4; c++) {
      const seatNumber = `${r}${colNames[c]}`;
      const isWindow = c === 0 || c === 3;
      const isBooked = bookedList.includes(seatNumber);
      
      let tier: SeatData['tier'] = 'Standard';
      let price = basePrice;
      let features = ['Ergonomic Memory Foam', 'High-speed Wi-Fi 7', 'USB-C 100W PD'];

      if (r <= 2) {
        tier = 'Executive VIP';
        price = Math.round(basePrice * 1.45);
        features = [
          'Ultra-Luxury Zero-G Recliner 170°',
          'Active Noise Cancelling Sound Pods',
          'Private 14" OLED 4K Touch Display',
          'Complimentary Molecular Gourmet Snacks',
          'Ultrasonic Neck Massager'
        ];
      } else if (isWindow) {
        tier = 'Panorama Window';
        price = Math.round(basePrice * 1.2);
        features = [
          'Smart Electrochromic Tint Window',
          'Panorama HUD Augmented Reality View',
          'Magnetic Tray Table & Laptop Stand',
          'Dedicated Ambient Reading Beam'
        ];
      } else if (r <= 5) {
        tier = 'Cyber Business';
        price = Math.round(basePrice * 1.1);
        features = [
          'High-Density Workstation Table',
          'Privacy Wing Headrest',
          'Wireless Inductive Qi Fast Charger'
        ];
      }

      seats.push({
        id: `${busId}-seat-${seatNumber}`,
        seatNumber,
        row: r,
        col: c,
        tier,
        price,
        isBooked,
        isWindow,
        features,
        position: [xCoords[c], 0.35, zPos],
      });
    }
  }

  return seats;
}

export const INITIAL_BUSES: BusDetails[] = [
  {
    id: 'bus-1',
    name: 'CyberCruiser GT Alpha',
    operator: 'Novara Premier AeroLine',
    model: 'NC-9000 Autonomous EV',
    type: 'Executive Biometric Sleeper',
    totalSeats: 28,
    availableSeats: 23,
    basePrice: 85,
    rating: 4.95,
    reviewsCount: 342,
    departureTime: '08:30 AM',
    arrivalTime: '01:45 PM',
    duration: '5h 15m',
    fromCity: 'Neo-San Francisco',
    toCity: 'Metro Los Angeles',
    date: '2026-11-25',
    amenities: [
      'Wi-Fi 7 Starlink',
      'Zero-G Reclining Seats',
      'HEPA H14 Ionized Air',
      '4K OLED Entertainment',
      'Complimentary Refreshments',
      'Ultra-Silent MagDrive'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    seats: generateSeatsForBus('bus-1', 85),
    features: {
      electricAutonomous: true,
      panoramicRoof: true,
      hepaFilterAir: true,
      noiseCancellingCabin: true,
      fastChargePorts: true,
    }
  },
  {
    id: 'bus-2',
    name: 'Quantum Lounge HyperCoach',
    operator: 'Aether Dynamics Transit',
    model: 'AD-HyperLiner V3',
    type: 'Ultra-Luxury VIP Express',
    totalSeats: 28,
    availableSeats: 24,
    basePrice: 110,
    rating: 4.98,
    reviewsCount: 489,
    departureTime: '10:15 AM',
    arrivalTime: '02:30 PM',
    duration: '4h 15m',
    fromCity: 'Neo-Seattle',
    toCity: 'Silicon Austin',
    date: '2026-11-25',
    amenities: [
      'Wi-Fi 7 Starlink',
      'Smart Glass Sunroof',
      'Molecular Barista Bar',
      'Biometric Climate Control',
      'Private Audio Spheres'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80',
    seats: generateSeatsForBus('bus-2', 110),
    features: {
      electricAutonomous: true,
      panoramicRoof: true,
      hepaFilterAir: true,
      noiseCancellingCabin: true,
      fastChargePorts: true,
    }
  },
  {
    id: 'bus-3',
    name: 'Apex SkyLiner BioDrive',
    operator: 'Chronos Transit Systems',
    model: 'Apex-Bio 750',
    type: 'Cyber Business Suite',
    totalSeats: 28,
    availableSeats: 24,
    basePrice: 75,
    rating: 4.88,
    reviewsCount: 215,
    departureTime: '02:00 PM',
    arrivalTime: '07:30 PM',
    duration: '5h 30m',
    fromCity: 'Neo-San Francisco',
    toCity: 'Metro Los Angeles',
    date: '2026-11-25',
    amenities: [
      'High-Speed Wi-Fi',
      'Individual Work Desks',
      'USB-C 100W PD Outlets',
      'Restroom & Powder Room',
      'Noise-Canceling Acoustic Pod'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&w=1200&q=80',
    seats: generateSeatsForBus('bus-3', 75),
    features: {
      electricAutonomous: true,
      panoramicRoof: false,
      hepaFilterAir: true,
      noiseCancellingCabin: true,
      fastChargePorts: true,
    }
  },
  {
    id: 'bus-4',
    name: 'Stellar Horizon NightVoyager',
    operator: 'Lumina TransGlobal',
    model: 'Stellar NV-10X',
    type: 'Night Sleeper Capsule',
    totalSeats: 28,
    availableSeats: 24,
    basePrice: 95,
    rating: 4.92,
    reviewsCount: 310,
    departureTime: '11:00 PM',
    arrivalTime: '06:00 AM',
    duration: '7h 00m',
    fromCity: 'Vegas SkyPort',
    toCity: 'Neo-San Francisco',
    date: '2026-11-26',
    amenities: [
      'Starlight Ceiling Projection',
      'Full Flat Bed Convertibility',
      'Sleep Induction Soundscapes',
      'Organic Silk Duvet & Pillows',
      'Wakeup Espresso Service'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&w=1200&q=80',
    seats: generateSeatsForBus('bus-4', 95),
    features: {
      electricAutonomous: true,
      panoramicRoof: true,
      hepaFilterAir: true,
      noiseCancellingCabin: true,
      fastChargePorts: true,
    }
  }
];

export const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: 'booking-1',
    bookingRef: 'NOV-849201',
    busId: 'bus-1',
    busName: 'CyberCruiser GT Alpha',
    operator: 'Novara Premier AeroLine',
    model: 'NC-9000 Autonomous EV',
    fromCity: 'Neo-San Francisco',
    toCity: 'Metro Los Angeles',
    departureTime: '08:30 AM',
    arrivalTime: '01:45 PM',
    journeyDate: '2026-11-25',
    passengerName: 'Alex Mercer',
    passengerEmail: 'alex.mercer@cybernet.io',
    passengerPhone: '+1 (555) 019-2834',
    seats: ['1B', '2D'],
    totalPrice: 205,
    status: 'CONFIRMED',
    paymentMethod: 'CyberPay Instant',
    paymentStatus: 'PAID',
    createdAt: '2026-11-22T14:20:00Z',
    qrCodeData: 'NOV-849201|ALEX_MERCER|BUS-1|1B,2D|PAID'
  },
  {
    id: 'booking-2',
    bookingRef: 'NOV-621948',
    busId: 'bus-2',
    busName: 'Quantum Lounge HyperCoach',
    operator: 'Aether Dynamics Transit',
    model: 'AD-HyperLiner V3',
    fromCity: 'Neo-Seattle',
    toCity: 'Silicon Austin',
    departureTime: '10:15 AM',
    arrivalTime: '02:30 PM',
    journeyDate: '2026-11-28',
    passengerName: 'Dr. Elena Rostova',
    passengerEmail: 'elena.rostova@synapse.tech',
    passengerPhone: '+1 (555) 482-9102',
    seats: ['1A'],
    totalPrice: 160,
    status: 'CONFIRMED',
    paymentMethod: 'Encrypted Credit Card',
    paymentStatus: 'PAID',
    createdAt: '2026-11-21T09:45:00Z',
    qrCodeData: 'NOV-621948|ELENA_ROSTOVA|BUS-2|1A|PAID'
  }
];
