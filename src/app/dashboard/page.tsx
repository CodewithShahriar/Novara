'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Ticket,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  Phone,
  Search,
  X,
  ArrowRight,
  User,
  Sparkles,
} from 'lucide-react';
import { BookingRecord } from '@/lib/types';
import { INITIAL_BOOKINGS } from '@/lib/mock-data';
import DigitalTicketCard from '@/components/tickets/DigitalTicketCard';

const DEMO_PHONE = '+1 (555) 019-2834';

export default function UserDashboardPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [searchPhone, setSearchPhone] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [cancellingRef, setCancellingRef] = useState<string | null>(null);
  const [isCancelSuccess, setIsCancelSuccess] = useState(false);
  const [selectedTicketForModal, setSelectedTicketForModal] = useState<BookingRecord | null>(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch('/api/bookings');
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchPhone.trim());
  };

  const handleClearSearch = () => {
    setSearchPhone('');
    setActiveSearch('');
  };

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

  // Filter bookings based on user's entered phone number or booking reference
  const displayedBookings = useMemo(() => {
    // If no search entered, show 1 demo booking
    if (!activeSearch.trim()) {
      return bookings.length > 0 ? [bookings[0]] : INITIAL_BOOKINGS.slice(0, 1);
    }

    const cleanQuery = activeSearch.replace(/\D/g, '');
    const rawQuery = activeSearch.trim().toLowerCase();

    const matches = bookings.filter((b) => {
      // Match phone number (digits only match)
      if (b.passengerPhone && cleanQuery.length >= 3) {
        const cleanPhone = b.passengerPhone.replace(/\D/g, '');
        if (cleanPhone.includes(cleanQuery) || cleanQuery.includes(cleanPhone)) {
          return true;
        }
      }
      // Match booking reference
      if (b.bookingRef && b.bookingRef.toLowerCase().includes(rawQuery)) {
        return true;
      }
      // Match passenger name
      if (b.passengerName && b.passengerName.toLowerCase().includes(rawQuery)) {
        return true;
      }
      return false;
    });

    return matches;
  }, [bookings, activeSearch]);

  const upcomingBookings = displayedBookings.filter((b) => b.status === 'CONFIRMED');
  const pastBookings = displayedBookings.filter((b) => b.status === 'CANCELLED');

  return (
    <div className="min-h-screen bg-[#071526] py-8 sm:py-12 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Ticket Lookup Header Card (Replaces fake user profile) */}
        <div className="bg-[#0B192C]/90 border border-white/10 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B48C56]/20 border border-[#B48C56]/30 text-[#D8B788] text-[11px] font-bold uppercase tracking-widest mb-4">
              <Ticket className="w-3.5 h-3.5 text-[#D8B788]" />
              <span>TICKET RETRIEVAL & BOARDING PASSES</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Find & Manage Your Tickets
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Enter the mobile phone number used during seat booking to view your confirmed coach passes, check departure timings, and view digital barcodes.
                </p>
              </div>

              <Link
                href="/routes"
                className="self-start lg:self-auto inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#A67C41] via-[#8B6226] to-[#694416] hover:from-[#B5894B] hover:via-[#9A6F2E] hover:to-[#774E1B] text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_8px_20px_-4px_rgba(139,98,38,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)] border border-[#E0BE86]/35 transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Book New Journey</span>
                <ArrowRight className="w-4 h-4 text-[#FDEBD0]" />
              </Link>
            </div>

            {/* Mobile / Ref Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D8B788] pointer-events-none" />
                <input
                  type="text"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  placeholder="Enter mobile phone number (e.g. 555-019-2834) or Booking Ref (e.g. NOV-849201)"
                  className="w-full pl-11 pr-4 py-3.5 bg-[#071526] border border-white/15 focus:border-[#B48C56] rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B48C56]/30 transition shadow-inner"
                />
              </div>

              <button
                type="submit"
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#A67C41] via-[#8B6226] to-[#694416] hover:from-[#B5894B] hover:via-[#9A6F2E] hover:to-[#774E1B] text-white font-black text-xs uppercase tracking-widest shadow-[0_12px_28px_-6px_rgba(139,98,38,0.55),inset_0_1px_1px_rgba(255,255,255,0.32)] border border-[#E0BE86]/35 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer drop-shadow-sm"
              >
                <Search className="w-4 h-4 text-[#FDEBD0] stroke-[2.5]" />
                <span>Find Tickets</span>
              </button>

              {activeSearch && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs border border-white/10 transition cursor-pointer"
                >
                  Clear
                </button>
              )}
            </form>

            {/* Quick Demo Number Pill */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
              <span>Demo Test Number:</span>
              <button
                type="button"
                onClick={() => {
                  setSearchPhone(DEMO_PHONE);
                  setActiveSearch(DEMO_PHONE);
                }}
                className="inline-flex items-center gap-1.5 font-mono text-[#E5C287] hover:text-white bg-white/5 hover:bg-[#B48C56]/20 px-2.5 py-1 rounded-lg border border-white/10 hover:border-[#B48C56]/40 transition cursor-pointer"
              >
                <span>{DEMO_PHONE}</span>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  • Click to Fill
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* Demo Indicator Note when search is empty */}
        {!activeSearch && (
          <div className="mb-6 p-4 rounded-2xl bg-[#0B192C]/70 border border-[#B48C56]/25 text-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#B48C56] animate-pulse shrink-0" />
              <span>
                Showing <strong>1 Demo Ticket</strong> below. Enter your mobile number in the search box above to retrieve your personal booked coach passes.
              </span>
            </div>
            <button
              onClick={() => {
                setSearchPhone(DEMO_PHONE);
                setActiveSearch(DEMO_PHONE);
              }}
              className="text-[#E5C287] hover:underline font-bold shrink-0 cursor-pointer"
            >
              Search Demo
            </button>
          </div>
        )}

        {/* Search Query Result Banner */}
        {activeSearch && (
          <div className="mb-6 flex items-center justify-between text-xs text-slate-300">
            <div>
              Results for: <strong className="text-[#E5C287] font-mono">{activeSearch}</strong>{' '}
              ({displayedBookings.length} {displayedBookings.length === 1 ? 'ticket found' : 'tickets found'})
            </div>
            <button
              onClick={handleClearSearch}
              className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
            >
              View demo pass
            </button>
          </div>
        )}

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
                ? 'bg-gradient-to-r from-[#A67C41] via-[#8B6226] to-[#694416] text-white shadow-md border border-[#E0BE86]/35'
                : 'text-slate-400 hover:text-white bg-[#0B192C] border border-white/5'
            }`}
          >
            Active Passes ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'past'
                ? 'bg-gradient-to-r from-[#A67C41] via-[#8B6226] to-[#694416] text-white shadow-md border border-[#E0BE86]/35'
                : 'text-slate-400 hover:text-white bg-[#0B192C] border border-white/5'
            }`}
          >
            Past & Cancelled ({pastBookings.length})
          </button>
        </div>

        {/* Content Tabs */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <div className="bg-[#0B192C] border border-white/10 rounded-2xl p-12 text-center">
                <Ticket className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No Active Tickets Found</h3>
                <p className="text-xs text-slate-400 mb-6">
                  {activeSearch
                    ? `No reservations found matching "${activeSearch}". Please verify the number used during booking.`
                    : 'Enter your phone number to check for scheduled journeys.'}
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleClearSearch}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase cursor-pointer"
                  >
                    View Demo Pass
                  </button>
                  <Link
                    href="/routes"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A67C41] via-[#8B6226] to-[#694416] hover:from-[#B5894B] text-white font-bold text-xs uppercase shadow-md cursor-pointer"
                  >
                    Find Schedules
                  </Link>
                </div>
              </div>
            ) : (
              upcomingBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-[#0B192C] border border-white/10 hover:border-[#B48C56]/40 rounded-2xl p-6 shadow-xl transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-mono font-bold text-[#E5C287] bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                          {b.bookingRef}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {b.status}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {b.operator}
                        </span>
                        {b.passengerName && (
                          <span className="text-xs text-slate-300 flex items-center gap-1 ml-auto md:ml-0">
                            <User className="w-3.5 h-3.5 text-[#B48C56]" />
                            {b.passengerName}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span>{b.fromCity}</span>
                        <span className="text-[#D8B788]">→</span>
                        <span>{b.toCity}</span>
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
                          Suites: <strong className="text-[#E5C287]">{b.seats.join(', ')}</strong>
                        </span>
                        <span>
                          Total: <strong className="text-white">${b.totalPrice}</strong>
                        </span>
                        {b.passengerPhone && (
                          <span className="text-slate-500 font-mono text-[11px]">
                            Phone: {b.passengerPhone}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedTicketForModal(b)}
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A67C41] via-[#8B6226] to-[#694416] hover:from-[#B5894B] hover:via-[#9A6F2E] hover:to-[#774E1B] text-white border border-[#E0BE86]/35 font-extrabold text-xs uppercase tracking-wider shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#FDEBD0]" />
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
                        {b.journeyDate} • Suites: {b.seats.join(', ')} • Refund: {b.paymentStatus}
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
                  className="px-4 py-2.5 rounded-xl bg-[#071526] text-slate-300 font-semibold text-xs cursor-pointer"
                >
                  Keep Reservation
                </button>
                <button
                  onClick={() => handleCancelBooking(cancellingRef)}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
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
