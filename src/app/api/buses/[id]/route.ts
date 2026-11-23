import { NextResponse } from 'next/server';
import { getBusById } from '@/lib/data-service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bus = await getBusById(id);

    if (!bus) {
      return NextResponse.json({ success: false, error: 'Bus not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: bus });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bus' },
      { status: 500 }
    );
  }
}
