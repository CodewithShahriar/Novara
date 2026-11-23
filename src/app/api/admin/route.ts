import { NextResponse } from 'next/server';
import { getAllBuses, getAllBookings, updateSeatStatus } from '@/lib/data-service';

export async function GET() {
  try {
    const buses = await getAllBuses();
    const bookings = await getAllBookings();

    const totalRevenue = bookings.reduce((sum, b) => (b.status === 'CONFIRMED' ? sum + b.totalPrice : sum), 0);
    const activeBookings = bookings.filter((b) => b.status === 'CONFIRMED').length;
    const totalFleetSeats = buses.reduce((sum, b) => sum + b.totalSeats, 0);
    const totalAvailableSeats = buses.reduce((sum, b) => sum + b.availableSeats, 0);
    const occupancyRate = totalFleetSeats > 0 ? Math.round(((totalFleetSeats - totalAvailableSeats) / totalFleetSeats) * 100) : 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        activeBookings,
        fleetCount: buses.length,
        occupancyRate,
      },
      buses,
      bookings,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Admin error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, busId, seatNumber, isBooked } = body;

    if (action === 'TOGGLE_SEAT') {
      await updateSeatStatus(busId, seatNumber, isBooked);
      return NextResponse.json({ success: true, message: `Seat ${seatNumber} status updated` });
    }

    return NextResponse.json({ success: false, error: 'Unknown admin action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Admin action failed' }, { status: 500 });
  }
}
