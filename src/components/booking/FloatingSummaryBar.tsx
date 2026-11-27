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
  const totalCount = selectedSeatsList.length;
  const totalPrice = selectedSeatsList.reduce((acc, s) => acc + s.price, 0);

  return (
    <div
      className={`fixed bottom-2 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 w-[96vw] max-w-4xl transition-all duration-300 ${
        isZoomed ? 'hidden sm:block' : 'block'
      }`}
    >
      <div className="bg-[#071526]/95 backdrop-blur-xl rounded-2xl p-2.5 sm:p-4 md:px-6 md:py-4 border border-white/10 shadow-2xl">
        {totalCount === 0 ? (
          /* Sleek single-row bar on mobile when 0 seats selected */
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#B48C56]/20 border border-[#B48C56]/30 flex items-center justify-center text-[#D8B788] shrink-0">
                <Armchair className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">
                  Tap any suite in 3D cabin
                </span>
                <span className="text-[10px] text-slate-400 block sm:hidden">
                  36 Suites available
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:block">
                  Click any seat in 3D coach or open 2D blueprint to select
                </span>
              </div>
            </div>

            <button
              onClick={onToggle2DMap}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#D8B788] hover:text-white bg-[#0B192C] hover:bg-slate-800 border border-white/10 px-3 py-2 rounded-xl transition cursor-pointer shrink-0"
              title="Toggle 2D layout map"
            >
              <Map className="w-3.5 h-3.5 text-[#B48C56]" />
              <span>2D Map</span>
            </button>
          </div>
        ) : (
          /* Active selection with suites, price, and continue CTA */
          <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4">
            {/* Left Side: Selected Seats Badges */}
            <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto overflow-x-auto pb-0.5 md:pb-0">
              <div className="flex items-center gap-2 pr-2.5 border-r border-slate-700/60 shrink-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#B48C56]/20 border border-[#B48C56]/30 flex items-center justify-center text-[#D8B788]">
                  <Armchair className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">Suites</div>
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                    {totalCount} Active
                  </div>
                </div>
              </div>

              {/* Seat Pills */}
              <div className="flex items-center gap-1.5 flex-nowrap sm:flex-wrap overflow-x-auto">
                {selectedSeatsList.map((seat) => (
                  <div
                    key={seat.id}
                    className="flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-lg bg-[#0B192C] border border-white/10 text-white text-[11px] sm:text-xs font-semibold shrink-0"
                  >
                    <span className="text-[#D8B788]">{seat.seatNumber}</span>
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
            <div className="flex items-center justify-between md:justify-end gap-2.5 w-full md:w-auto pt-1 sm:pt-0 border-t sm:border-t-0 border-white/5">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onToggle2DMap}
                  className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-slate-300 hover:text-white bg-[#0B192C] hover:bg-slate-800 border border-white/10 px-2.5 py-1.5 sm:py-2 rounded-xl transition"
                  title="Toggle 2D layout map"
                >
                  <Map className="w-3.5 h-3.5 text-[#B48C56]" />
                  <span className="hidden xs:inline">2D</span>
                </button>

                {totalCount > 0 && (
                  <button
                    onClick={onClearAll}
                    className="p-2 sm:p-2.5 rounded-xl text-slate-400 hover:text-rose-400 bg-[#0B192C] border border-white/10 transition cursor-pointer"
                    title="Clear selection"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Total Price */}
              <div className="text-right px-1">
                <div className="text-[9px] uppercase font-bold text-slate-400">Total</div>
                <div className="text-lg sm:text-2xl font-black text-[#D8B788] leading-tight">
                  ${totalPrice}
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href={`/checkout?busId=${busId}&seats=${selectedSeatsList.map((s) => s.seatNumber).join(',')}${date ? `&date=${encodeURIComponent(date)}` : ''}${fromCity ? `&from=${encodeURIComponent(fromCity)}` : ''}${toCity ? `&to=${encodeURIComponent(toCity)}` : ''}`}
                className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-[#A67C41] via-[#8B6226] to-[#694416] hover:from-[#B5894B] hover:via-[#9A6F2E] hover:to-[#774E1B] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-[0_8px_20px_-4px_rgba(139,98,38,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)] border border-[#E0BE86]/35 transition transform hover:-translate-y-0.5 group cursor-pointer shrink-0"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-[#FDEBD0]" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
