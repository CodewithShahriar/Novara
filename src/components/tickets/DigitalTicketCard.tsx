'use client';

import React, { useRef } from 'react';
import { BookingRecord } from '@/lib/types';
import { Download, Printer, CheckCircle2, ShieldCheck, MapPin, Calendar, Clock, Bus } from 'lucide-react';

interface DigitalTicketCardProps {
  booking: BookingRecord;
}

export default function DigitalTicketCard({ booking }: DigitalTicketCardProps) {
  const ticketRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Top action buttons */}
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>VERIFIED PASSENGER BOARDING PASS</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-[#0B192C] border border-white/10 hover:border-white/20 text-slate-300 transition shadow-lg cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Print Pass</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-[#B48C56] hover:bg-[#A37B47] text-slate-950 shadow-lg transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Save PDF</span>
          </button>
        </div>
      </div>

      {/* Main Ticket Pass */}
      <div
        ref={ticketRef}
        className="bg-[#0B192C] border border-white/10 rounded-3xl overflow-hidden shadow-2xl text-white"
      >
        {/* Obsidian Navy Header */}
        <div className="bg-gradient-to-r from-[#071526] via-[#0B192C] to-[#071526] p-6 sm:p-8 text-white relative border-b border-white/10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#B48C56]/20 border border-[#B48C56]/40 flex items-center justify-center">
                <Bus className="w-5 h-5 text-[#D8B788]" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white">
                  NOVARA LUXURY EXPRESS
                </span>
                <p className="text-xs text-slate-400">
                  {booking.operator} • {booking.model}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-[#D8B788] font-bold block">
                Booking Reference
              </span>
              <div className="text-lg font-black font-mono text-white">
                {booking.bookingRef}
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full mt-1 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                {booking.status}
              </span>
            </div>
          </div>
        </div>

        {/* Route Origin & Destination */}
        <div className="p-6 sm:p-8 bg-[#071526]/80 border-b border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Origin */}
            <div className="text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#B48C56]" />
                Origin Terminal
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {booking.fromCity}
              </h3>
              <p className="text-xs text-[#D8B788] font-semibold mt-0.5">
                Departure: {booking.departureTime}
              </p>
            </div>

            {/* Middle Coach Icon */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-slate-500 tracking-wider">
                EXPRESS DIRECT
              </span>
              <div className="flex items-center gap-2 my-1.5">
                <div className="w-12 sm:w-16 h-0.5 bg-slate-700" />
                <Bus className="w-4 h-4 text-[#B48C56]" />
                <div className="w-12 sm:w-16 h-0.5 bg-slate-700" />
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">
                Dedicated Corridor
              </span>
            </div>

            {/* Destination */}
            <div className="text-center sm:text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-center sm:justify-end gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Arrival Station
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {booking.toCity}
              </h3>
              <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                Arrival: {booking.arrivalTime}
              </p>
            </div>
          </div>
        </div>

        {/* Passenger & Ticket Data Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-4 gap-6 border-b border-white/10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Passenger Name
            </span>
            <div className="text-sm font-bold text-white mt-0.5">
              {booking.passengerName}
            </div>
            <p className="text-[11px] text-slate-400 truncate">{booking.passengerPhone}</p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Journey Date
            </span>
            <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#B48C56]" />
              {booking.journeyDate}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Allocated Suites
            </span>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              {booking.seats.map((seatNum) => (
                <span
                  key={seatNum}
                  className="px-2.5 py-0.5 rounded-md bg-[#B48C56]/20 border border-[#B48C56]/30 text-[#D8B788] font-bold text-xs"
                >
                  Suite {seatNum}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Fare
            </span>
            <div className="text-lg font-black text-[#D8B788] mt-0.5">
              ${booking.totalPrice}
            </div>
            <p className="text-[10px] text-emerald-400 font-semibold">{booking.paymentStatus}</p>
          </div>
        </div>

        {/* Bottom Bar with QR Code */}
        <div className="p-6 sm:p-8 bg-[#0B192C] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Boarding Instructions
            </span>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Present this pass or scan the digital code directly at the coach boarding door. Boarding begins 15 minutes prior to departure.
            </p>
          </div>

          {/* Clean SVG QR Code */}
          <div className="p-3 rounded-2xl bg-white border border-slate-300 shadow-md shrink-0">
            <svg
              className="w-24 h-24"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="100" height="100" fill="white" />
              <rect x="10" y="10" width="24" height="24" fill="#0F172A" />
              <rect x="14" y="14" width="16" height="16" fill="white" />
              <rect x="18" y="18" width="8" height="8" fill="#0F172A" />
              <rect x="66" y="10" width="24" height="24" fill="#0F172A" />
              <rect x="70" y="14" width="16" height="16" fill="white" />
              <rect x="74" y="18" width="8" height="8" fill="#0F172A" />
              <rect x="10" y="66" width="24" height="24" fill="#0F172A" />
              <rect x="14" y="70" width="16" height="16" fill="white" />
              <rect x="18" y="74" width="8" height="8" fill="#0F172A" />
              <rect x="42" y="14" width="6" height="6" fill="#0F172A" />
              <rect x="52" y="14" width="6" height="6" fill="#0F172A" />
              <rect x="42" y="24" width="6" height="6" fill="#0F172A" />
              <rect x="42" y="42" width="16" height="16" fill="#1E3A8A" />
              <rect x="46" y="46" width="8" height="8" fill="#0F172A" />
              <rect x="18" y="42" width="8" height="8" fill="#0F172A" />
              <rect x="68" y="42" width="6" height="6" fill="#0F172A" />
              <rect x="78" y="48" width="6" height="6" fill="#0F172A" />
              <rect x="42" y="68" width="8" height="8" fill="#0F172A" />
              <rect x="56" y="74" width="12" height="6" fill="#0F172A" />
              <rect x="74" y="72" width="10" height="10" fill="#0F172A" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
