'use client';

import React from 'react';
import { SeatData } from '@/lib/types';
import { X, Armchair, Check } from 'lucide-react';

interface SeatMap2DModalProps {
  isOpen: boolean;
  onClose: () => void;
  seats: SeatData[];
  selectedSeats: string[];
  onSeatSelect: (seat: SeatData) => void;
}

export default function SeatMap2DModal({
  isOpen,
  onClose,
  seats,
  selectedSeats,
  onSeatSelect,
}: SeatMap2DModalProps) {
  if (!isOpen) return null;

  const rows = Array.from(new Set(seats.map((s) => s.row))).sort((a, b) => a - b);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Armchair className="w-5 h-5 text-amber-400" />
              2D Cabin Blueprint
            </h3>
            <p className="text-xs text-slate-400">
              Click any suite to select or focus in 3D interactive mode
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-300 py-2.5 px-4 rounded-xl bg-slate-800/80 border border-white/5 mb-6">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-slate-700 border border-slate-600 shadow-xs" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-amber-500 shadow-xs" />
            <span className="text-amber-400 font-bold">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-amber-600/30 border border-amber-500/30" />
            <span className="text-amber-300">Executive VIP</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-slate-800 border border-slate-700" />
            <span className="text-slate-500">Booked</span>
          </div>
        </div>

        {/* Coach Front Indicator */}
        <div className="text-center mb-6">
          <div className="inline-block px-5 py-1.5 rounded-full bg-slate-800 border border-white/5 text-[10px] uppercase font-bold tracking-widest text-slate-400">
            ▲ Front Driver Cockpit
          </div>
        </div>

        {/* 2D Bus Interior Seat Grid (2 + 2 layout) */}
        <div className="space-y-3 bg-slate-950/60 p-6 rounded-2xl border border-white/5">
          {rows.map((rowNum) => {
            const rowSeats = seats.filter((s) => s.row === rowNum);
            const leftSeats = rowSeats.filter((s) => s.col === 0 || s.col === 1 || s.seatNumber.endsWith('A') || s.seatNumber.endsWith('B'));
            const rightSeats = rowSeats.filter((s) => s.col === 2 || s.col === 3 || s.seatNumber.endsWith('C') || s.seatNumber.endsWith('D'));

            return (
              <div key={rowNum} className="flex items-center justify-between gap-4">
                {/* Left 2 seats (A, B) */}
                <div className="flex items-center gap-2">
                  {leftSeats.map((seat) => {
                    const isSelected = selectedSeats.includes(seat.seatNumber);
                    const isBooked = seat.isBooked;
                    const isVip = seat.tier === 'Executive VIP';

                    return (
                      <button
                        key={seat.id}
                        disabled={isBooked}
                        onClick={() => onSeatSelect(seat)}
                        className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all relative ${
                          isBooked
                            ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700/50'
                            : isSelected
                            ? 'bg-amber-500 text-slate-950 shadow-lg font-black scale-105'
                            : isVip
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 hover:bg-amber-500/25'
                            : 'bg-slate-800 text-white border border-white/10 hover:border-amber-400/50 hover:bg-slate-700'
                        }`}
                        title={`Seat ${seat.seatNumber} (${seat.tier}) - $${seat.price}`}
                      >
                        {isSelected && (
                          <div className="absolute top-1 right-1">
                            <Check className="w-2.5 h-2.5 text-slate-950 stroke-[3]" />
                          </div>
                        )}
                        <span>{seat.seatNumber}</span>
                        <span className="text-[9px] opacity-75">${seat.price}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Center Aisle Indicator */}
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-[10px] text-slate-600 uppercase font-mono tracking-widest">
                    Row {rowNum}
                  </span>
                </div>

                {/* Right 2 seats (C, D) */}
                <div className="flex items-center gap-2">
                  {rightSeats.map((seat) => {
                    const isSelected = selectedSeats.includes(seat.seatNumber);
                    const isBooked = seat.isBooked;
                    const isVip = seat.tier === 'Executive VIP';

                    return (
                      <button
                        key={seat.id}
                        disabled={isBooked}
                        onClick={() => onSeatSelect(seat)}
                        className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all relative ${
                          isBooked
                            ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700/50'
                            : isSelected
                            ? 'bg-amber-500 text-slate-950 shadow-lg font-black scale-105'
                            : isVip
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 hover:bg-amber-500/25'
                            : 'bg-slate-800 text-white border border-white/10 hover:border-amber-400/50 hover:bg-slate-700'
                        }`}
                        title={`Seat ${seat.seatNumber} (${seat.tier}) - $${seat.price}`}
                      >
                        {isSelected && (
                          <div className="absolute top-1 right-1">
                            <Check className="w-2.5 h-2.5 text-slate-950 stroke-[3]" />
                          </div>
                        )}
                        <span>{seat.seatNumber}</span>
                        <span className="text-[9px] opacity-75">${seat.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Coach Rear Indicator */}
        <div className="text-center mt-6">
          <div className="inline-block px-5 py-1.5 rounded-full bg-slate-800 border border-white/5 text-[10px] uppercase font-bold tracking-widest text-slate-400">
            ▼ Rear Executive Suite & Restroom
          </div>
        </div>
      </div>
    </div>
  );
}
