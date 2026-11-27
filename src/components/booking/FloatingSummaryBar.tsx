'use client';

import React from 'react';
import { SeatData } from '@/lib/types';
import { ArrowRight, Trash2, Map, Armchair } from 'lucide-react';
import Link from 'next/link';

interface FloatingSummaryBarProps {
  selectedSeatsList: SeatData[];
  onRemoveSeat: (seat: SeatData) => void;
  onClearAll: () => void;
  onToggle2DMap: () => void;
  busId: string;
  date?: string;
  fromCity?: string;
  toCity?: string;
  isZoomed?: boolean;
}

export default function FloatingSummaryBar({
  selectedSeatsList,
  onRemoveSeat,
  onClearAll,
  onToggle2DMap,
  busId,
  date,
  fromCity,
  toCity,
  isZoomed = false,
}: FloatingSummaryBarProps) {
  // If user is currently inspecting/zoomed into a specific seat, hide summary bar to prevent overlap
  if (isZoomed) return null;

  const totalCount = selectedSeatsList.length;
  // If no seats selected yet, keep the 3D canvas clean and unobstructed
  if (totalCount === 0) return null;

  const totalPrice = selectedSeatsList.reduce((acc, s) => acc + s.price, 0);

  return (
    <div className="fixed bottom-3 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-30 sm:w-[94vw] sm:max-w-2xl animate-in slide-in-from-bottom duration-300">
      <div className="bg-[#071526]/95 backdrop-blur-xl rounded-2xl p-3 sm:p-4 border border-[#B48C56]/35 shadow-[0_15px_40px_rgba(0,0,0,0.7)] flex items-center justify-between gap-3">
        
        {/* Left Side: Selected Seats Badges */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 overflow-x-auto">
          <div className="flex items-center gap-2 pr-2.5 border-r border-slate-700/60 shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#B48C56]/20 border border-[#B48C56]/30 flex items-center justify-center text-[#D8B788]">
              <Armchair className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Reserved</div>
              <div className="text-xs sm:text-sm font-black text-white leading-tight">
                {totalCount} {totalCount > 1 ? 'Suites' : 'Suite'}
              </div>
            </div>
          </div>

          {/* Seat Pills */}
          <div className="flex items-center gap-1.5 flex-nowrap overflow-x-auto py-0.5">
            {selectedSeatsList.map((seat) => (
              <div
                key={seat.id}
                className="flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-lg bg-[#0B192C] border border-white/10 text-white text-[11px] sm:text-xs font-semibold shrink-0"
              >
                <span className="text-[#D8B788]">Suite {seat.seatNumber}</span>
                <span className="text-[10px] text-slate-400">(${seat.price})</span>
                <button
                  onClick={() => onRemoveSeat(seat)}
                  className="p-0.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
                  title={`Remove seat ${seat.seatNumber}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Total Price & Continue CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            onClick={onClearAll}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 bg-[#0B192C] border border-white/10 transition cursor-pointer"
            title="Clear selection"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Total Price */}
          <div className="text-right px-1">
            <div className="text-[9px] uppercase font-bold text-slate-400">Total</div>
            <div className="text-base sm:text-xl font-black text-[#D8B788] leading-tight">
              ${totalPrice}
            </div>
          </div>

          {/* Checkout CTA */}
          <Link
            href={`/checkout?busId=${busId}&seats=${selectedSeatsList.map((s) => s.seatNumber).join(',')}${date ? `&date=${encodeURIComponent(date)}` : ''}${fromCity ? `&from=${encodeURIComponent(fromCity)}` : ''}${toCity ? `&to=${encodeURIComponent(toCity)}` : ''}`}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#A67C41] via-[#8B6226] to-[#694416] hover:from-[#B5894B] hover:via-[#9A6F2E] hover:to-[#774E1B] text-white px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-[0_8px_20px_-4px_rgba(139,98,38,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)] border border-[#E0BE86]/35 transition transform hover:-translate-y-0.5 group cursor-pointer shrink-0"
          >
            <span>Checkout</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-[#FDEBD0]" />
          </Link>
        </div>

      </div>
    </div>
  );
}
