import { NextResponse } from 'next/server';
import { getAllBookings, createBooking } from '@/lib/data-service';

export async function GET() {
  try {
    const bookings = await getAllBookings();
    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { busId, passengerName, passengerPhone, passengerEmail, seatNumbers, totalPrice, paymentMethod, journeyDate, fromCity, toCity } = body;

    if (!busId || !passengerName || !seatNumbers || seatNumbers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required booking fields' },
        { status: 400 }
      );
    }

    const booking = await createBooking({
      busId,
      passengerName,
      passengerPhone: passengerPhone || '+1 (555) 000-0000',
      passengerEmail: passengerEmail || 'guest@novaratransit.io',
      seatNumbers,
      totalPrice: totalPrice || 85,
      paymentMethod: paymentMethod || 'CyberPay Instant',
      journeyDate,
      fromCity,
      toCity,
    });

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
