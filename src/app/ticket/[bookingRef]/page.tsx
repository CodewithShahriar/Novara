'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, LayoutDashboard } from 'lucide-react';
import { BookingRecord } from '@/lib/types';
import { INITIAL_BOOKINGS } from '@/lib/mock-data';
import DigitalTicketCard from '@/components/tickets/DigitalTicketCard';

export default function TicketPage({
  params,
}: {
  params: Promise<{ bookingRef: string }>;
}) {
  const resolvedParams = use(params);
  const bookingRef = resolvedParams.bookingRef;

  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTicket() {
      try {
        const res = await fetch(`/api/bookings/${bookingRef}`);
        const data = await res.json();
        if (data.success && data.data) {
          setBooking(data.data);
        } else {
          const fallback = INITIAL_BOOKINGS[0];
          setBooking({ ...fallback, bookingRef });
        }
      } catch (err) {
        const fallback = INITIAL_BOOKINGS[0];
        setBooking({ ...fallback, bookingRef });
      } finally {
        setLoading(false);
      }
    }

    loadTicket();
  }, [bookingRef]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071526] flex flex-col items-center justify-center text-slate-400">
        <div className="w-10 h-10 border-3 border-[#B48C56] border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs font-semibold uppercase tracking-widest text-[#D8B788]">Loading Boarding Pass...</span>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#071526] flex flex-col items-center justify-center text-white p-4">
        <h2 className="text-xl font-bold mb-2">Ticket Not Found</h2>
        <p className="text-xs text-slate-500 mb-6 font-mono">Reference: {bookingRef}</p>
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#A67C41] via-[#8B6226] to-[#694416] hover:from-[#B5894B] text-white font-bold text-xs uppercase tracking-wider shadow-lg border border-[#E0BE86]/35"
        >
          Go to My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071526] py-8 sm:py-12 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Status Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 no-print">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#D8B788] hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>My Bookings</span>
          </Link>

          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirmed & Boarding Guaranteed</span>
          </div>
        </div>

        {/* Boarding Pass Card */}
        <DigitalTicketCard booking={booking} />

        {/* Post Booking Actions */}
        <div className="mt-8 text-center no-print">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <LayoutDashboard className="w-4 h-4 text-[#D8B788]" />
            <span>View All Trips in My Bookings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
