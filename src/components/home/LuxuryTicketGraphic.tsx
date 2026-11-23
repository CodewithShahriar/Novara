'use client';

import React from 'react';
import { Bus, MapPin, Sparkles } from 'lucide-react';

interface TicketProps {
  departureCity?: string;
  arrivalCity?: string;
  date?: string;
  time?: string;
  seatNumber?: string;
  price?: string;
  ticketRef?: string;
  className?: string;
}

export function SingleBoardingTicket({
  departureCity = 'SAN FRANCISCO',
  arrivalCity = 'LOS ANGELES',
  date = '25.11.2026',
  time = '08:30',
  seatNumber = '27',
  price = '$45',
  ticketRef = 'NOV-849201',
  className = '',
}: TicketProps) {
  return (
    <div
      className={`relative w-[330px] sm:w-[380px] md:w-[400px] h-[125px] sm:h-[138px] rounded-2xl overflow-hidden flex select-none ${className}`}
      style={{
        boxShadow: '0 20px 40px -10px rgba(7, 21, 38, 0.28), 0 10px 20px -5px rgba(0, 0, 0, 0.18)',
      }}
    >
      {/* 
        ========================================================================
        1. GOLDEN CAMEL BANNER (Left ~25%)
        ========================================================================
      */}
      <div className="w-[25%] bg-gradient-to-br from-[#D8B788] via-[#C5A880] to-[#A8824E] p-2.5 sm:p-3 flex flex-col justify-between items-start text-white relative overflow-hidden border-r border-[#9E7947]/30">
        {/* Subtle decorative shimmer angle */}
        <div className="absolute -right-6 -top-6 w-16 h-16 bg-white/20 rounded-full blur-sm pointer-events-none" />

        {/* Top: Modern Bus Icon */}
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-inner">
          <Bus className="w-4 h-4 text-white stroke-[2.2]" />
        </div>

        {/* Middle: Bold Rotated / Stacked BUS TICKET */}
        <div className="my-auto py-1">
          <div className="text-[12px] sm:text-[14px] font-black uppercase tracking-wider text-white leading-tight drop-shadow-sm">
            BUS
          </div>
          <div className="text-[12px] sm:text-[14px] font-black uppercase tracking-wider text-white leading-tight drop-shadow-sm">
            TICKET
          </div>
        </div>

        {/* Bottom: Metallic Stamp Badge */}
        <div className="flex items-center gap-1 opacity-90">
          <Sparkles className="w-2.5 h-2.5 text-white" />
          <span className="text-[7px] font-bold uppercase tracking-widest text-white/90">
            EXPRESS PASS
          </span>
        </div>
      </div>

      {/* 
        ========================================================================
        2. CRISP OFF-WHITE TICKET BODY (Center ~51%)
        ========================================================================
      */}
      <div className="w-[51%] bg-[#FCFCFD] p-2.5 sm:p-3.5 flex flex-col justify-between relative text-slate-800 border-r border-dashed border-slate-300">
        {/* Watermark Route Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#071526 1px, transparent 1px)',
            backgroundSize: '8px 8px',
          }}
        />

        {/* Top: Route Information */}
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[7px] uppercase font-bold tracking-wider text-slate-400 block -mb-0.5">
                DEPARTURE
              </span>
              <div className="flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 text-[#B48C56] shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-black text-[#071526] tracking-tight truncate max-w-[95px]">
                  {departureCity}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[7px] uppercase font-bold tracking-wider text-slate-400 block -mb-0.5">
                DESTINATION
              </span>
              <div className="flex items-center gap-1 justify-end">
                <span className="text-[10px] sm:text-[11px] font-black text-[#071526] tracking-tight truncate max-w-[95px]">
                  {arrivalCity}
                </span>
                <MapPin className="w-2.5 h-2.5 text-[#B48C56] shrink-0" />
              </div>
            </div>
          </div>

          {/* Dotted Route Connector Bar */}
          <div className="flex items-center justify-center my-0.5 opacity-60">
            <span className="w-2 h-2 rounded-full border border-[#B48C56] bg-amber-50" />
            <div className="flex-1 border-t-2 border-dotted border-[#B48C56] mx-1" />
            <span className="w-2 h-2 rounded-full bg-[#B48C56]" />
          </div>
        </div>

        {/* Bottom: Journey Stats Grid */}
        <div className="grid grid-cols-4 gap-1 pt-1 border-t border-slate-100 relative z-10 text-center">
          <div>
            <span className="text-[6.5px] uppercase font-bold text-slate-400 block">DATE</span>
            <span className="text-[8.5px] sm:text-[9.5px] font-black text-slate-900 block font-mono">{date}</span>
          </div>
          <div>
            <span className="text-[6.5px] uppercase font-bold text-slate-400 block">TIME</span>
            <span className="text-[8.5px] sm:text-[9.5px] font-black text-slate-900 block font-mono">{time}</span>
          </div>
          <div className="bg-[#B48C56]/10 rounded-md py-0.5">
            <span className="text-[6px] uppercase font-black text-[#8C6B3D] block">SEAT</span>
            <span className="text-[10px] sm:text-[11px] font-black text-[#071526] block leading-none">{seatNumber}</span>
          </div>
          <div>
            <span className="text-[6.5px] uppercase font-bold text-slate-400 block">FARE</span>
            <span className="text-[9px] sm:text-[10px] font-black text-emerald-600 block">{price}</span>
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        3. MIDNIGHT NAVY STUB (Right ~24%)
        ========================================================================
      */}
      <div className="w-[24%] bg-[#071526] p-2.5 sm:p-3 flex flex-col justify-between items-center text-white relative">
        {/* Semi-circular tear notches */}
        <div className="absolute -top-2 left-0 -translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-inner pointer-events-none" />
        <div className="absolute -bottom-2 left-0 -translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-inner pointer-events-none" />

        {/* Top: Simulated Boarding Barcode */}
        <div className="w-full flex items-center justify-center gap-[1.5px] py-1 bg-white/10 rounded px-1.5">
          <span className="w-[2px] h-5 bg-white" />
          <span className="w-[1px] h-5 bg-white/40" />
          <span className="w-[3px] h-5 bg-white" />
          <span className="w-[1.5px] h-5 bg-white" />
          <span className="w-[1px] h-5 bg-white/50" />
          <span className="w-[2px] h-5 bg-white" />
          <span className="w-[3.5px] h-5 bg-white" />
          <span className="w-[1px] h-5 bg-white" />
          <span className="w-[2px] h-5 bg-white" />
          <span className="w-[1.5px] h-5 bg-white" />
          <span className="w-[3px] h-5 bg-white" />
        </div>

        {/* Seat Number in Stub */}
        <div className="text-center my-auto">
          <div className="text-xl sm:text-2xl font-black text-white leading-none font-mono">
            {seatNumber}
          </div>
          <span className="text-[7px] uppercase font-bold text-[#D8B788] tracking-widest block mt-0.5">
            SEAT NUMBER
          </span>
        </div>

        {/* Bottom: Bus Silhouette & Flight Time */}
        <div className="w-full flex items-center justify-between text-[7px] text-slate-400 font-mono border-t border-white/10 pt-1">
          <span className="truncate max-w-[36px]">{time}</span>
          <Bus className="w-2.5 h-2.5 text-[#C5A880] shrink-0" />
        </div>
      </div>
    </div>
  );
}

export default function LuxuryTicketGraphic() {
  return (
    <div className="relative w-full max-w-[380px] sm:max-w-[420px] h-[360px] sm:h-[400px] flex items-center justify-center select-none group">
      
      {/* Soft Ambient Gold/Navy Glow Aura */}
      <div className="absolute -inset-6 bg-gradient-to-tr from-[#C5A880]/20 via-transparent to-[#071526]/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />

      {/* 
        ========================================================================
        REAR TICKET (100% Complete, No Cutoff, Positioned Diagonally at ~-36deg)
        ========================================================================
      */}
      <div 
        className="absolute transition-all duration-500 ease-out transform -rotate-[36deg] translate-x-5 -translate-y-8 sm:translate-x-7 sm:-translate-y-10 group-hover:translate-x-9 group-hover:-translate-y-13 group-hover:-rotate-[39deg] group-hover:scale-[1.02]"
        style={{ transformOrigin: 'center center' }}
      >
        <SingleBoardingTicket
          departureCity="AMSTERDAM"
          arrivalCity="BERLIN"
          date="15.02.2026"
          time="14:30"
          seatNumber="27"
          price="$46"
          ticketRef="NOV-728104"
          className="opacity-95"
        />
      </div>

      {/* 
        ========================================================================
        FRONT TICKET (100% Complete, Pristine Luxury Boarding Pass)
        ========================================================================
      */}
      <div 
        className="absolute transition-all duration-500 ease-out transform -rotate-[36deg] translate-x-0 translate-y-0 z-10 group-hover:-translate-x-1 group-hover:translate-y-1 group-hover:-rotate-[34deg] group-hover:scale-[1.03]"
        style={{ transformOrigin: 'center center' }}
      >
        <SingleBoardingTicket
          departureCity="SAN FRANCISCO"
          arrivalCity="LOS ANGELES"
          date="25.11.2026"
          time="08:30"
          seatNumber="1B"
          price="$45"
          ticketRef="NOV-849201"
        />
      </div>

    </div>
  );
}
