'use client';

export const dynamic = 'force-dynamic';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Zap,
  Armchair,
} from 'lucide-react';
import { INITIAL_BUSES } from '@/lib/mock-data';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const busId = searchParams.get('busId') || 'bus-1';
  const seatsParam = searchParams.get('seats') || '1A';
  const dateParam = searchParams.get('date');
  const fromParam = searchParams.get('from');
  const toParam = searchParams.get('to');
  const seatNumbers = seatsParam.split(',').filter(Boolean);

  const rawBus = INITIAL_BUSES.find((b) => b.id === busId) || INITIAL_BUSES[0];
  const bus = {
    ...rawBus,
    ...(dateParam ? { date: dateParam } : {}),
    ...(fromParam ? { fromCity: fromParam } : {}),
    ...(toParam ? { toCity: toParam } : {}),
  };

  const [passengerName, setPassengerName] = useState('Alex Mercer');
  const [passengerEmail, setPassengerEmail] = useState('alex.mercer@novaracoach.com');
  const [passengerPhone, setPassengerPhone] = useState('+1 (555) 234-8901');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'applepay' | 'gpay'>('card');

  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('492');

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  const matchingSeats = bus.seats.filter((s) => seatNumbers.includes(s.seatNumber));
  const subtotal = matchingSeats.reduce((sum, s) => sum + s.price, 0) || bus.basePrice * seatNumbers.length;
  const bookingServiceFee = 4.5;
  const transitTaxes = Math.round(subtotal * 0.08);
  const grandTotal = subtotal + bookingServiceFee + transitTaxes;

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingStep('Authorizing reservation...');

    await new Promise((r) => setTimeout(r, 600));
    setProcessingStep('Assigning allocated suites...');

    await new Promise((r) => setTimeout(r, 600));
    setProcessingStep('Generating digital boarding pass...');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          busId: bus.id,
          passengerName,
          passengerEmail,
          passengerPhone,
          journeyDate: bus.date,
          fromCity: bus.fromCity,
          toCity: bus.toCity,
          seatNumbers,
          totalPrice: grandTotal,
          paymentMethod:
            paymentMethod === 'card'
              ? 'Credit/Debit Card'
              : paymentMethod === 'applepay'
              ? 'Apple Pay'
              : 'Google Pay',
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#38BDF8', '#10B981', '#FFFFFF'],
        });

        setTimeout(() => {
          router.push(`/ticket/${resData.data.bookingRef}`);
        }, 600);
      } else {
        const fallbackRef = `NOV-${Math.floor(100000 + Math.random() * 900000)}`;
        router.push(`/ticket/${fallbackRef}`);
      }
    } catch (err) {
      const fallbackRef = `NOV-${Math.floor(100000 + Math.random() * 900000)}`;
      router.push(`/ticket/${fallbackRef}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#071526] py-8 sm:py-12 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href={`/book/${bus.id}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#D8B788] hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to 3D Seat Selector</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Passenger & Payment Information */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#0B192C]/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <h2 className="text-xl sm:text-2xl font-black text-white mb-6 flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-[#D8B788]" />
                Passenger Details & Checkout
              </h2>

              <form onSubmit={handleSubmitBooking} className="space-y-6">
                
                {/* Contact details */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Primary Passenger Information
                  </h3>

                  <div>
                    <label className="block text-xs text-slate-300 font-semibold mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      placeholder="e.g. Alex Mercer"
                      className="w-full bg-[#071526] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#B48C56] transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-300 font-semibold mb-1">
                        Email Address (for Boarding Pass)
                      </label>
                      <input
                        type="email"
                        required
                        value={passengerEmail}
                        onChange={(e) => setPassengerEmail(e.target.value)}
                        placeholder="alex@novaracoach.com"
                        className="w-full bg-[#071526] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#B48C56] transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 font-semibold mb-1">
                        Mobile Phone (SMS Travel Updates)
                      </label>
                      <input
                        type="tel"
                        required
                        value={passengerPhone}
                        onChange={(e) => setPassengerPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-[#071526] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#B48C56] transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="pt-4 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Payment Method
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                      <Lock className="w-3.5 h-3.5" />
                      <span>256-Bit SSL Encrypted</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'bg-[#B48C56]/20 border-[#B48C56] text-white font-bold shadow-lg'
                          : 'bg-[#071526] border-white/5 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-[#D8B788] mb-2" />
                      <div>
                        <div className="text-xs">Credit/Debit</div>
                        <div className="text-[10px] text-slate-400 font-normal">Visa / Master</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('applepay')}
                      className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition cursor-pointer ${
                        paymentMethod === 'applepay'
                          ? 'bg-[#B48C56]/20 border-[#B48C56] text-white font-bold shadow-lg'
                          : 'bg-[#071526] border-white/5 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <Zap className="w-5 h-5 text-slate-300 mb-2" />
                      <div>
                        <div className="text-xs">Apple Pay</div>
                        <div className="text-[10px] text-slate-400 font-normal">One-Click</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('gpay')}
                      className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition cursor-pointer ${
                        paymentMethod === 'gpay'
                          ? 'bg-[#B48C56]/20 border-[#B48C56] text-white font-bold shadow-lg'
                          : 'bg-[#071526] border-white/5 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
                      <div>
                        <div className="text-xs">Google Pay</div>
                        <div className="text-[10px] text-slate-400 font-normal">Instant</div>
                      </div>
                    </button>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="p-4 rounded-2xl bg-[#071526] border border-white/5 space-y-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-[#0B192C] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#B48C56]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full bg-[#0B192C] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#B48C56]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                            CVC
                          </label>
                          <input
                            type="text"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-full bg-[#0B192C] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#B48C56]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 rounded-xl bg-[#B48C56] hover:bg-[#A37B47] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>{processingStep}</span>
                    </div>
                  ) : (
                    <>
                      <span>Confirm & Authorize ${grandTotal}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0B192C]/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D8B788]">
                Itinerary Overview
              </span>
              <h3 className="text-xl font-black text-white mt-1 mb-4">{bus.name}</h3>

              {/* Journey Route */}
              <div className="bg-[#071526] rounded-2xl p-4 border border-white/5 space-y-3 mb-6">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#B48C56]" />
                    <span>{bus.fromCity}</span>
                  </div>
                  <span className="text-[#D8B788]">{bus.departureTime}</span>
                </div>

                <div className="pl-6 border-l-2 border-dashed border-slate-700 py-1 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{bus.duration} Express Non-Stop</span>
                  <span>Direct Corridor</span>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>{bus.toCity}</span>
                  </div>
                  <span className="text-emerald-400">{bus.arrivalTime}</span>
                </div>
              </div>

              {/* Allocated Seats */}
              <div className="mb-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Reserved Suites ({seatNumbers.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {seatNumbers.map((seatNum) => {
                    const s = bus.seats.find((item) => item.seatNumber === seatNum);
                    return (
                      <div
                        key={seatNum}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#B48C56]/15 border border-[#B48C56]/30 text-xs font-semibold text-white"
                      >
                        <Armchair className="w-3.5 h-3.5 text-[#D8B788]" />
                        <span>Suite {seatNum}</span>
                        <span className="text-[#D8B788] font-bold">${s?.price || bus.basePrice}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Ticket Subtotal</span>
                  <span className="font-semibold text-white">${subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Booking & Reservation Fee</span>
                  <span className="font-semibold text-white">${bookingServiceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>State Transit Tax (8%)</span>
                  <span className="font-semibold text-white">${transitTaxes}</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Total Charge</span>
                  <span className="text-2xl font-black text-[#D8B788]">${grandTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070A0F] flex items-center justify-center text-slate-400">
          <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mb-3" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
