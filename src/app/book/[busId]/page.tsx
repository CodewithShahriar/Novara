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
      
      {/* 1. TOP STATUS & NAVIGATION OVERLAY BAR (Compact, single-row responsive layout) */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-30 flex items-center justify-between gap-1.5 sm:gap-4 pointer-events-none">
        
        {/* Left: Route info & back to schedules */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-3 min-w-0">
          <Link
            href="/routes"
            className="flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2 rounded-xl bg-[#071526]/95 hover:bg-[#0B192C] text-slate-200 border border-white/10 text-xs font-semibold shadow-lg transition backdrop-blur-md shrink-0"
            title="Return to schedules"
          >
            <ArrowLeft className="w-4 h-4 text-[#D8B788]" />
            <span className="hidden sm:inline">All Schedules</span>
          </Link>

          <div className="bg-[#071526]/95 backdrop-blur-md px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-white/10 shadow-lg flex items-center gap-2 min-w-0">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs font-bold text-white tracking-wide truncate max-w-[110px] xs:max-w-[160px] sm:max-w-none">
                  {bus.name}
                </span>
                <span className="hidden xs:inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#B48C56]/20 text-[#D8B788] border border-[#B48C56]/30 uppercase tracking-wider shrink-0">
                  {bus.type}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                {bus.fromCity} → {bus.toCity} <span className="hidden xs:inline">• {bus.departureTime}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Camera Reset & 2D Blueprint Actions */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Reset Camera to Full Cabin Overview */}
          <button
            onClick={handleBackToOverview}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition shadow-lg backdrop-blur-md cursor-pointer ${
              isZoomed
                ? 'bg-[#B48C56] text-slate-950 hover:bg-[#A37B47]'
                : 'bg-[#071526]/95 hover:bg-[#0B192C] text-slate-200 border border-white/10'
            }`}
            title="Reset 3D camera to full coach overview"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Cabin Overview</span>
          </button>

          {/* 2D Map Blueprint toggle */}
          <button
            onClick={() => setIs2DMapOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#071526]/95 hover:bg-[#0B192C] text-slate-200 border border-white/10 text-xs font-semibold shadow-lg transition backdrop-blur-md cursor-pointer"
            title="Open 2D Seat Map"
          >
            <Map className="w-3.5 h-3.5 text-[#D8B788]" />
            <span className="text-xs">2D</span>
            <span className="hidden md:inline">Blueprint</span>
          </button>
        </div>
      </div>

      {/* 2. 3D INTERACTION HINT PILL (Only visible in overview mode, clean responsive positioning) */}
      {!isZoomed && (
        <div className="absolute top-14 sm:top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none max-w-[92vw] animate-in fade-in">
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#071526]/90 backdrop-blur-md border border-white/10 text-[11px] sm:text-xs font-medium text-slate-300 shadow-xl whitespace-nowrap overflow-hidden text-ellipsis">
            <Eye className="w-3.5 h-3.5 text-[#D8B788] shrink-0" />
            <span className="sm:hidden">Tap seat to inspect • Drag to rotate</span>
            <span className="hidden sm:inline">Click any seat to zoom in & inspect • Drag to rotate coach</span>
          </div>
        </div>
      )}

      {/* 3. HOVERED SEAT TOOLTIP OVERLAY */}
      {hoveredSeat && !isZoomed && (
        <div className="absolute bottom-28 left-6 z-20 pointer-events-none animate-in fade-in">
          <div className="bg-[#071526]/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 shadow-2xl text-xs text-white">
            <div className="font-bold flex items-center gap-2">
              <Armchair className="w-4 h-4 text-[#D8B788]" />
              <span>Seat {hoveredSeat.seatNumber}</span>
              <span className="text-[10px] text-[#D8B788] font-semibold uppercase tracking-wider">
                ({hoveredSeat.tier})
              </span>
            </div>
            <div className="text-slate-400 text-[11px] mt-0.5">
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
