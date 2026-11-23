'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  MapPin,
  Calendar,
  Users,
  Search,
  Filter,
  Clock,
  Wifi,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  Zap,
  Armchair,
  SlidersHorizontal,
  Bus,
  Eye,
  Sunrise,
  Sun,
  Sunset,
  Moon,
} from 'lucide-react';
import { INITIAL_BUSES, CITIES } from '@/lib/mock-data';

const TIME_SLOTS = [
  { id: '00-06', range: '00-06', label: 'Early Morning (00:00 - 06:00)', icon: Sunrise },
  { id: '06-12', range: '06-12', label: 'Morning (06:00 - 12:00)', icon: Sun },
  { id: '12-18', range: '12-18', label: 'Afternoon (12:00 - 18:00)', icon: Sunset },
  { id: '18-00', range: '18-00', label: 'Night (18:00 - 24:00)', icon: Moon },
];

function getSlotForTime(timeStr: string): string {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return '06-12';
  let hour = parseInt(match[1], 10);
  const isPM = match[3]?.toUpperCase() === 'PM';
  const isAM = match[3]?.toUpperCase() === 'AM';
  if (isPM && hour < 12) hour += 12;
  if (isAM && hour === 12) hour = 0;

  if (hour >= 0 && hour < 6) return '00-06';
  if (hour >= 6 && hour < 12) return '06-12';
  if (hour >= 12 && hour < 18) return '12-18';
  return '18-00';
}

function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

function RoutesContent() {
  const searchParams = useSearchParams();

  const [fromCity, setFromCity] = useState(
    searchParams.get('from') || 'San Francisco'
  );
  const [toCity, setToCity] = useState(
    searchParams.get('to') || 'Los Angeles'
  );
  const [date, setDate] = useState(
    searchParams.get('date') || '2026-11-25'
  );

  const [selectedOperator, setSelectedOperator] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(150);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('all');
  const [sortOption, setSortOption] = useState<'price-asc' | 'price-desc' | 'duration' | 'rating'>('price-asc');
  const [isFiltering, setIsFiltering] = useState(false);

  // Trigger brief luxury pulsing loader whenever search criteria or filters change
  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setIsFiltering(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [date, fromCity, toCity, selectedTimeSlot, selectedOperator, maxPrice, sortOption]);

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('date', newDate);
      url.searchParams.set('from', fromCity);
      url.searchParams.set('to', toCity);
      window.history.replaceState(null, '', url.toString());
    }
  };

  const handleFromCityChange = (city: string) => {
    setFromCity(city);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('from', city);
      url.searchParams.set('to', toCity);
      url.searchParams.set('date', date);
      window.history.replaceState(null, '', url.toString());
    }
  };

  const handleToCityChange = (city: string) => {
    setToCity(city);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('to', city);
      url.searchParams.set('from', fromCity);
      url.searchParams.set('date', date);
      window.history.replaceState(null, '', url.toString());
    }
  };

  const filteredBuses = useMemo(() => {
    let list = INITIAL_BUSES.map((b) => ({
      ...b,
      date,
      fromCity,
      toCity,
    }));

    if (selectedOperator !== 'all') {
      list = list.filter((b) => b.operator === selectedOperator);
    }

    list = list.filter((b) => b.basePrice <= maxPrice);

    if (selectedTimeSlot !== 'all') {
      list = list.filter((b) => getSlotForTime(b.departureTime) === selectedTimeSlot);
    }

    if (sortOption === 'price-asc') {
      list.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortOption === 'price-desc') {
      list.sort((a, b) => b.basePrice - a.basePrice);
    } else if (sortOption === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [selectedOperator, maxPrice, selectedTimeSlot, sortOption, fromCity, toCity, date]);

  const operators = Array.from(new Set(INITIAL_BUSES.map((b) => b.operator)));

  return (
    <div className="min-h-screen bg-[#071526] text-slate-100 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Search Criteria Bar */}
        <div className="bg-[#0B192C]/90 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-2xl mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            {/* Origin */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#B48C56]" />
                From
              </label>
              <select
                value={fromCity}
                onChange={(e) => handleFromCityChange(e.target.value)}
                className="w-full bg-[#071526] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-[#B48C56]"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c} className="bg-[#071526] text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#B48C56]" />
                To
              </label>
              <select
                value={toCity}
                onChange={(e) => handleToCityChange(e.target.value)}
                className="w-full bg-[#071526] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-[#B48C56]"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c} className="bg-[#071526] text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Journey Date */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#B48C56]" />
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full bg-[#071526] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-medium focus:outline-none focus:border-[#B48C56] [color-scheme:dark]"
              />
            </div>

            {/* Status indicator */}
            <div className="flex items-center justify-between sm:justify-end gap-3 pt-4 sm:pt-0">
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Live Dispatch
                </span>
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 justify-end">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isFiltering
                        ? 'bg-[#E5C287] animate-ping'
                        : 'bg-emerald-400 animate-pulse'
                    }`}
                  />
                  <span className={isFiltering ? 'text-[#E5C287] font-semibold' : ''}>
                    {isFiltering ? 'Syncing...' : 'Real-Time 3D Seats'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Layout: Filters Sidebar + Bus Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#0B192C]/80 border border-white/10 rounded-2xl p-5 space-y-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#B48C56]" />
                  Filter Schedules
                </h3>
                <button
                  onClick={() => {
                    setSelectedOperator('all');
                    setMaxPrice(150);
                    setSelectedTimeSlot('all');
                  }}
                  className="text-xs text-[#D8B788] font-semibold hover:underline cursor-pointer"
                >
                  Reset
                </button>
              </div>

              {/* Operator */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Coach Line
                </label>
                <select
                  value={selectedOperator}
                  onChange={(e) => setSelectedOperator(e.target.value)}
                  className="w-full bg-[#071526] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B48C56]"
                >
                  <option value="all" className="bg-[#071526]">All Coach Lines</option>
                  {operators.map((op) => (
                    <option key={op} value={op} className="bg-[#071526]">
                      {op}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Max Ticket Price</span>
                  <span className="text-[#D8B788] font-bold">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="150"
                  step="5"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#B48C56] cursor-pointer"
                />
              </div>

              {/* Departure Time Slots Filter (Matches Reference UI) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    Departure Time
                  </label>
                  {selectedTimeSlot !== 'all' && (
                    <button
                      type="button"
                      onClick={() => setSelectedTimeSlot('all')}
                      className="text-[10px] text-[#D8B788] hover:underline cursor-pointer lowercase"
                    >
                      clear
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-[#071526]/80 border border-white/10">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = selectedTimeSlot === slot.id;
                    const Icon = slot.icon;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedTimeSlot(isSelected ? 'all' : slot.id)}
                        className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-b from-[#A67C41]/35 to-[#694416]/50 border border-[#E0BE86]/50 text-[#FDEBD0] shadow-[0_4px_12px_rgba(166,124,65,0.25)]'
                            : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                        title={slot.label}
                      >
                        <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-[#E5C287]' : 'text-slate-400'}`} />
                        <span className="text-[11px] font-bold tracking-tight">{slot.range}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3D Callout */}
              <div className="p-4 rounded-xl bg-[#B48C56]/10 border border-[#B48C56]/20 text-xs">
                <div className="font-bold text-[#D8B788] mb-1 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#B48C56]" />
                  3D Seat Reservation
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Every coach allows you to inspect the real cutaway interior, select specific seats, and zoom in.
                </p>
              </div>
            </div>
          </div>

          {/* Bus Results List */}
          <div className="lg:col-span-3 space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
              <div className="text-xs text-slate-300">
                Found <span className="text-[#D8B788] font-bold">{filteredBuses.length}</span> luxury coaches for{' '}
                <span className="text-white font-bold">{fromCity} → {toCity}</span> on{' '}
                <span className="text-[#E5C287] font-bold">{formatDateDisplay(date)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Sort by:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                  className="bg-[#0B192C] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                >
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* List or Pulsing Loader */}
            {isFiltering ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Pulsing indicator banner */}
                <div className="flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-[#0B192C]/80 border border-[#B48C56]/30 text-xs text-[#E5C287] shadow-lg backdrop-blur-md">
                  <div className="relative flex items-center justify-center">
                    <span className="w-3 h-3 rounded-full bg-[#B48C56] animate-ping absolute opacity-75" />
                    <span className="w-2 h-2 rounded-full bg-[#B48C56]" />
                  </div>
                  <span className="font-semibold uppercase tracking-wider text-[11px] animate-pulse">
                    Updating Schedules for {fromCity} → {toCity} ({formatDateDisplay(date)})...
                  </span>
                </div>

                {/* 3 Luxury Pulsing Skeleton Cards */}
                {[1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className="bg-[#0B192C]/70 border border-white/5 rounded-2xl p-6 shadow-xl animate-pulse space-y-4"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-2.5 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-28 bg-white/10 rounded-md" />
                          <div className="h-4 w-20 bg-white/5 rounded-md" />
                        </div>
                        <div className="h-6 w-52 bg-white/10 rounded-lg" />
                        <div className="h-4 w-36 bg-white/5 rounded-md" />
                      </div>

                      <div className="flex items-center justify-between sm:justify-center gap-8 py-2">
                        <div className="space-y-1 text-center">
                          <div className="h-5 w-16 bg-white/10 rounded mx-auto" />
                          <div className="h-3 w-14 bg-white/5 rounded mx-auto" />
                        </div>
                        <div className="w-24 sm:w-32 h-1 bg-white/10 rounded-full" />
                        <div className="space-y-1 text-center">
                          <div className="h-5 w-16 bg-white/10 rounded mx-auto" />
                          <div className="h-3 w-14 bg-white/5 rounded mx-auto" />
                        </div>
                      </div>

                      <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3">
                        <div className="h-7 w-20 bg-white/10 rounded-lg" />
                        <div className="h-10 w-36 bg-gradient-to-r from-[#A67C41]/30 to-[#694416]/30 border border-[#E0BE86]/20 rounded-xl" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredBuses.length === 0 ? (
              <div className="bg-[#0B192C] border border-white/10 rounded-2xl p-12 text-center space-y-3 shadow-xl">
                <Bus className="w-8 h-8 text-slate-500 mx-auto" />
                <h4 className="text-base font-bold text-white">No Coaches Match Your Filter</h4>
                <p className="text-xs text-slate-400">Try adjusting your price range or coach operators.</p>
              </div>
            ) : (
              filteredBuses.map((bus) => (
                <div
                  key={bus.id}
                  className="bg-[#0B192C]/90 border border-white/10 rounded-2xl p-6 transition-all hover:border-[#B48C56]/40 shadow-xl"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Bus Operator & Model Info */}
                    <div className="space-y-2 lg:max-w-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-[#D8B788] uppercase tracking-wider">
                          {bus.operator}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                          {bus.type}
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-white">{bus.name}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-[#D8B788]">
                        <Star className="w-3.5 h-3.5 fill-[#D8B788]" />
                        <span className="font-bold">{bus.rating}</span>
                        <span className="text-slate-400">• Executive Touring Coach</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 text-[11px] text-[#E5C287] font-semibold bg-[#B48C56]/15 border border-[#B48C56]/30 px-2.5 py-0.5 rounded-md mt-1">
                        <Calendar className="w-3 h-3 text-[#B48C56]" />
                        <span>{formatDateDisplay(date)}</span>
                      </div>
                    </div>

                    {/* Timeline: Departure -> Duration -> Arrival */}
                    <div className="flex items-center justify-between sm:justify-center gap-6 sm:gap-10 border-y lg:border-y-0 lg:border-x border-white/10 py-4 lg:py-0 lg:px-8">
                      <div className="text-center sm:text-left">
                        <div className="text-lg font-black text-white">{bus.departureTime}</div>
                        <div className="text-xs text-[#E5C287] font-semibold">{bus.fromCity}</div>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          {bus.duration}
                        </span>
                        <div className="w-24 sm:w-32 h-0.5 bg-slate-700 relative flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-[#B48C56]" />
                        </div>
                        <span className="text-[10px] text-emerald-400 mt-1 font-semibold">
                          Non-Stop Express
                        </span>
                      </div>

                      <div className="text-center sm:text-right">
                        <div className="text-lg font-black text-white">{bus.arrivalTime}</div>
                        <div className="text-xs text-[#E5C287] font-semibold">{bus.toCity}</div>
                      </div>
                    </div>

                    {/* Pricing, Available Seats, & CTA */}
                    <div className="flex items-center justify-between lg:flex-col lg:items-end gap-3 shrink-0">
                      <div className="text-left lg:text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          From
                        </span>
                        <div className="text-2xl font-black text-[#D8B788] leading-none">
                          ${bus.basePrice}
                        </div>
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          <span className="text-emerald-400 font-bold">{bus.availableSeats}</span> seats open
                        </span>
                      </div>

                      <Link
                        href={`/book/${bus.id}?date=${encodeURIComponent(date)}&from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}`}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A67C41] via-[#8B6226] to-[#694416] hover:from-[#B5894B] hover:via-[#9A6F2E] hover:to-[#774E1B] text-white font-bold text-xs uppercase tracking-wider shadow-[0_8px_20px_-4px_rgba(139,98,38,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)] border border-[#E0BE86]/35 transition transform hover:-translate-y-0.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#FDEBD0]" />
                        <span>Select 3D Suite</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RoutesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070A0F] flex items-center justify-center text-slate-400">
          <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mb-3" />
        </div>
      }
    >
      <RoutesContent />
    </Suspense>
  );
}
