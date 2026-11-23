import { NextResponse } from 'next/server';
import { getAllBuses } from '@/lib/data-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from') || undefined;
    const to = searchParams.get('to') || undefined;
    const date = searchParams.get('date') || undefined;

    const buses = await getAllBuses(from, to, date);
    return NextResponse.json({ success: true, data: buses });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve buses' },
      { status: 500 }
    );
  }
}
