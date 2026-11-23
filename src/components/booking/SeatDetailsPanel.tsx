'use client';

import React from 'react';
import { SeatData } from '@/lib/types';
import { X, Check, ShieldCheck, Sparkles, User, Phone, ArrowLeft, Armchair } from 'lucide-react';

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

  return (
    <div className="fixed top-20 right-4 md:right-8 z-40 w-[92vw] max-w-md animate-in slide-in-from-right duration-300">
      <div className="bg-[#071526]/95 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-white shadow-2xl relative overflow-hidden">
        {/* Top Accent Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B48C56] via-[#D8B788] to-[#071526]" />

        {/* Header with Back to Cabin and Close */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-semibold text-[#D8B788] hover:text-white transition px-3 py-1.5 rounded-lg bg-[#B48C56]/20 hover:bg-[#B48C56]/30 border border-[#B48C56]/30"
            title="Return to full bus overview"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cabin Overview</span>
          </button>

          <button
            onClick={onBack}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Seat Badge & Pricing */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-3xl font-black text-white flex items-center gap-2">
                <Armchair className="w-7 h-7 text-[#D8B788]" />
                Seat {seat.seatNumber}
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  isVip
                    ? 'bg-[#B48C56]/20 text-[#D8B788] border border-[#B48C56]/40'
                    : isWindow
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-slate-800 text-slate-300 border border-white/10'
                }`}
              >
                {seat.tier}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Row {seat.row} • {isWindow ? 'Panoramic Window View' : 'Direct Aisle Access'}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Fare</span>
            <div className="text-2xl font-black text-[#D8B788]">${seat.price}</div>
          </div>
        </div>

        {/* Seat Specifications */}
        <div className="bg-[#0B192C]/80 rounded-xl p-4 border border-white/5 mb-5">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2.5">
            Suite Amenities & Specifications
          </span>
          <div className="grid grid-cols-1 gap-2 text-xs text-slate-300">
            {seat.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#B48C56]" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Passenger Quick Name & Details */}
        <div className="space-y-3 mb-6">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Passenger Details (Optional)
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Passenger Full Name"
              value={passengerInfo.name}
              onChange={(e) =>
                onPassengerInfoChange({ ...passengerInfo, name: e.target.value })
              }
              className="w-full bg-[#0B192C] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#B48C56]"
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="tel"
              placeholder="Mobile Phone Number"
              value={passengerInfo.phone}
              onChange={(e) =>
                onPassengerInfoChange({ ...passengerInfo, phone: e.target.value })
              }
              className="w-full bg-[#0B192C] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#B48C56]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {isSelected ? (
            <button
              onClick={() => onDeselectSeat(seat)}
              className="w-full py-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Remove Selection
            </button>
          ) : (
            <button
              onClick={() => onConfirmSeat(seat)}
              className="w-full py-3 rounded-xl bg-[#B48C56] hover:bg-[#A37B47] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Suite {seat.seatNumber}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
