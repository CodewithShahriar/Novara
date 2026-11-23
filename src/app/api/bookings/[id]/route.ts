import { NextResponse } from 'next/server';
import { getBookingByRef, cancelBooking } from '@/lib/data-service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = await getBookingByRef(id);

    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve booking' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await cancelBooking(id);

    return NextResponse.json({ success, message: 'Booking successfully cancelled' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}
