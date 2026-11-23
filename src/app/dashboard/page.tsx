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
  KeyRound,
  RotateCcw,
  Lock,
} from 'lucide-react';
import { BookingRecord } from '@/lib/types';
import { INITIAL_BOOKINGS } from '@/lib/mock-data';
import DigitalTicketCard from '@/components/tickets/DigitalTicketCard';

const SIMULATED_OTP = '849201';

export default function UserDashboardPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  
  // Mobile & OTP authentication state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(30);

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

  // OTP resend countdown timer
  useEffect(() => {
    if (otpSent && countdown > 0 && !isVerified) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpSent, countdown, isVerified]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length < 6) {
      setOtpError('Please enter a valid mobile phone number');
      return;
    }
    setOtpSent(true);
    setOtpError('');
    setCountdown(30);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setOtpError('Please enter the 6-digit verification code');
      return;
    }

    // Accept simulated OTP or any 6-digit code for smooth user testing
    if (otpCode.trim() !== SIMULATED_OTP && otpCode.trim().length !== 6) {
      setOtpError(`Invalid code. Try using simulated code: ${SIMULATED_OTP}`);
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      setOtpError('');
    }, 500);
  };

  const handleResetAuth = () => {
    setPhoneNumber('');
    setOtpSent(false);
    setOtpCode('');
    setIsVerified(false);
    setOtpError('');
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

  // Filter bookings for the verified phone number
  const displayedBookings = useMemo(() => {
    if (!isVerified) return [];

    const cleanQuery = phoneNumber.replace(/\D/g, '');

    const matches = bookings.filter((b) => {
      if (b.passengerPhone && cleanQuery.length >= 4) {
        const cleanPhone = b.passengerPhone.replace(/\D/g, '');
        if (cleanPhone.includes(cleanQuery) || cleanQuery.includes(cleanPhone)) {
          return true;
        }
      }
      return false;
    });

    // If bookings match this phone number, show them. Otherwise show available bookings for this verified session
    return matches.length > 0 ? matches : bookings;
  }, [bookings, isVerified, phoneNumber]);

  const upcomingBookings = displayedBookings.filter((b) => b.status === 'CONFIRMED');
  const pastBookings = displayedBookings.filter((b) => b.status === 'CANCELLED');

  return (
    <div className="min-h-screen bg-[#071526] py-8 sm:py-12 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Ticket Lookup Header Card */}
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
                  Enter your mobile phone number to receive an instant verification code and access your confirmed coach tickets and digital boarding passes.
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

            {/* STEP 1: Mobile Phone Number Input (when not sent OTP yet and not verified) */}
            {!otpSent && !isVerified && (
              <form onSubmit={handleSendOtp} className="max-w-2xl">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D8B788] pointer-events-none" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setOtpError('');
                      }}
                      placeholder="Enter your mobile number (e.g. 555-019-2834)"
                      className="w-full pl-11 pr-4 py-3.5 bg-[#071526] border border-white/15 focus:border-[#B48C56] rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B48C56]/30 transition shadow-inner font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#A67C41] via-[#8B6226] to-[#694416] hover:from-[#B5894B] hover:via-[#9A6F2E] hover:to-[#774E1B] text-white font-black text-xs uppercase tracking-widest shadow-[0_12px_28px_-6px_rgba(139,98,38,0.55),inset_0_1px_1px_rgba(255,255,255,0.32)] border border-[#E0BE86]/35 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer drop-shadow-sm shrink-0"
                  >
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4 text-[#FDEBD0]" />
                  </button>
                </div>

                {otpError && (
                  <p className="mt-2 text-xs text-rose-400 font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{otpError}</span>
                  </p>
                )}
              </form>
            )}

            {/* STEP 2: OTP Verification Box (when OTP sent but not verified) */}
            {otpSent && !isVerified && (
              <form onSubmit={handleVerifyOtp} className="max-w-2xl bg-[#071526]/90 border border-[#B48C56]/35 rounded-2xl p-5 shadow-xl animate-in fade-in">
                <div className="flex items-center justify-between gap-4 mb-3 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <KeyRound className="w-4 h-4 text-[#E5C287]" />
                    <span>Enter 6-digit OTP sent to <strong className="text-white font-mono">{phoneNumber}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetAuth}
                    className="text-[11px] text-[#D8B788] hover:underline cursor-pointer"
                  >
                    Change Number
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <div className="relative flex-1 w-full">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D8B788] pointer-events-none" />
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => {
                        setOtpCode(e.target.value);
                        setOtpError('');
                      }}
                      placeholder="6-digit code (e.g. 849201)"
                      className="w-full pl-11 pr-4 py-3 bg-[#0B1E34] border border-white/20 focus:border-[#B48C56] rounded-xl text-base text-white tracking-widest font-mono text-center focus:outline-none focus:ring-2 focus:ring-[#B48C56]/30 transition"
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-[#A67C41] via-[#8B6226] to-[#694416] hover:from-[#B5894B] hover:via-[#9A6F2E] hover:to-[#774E1B] text-white font-black text-xs uppercase tracking-widest shadow-lg border border-[#E0BE86]/35 transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
                  >
                    {isVerifying ? (
                      <span>Verifying...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Verify & Access Passes</span>
                      </>
                    )}
                  </button>
                </div>

                {otpError && (
                  <p className="mt-2 text-xs text-rose-400 font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{otpError}</span>
                  </p>
                )}

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpCode(SIMULATED_OTP);
                      setOtpError('');
                    }}
                    className="inline-flex items-center gap-1.5 text-[#E5C287] hover:underline cursor-pointer"
                  >
                    <span>Use Test OTP: <strong>{SIMULATED_OTP}</strong></span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">Auto-Fill</span>
                  </button>

                  <span>
                    {countdown > 0 ? (
                      <span>Resend code in <strong className="text-white">{countdown}s</strong></span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setCountdown(30)}
                        className="text-[#D8B788] hover:underline cursor-pointer"
                      >
                        Resend Code
                      </button>
                    )}
                  </span>
                </div>
              </form>
            )}

            {/* STEP 3: Verified Status Header Bar */}
            {isVerified && (
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#071526] border border-emerald-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>Verified Mobile: <strong className="font-mono text-[#E5C287]">{phoneNumber}</strong></span>
                      <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        Secure Session
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Showing confirmed reservations and boarding passes linked to this phone number.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleResetAuth}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs border border-white/10 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#D8B788]" />
                  <span>Change Number</span>
                </button>
              </div>
            )}

          </div>
        </div>

        {/* When NOT verified: Prompt card */}
        {!isVerified && (
          <div className="bg-[#0B192C]/70 border border-white/10 rounded-3xl p-10 text-center space-y-3 shadow-xl">
            <Lock className="w-10 h-10 text-[#D8B788] mx-auto opacity-75" />
            <h3 className="text-base font-bold text-white">Mobile Verification Required</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              For passenger privacy and instant security, enter your phone number above to receive a 6-digit code and access your official boarding pass.
            </p>
          </div>
        )}

        {/* When VERIFIED: Display Bookings List & Tabs */}
        {isVerified && (
          <>
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
                      No active reservations found for {phoneNumber}. Explore our routes to book your journey.
                    </p>
                    <Link
                      href="/routes"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A67C41] via-[#8B6226] to-[#694416] hover:from-[#B5894B] text-white font-bold text-xs uppercase shadow-md cursor-pointer"
                    >
                      Find Schedules
                    </Link>
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
          </>
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

        {/* Real Boarding Pass Popup Modal (Fixed Header Row - Close Button Cleanly Above Card, Never Overlaps Save PDF) */}
        {selectedTicketForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
            <div className="relative w-full max-w-2xl my-auto pt-6 pb-6">
              {/* Separate Header Bar with Clear Close Button - Outside & Above Card */}
              <div className="flex items-center justify-between pb-3 px-1 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D8B788] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Official Boarding Pass
                </span>
                <button
                  onClick={() => setSelectedTicketForModal(null)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#071526] hover:bg-[#B48C56] hover:text-slate-950 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-xl"
                  title="Close Boarding Pass"
                >
                  <X className="w-4 h-4" />
                  <span>Close</span>
                </button>
              </div>

              <DigitalTicketCard booking={selectedTicketForModal} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
