'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  MapPin,
  Calendar,
  Users,
  Search,
  Wifi,
  Armchair,
  Wind,
  Zap,
  Coffee,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Bus,
  ShieldCheck,
  Star,
  QrCode,
  Compass,
  Sparkles,
} from 'lucide-react';
import { CITIES } from '@/lib/mock-data';

// Domestic Intercity Destinations (All within the country's national express network)
const POPULAR_DESTINATIONS = [
  {
    city: 'Los Angeles',
    corridor: 'Downtown & Metro Concourse',
    trips: '16 Daily Express Trips',
    price: '$45',
    image: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&w=800&q=80',
    description: 'Direct express service to Downtown Grand Central and Westside terminal hubs.',
  },
  {
    city: 'San Francisco',
    corridor: 'Bay Concourse & Financial Gate',
    trips: '14 Daily Express Trips',
    price: '$42',
    image: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=800&q=80',
    description: 'Scenic highway routes connecting the Bay Area, peninsula, and tech corridors.',
  },
  {
    city: 'San Diego',
    corridor: 'Pacific Harbor & Coastal Bay',
    trips: '10 Daily Express Trips',
    price: '$35',
    image: 'https://images.unsplash.com/photo-1534050359320-02900022671e?auto=format&fit=crop&w=800&q=80',
    description: 'Punctual coastal departures to harbor concourses, bay gates, and city centers.',
  },
  {
    city: 'Las Vegas',
    corridor: 'Grand Strip Express Terminal',
    trips: '18 Daily Express Trips',
    price: '$38',
    image: 'https://images.unsplash.com/photo-1581351123004-757df051db8e?auto=format&fit=crop&w=800&q=80',
    description: 'High-frequency non-stop routes to Boulevard Gate and entertainment concourses.',
  },
];

const SCHEDULE_DATA = [
  {
    id: 'bus-1',
    route: 'San Francisco → Los Angeles',
    departure: '08:30 AM',
    arrival: '01:45 PM',
    duration: '5h 15m',
    type: 'Morning Express',
    model: 'Apex Touring GT',
    price: '$45',
    status: 'On Time',
  },
  {
    id: 'bus-2',
    route: 'Los Angeles → San Diego',
    departure: '10:15 AM',
    arrival: '12:45 PM',
    duration: '2h 30m',
    type: 'Morning Express',
    model: 'Quantum HyperLiner',
    price: '$35',
    status: 'On Time',
  },
  {
    id: 'bus-3',
    route: 'San Francisco → Las Vegas',
    departure: '02:00 PM',
    arrival: '08:30 PM',
    duration: '6h 30m',
    type: 'Evening',
    model: 'BioDrive Executive',
    price: '$48',
    status: 'Fast Filling',
  },
  {
    id: 'bus-4',
    route: 'San Jose → Sacramento',
    departure: '05:30 PM',
    arrival: '07:45 PM',
    duration: '2h 15m',
    type: 'Evening',
    model: 'CyberCruiser Alpha',
    price: '$29',
    status: 'On Time',
  },
  {
    id: 'bus-1',
    route: 'Los Angeles → San Francisco',
    departure: '11:00 PM',
    arrival: '05:30 AM',
    duration: '6h 30m',
    type: 'Overnight Sleeper',
    model: 'Stellar NightVoyager',
    price: '$58',
    status: 'Sleeper Suite',
  },
];

const FAQS = [
  {
    q: 'Can I book a ticket online?',
    a: 'Yes, you can easily book your ticket online through our platform. Choose your departure and destination cities, select your travel date, view and inspect your exact seat in our interactive 3D coach, and pay securely within minutes.',
  },
  {
    q: 'Does the bus make stops along the way?',
    a: 'Our direct intercity express routes make minimal, scheduled stops only at major designated transit concourses and highway rest pavilions for scheduled passenger boarding and comfort.',
  },
  {
    q: 'Are there discounts for children, seniors, and students?',
    a: 'Yes! We offer concessionary discounts of up to 20% for students with valid ID, children under 12, and seniors aged 65 and older across all standard and business suites.',
  },
  {
    q: 'How can I return or exchange a ticket?',
    a: 'You can reschedule or cancel your reservation up to 2 hours before the scheduled coach departure time directly via the My Bookings portal with instant refund confirmation.',
  },
  {
    q: 'Do the buses have Wi-Fi and charging ports?',
    a: 'Every luxury touring coach in our fleet features complimentary high-speed Starlink Wi-Fi, 100W USB-C PD charging ports, and standard AC power outlets at every single seat.',
  },
];

const BLOG_POSTS = [
  {
    title: 'Top 10 Scenic Intercity Coach Routes to Experience This Season',
    date: 'Nov 18, 2026',
    category: 'Travel Guides',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=700&q=80',
    excerpt: 'From Alpine highway passes to coastal panoramas, discover the most breathtaking long-distance touring routes.',
  },
  {
    title: 'Night Travel Secrets: How to Sleep Comfortably on Intercity Buses',
    date: 'Nov 12, 2026',
    category: 'Travel Tips',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80',
    excerpt: 'Master the art of overnight sleeper travel with our guide to memory foam suites, sound pods, and circadian lighting.',
  },
  {
    title: 'The Future of Touring: How Clean Autonomous Coaches Are Leading the Shift',
    date: 'Nov 05, 2026',
    category: 'Innovation',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=700&q=80',
    excerpt: 'Explore how aerodynamic engineering and clean powertrains are creating an ultra-quiet, zero-emission travel experience.',
  },
];

export default function HomePage() {
  const router = useRouter();

  // Search State
  const [fromCity, setFromCity] = useState('Budapest');
  const [toCity, setToCity] = useState('Vienna');
  const [journeyDate, setJourneyDate] = useState('2026-11-25');
  const [passengerCount, setPassengerCount] = useState(1);

  // Filter tabs for Schedule
  const [activeScheduleTab, setActiveScheduleTab] = useState<'All' | 'Morning Express' | 'Evening' | 'Overnight Sleeper'>('All');

  // FAQ open/close state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/routes?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(
        toCity
      )}&date=${encodeURIComponent(journeyDate)}&passengers=${passengerCount}`
    );
  };

  const filteredSchedules = SCHEDULE_DATA.filter((item) => {
    if (activeScheduleTab === 'All') return true;
    return item.type === activeScheduleTab;
  });

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-[#B48C56] selection:text-white">
      
      {/* ============================================================== */}
      {/* 1. HERO SECTION (Dynamic Full-Screen Viewport Matching Device) */}
      {/* ============================================================== */}
      <section className="relative min-h-[calc(100vh-5rem)] min-h-[calc(100dvh-5rem)] bg-[#071526] text-white flex flex-col justify-between pt-8 pb-10 sm:pt-10 sm:pb-12 lg:pt-12 lg:pb-12 overflow-hidden">
        {/* Full-Bleed Hero Background Image with Uploaded Night Coach at Terminal - Brightened & Highlighted */}
        <div 
          className="absolute inset-0 bg-cover bg-[center_right_10%] lg:bg-right bg-no-repeat pointer-events-none brightness-115 contrast-105 saturate-110"
          style={{
            backgroundImage: `url('/images/hero-coach.jpg')`,
          }}
        />

        {/* Cinematic Deep Navy Gradient Overlay: Solid on left for crystal-clear readability, completely open & bright on right for coach photo */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071526] from-20% via-[#071526]/80 via-42% to-transparent to-58% lg:from-[#071526] lg:from-25% lg:via-[#071526]/65 lg:via-42% lg:to-transparent lg:to-55% pointer-events-none" />
        
        {/* Subtle bottom vignette to smoothly anchor the floating search widget */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#071526]/70 to-transparent pointer-events-none" />

        <div className="relative max-w-7xl xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 flex-1 flex flex-col justify-between py-4 lg:py-6">
          
          {/* Hero Left-Aligned Typography (Refined Executive Headline) */}
          <div className="text-left max-w-2xl my-auto pt-6 lg:pt-8">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#B48C56]/20 border border-[#B48C56]/40 text-[#D8B788] text-xs font-bold uppercase tracking-widest mb-5 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#D8B788]" />
              <span>PREMIUM INTERCITY MOBILITY</span>
            </div>

            <h1 className="tracking-tight leading-none mb-5">
              <span className="font-serif italic text-3xl sm:text-5xl md:text-6xl text-[#C5A880] block mb-2 font-normal">
                Luxury Coach Travel
              </span>
              <span className="text-white text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight block">
                INTERCITY EXPRESS
              </span>
            </h1>

            <p className="text-xs sm:text-sm uppercase tracking-widest text-slate-300 font-medium leading-relaxed max-w-xl border-l-2 border-[#B48C56] pl-4 mt-3">
              FAST, COMFORTABLE DIRECT JOURNEYS ACROSS CITIES • GUARANTEED 3D SEAT CONFIRMATION
            </p>
          </div>

          {/* Floating Horizontal Search Widget - Obsidian Luxury Glassmorphism */}
          <div className="w-full max-w-6xl xl:max-w-7xl bg-[#061222]/80 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 lg:p-7 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.18)] border border-white/15 text-white mt-6 lg:mt-8 ring-1 ring-white/5">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
              
              {/* Departure City */}
              <div className="relative">
                <label className="block text-[11px] font-bold text-[#D8B788] uppercase tracking-wider mb-1.5">
                  From
                </label>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3.5 w-4 h-4 text-[#B48C56] pointer-events-none" />
                  <select
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-[#0B1E34]/85 border border-white/15 hover:border-[#B48C56]/60 rounded-2xl text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-[#B48C56] focus:ring-2 focus:ring-[#B48C56]/30 transition-all shadow-inner"
                  >
                    {CITIES.map((city) => (
                      <option key={`from-${city}`} value={city} className="bg-[#0B1E34] text-white">
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Destination City */}
              <div className="relative">
                <label className="block text-[11px] font-bold text-[#D8B788] uppercase tracking-wider mb-1.5">
                  To
                </label>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3.5 w-4 h-4 text-[#B48C56] pointer-events-none" />
                  <select
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-[#0B1E34]/85 border border-white/15 hover:border-[#B48C56]/60 rounded-2xl text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-[#B48C56] focus:ring-2 focus:ring-[#B48C56]/30 transition-all shadow-inner"
                  >
                    {CITIES.map((city) => (
                      <option key={`to-${city}`} value={city} className="bg-[#0B1E34] text-white">
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date */}
              <div className="relative">
                <label className="block text-[11px] font-bold text-[#D8B788] uppercase tracking-wider mb-1.5">
                  Date
                </label>
                <div className="relative flex items-center">
                  <Calendar className="absolute left-3.5 w-4 h-4 text-[#B48C56] pointer-events-none" />
                  <input
                    type="date"
                    value={journeyDate}
                    onChange={(e) => setJourneyDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-[#0B1E34]/85 border border-white/15 hover:border-[#B48C56]/60 rounded-2xl text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-[#B48C56] focus:ring-2 focus:ring-[#B48C56]/30 transition-all shadow-inner [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Passengers */}
              <div className="relative">
                <label className="block text-[11px] font-bold text-[#D8B788] uppercase tracking-wider mb-1.5">
                  Passengers
                </label>
                <div className="relative flex items-center">
                  <Users className="absolute left-3.5 w-4 h-4 text-[#B48C56] pointer-events-none" />
                  <select
                    value={passengerCount}
                    onChange={(e) => setPassengerCount(Number(e.target.value))}
                    className="w-full pl-10 pr-3 py-3 bg-[#0B1E34]/85 border border-white/15 hover:border-[#B48C56]/60 rounded-2xl text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-[#B48C56] focus:ring-2 focus:ring-[#B48C56]/30 transition-all shadow-inner"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num} className="bg-[#0B1E34] text-white">
                        {num} {num === 1 ? 'Passenger' : 'Passengers'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Find Tickets CTA Button */}
              <div className="sm:col-span-2 lg:col-span-1 flex items-end">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#D8B788] via-[#B48C56] to-[#8C6B3D] hover:from-[#E2C799] hover:to-[#B48C56] text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_10px_25px_rgba(180,140,86,0.35)] hover:shadow-[0_14px_32px_rgba(180,140,86,0.5)] transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  <span>Find Tickets</span>
                </button>
              </div>

            </form>

            {/* Quick 3D Tour Bar */}
            <div className="mt-4 pt-3.5 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
              <span className="font-medium text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Direct city-to-city service with interactive 3D seat reservation
              </span>
              <Link
                href="/book/bus-1"
                className="inline-flex items-center gap-1.5 text-[#D8B788] hover:text-[#F3E3C3] font-bold transition hover:underline"
              >
                <span>Walk Inside 3D Coach</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. BUS TRAVEL WITH EASY SECTION (Faithful Reference Match UI)  */}
      {/* ============================================================== */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Big Statement Headline & Read More */}
            <div className="lg:col-span-4 space-y-5 text-left">
              <div>
                <h2 className="tracking-tight leading-[0.95]">
                  <span className="font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#B48C56] block tracking-tight uppercase">
                    BUS TRAVEL
                  </span>
                  <span className="font-black text-4xl sm:text-5xl lg:text-6xl text-[#071526] block tracking-tight uppercase mt-1">
                    WITH EASY
                  </span>
                </h2>
              </div>
              <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-800 leading-relaxed max-w-sm">
                AFFORDABLE TICKETS FOR FAST AND COMFORTABLE BUS TRIPS ACROSS CITIES
              </p>
              <div className="pt-2">
                <Link
                  href="/routes"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B48C56] hover:text-[#946F38] transition-all group"
                >
                  <span className="border-b border-[#B48C56] pb-0.5">READ MORE</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Center Column: Two Overlapping Diagonal Boarding Passes / Reference Graphic */}
            <div className="lg:col-span-4 flex items-center justify-center relative py-6 lg:py-0">
              <div className="relative w-full max-w-[340px] sm:max-w-[380px] h-[320px] flex items-center justify-center select-none">
                
                {/* Rear Dark Navy Boarding Pass (Rotated ~-14deg) */}
                <div 
                  className="absolute w-[290px] h-[135px] sm:w-[310px] sm:h-[145px] rounded-2xl bg-[#071526] text-white p-4 shadow-2xl border border-white/10 flex flex-col justify-between transform -rotate-14 -translate-y-8 -translate-x-3 transition-transform duration-500 hover:-rotate-10 hover:scale-105"
                  style={{ transformOrigin: 'center center' }}
                >
                  <div className="flex items-center justify-between border-b border-white/15 pb-2">
                    <div className="flex items-center gap-2">
                      <Bus className="w-3.5 h-3.5 text-[#B48C56]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#D8B788]">NOVARA PASS</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">FLAT ECONOMY</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-slate-400">From / To</div>
                      <div className="text-xs font-black text-white">SF → LA</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] uppercase tracking-wider text-slate-400">Seat</div>
                      <div className="text-sm font-black text-[#D8B788]">27</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-dashed border-white/20">
                    <div className="font-mono text-[9px] tracking-widest text-slate-400">||| |||| || | ||||| ||</div>
                    <span className="text-[10px] font-bold text-emerald-400">BOARDING OK</span>
                  </div>
                </div>

                {/* Front Gold / Tan Boarding Pass (Rotated ~-3deg) */}
                <div 
                  className="absolute w-[290px] h-[135px] sm:w-[310px] sm:h-[145px] rounded-2xl bg-gradient-to-r from-[#C5A880] to-[#B48C56] text-slate-950 p-4 shadow-[0_25px_50px_-12px_rgba(180,140,86,0.5)] border border-amber-200/50 flex flex-col justify-between transform -rotate-3 translate-y-6 translate-x-2 transition-transform duration-500 hover:rotate-0 hover:scale-105 z-10"
                  style={{ transformOrigin: 'center center' }}
                >
                  <div className="flex items-center justify-between border-b border-slate-950/15 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-slate-950 text-[#C5A880] flex items-center justify-center">
                        <Bus className="w-3 h-3" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-950">BUS TICKET</span>
                    </div>
                    <span className="text-[11px] font-black font-mono bg-slate-950/15 px-2 py-0.5 rounded text-slate-900">NOV-8492</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <div>
                      <div className="text-[9px] uppercase font-bold tracking-wider text-slate-800">Direct Route</div>
                      <div className="text-xs font-black text-slate-950 uppercase">SAN FRANCISCO → LA</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] uppercase font-bold tracking-wider text-slate-800">Confirmed</div>
                      <div className="text-base font-black text-slate-950">SUITE 1B</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-dashed border-slate-950/25">
                    <div className="font-mono text-[10px] tracking-widest font-black text-slate-900">|||| ||| |||| | ||| ||||</div>
                    <span className="text-[10px] font-black text-slate-950 uppercase tracking-wider">$45 • VERIFIED</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Transport You Can Trust + View Schedule Button */}
            <div className="lg:col-span-4 space-y-6 text-left">
              <div>
                <h4 className="text-xs sm:text-sm font-black text-[#071526] uppercase tracking-widest mb-1.5">
                  TRANSPORT YOU CAN TRUST
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Guaranteed departure times with premium direct intercity corridors. Zero layovers, no stress, and real-time live vehicle status.
                </p>
              </div>

              <div>
                <h4 className="text-xs sm:text-sm font-black text-[#071526] uppercase tracking-widest mb-1.5">
                  TRANSPORT YOU CAN TRUST
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Ergonomic reclining suites, certified sanitation standards, and guaranteed 3D seat reservation for every single passenger.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/routes"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-[#C5A880] hover:bg-[#B48C56] text-white font-extrabold text-xs uppercase tracking-widest shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  VIEW SCHEDULE
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. POPULAR DESTINATIONS SECTION (Clean Photo Cards - No Badges)*/}
      {/* ============================================================== */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#B48C56] uppercase tracking-widest block mb-1">
            LET&apos;S GO TOGETHER
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            POPULAR DESTINATIONS
          </h2>
        </div>

        {/* 4 Tall Vertical Photo Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {POPULAR_DESTINATIONS.map((dest) => (
            <div
              key={dest.city}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition duration-300 flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.city}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* City & Corridor Overlay (Clean, no floating badges) */}
                <div className="absolute bottom-3.5 left-4 right-4 text-white flex items-end justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#D8B788]">
                      <Compass className="w-3.5 h-3.5" />
                      <span>{dest.corridor}</span>
                    </div>
                    <h3 className="text-xl font-black leading-tight drop-shadow-sm">{dest.city}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-300 block font-normal">from</span>
                    <span className="text-lg font-black text-[#D8B788]">{dest.price}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3">
                    {dest.description}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-[#B48C56]" />
                    <span>{dest.trips}</span>
                  </div>
                </div>

                <Link
                  href={`/routes?to=${encodeURIComponent(dest.city)}`}
                  className="mt-4 w-full py-2.5 rounded-xl bg-slate-50 hover:bg-[#071526] hover:text-white text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <span>View Departures</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ============================================================== */}
      {/* 3. DAY AND NIGHT ROUTES (Two-Column Feature - Ref UI)           */}
      {/* ============================================================== */}
      <section className="py-16 md:py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Portrait photo of passengers selfie inside coach */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                <img
                  src="/images/timetable-passengers.jpg"
                  alt="Happy passengers enjoying direct intercity travel inside Novara touring coach"
                  className="w-full h-[480px] object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071526]/50 via-transparent to-transparent" />
              </div>
              
              {/* Floating Quality Badge */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#B48C56]/15 flex items-center justify-center text-[#B48C56]">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">4.9 / 5.0 Rating</div>
                  <div className="text-[11px] text-slate-500">From 18,000+ Verified Passengers</div>
                </div>
              </div>
            </div>

            {/* Right Column: Features & CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold text-[#B48C56] uppercase tracking-widest block mb-2">
                  TIMETABLE FLEXIBILITY
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  DAY AND NIGHT ROUTES AVAILABLE FOR THE BEST TIME FOR YOU
                </h2>
              </div>

              <p className="text-sm md:text-base text-slate-600 leading-relaxed font-normal">
                Whether you prefer scenic day journeys through scenic countryside vistas or overnight sleeper coaches that arrive refreshed at dawn, Novara provides direct city-to-city departures tailored to your schedule.
              </p>

              {/* Bullet Features */}
              <div className="space-y-3.5 pt-2">
                {[
                  'Flexible round-the-clock departures connecting major city corridors',
                  'Full-flat reclining sleeper suites with memory foam pillows on night journeys',
                  'Panoramic electrochromic smart-tint windows for glare-free daytime sightseeing',
                  'Guaranteed on-time departures with dedicated express highway transit corridors'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#B48C56] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Gold Buy Ticket CTA */}
              <div className="pt-4">
                <Link
                  href="/routes"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#B48C56] hover:bg-[#A37B47] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg transition"
                >
                  <span>Buy Ticket</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. FLEET & AMENITIES SECTION (Deep Navy & Stats - Ref UI)       */}
      {/* ============================================================== */}
      <section className="py-20 md:py-28 bg-[#071526] text-white relative overflow-hidden">
        
        {/* Ambient Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-[#B48C56]/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white uppercase leading-snug">
              OUR BUSES ARE EQUIPPED WITH <span className="text-[#C5A880]">MODERN SEATS AND FACILITIES</span> FOR YOUR PLEASANT AND CONVENIENT JOURNEY
            </h2>
          </div>

          {/* 6 Amenity Icons Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-16">
            {[
              { icon: Wifi, title: 'Wi-Fi 7', desc: 'Starlink gigabit speed' },
              { icon: Armchair, title: 'Reclining Seats', desc: '170° ergonomic comfort' },
              { icon: Wind, title: 'Air Conditioning', desc: 'HEPA ionized climate' },
              { icon: Zap, title: 'Power Outlets', desc: '100W USB-C & AC plug' },
              { icon: Coffee, title: 'Refreshments', desc: 'Complimentary drinks' },
              { icon: ShieldCheck, title: 'Clean Restroom', desc: 'Touchless sanitization' },
            ].map((amenity, idx) => {
              const Icon = amenity.icon;
              return (
                <div
                  key={idx}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 text-center transition duration-300 backdrop-blur-sm group"
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-[#B48C56]/20 border border-[#B48C56]/40 flex items-center justify-center text-[#D8B788] mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{amenity.title}</h3>
                  <p className="text-[11px] text-slate-400">{amenity.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Large Centerpiece Photo: Luxury Coach Night City View */}
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl mb-16 bg-[#0B192C]">
            <img
              src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1600&q=80"
              alt="Luxury Touring Coach Night City View"
              className="w-full h-80 sm:h-96 object-cover opacity-65"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071526] via-[#071526]/40 to-transparent flex flex-col justify-end p-6 sm:p-10">
              <div className="max-w-xl">
                <span className="text-xs font-bold text-[#B48C56] uppercase tracking-widest block mb-2">
                  STATE-OF-THE-ART FLEET
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
                  Step Inside The Novara 3D Coach Cabin
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
                  Rotate, zoom, and inspect each luxury leather suite before confirming your journey. 36 individual luxury seats across 9 rows with direct window alignment.
                </p>
                <Link
                  href="/book/bus-1"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#B48C56] hover:bg-[#A37B47] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg transition"
                >
                  <Bus className="w-4 h-4" />
                  <span>Launch 3D Cabin Tour</span>
                </Link>
              </div>
            </div>
          </div>

          {/* 4 Stat Counters (Exact Match to Reference UI!) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-white/10 pt-12">
            <div>
              <div className="text-4xl md:text-5xl font-black text-[#D8B788] mb-1">05</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Coach Models</div>
              <div className="text-[11px] text-slate-500">Premium Touring Fleet</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-[#D8B788] mb-1">32</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Intercity Routes</div>
              <div className="text-[11px] text-slate-500">Connecting Direct City Pairs</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-[#D8B788] mb-1">120+</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Daily Departures</div>
              <div className="text-[11px] text-slate-500">Day & Night Schedules</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-[#D8B788] mb-1">98%</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Punctuality</div>
              <div className="text-[11px] text-slate-500">Guaranteed On-Time Arrival</div>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. RECENT SCHEDULE / TIMETABLE (Tabbed Table - Ref UI)         */}
      {/* ============================================================== */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#B48C56] uppercase tracking-widest block mb-1">
            REAL-TIME DEPARTURES
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            RECENT SCHEDULE
          </h2>
        </div>

        {/* Tab Filter */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-8">
          {(['All', 'Morning Express', 'Evening', 'Overnight Sleeper'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveScheduleTab(tab)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeScheduleTab === tab
                  ? 'bg-[#B48C56] text-slate-950 shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Schedule Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-[#071526] text-white text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Route & Coach</th>
                  <th className="py-4 px-6">Departure</th>
                  <th className="py-4 px-6">Arrival</th>
                  <th className="py-4 px-6">Duration</th>
                  <th className="py-4 px-6">Class / Type</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSchedules.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{row.route}</div>
                      <div className="text-xs text-slate-400">{row.model}</div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-800">
                      {row.departure}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-800">
                      {row.arrival}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {row.duration}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#B48C56]/15 text-[#8E6A38]">
                        {row.type}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-base font-extrabold text-slate-900">{row.price}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/book/${row.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#071526] hover:bg-[#B48C56] hover:text-slate-950 text-white font-bold text-xs transition"
                      >
                        <span>Select Seat</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </section>



      {/* ============================================================== */}
      {/* 7. SCENIC HIGHWAY RIBBON (Aerial Forest View - Ref UI)          */}
      {/* ============================================================== */}
      <section className="relative py-24 bg-cover bg-center text-white overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-[#071526]/75 backdrop-blur-[2px]" />
        
        <div className="relative max-w-5xl mx-auto px-4 text-center z-10 space-y-6">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            COMFORT, SAFETY AND SPEED — EVERYTHING FOR YOUR JOURNEY
          </h2>
          <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto font-light">
            Engineered for smooth long-distance travel between cities with zero compromise on luxury.
          </p>
          <div>
            <Link
              href="/routes"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#B48C56] hover:bg-[#A37B47] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-2xl transition"
            >
              <span>Book Your Journey Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. FAQ ACCORDION (Exact Match to Reference Screenshot 2!)       */}
      {/* ============================================================== */}
      <section className="py-20 md:py-28 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Questions Accordion with Clean Plus/Minus Toggles */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                QUESTIONS &amp; ANSWERS
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#071526] tracking-tight mb-8">
                POPULAR QUESTIONS <br />ABOUT TRANSFERS
              </h2>
            </div>

            {/* Accordion Items with Clean Thin Border Dividers */}
            <div className="divide-y divide-slate-200 border-t border-slate-200">
              {FAQS.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="py-4">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full flex items-center gap-3 text-left font-bold text-xs sm:text-sm text-[#071526] hover:text-[#B48C56] transition cursor-pointer"
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                        {isOpen ? '−' : '+'}
                      </span>
                      <span>{faq.q}</span>
                    </button>
                    {isOpen && (
                      <div className="pl-8 pt-3 text-xs text-slate-600 leading-relaxed animate-in fade-in">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Read More Link */}
            <div className="pt-6">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#071526] hover:text-[#B48C56] transition tracking-wider group cursor-pointer"
              >
                <span>READ MORE</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B48C56] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Clean Yellow Suitcase with Straw Hat & Sunglasses (From Ref Pic!) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-sm h-[440px] overflow-hidden flex items-center justify-center">
              <img
                src="/images/faq-suitcase.jpg"
                alt="Yellow suitcase with straw hat and sunglasses"
                className="w-full h-full object-cover object-right"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 9. BLOG & ARTICLES SECTION (Ref UI)                             */}
      {/* ============================================================== */}
      <section className="py-16 md:py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#B48C56] uppercase tracking-widest block mb-1">
              INSIGHTS & INSPIRATION
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              BLOG / ARTICLES
            </h2>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post, idx) => (
              <div
                key={idx}
                className="group bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 hover:shadow-lg transition duration-300 flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-slate-800">
                    {post.category}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 mb-2">
                      {post.date}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#B48C56] transition leading-snug mb-3">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-[#B48C56] group-hover:text-[#8E6A38] transition">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
