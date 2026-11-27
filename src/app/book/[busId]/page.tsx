'use client';

import React, { useState, use, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ArrowLeft,
  RotateCcw,
  Map,
  Eye,
  Armchair,
  Sparkles,
} from 'lucide-react';
import { BusDetails, SeatData } from '@/lib/types';
import { INITIAL_BUSES } from '@/lib/mock-data';
import SeatDetailsPanel from '@/components/booking/SeatDetailsPanel';
import FloatingSummaryBar from '@/components/booking/FloatingSummaryBar';
import SeatMap2DModal from '@/components/booking/SeatMap2DModal';
import DockedSeatPlan2D from '@/components/booking/DockedSeatPlan2D';

// Dynamically import 3D Bus Scene to bypass SSR WebGL restrictions
const BusInteriorScene = dynamic(
  () => import('@/components/3d/BusInteriorScene'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#080B11]">
        <div className="w-12 h-12 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold text-slate-300 tracking-widest uppercase">
          Initializing 3D Luxury Coach Interior...
        </p>
      </div>
    ),
  }
);

export default function BookBusPage({
  params,
}: {
  params: Promise<{ busId: string }>;
}) {
  const resolvedParams = use(params);
  const busId = resolvedParams.busId;

  // Retrieve current bus
  const [bus, setBus] = useState<BusDetails>(() => {
    const found = INITIAL_BUSES.find((b) => b.id === busId);
    return found || INITIAL_BUSES[0];
  });

  // Sync date and corridor route from URL query params (e.g. from /routes search)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      const queryDate = sp.get('date');
      const queryFrom = sp.get('from');
      const queryTo = sp.get('to');
      if (queryDate || queryFrom || queryTo) {
        setBus((prev) => ({
          ...prev,
          ...(queryDate ? { date: queryDate } : {}),
          ...(queryFrom ? { fromCity: queryFrom } : {}),
          ...(queryTo ? { toCity: queryTo } : {}),
        }));
      }
    }
  }, []);

  // Seat selection state
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState<string[]>([]);
  const [activeFocusedSeat, setActiveFocusedSeat] = useState<SeatData | null>(null);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [hoveredSeat, setHoveredSeat] = useState<SeatData | null>(null);

  // 2D blueprint overlay modal
  const [is2DMapOpen, setIs2DMapOpen] = useState(false);

  // Quick passenger details
  const [passengerInfo, setPassengerInfo] = useState({
    name: '',
    phone: '',
    email: '',
  });

  // Handle clicking a 3D seat: smoothly zoom in toward that specific seat
  const handleSeatClick = (seat: SeatData) => {
    if (seat.isBooked) return;

    setActiveFocusedSeat(seat);
    setIsZoomed(true);
  };

  // Confirm seat selection and return to overview
  const handleConfirmSeat = (seat: SeatData) => {
    if (!selectedSeatNumbers.includes(seat.seatNumber)) {
      setSelectedSeatNumbers((prev) => [...prev, seat.seatNumber]);
    }
    handleBackToOverview();
  };

  // Deselect a seat
  const handleDeselectSeat = (seat: SeatData) => {
    setSelectedSeatNumbers((prev) => prev.filter((s) => s !== seat.seatNumber));
    if (activeFocusedSeat?.seatNumber === seat.seatNumber) {
      handleBackToOverview();
    }
  };

  // Smoothly restore full-bus camera view (entire bus visible again)
  const handleBackToOverview = () => {
    setIsZoomed(false);
    setActiveFocusedSeat(null);
  };

  // Selected seats objects list for pricing calculation
  const selectedSeatsList = bus.seats.filter((s) =>
    selectedSeatNumbers.includes(s.seatNumber)
  );

  return (
    <div className="relative w-screen h-[calc(100dvh-5rem)] bg-[#071526] overflow-hidden select-none">
      
      {/* 1. TOP UNIFIED NAVIGATION & ACTION BAR (Single elegant row, zero overlap) */}
      <div className="absolute top-3 inset-x-3 z-30 flex items-center justify-between gap-2 pointer-events-none">
        
        {/* Left: Back button + Coach Route Info */}
        <div className="pointer-events-auto flex items-center gap-2 bg-[#071526]/90 backdrop-blur-md px-2.5 sm:px-3 py-1.5 rounded-2xl border border-white/10 shadow-xl min-w-0">
          <Link
            href="/routes"
            className="p-1.5 rounded-xl hover:bg-white/10 text-[#D8B788] transition shrink-0"
            title="Return to schedules"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0 leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-white tracking-wide truncate max-w-[130px] xs:max-w-[180px] sm:max-w-none">
                {bus.name}
              </span>
              <span className="hidden xs:inline-block text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#B48C56]/20 text-[#D8B788] border border-[#B48C56]/30 uppercase shrink-0">
                {bus.type}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">
              {bus.fromCity} → {bus.toCity} <span className="hidden xs:inline">• {bus.departureTime}</span>
            </p>
          </div>
        </div>

        {/* Right: Context-Aware Action (Overview when zoomed, 2D Blueprint when overview) */}
        <div className="pointer-events-auto flex items-center gap-1.5 shrink-0">
          {isZoomed ? (
            <button
              onClick={handleBackToOverview}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#B48C56] hover:bg-[#A37B47] text-slate-950 font-black text-xs shadow-xl transition cursor-pointer"
              title="Reset 3D camera to full coach overview"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>
          ) : (
            <button
              onClick={() => setIs2DMapOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#071526]/90 hover:bg-[#0B192C] text-slate-200 border border-white/10 text-xs font-bold shadow-xl transition backdrop-blur-md cursor-pointer"
              title="Open 2D Seat Map"
            >
              <Map className="w-3.5 h-3.5 text-[#D8B788]" />
              <span>2D Map</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. 3D INTERACTION HINT PILL (Clean floating pill near bottom, auto-hides on zoom or seat selection) */}
      {!isZoomed && selectedSeatNumbers.length === 0 && (
        <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none max-w-[92vw] animate-in fade-in">
          <div className="flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full bg-[#071526]/85 backdrop-blur-md border border-white/10 text-[11px] sm:text-xs font-medium text-slate-300 shadow-xl whitespace-nowrap">
            <Eye className="w-3.5 h-3.5 text-[#D8B788] shrink-0" />
            <span className="sm:hidden">Tap suite to inspect • Drag to rotate</span>
            <span className="hidden sm:inline">Click any seat to zoom in & inspect • Drag to rotate coach</span>
          </div>
        </div>
      )}

      {/* 3. HOVERED SEAT TOOLTIP OVERLAY */}
      {hoveredSeat && !isZoomed && (
        <div className="absolute bottom-24 left-4 z-20 pointer-events-none animate-in fade-in hidden sm:block">
          <div className="bg-[#071526]/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 shadow-2xl text-xs text-white">
            <div className="font-bold flex items-center gap-2">
              <Armchair className="w-3.5 h-3.5 text-[#D8B788]" />
              <span>Suite {hoveredSeat.seatNumber}</span>
              <span className="text-[10px] text-[#D8B788] font-semibold uppercase tracking-wider">
                ({hoveredSeat.tier})
              </span>
            </div>
            <div className="text-slate-400 text-[10px] mt-0.5">
              ${hoveredSeat.price} • {hoveredSeat.isWindow ? 'Panoramic Window' : 'Direct Aisle Access'}
            </div>
          </div>
        </div>
      )}

      {/* 4. THE FLAGSHIP 3D CUTAWAY COACH CANVAS */}
      <div className="w-full h-full">
        <BusInteriorScene
          seats={bus.seats}
          selectedSeats={selectedSeatNumbers}
          activeFocusedSeat={activeFocusedSeat}
          onSeatClick={handleSeatClick}
          onHoverSeat={setHoveredSeat}
          isZoomed={isZoomed}
        />
      </div>

      {/* 4b. DOCKED 2D SEAT BLUEPRINT (Quick 1-click access to all 9 rows without zooming out) */}
      <DockedSeatPlan2D
        seats={bus.seats}
        selectedSeats={selectedSeatNumbers}
        activeFocusedSeat={activeFocusedSeat}
        onSeatClick={handleSeatClick}
      />

      {/* 5. SEAT DETAILS SLIDE-IN PANEL (When seat is zoomed in) */}
      <SeatDetailsPanel
        seat={activeFocusedSeat}
        bus={bus}
        isSelected={
          activeFocusedSeat
            ? selectedSeatNumbers.includes(activeFocusedSeat.seatNumber)
            : false
        }
        onConfirmSeat={handleConfirmSeat}
        onDeselectSeat={handleDeselectSeat}
        onBack={handleBackToOverview}
        passengerInfo={passengerInfo}
        onPassengerInfoChange={setPassengerInfo}
      />

      {/* 6. FLOATING MULTI-SEAT SUMMARY BAR */}
      <FloatingSummaryBar
        selectedSeatsList={selectedSeatsList}
        onRemoveSeat={handleDeselectSeat}
        onClearAll={() => setSelectedSeatNumbers([])}
        onToggle2DMap={() => setIs2DMapOpen(true)}
        busId={bus.id}
        date={bus.date}
        fromCity={bus.fromCity}
        toCity={bus.toCity}
        isZoomed={isZoomed}
      />

      {/* 7. 2D BLUEPRINT MODAL */}
      <SeatMap2DModal
        isOpen={is2DMapOpen}
        onClose={() => setIs2DMapOpen(false)}
        seats={bus.seats}
        selectedSeats={selectedSeatNumbers}
        onSeatSelect={(seat) => {
          if (selectedSeatNumbers.includes(seat.seatNumber)) {
            handleDeselectSeat(seat);
          } else {
            handleSeatClick(seat);
            setIs2DMapOpen(false);
          }
        }}
      />
    </div>
  );
}
