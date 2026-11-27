'use client';

import React from 'react';
import { SeatData, BusDetails } from '@/lib/types';
import {
  X,
  Check,
  User,
  Phone,
  ArrowLeft,
  Armchair,
  Bus,
  MapPin,
  Calendar,
  Clock,
  QrCode,
  ShieldCheck,
  ScanLine,
} from 'lucide-react';

interface SeatDetailsPanelProps {
  seat: SeatData | null;
  bus?: BusDetails | null;
  isSelected: boolean;
  onConfirmSeat: (seat: SeatData) => void;
  onDeselectSeat: (seat: SeatData) => void;
  onBack: () => void;
  passengerInfo: { name: string; phone: string; email: string };
  onPassengerInfoChange: (info: { name: string; phone: string; email: string }) => void;
}

export default function SeatDetailsPanel({
  seat,
  bus,
  isSelected,
  onConfirmSeat,
  onDeselectSeat,
  onBack,
  passengerInfo,
  onPassengerInfoChange,
}: SeatDetailsPanelProps) {
  if (!seat) return null;

  const isVip = seat.tier === 'Executive VIP';
  const isWindow = seat.isWindow;
  const ticketRef = `NOV-849201-${seat.seatNumber}`;

  // Authentic bus journey itinerary defaults
  const fromCity = bus?.fromCity || 'San Francisco';
  const toCity = bus?.toCity || 'Los Angeles';
  const departureTime = bus?.departureTime || '08:30 AM';
  const arrivalTime = bus?.arrivalTime || '01:45 PM';
  const duration = bus?.duration || '5h 15m Express';
  const date = bus?.date || '2026-11-25';
  const coachName = bus?.name || 'Apex Skyliner BioDrive';

  return (
    <div className="fixed bottom-2 sm:bottom-auto sm:top-20 left-2 right-2 sm:left-auto sm:right-6 md:right-8 z-40 w-auto sm:w-[94vw] max-w-md max-h-[72vh] sm:max-h-[88vh] overflow-y-auto overscroll-contain animate-in slide-in-from-bottom sm:slide-in-from-right duration-300">
      
      {/* 
        ========================================================================
        AUTHENTIC LUXURY EXECUTIVE BOARDING PASS / TICKET VOUCHER
        Features:
        - Mobile-responsive layout fitting all screens with fluid scroll
        - Scalloped ticket tear notches on left & right borders
        - Perforated dotted tear line
        - Concise bus journey itinerary (from/to, departure/arrival times, date)
        - Stark Black & White Scanner QR Code matching real boarding pass
        ========================================================================
      */}
      <div className="relative bg-[#071322]/98 backdrop-blur-2xl rounded-3xl border border-[#C5A880]/35 text-white shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85),0_0_25px_rgba(197,168,128,0.12)] overflow-hidden">
        
        {/* Mobile Pull Handle Indicator */}
        <div className="w-10 h-1 bg-white/25 rounded-full mx-auto my-1.5 sm:hidden" />

        {/* Top Gold Foil Metallic Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#D8B788] via-[#B48C56] to-[#8C6B3D]" />

        {/* 1. TICKET HEADER & CONTROLS */}
        <div className="p-3.5 sm:p-5 pb-3 sm:pb-4 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0B1E34] to-[#071526] border border-[#C5A880]/40 flex items-center justify-center p-1 shadow-inner shrink-0">
                <img 
                  src="/images/novara-logo.png" 
                  alt="Novara" 
                  className="w-full h-full object-contain filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" 
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black tracking-wider text-white">NOVARA</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#B48C56]/20 text-[#D8B788] border border-[#B48C56]/40 uppercase tracking-widest">
                    EXECUTIVE PASS
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 font-semibold tracking-wider">
                  {ticketRef}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 text-[11px] font-bold text-[#D8B788] hover:text-white transition px-2.5 py-1.2 rounded-lg bg-[#B48C56]/15 hover:bg-[#B48C56]/30 border border-[#B48C56]/30 shadow-sm cursor-pointer"
                title="Return to full bus overview"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Cabin Overview</span>
              </button>

              <button
                onClick={onBack}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 2. TICKET BODY: SEAT IDENTIFIER, BUS JOURNEY ITINERARY & PASSENGER INPUT */}
        <div className="p-4 sm:p-5 space-y-3.5">
          
          {/* Main Seat Voucher Block */}
          <div className="bg-gradient-to-br from-[#0B1E34]/90 to-[#071526]/90 rounded-2xl p-3.5 sm:p-4 border border-[#C5A880]/20 shadow-inner flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C5A880]/20 via-[#B48C56]/10 to-transparent border border-[#C5A880]/40 flex flex-col items-center justify-center text-[#E5C287] shadow-md shrink-0">
                <Armchair className="w-5 h-5 text-[#E5C287] stroke-[2.2]" />
                <span className="text-[8px] font-black uppercase tracking-wider text-slate-300">SUITE</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {seat.seatNumber}
                  </span>
                  <span
                    className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-md font-extrabold uppercase tracking-wider ${
                      isVip
                        ? 'bg-[#B48C56]/30 text-[#E5C287] border border-[#B48C56]/60 shadow-[0_0_10px_rgba(180,140,86,0.3)]'
                        : isWindow
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        : 'bg-slate-800/80 text-slate-300 border border-white/10'
                    }`}
                  >
                    {seat.tier}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                  Row {seat.row} • {isWindow ? 'Panoramic Window View' : 'Direct Aisle Access'}
                </p>
              </div>
            </div>

            <div className="text-right pl-3 border-l border-white/10 shrink-0">
              <span className="text-[9px] text-[#D8B788] uppercase font-bold tracking-widest block">FARE</span>
              <div className="text-xl sm:text-2xl font-black text-[#E5C287] leading-none mt-0.5">${seat.price}</div>
              <span className="text-[9px] text-slate-400 font-medium">All Taxes Incl.</span>
            </div>
          </div>

          {/* 
            ====================================================================
            BUS JOURNEY ITINERARY DETAILS (Replaces Suite Amenities per user request!)
            Displays where the bus goes, departure/arrival times, date & platform
            ====================================================================
          */}
          <div className="bg-[#0B1E34]/80 rounded-2xl p-3.5 sm:p-4 border border-[#C5A880]/20 shadow-inner space-y-3">
            
            {/* Direct City Route Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#C5A880]/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Intercity Corridor</div>
                  <div className="text-xs sm:text-sm font-black text-white uppercase tracking-tight">
                    {fromCity} <span className="text-[#C5A880] mx-1">➔</span> {toCity}
                  </div>
                </div>
              </div>
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                Direct
              </span>
            </div>

            {/* Departure, Arrival & Duration Cards */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-[#071322]/85 rounded-xl p-2 border border-white/5">
                <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">Departs</span>
                <span className="text-xs sm:text-sm font-black text-[#E5C287]">{departureTime}</span>
              </div>
              <div className="bg-[#071322]/85 rounded-xl p-2 border border-white/5">
                <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">Arrives</span>
                <span className="text-xs sm:text-sm font-black text-white">{arrivalTime}</span>
              </div>
              <div className="bg-[#071322]/85 rounded-xl p-2 border border-white/5">
                <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">Duration</span>
                <span className="text-xs sm:text-sm font-black text-slate-300">{duration}</span>
              </div>
            </div>

            {/* Travel Date & Coach Platform */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] text-slate-300 pt-1 px-0.5">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                <span className="font-semibold">{date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bus className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                <span className="font-semibold text-slate-300">Bay 02 • {coachName}</span>
              </div>
            </div>

          </div>

          {/* Passenger Details Form */}
          <div className="space-y-1.5 pt-0.5">
            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest block flex items-center justify-between">
              <span>Passenger Details (Optional)</span>
              <span className="text-[9px] text-slate-500 font-normal">Can be edited at checkout</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              <div className="relative flex items-center">
                <User className="absolute left-3 w-3.5 h-3.5 text-[#C5A880] pointer-events-none" />
                <input
                  type="text"
                  placeholder="Passenger Full Name"
                  value={passengerInfo.name}
                  onChange={(e) =>
                    onPassengerInfoChange({ ...passengerInfo, name: e.target.value })
                  }
                  className="w-full bg-[#0B1E34]/80 border border-white/10 hover:border-[#C5A880]/50 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30 transition shadow-inner"
                />
              </div>
              <div className="relative flex items-center">
                <Phone className="absolute left-3 w-3.5 h-3.5 text-[#C5A880] pointer-events-none" />
                <input
                  type="tel"
                  placeholder="Mobile Phone Number"
                  value={passengerInfo.phone}
                  onChange={(e) =>
                    onPassengerInfoChange({ ...passengerInfo, phone: e.target.value })
                  }
                  className="w-full bg-[#0B1E34]/80 border border-white/10 hover:border-[#C5A880]/50 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30 transition shadow-inner"
                />
              </div>
            </div>
          </div>

        </div>

        {/* 
          ========================================================================
          PERFORATED TICKET TEAR NOTCH & DIVIDER LINE
          ========================================================================
        */}
        <div className="relative py-1 flex items-center justify-center">
          {/* Left Scalloped Semi-Circle Cutout */}
          <div className="absolute -left-3 w-6 h-6 rounded-full bg-[#071322] border-r border-[#C5A880]/35 shadow-inner" />
          {/* Perforated Dotted Tear Line */}
          <div className="w-full border-t-2 border-dashed border-white/20 mx-4" />
          {/* Right Scalloped Semi-Circle Cutout */}
          <div className="absolute -right-3 w-6 h-6 rounded-full bg-[#071322] border-l border-[#C5A880]/35 shadow-inner" />
        </div>

        {/* 
          ========================================================================
          3. TICKET BOTTOM STUB: AUTHENTIC SCANNER BARCODE (Balanced Two-Column)
          ========================================================================
        */}
        <div className="p-4 sm:p-5 pt-2 sm:pt-3 bg-gradient-to-b from-transparent to-[#040C16]/95 space-y-3.5">
          
          {/* Authentic Two-Column Boarding Scanner Barcode Stub (Matches User Preference) */}
          <div className="flex items-center justify-between bg-[#0B1E34]/90 rounded-2xl p-3 sm:p-3.5 border border-[#C5A880]/25 gap-3 sm:gap-4 shadow-inner">
            
            {/* Left: Barcode Container with Transparent Background */}
            <div className="bg-[#071322]/80 rounded-xl px-2.5 py-2 border border-white/10 flex flex-col items-center justify-center shrink-0">
              <img
                src="/images/transparent-barcode.png"
                alt="Boarding Scanner Barcode"
                className="h-10 sm:h-11 w-32 sm:w-40 object-fill filter drop-shadow-[0_0_8px_rgba(245,248,255,0.2)]"
              />
              <div className="text-[9px] font-mono font-bold text-slate-400 tracking-widest mt-1 text-center">
                {ticketRef}
              </div>
            </div>

            {/* Right: Boarding Status, Coach Door Instructions & Ready Indicator */}
            <div className="text-right flex-1 min-w-0">
              <div className="text-[10px] sm:text-[11px] font-black text-white tracking-wider flex items-center justify-end gap-1.5">
                <ScanLine className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                <span className="truncate">BOARDING BARCODE</span>
              </div>
              <div className="text-[9px] sm:text-[10px] font-semibold text-slate-300 tracking-wider mt-0.5">
                SCAN AT COACH DOOR
              </div>
              <div className="flex items-center justify-end gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-[10px] font-black text-emerald-400 tracking-wider">
                  CONFIRMATION READY
                </span>
              </div>
            </div>

          </div>

          {/* Action CTA Buttons */}
          <div>
            {isSelected ? (
              <button
                onClick={() => onDeselectSeat(seat)}
                className="w-full py-3.5 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 font-extrabold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <X className="w-4 h-4" />
                <span>Remove Suite {seat.seatNumber} Selection</span>
              </button>
            ) : (
              <button
                onClick={() => onConfirmSeat(seat)}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#A67C41] via-[#8B6226] to-[#694416] hover:from-[#B5894B] hover:via-[#9A6F2E] hover:to-[#774E1B] text-white font-black text-xs uppercase tracking-widest shadow-[0_12px_28px_-6px_rgba(139,98,38,0.6),inset_0_1px_1px_rgba(255,255,255,0.32)] border border-[#E0BE86]/35 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer drop-shadow-sm"
              >
                <Check className="w-4 h-4 text-[#FDEBD0] stroke-[3]" />
                <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">Confirm Suite {seat.seatNumber}</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
