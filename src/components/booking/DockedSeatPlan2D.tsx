'use client';

import React, { useState } from 'react';
import { SeatData } from '@/lib/types';
import {
  Armchair,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Compass,
} from 'lucide-react';

interface DockedSeatPlan2DProps {
  seats: SeatData[];
  selectedSeats: string[];
  activeFocusedSeat: SeatData | null;
  onSeatClick: (seat: SeatData) => void;
}

export default function DockedSeatPlan2D({
  seats,
  selectedSeats,
  activeFocusedSeat,
  onSeatClick,
}: DockedSeatPlan2DProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Group seats by rows 1 to 9
  const rows = Array.from(new Set(seats.map((s) => s.row))).sort((a, b) => a - b);

  return (
    <div
      className={`absolute left-4 top-24 bottom-24 z-20 transition-all duration-300 ease-in-out flex items-start select-none ${
        isCollapsed ? '-translate-x-[calc(100%-12px)]' : 'translate-x-0'
      }`}
    >
      {/* Main Docked Panel */}
      <div className="w-72 max-h-full flex flex-col bg-[#071526]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header with Driver Direction */}
        <div className="px-4 py-3 bg-[#0B192C] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#B48C56]/20 border border-[#B48C56]/30 flex items-center justify-center text-[#D8B788]">
              <Armchair className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                2D Seat Blueprint
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-[#D8B788] border border-amber-500/30">
                  9 Rows
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">Click any seat to zoom in 3D</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="px-3 py-2 bg-[#071526] border-b border-white/5 flex items-center justify-between text-[10px] text-slate-300">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-slate-700 border border-slate-600 inline-block" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-[#B48C56] inline-block" />
            <span className="text-[#D8B788] font-bold">Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-amber-500/30 border border-amber-400/50 inline-block" />
            <span className="text-amber-300">VIP</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-slate-800 border border-slate-700 inline-block" />
            <span className="text-slate-500">Booked</span>
          </div>
        </div>

        {/* Front Direction Indicator */}
        <div className="px-3 pt-2 pb-1 text-center bg-[#071526]/80">
          <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-wider text-slate-400">
            <Compass className="w-3 h-3 text-[#D8B788]" />
            ▲ FRONT • DRIVER COCKPIT
          </div>
        </div>

        {/* Scrollable Seats Grid (Rows 1 to 9) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
          {rows.map((rowNum) => {
            const rowSeats = seats.filter((s) => s.row === rowNum);
            
            // Standard 2x2 layout: A (Window), B (Aisle) --- Aisle --- C (Aisle), D (Window)
            const seatA = rowSeats.find((s) => s.seatNumber.endsWith('A') || s.col === 0);
            const seatB = rowSeats.find((s) => s.seatNumber.endsWith('B') || s.col === 1);
            const seatC = rowSeats.find((s) => s.seatNumber.endsWith('C') || s.col === 2);
            const seatD = rowSeats.find((s) => s.seatNumber.endsWith('D') || s.col === 3);

            const renderSeatButton = (seat?: SeatData) => {
              if (!seat) {
                return <div className="w-8 h-8 rounded-lg border border-dashed border-white/10 opacity-20" />;
              }

              const isSelected = selectedSeats.includes(seat.seatNumber);
              const isFocused = activeFocusedSeat?.seatNumber === seat.seatNumber;
              const isBooked = seat.isBooked;
              const isVip = seat.tier === 'Executive VIP';

              return (
                <button
                  key={seat.id}
                  disabled={isBooked}
                  onClick={() => onSeatClick(seat)}
                  title={`Seat ${seat.seatNumber} • ${seat.tier} • $${seat.price}`}
                  className={`w-8 h-8 rounded-lg flex flex-col items-center justify-center text-[10px] font-bold transition-all duration-150 relative cursor-pointer ${
                    isBooked
                      ? 'bg-slate-800/80 text-slate-600 border border-slate-700/50 cursor-not-allowed'
                      : isSelected
                      ? 'bg-[#B48C56] text-slate-950 font-black shadow-md shadow-amber-500/20 scale-105'
                      : isFocused
                      ? 'bg-sky-500 text-white ring-2 ring-sky-300 shadow-md scale-105'
                      : isVip
                      ? 'bg-[#0B192C] text-[#D8B788] border border-amber-500/40 hover:border-amber-400 hover:bg-amber-950/30'
                      : 'bg-slate-800 text-slate-200 border border-white/10 hover:border-white/30 hover:bg-slate-700'
                  }`}
                >
                  <span>{seat.seatNumber}</span>
                  {isVip && !isSelected && !isBooked && (
                    <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
                </button>
              );
            };

            return (
              <div
                key={rowNum}
                className="flex items-center justify-between px-2 py-1 rounded-xl bg-white/2 hover:bg-white/5 transition border border-white/5"
              >
                {/* Left Side: A (Window) & B (Aisle) */}
                <div className="flex items-center gap-1.5">
                  {renderSeatButton(seatA)}
                  {renderSeatButton(seatB)}
                </div>

                {/* Center Aisle Indicator with Row Number */}
                <div className="flex flex-col items-center justify-center w-6 text-[9px] font-mono font-bold text-slate-500">
                  <span>R{rowNum}</span>
                </div>

                {/* Right Side: C (Aisle) & D (Window) */}
                <div className="flex items-center gap-1.5">
                  {renderSeatButton(seatC)}
                  {renderSeatButton(seatD)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="p-2.5 bg-[#0B192C] border-t border-white/10 text-[10px] text-center text-slate-400 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#D8B788]" />
          <span>Click any row 1–9 to glide 3D camera</span>
        </div>
      </div>

      {/* Collapse / Expand Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="mt-4 -ml-1 p-2 rounded-r-xl bg-[#0B192C] text-[#D8B788] border-y border-r border-white/10 shadow-xl hover:bg-[#071526] hover:text-white transition cursor-pointer flex items-center justify-center"
        title={isCollapsed ? 'Expand 2D Seat Plan' : 'Collapse 2D Seat Plan'}
      >
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-1">
            <ChevronRight className="w-4 h-4" />
            <span className="text-[9px] font-bold uppercase [writing-mode:vertical-lr] tracking-widest text-[#D8B788]">
              2D Plan
            </span>
          </div>
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
