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
}

export default function FloatingSummaryBar({
  selectedSeatsList,
  onRemoveSeat,
  onClearAll,
  onToggle2DMap,
  busId,
}: FloatingSummaryBarProps) {
  const totalCount = selectedSeatsList.length;
  const totalPrice = selectedSeatsList.reduce((acc, s) => acc + s.price, 0);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-[95vw] max-w-4xl animate-in slide-in-from-bottom duration-300">
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-4 md:px-6 md:py-4 border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Left Side: Selected Seats Badges */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-2.5 pr-3 border-r border-slate-700/60 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Armchair className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Reservation</div>
              <div className="text-sm font-bold text-white leading-tight">
                {totalCount > 0 ? `${totalCount} Suite${totalCount > 1 ? 's' : ''}` : 'No Seats'}
              </div>
            </div>
          </div>

          {/* Seat Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {totalCount === 0 ? (
              <span className="text-xs text-slate-400 italic">
                Click any seat in 3D cabin or use 2D map to choose
              </span>
            ) : (
              selectedSeatsList.map((seat) => (
                <div
                  key={seat.id}
                  className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg bg-slate-800/80 border border-white/10 text-white text-xs font-semibold"
                >
                  <span className="text-amber-400">Suite {seat.seatNumber}</span>
                  <span className="text-[10px] text-slate-300">(${seat.price})</span>
                  <button
                    onClick={() => onRemoveSeat(seat)}
                    className="p-0.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 transition"
                    title={`Remove seat ${seat.seatNumber}`}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Total Price & Continue CTA */}
        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
          <button
            onClick={onToggle2DMap}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-white/10 px-3 py-2.5 rounded-xl transition"
            title="Toggle 2D layout map"
          >
            <Map className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">2D Layout</span>
          </button>

          {totalCount > 0 && (
            <button
              onClick={onClearAll}
              className="p-2.5 rounded-xl text-slate-400 hover:text-rose-400 bg-slate-800/80 border border-white/10 transition"
              title="Clear selection"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {/* Total Price */}
          <div className="text-right px-2">
            <div className="text-[10px] uppercase font-bold text-slate-400">Total</div>
            <div className="text-xl md:text-2xl font-black text-amber-400 leading-tight">
              ${totalPrice}
            </div>
          </div>

          {/* Checkout CTA */}
          {totalCount > 0 ? (
            <Link
              href={`/checkout?busId=${busId}&seats=${selectedSeatsList.map((s) => s.seatNumber).join(',')}`}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg transition group"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <button
              disabled
              className="flex items-center gap-2 bg-slate-800 text-slate-500 px-5 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider cursor-not-allowed border border-white/5"
            >
              Select Seats
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
