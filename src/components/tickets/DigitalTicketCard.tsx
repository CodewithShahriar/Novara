'use client';

import React, { useRef, useMemo, useState } from 'react';
import { BookingRecord } from '@/lib/types';
import {
  Download,
  Printer,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Calendar,
  Clock,
  Bus,
  Sparkles,
  QrCode,
  Share2,
  Check,
  Luggage,
} from 'lucide-react';

interface DigitalTicketCardProps {
  booking: BookingRecord;
}

// Generate realistic high-density 29x29 QR code matrix with ISO finder patterns
function generateRealisticQRMatrix(seed: string): boolean[][] {
  const size = 29;
  const grid = Array.from({ length: size }, () => Array(size).fill(false));

  // Helper to draw standard 7x7 Finder Pattern with 3x3 solid center
  function drawFinder(r0: number, c0: number) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          grid[r0 + r][c0 + c] = true;
        }
      }
    }
  }

  // Draw 3 corner finder patterns
  drawFinder(0, 0);
  drawFinder(0, 22);
  drawFinder(22, 0);

  // Timing patterns (alternating black/white dots along row 6 and col 6)
  for (let i = 8; i < 22; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  // Alignment pattern at (18..22, 18..22)
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (r === 0 || r === 4 || c === 0 || c === 4 || (r === 2 && c === 2)) {
        grid[18 + r][18 + c] = true;
      }
    }
  }

  // Pseudo-random deterministic hash fill for high-density data modules
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip finder pattern zones & separators
      if (r < 8 && (c < 8 || c >= 21)) continue;
      if (r >= 21 && c < 8) continue;
      // Skip timing patterns
      if (r === 6 || c === 6) continue;
      // Skip alignment zone
      if (r >= 18 && r <= 22 && c >= 18 && c <= 22) continue;

      h = Math.imul(h ^ (r * 31 + c), 16777619);
      grid[r][c] = (h >>> 0) % 100 < 54;
    }
  }

  return grid;
}

// Convert city name to authentic 3-letter terminal code
function getCityCode(cityName: string): string {
  const map: Record<string, string> = {
    'San Francisco': 'SFO',
    'Neo-San Francisco': 'SFO',
    'Los Angeles': 'LAX',
    'Metro Los Angeles': 'LAX',
    'San Diego': 'SAN',
    'Las Vegas': 'LAS',
    'Vegas SkyPort': 'LAS',
    Sacramento: 'SAC',
    'San Jose': 'SJC',
    Seattle: 'SEA',
    'Neo-Seattle': 'SEA',
    Portland: 'PDX',
    Phoenix: 'PHX',
    Austin: 'AUS',
    'Silicon Austin': 'AUS',
    Budapest: 'BUD',
    Vienna: 'VIE',
    Rome: 'FCO',
    Milan: 'MXP',
    Prague: 'PRG',
    Berlin: 'BER',
    Paris: 'CDG',
  };
  return map[cityName] || cityName.slice(0, 3).toUpperCase();
}

export default function DigitalTicketCard({ booking }: DigitalTicketCardProps) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const qrMatrix = useMemo(
    () => generateRealisticQRMatrix(booking.bookingRef + booking.passengerName),
    [booking.bookingRef, booking.passengerName]
  );

  const fromCode = getCityCode(booking.fromCity);
  const toCode = getCityCode(booking.toCity);

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/ticket/${booking.bookingRef}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      {/* Top Action Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>VERIFIED ENCRYPTED BOARDING PASS</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-[#0B192C] border border-white/10 hover:border-white/20 text-slate-300 transition shadow-lg cursor-pointer"
            title="Copy digital boarding pass link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Share</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-[#0B192C] border border-white/10 hover:border-white/20 text-slate-300 transition shadow-lg cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print Pass</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs font-black px-4 py-2 rounded-xl bg-[#B48C56] hover:bg-[#A37B47] text-slate-950 shadow-lg transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save PDF</span>
          </button>
        </div>
      </div>

      {/* Main Luxury Boarding Pass Ticket */}
      <div
        ref={ticketRef}
        className="relative bg-[#0B192C] border border-[#B48C56]/30 rounded-3xl overflow-hidden shadow-2xl text-white select-none"
      >
        {/* Subtle Watermark Branding in Background */}
        <div className="absolute right-6 top-24 pointer-events-none opacity-4 select-none">
          <span className="text-9xl font-black font-serif italic text-white tracking-widest">
            NOVARA
          </span>
        </div>

        {/* 1. TOP PREMIUM HEADER */}
        <div className="bg-gradient-to-r from-[#071526] via-[#0B1E34] to-[#071526] p-6 sm:p-7 border-b border-white/10 relative">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Carrier Brand & Class */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#B48C56] to-[#8C6B3D] flex items-center justify-center text-slate-950 shadow-md">
                <Bus className="w-6 h-6 text-slate-950 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-white">
                    NOVARA
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#B48C56]/20 text-[#D8B788] border border-[#B48C56]/40 uppercase tracking-widest">
                    EXECUTIVE VIP
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  {booking.operator} • 3-Axle Touring Coach
                </p>
              </div>
            </div>

            {/* Electronic Reference Code & Status */}
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block">
                E-TICKET #ETKT-{booking.bookingRef}
              </span>
              <div className="text-xl font-mono font-black text-[#D8B788] tracking-wider">
                {booking.bookingRef}
              </div>
              <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full mt-0.5 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                <span>CONFIRMED & GUARANTEED</span>
              </div>
            </div>

          </div>
        </div>

        {/* 2. AVIATION-STYLE ROUTE CORRIDOR DISPLAY */}
        <div className="p-6 sm:p-8 bg-[#071526]/90 border-b border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8">
            
            {/* Origin Terminal */}
            <div className="text-center sm:text-left flex-1">
              <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
                {fromCode}
              </span>
              <h3 className="text-base font-bold text-slate-200 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#B48C56]" />
                {booking.fromCity}
              </h3>
              <div className="mt-2 text-xs">
                <span className="text-slate-400 block text-[10px] uppercase tracking-wider">
                  Departure Time
                </span>
                <span className="text-base font-extrabold text-[#D8B788] font-mono">
                  {booking.departureTime}
                </span>
              </div>
            </div>

            {/* Center Highway Corridor Graphic */}
            <div className="flex flex-col items-center shrink-0">
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                DIRECT HIGHWAY
              </span>
              <div className="flex items-center gap-3 my-2">
                <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-transparent via-[#B48C56] to-[#B48C56]" />
                <div className="w-8 h-8 rounded-full bg-[#B48C56]/20 border border-[#B48C56]/40 flex items-center justify-center text-[#D8B788] shadow-sm">
                  <Bus className="w-4 h-4" />
                </div>
                <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-[#B48C56] via-[#B48C56] to-transparent" />
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-300">
                Express Highway
              </span>
            </div>

            {/* Destination Terminal */}
            <div className="text-center sm:text-right flex-1">
              <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
                {toCode}
              </span>
              <h3 className="text-base font-bold text-slate-200 mt-1 flex items-center justify-center sm:justify-end gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {booking.toCity}
              </h3>
              <div className="mt-2 text-xs">
                <span className="text-slate-400 block text-[10px] uppercase tracking-wider">
                  Arrival Time
                </span>
                <span className="text-base font-extrabold text-emerald-400 font-mono">
                  {booking.arrivalTime}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* 3. PASSENGER & FLIGHT/COACH METRICS GRID */}
        <div className="p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-4 gap-6 bg-[#0B192C] border-b border-white/10 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Passenger Name
            </span>
            <div className="text-sm font-black text-white mt-1 truncate">
              {booking.passengerName}
            </div>
            <span className="inline-block text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-[#D8B788] border border-amber-500/30 uppercase mt-1">
              Priority Passenger
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Travel Date
            </span>
            <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#B48C56]" />
              <span>{booking.journeyDate}</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              Check-in Bay 04
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Reserved Suites
            </span>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              {booking.seats.map((seatNum) => (
                <span
                  key={seatNum}
                  className="px-2.5 py-1 rounded-lg bg-[#B48C56] text-slate-950 font-black text-xs shadow-md"
                >
                  Suite {seatNum}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Fare & Payment
            </span>
            <div className="text-lg font-black text-[#D8B788] font-mono mt-0.5">
              ${booking.totalPrice}
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold block">
              {booking.paymentStatus || 'Verified Paid'}
            </span>
          </div>
        </div>

        {/* 4. PERFORATED TEAR-OFF LINE WITH CIRCULAR NOTCHES (Real Physical Ticket Feel!) */}
        <div className="relative w-full h-6 flex items-center bg-[#0B192C]">
          {/* Left Semicircle Cutout */}
          <div className="absolute -left-3 w-6 h-6 rounded-full bg-[#071526] border-r border-[#B48C56]/30 shadow-inner" />
          
          {/* Perforated Dashed Line */}
          <div className="w-full border-b-2 border-dashed border-white/20 mx-4" />

          {/* Right Semicircle Cutout */}
          <div className="absolute -right-3 w-6 h-6 rounded-full bg-[#071526] border-l border-[#B48C56]/30 shadow-inner" />
        </div>

        {/* 5. BOARDING STUB WITH REALISTIC HIGH-DENSITY QR & BARCODE */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-[#0B192C] to-[#071526] flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Boarding Info & Instructions */}
          <div className="space-y-3 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-white uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#D8B788]" />
              <span>Biometric Fast Boarding Lane</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              Scan this high-density encrypted pass directly at the coach door scanner. Luggage check-in at underfloor bay opens 20 minutes before departure.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[11px] text-slate-400 pt-1">
              <div className="flex items-center gap-1">
                <Luggage className="w-3.5 h-3.5 text-[#B48C56]" />
                <span>1 Checked (25kg) + 1 Carry-on</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Doors close 10m prior</span>
              </div>
            </div>

            {/* Code 128 Realistic Barcode Strip */}
            <div className="pt-3 hidden sm:block">
              <div className="flex items-end gap-[1.5px] h-9 w-60 opacity-80">
                {[
                  3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 1, 2, 1, 3, 2, 4, 1,
                  2, 3, 1, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 3, 1, 2, 4, 1,
                  2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 1, 2, 3, 1, 4, 2,
                ].map((w, i) => (
                  <div
                    key={i}
                    className="bg-slate-300 rounded-xs"
                    style={{ width: `${w * 1.1}px`, height: '100%' }}
                  />
                ))}
              </div>
              <span className="text-[9px] font-mono tracking-widest text-slate-400 block mt-1">
                * NOV - {booking.bookingRef} - ETKT *
              </span>
            </div>
          </div>

          {/* Genuine High-Density QR Code Box */}
          <div className="p-3 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col items-center shrink-0">
            <div className="relative">
              {/* Corner Framing Brackets */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#B48C56]" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#B48C56]" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#B48C56]" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#B48C56]" />

              {/* High-Density 29x29 Module Matrix SVG */}
              <svg
                className="w-32 h-32 sm:w-36 sm:h-36"
                viewBox="0 0 29 29"
                shapeRendering="crispEdges"
              >
                <rect width="29" height="29" fill="#FFFFFF" />
                {qrMatrix.map((row, r) =>
                  row.map((filled, c) =>
                    filled ? (
                      <rect
                        key={`${r}-${c}`}
                        x={c}
                        y={r}
                        width="1"
                        height="1"
                        fill="#071526"
                      />
                    ) : null
                  )
                )}
              </svg>
            </div>

            <div className="mt-2 text-center">
              <span className="text-[9px] font-mono font-bold text-slate-900 tracking-wider uppercase block">
                SCAN AT COACH DOOR
              </span>
              <span className="text-[8px] font-mono text-slate-500">
                {booking.bookingRef}
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Gold Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#B48C56] via-[#D8B788] to-[#B48C56]" />
      </div>
    </div>
  );
}
