'use client';

import React from 'react';
import { SeatData } from '@/lib/types';
import {
  X,
  Check,
  ShieldCheck,
  Sparkles,
  User,
  Phone,
  ArrowLeft,
  Armchair,
  Bus,
  QrCode,
  Lock,
} from 'lucide-react';

interface SeatDetailsPanelProps {
  seat: SeatData | null;
  isSelected: boolean;
  onConfirmSeat: (seat: SeatData) => void;
  onDeselectSeat: (seat: SeatData) => void;
  onBack: () => void;
  passengerInfo: { name: string; phone: string; email: string };
  onPassengerInfoChange: (info: { name: string; phone: string; email: string }) => void;
}

export default function SeatDetailsPanel({
  seat,
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

  return (
    <div className="fixed top-16 md:top-20 right-3 sm:right-6 md:right-8 z-40 w-[94vw] max-w-md animate-in slide-in-from-right duration-300">
      
      {/* 
        ========================================================================
        AUTHENTIC LUXURY EXECUTIVE BOARDING PASS / TICKET VOUCHER
        Features:
        - Scalloped ticket tear notches on left & right borders
        - Perforated dotted tear line separating pass header from boarding stub
        - Realistic linear barcode, security hologram tag, and gold foil accents
        ========================================================================
      */}
      <div className="relative bg-[#071322]/98 backdrop-blur-2xl rounded-3xl border border-[#C5A880]/35 text-white shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85),0_0_25px_rgba(197,168,128,0.12)] overflow-hidden">
        
        {/* Top Gold Foil Metallic Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#D8B788] via-[#B48C56] to-[#8C6B3D]" />

        {/* 1. TICKET HEADER & CONTROLS */}
        <div className="p-5 pb-4 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0B1E34] to-[#071526] border border-[#C5A880]/40 flex items-center justify-center p-1 shadow-inner">
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
                <span>Cabin Overview</span>
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

        {/* 2. TICKET BODY: SEAT IDENTIFIER & FARE */}
        <div className="p-5 space-y-4">
          
          {/* Main Seat Voucher Block */}
          <div className="bg-gradient-to-br from-[#0B1E34]/90 to-[#071526]/90 rounded-2xl p-4 border border-[#C5A880]/20 shadow-inner flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#C5A880]/20 via-[#B48C56]/10 to-transparent border border-[#C5A880]/40 flex flex-col items-center justify-center text-[#E5C287] shadow-md">
                <Armchair className="w-5 h-5 text-[#E5C287] stroke-[2.2]" />
                <span className="text-[8px] font-black uppercase tracking-wider text-slate-300">SUITE</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-white tracking-tight">
                    {seat.seatNumber}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold uppercase tracking-wider ${
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

            <div className="text-right pl-3 border-l border-white/10">
              <span className="text-[9px] text-[#D8B788] uppercase font-bold tracking-widest block">FARE</span>
              <div className="text-2xl font-black text-[#E5C287] leading-none mt-0.5">${seat.price}</div>
              <span className="text-[9px] text-slate-400 font-medium">All Taxes Incl.</span>
            </div>
          </div>

          {/* Suite Amenities & Specs */}
          <div className="bg-[#0B1E34]/50 rounded-xl p-3.5 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-[#D8B788] uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#D8B788]" />
                <span>Suite Amenities & Specifications</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Guaranteed 3D Seat
              </span>
            </div>
            <div className="grid grid-cols-1 gap-1.5 text-[11px] text-slate-300">
              {seat.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C5A880] shadow-[0_0_6px_rgba(197,168,128,0.8)]" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Passenger Details Form */}
          <div className="space-y-2 pt-1">
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
        <div className="relative py-2 flex items-center justify-center">
          {/* Left Scalloped Semi-Circle Cutout */}
          <div className="absolute -left-3 w-6 h-6 rounded-full bg-[#071322] border-r border-[#C5A880]/35 shadow-inner" />
          {/* Perforated Dotted Tear Line */}
          <div className="w-full border-t-2 border-dashed border-white/20 mx-4" />
          {/* Right Scalloped Semi-Circle Cutout */}
          <div className="absolute -right-3 w-6 h-6 rounded-full bg-[#071322] border-l border-[#C5A880]/35 shadow-inner" />
        </div>

        {/* 3. TICKET BOTTOM STUB: BARCODE & CONFIRM CTA */}
        <div className="p-5 pt-3 bg-gradient-to-b from-transparent to-[#040C16]/90 space-y-4">
          
          {/* Realistic Barcode Ribbon */}
          <div className="flex items-center justify-between px-2">
            <div className="flex gap-0.5 h-6 items-end">
              {[2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 2, 1, 3, 2, 1, 4, 2, 1, 3, 2, 1, 2, 4, 1, 3].map((w, i) => (
                <div key={i} className="bg-[#D8B788]/80" style={{ width: `${w * 1.2}px`, height: '100%' }} />
              ))}
            </div>
            <div className="text-right">
              <span className="text-[9px] font-mono text-slate-400 block tracking-widest">
                VERIFIED TICKET STUB
              </span>
              <span className="text-[10px] font-black text-emerald-400 tracking-wider">
                CONFIRMATION READY
              </span>
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
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#D8B788] via-[#B48C56] to-[#8C6B3D] hover:from-[#E2C799] hover:to-[#B48C56] text-slate-950 font-black text-xs uppercase tracking-widest shadow-[0_12px_28px_rgba(180,140,86,0.4)] hover:shadow-[0_16px_36px_rgba(180,140,86,0.55)] transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Confirm Suite {seat.seatNumber}</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
