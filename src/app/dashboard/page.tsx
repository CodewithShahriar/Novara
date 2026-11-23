'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Ticket,
  User,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  Bus,
  X,
} from 'lucide-react';
import { BookingRecord } from '@/lib/types';
import { INITIAL_BOOKINGS } from '@/lib/mock-data';
import DigitalTicketCard from '@/components/tickets/DigitalTicketCard';

export default function UserDashboardPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'profile'>('upcoming');
  const [cancellingRef, setCancellingRef] = useState<string | null>(null);
  const [isCancelSuccess, setIsCancelSuccess] = useState(false);
  const [selectedTicketForModal, setSelectedTicketForModal] = useState<BookingRecord | null>(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch('/api/bookings');
        const data = await res.json();
        if (data.success && data.data) {
          setBookings(data.data);
        } else {
          setBookings(INITIAL_BOOKINGS);
        }
      } catch (err) {
        setBookings(INITIAL_BOOKINGS);
      }
    }
    fetchBookings();
  }, []);

  const handleCancelBooking = async (ref: string) => {
    try {
      await fetch(`/api/bookings/${ref}`, { method: 'DELETE' });
      setBookings((prev) =>
        prev.map((b) =>
          b.bookingRef === ref ? { ...b, status: 'CANCELLED', paymentStatus: 'REFUNDED' } : b
        )
      );
      setCancellingRef(null);
      setIsCancelSuccess(true);
      setTimeout(() => setIsCancelSuccess(false), 4000);
    } catch (err) {
      setBookings((prev) =>
        prev.map((b) =>
          b.bookingRef === ref ? { ...b, status: 'CANCELLED', paymentStatus: 'REFUNDED' } : b
        )
      );
      setCancellingRef(null);
    }
  };

  const upcomingBookings = bookings.filter((b) => b.status === 'CONFIRMED');
  const pastBookings = bookings.filter((b) => b.status === 'CANCELLED');

  return (
    <div className="min-h-screen bg-[#071526] py-8 sm:py-12 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* User Profile Header Card */}
        <div className="bg-[#0B192C]/90 border border-white/10 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#B48C56]/20 border border-[#B48C56]/40 flex items-center justify-center text-[#D8B788] shadow-md">
                <User className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-white">Alex Mercer</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#B48C56]/15 border border-[#B48C56]/30 text-[#D8B788] text-xs font-bold uppercase">
                    Novara VIP Member
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  alex.mercer@novaracoach.com • Account #NOV-9941
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-[#071526] border border-white/5 text-right">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Ticket Status
                </span>
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 justify-end">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ACTIVE PASSES</span>
                </div>
              </div>

              <Link
                href="/routes"
                className="px-5 py-3 rounded-xl bg-[#B48C56] hover:bg-[#A37B47] text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg"
              >
                Book New Journey
              </Link>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {isCancelSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Booking successfully cancelled. Full refund has been initiated to your original payment method.</span>
            </div>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-[#B48C56] text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white bg-[#0B192C] border border-white/5'
            }`}
          >
            Upcoming Journeys ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'past'
                ? 'bg-[#B48C56] text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white bg-[#0B192C] border border-white/5'
            }`}
          >
            Past & Cancelled ({pastBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#B48C56] text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white bg-[#0B192C] border border-white/5'
            }`}
          >
            Traveler Profile
          </button>
        </div>

        {/* Content Tabs */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <div className="bg-[#0B192C] border border-white/10 rounded-2xl p-12 text-center">
                <Ticket className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No Upcoming Journeys</h3>
                <p className="text-xs text-slate-400 mb-6">Explore our coach schedules and reserve your seats.</p>
                <Link
                  href="/routes"
                  className="px-5 py-2.5 rounded-xl bg-[#B48C56] hover:bg-[#A37B47] text-slate-950 font-bold text-xs uppercase"
                >
                  Find Schedules
                </Link>
              </div>
            ) : (
              upcomingBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-[#0B192C] border border-white/10 rounded-2xl p-6 shadow-xl"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-[#D8B788]">
                          {b.bookingRef}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold">
                          {b.status}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {b.operator}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white">
                        {b.fromCity} → {b.toCity}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#B48C56]" />
                          {b.journeyDate}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#B48C56]" />
                          {b.departureTime}
                        </span>
                        <span>
                          Suites: <strong className="text-[#D8B788]">{b.seats.join(', ')}</strong>
                        </span>
                        <span>
                          Total: <strong className="text-white">${b.totalPrice}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedTicketForModal(b)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#071526] hover:bg-[#B48C56] hover:text-slate-950 text-white border border-white/10 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#D8B788]" />
                        <span>View Pass</span>
                      </button>

                      <button
                        onClick={() => setCancellingRef(b.bookingRef)}
                        className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-semibold text-xs transition cursor-pointer"
                        title="Cancel this booking"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'past' && (
          <div className="space-y-4">
            {pastBookings.length === 0 ? (
              <div className="bg-[#0B192C] border border-white/10 rounded-2xl p-8 text-center text-xs text-slate-400">
                No past or cancelled journeys on record.
              </div>
            ) : (
              pastBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-[#0B192C]/75 border border-white/10 rounded-2xl p-5 opacity-75"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 text-xs mb-1">
                        <span className="font-mono text-slate-400">{b.bookingRef}</span>
                        <span className="px-2 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[10px] font-bold">
                          {b.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">
                        {b.fromCity} → {b.toCity}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {b.journeyDate} • Seats: {b.seats.join(', ')} • Refund: {b.paymentStatus}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-400">${b.totalPrice}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-[#0B192C] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-white">Traveler Preferences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#071526] border border-white/5 space-y-1">
                <span className="text-slate-400 font-semibold">Seat Preference</span>
                <p className="font-bold text-white">Executive VIP Leather Suite (Window)</p>
              </div>
              <div className="p-4 rounded-xl bg-[#071526] border border-white/5 space-y-1">
                <span className="text-slate-400 font-semibold">Dietary & Refreshment</span>
                <p className="font-bold text-white">Sparkling Water & Organic Snack Pack</p>
              </div>
            </div>
          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        {cancellingRef && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
            <div className="bg-[#0B192C] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white mb-2">Cancel Reservation?</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Are you sure you want to cancel booking <strong className="text-white">{cancellingRef}</strong>? Your seats will be released back to the 3D cabin inventory immediately and a full refund will be processed.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setCancellingRef(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#071526] text-slate-300 font-semibold text-xs"
                >
                  Keep Reservation
                </button>
                <button
                  onClick={() => handleCancelBooking(cancellingRef)}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Real Boarding Pass Popup Modal */}
        {selectedTicketForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
            <div className="relative w-full max-w-2xl my-auto">
              {/* Close Button */}
              <button
                onClick={() => setSelectedTicketForModal(null)}
                className="absolute -top-3 -right-3 z-20 w-9 h-9 rounded-full bg-[#071526] border border-white/20 text-white flex items-center justify-center hover:bg-[#B48C56] hover:text-slate-950 transition cursor-pointer shadow-2xl"
                title="Close Boarding Pass"
              >
                <X className="w-5 h-5" />
              </button>

              <DigitalTicketCard booking={selectedTicketForModal} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
