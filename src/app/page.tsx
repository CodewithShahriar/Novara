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
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  Bus,
  ShieldCheck,
  Star,
  QrCode,
  Compass,
} from 'lucide-react';
import { CITIES, INITIAL_BUSES } from '@/lib/mock-data';

// Destinations data with flags & prices matching reference layout
const POPULAR_DESTINATIONS = [
  {
    city: 'Budapest',
    country: 'Hungary',
    flag: '🇭🇺',
    trips: '8 Daily Trips',
    price: '€35',
    image: 'https://images.unsplash.com/photo-1549877452-9c387954fbc2?auto=format&fit=crop&w=800&q=80',
    description: 'Breathtaking Parliament views along the scenic Danube river.',
  },
  {
    city: 'Rome',
    country: 'Italy',
    flag: '🇮🇹',
    trips: '12 Daily Trips',
    price: '€42',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    description: 'Ancient monuments, historic piazzas, and world-class espresso.',
  },
  {
    city: 'Prague',
    country: 'Czech Republic',
    flag: '🇨🇿',
    trips: '6 Daily Trips',
    price: '€29',
    image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=800&q=80',
    description: 'Fairy-tale castles, Gothic bridges, and charming old town lanes.',
  },
  {
    city: 'Paris',
    country: 'France',
    flag: '🇫🇷',
    trips: '14 Daily Trips',
    price: '€49',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    description: 'Iconic boulevards, romantic riverbanks, and timeless architecture.',
  },
];

const SCHEDULE_DATA = [
  {
    id: 'bus-1',
    route: 'Budapest → Vienna',
    departure: '08:30 AM',
    arrival: '11:15 AM',
    duration: '2h 45m',
    type: 'Morning Express',
    model: 'Apex Touring GT',
    price: '€32',
    status: 'On Time',
  },
  {
    id: 'bus-2',
    route: 'Prague → Berlin',
    departure: '10:15 AM',
    arrival: '02:30 PM',
    duration: '4h 15m',
    type: 'Morning Express',
    model: 'Quantum HyperLiner',
    price: '€38',
    status: 'On Time',
  },
  {
    id: 'bus-3',
    route: 'Rome → Milan',
    departure: '02:00 PM',
    arrival: '07:30 PM',
    duration: '5h 30m',
    type: 'Evening',
    model: 'BioDrive Executive',
    price: '€45',
    status: 'Fast Filling',
  },
  {
    id: 'bus-4',
    route: 'Paris → Brussels',
    departure: '05:30 PM',
    arrival: '09:00 PM',
    duration: '3h 30m',
    type: 'Evening',
    model: 'CyberCruiser Alpha',
    price: '€29',
    status: 'On Time',
  },
  {
    id: 'bus-1',
    route: 'Munich → Zurich',
    departure: '11:00 PM',
    arrival: '05:30 AM',
    duration: '6h 30m',
    type: 'Overnight Sleeper',
    model: 'Stellar NightVoyager',
    price: '€55',
    status: 'Sleeper Suite',
  },
];

const FAQS = [
  {
    q: 'How much luggage can I bring on board?',
    a: 'Each passenger ticket includes one large checked suitcase (up to 25 kg / 55 lbs) placed securely in the underfloor climate-controlled luggage bay, plus one compact carry-on bag and personal item inside the overhead or under-seat cabin area.',
  },
  {
    q: 'Can I view and select my exact 3D seat before departure?',
    a: 'Yes! Novara features an industry-first interactive 3D cabin inspection tool. You can walk through the coach, inspect seat legroom, verify window alignment, and reserve your exact suite with real-time confirmation.',
  },
  {
    q: 'What amenities are available on board during the journey?',
    a: 'Every luxury touring coach in our fleet is equipped with Starlink ultra-fast Wi-Fi, 100W USB-C & AC power outlets at every seat, dual-zone HEPA ionized air conditioning, ergonomic recliners with footrests, and a touchless onboard restroom.',
  },
  {
    q: 'Can I reschedule or cancel my booking?',
    a: 'Tickets can be rescheduled or cancelled up to 2 hours before the scheduled departure time directly from your "My Bookings" portal with zero cancellation penalty when opting for Novara travel credit.',
  },
];

const BLOG_POSTS = [
  {
    title: 'Top 10 Scenic European Coach Routes to Experience This Season',
    date: 'Nov 18, 2026',
    category: 'Travel Guides',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=700&q=80',
    excerpt: 'From Alpine passes to Mediterranean coastlines, discover the most breathtaking panoramic highway journeys across Europe.',
  },
  {
    title: 'Night Travel Secrets: How to Sleep Comfortably on Intercity Coaches',
    date: 'Nov 12, 2026',
    category: 'Travel Tips',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80',
    excerpt: 'Master the art of overnight sleeper travel with our guide to memory foam suites, sound pods, and circadian lighting.',
  },
  {
    title: 'The Future of Touring: How Clean Autonomous Coaches Are Leading the Green Shift',
    date: 'Nov 05, 2026',
    category: 'Innovation',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=700&q=80',
    excerpt: 'Explore how aerodynamic engineering and electric powertrains are creating an ultra-quiet, zero-emission travel experience.',
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

  // Destination country filter
  const [destinationFilter, setDestinationFilter] = useState('All');

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
      {/* 1. HERO SECTION (Deep Navy & Gold - Matches Reference Image) */}
      {/* ============================================================== */}
      <section className="relative bg-[#071526] text-white overflow-hidden pt-12 pb-24 md:pt-16 md:pb-32">
        {/* Cinematic Backdrop Image with Dark Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 pointer-events-none transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#071526]/80 via-[#071526]/95 to-[#071526] pointer-events-none" />

        {/* Ambient Warm Gold Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#B48C56]/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          
          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#B48C56]/30 text-[#D8B788] text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#B48C56]" />
              <span>Novara Platinum Touring Express</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              EUROPEAN <span className="text-[#C5A880]">INTERCITY</span> ROUTES
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
              Travel comfortably between Europe&apos;s leading capitals. Reserve panoramic window suites in our state-of-the-art touring coach network with guaranteed seat reservations.
            </p>
          </div>

          {/* Floating Horizontal Search Widget (Matching Reference Card) */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-2xl border border-slate-100 max-w-5xl mx-auto text-slate-900">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
              
              {/* Departure City */}
              <div className="relative">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Departure From
                </label>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3 w-4 h-4 text-[#B48C56] pointer-events-none" />
                  <select
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#B48C56]/30 focus:border-[#B48C56] transition"
                  >
                    {CITIES.map((city) => (
                      <option key={`from-${city}`} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Destination City */}
              <div className="relative">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Destination To
                </label>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3 w-4 h-4 text-[#B48C56] pointer-events-none" />
                  <select
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#B48C56]/30 focus:border-[#B48C56] transition"
                  >
                    {CITIES.map((city) => (
                      <option key={`to-${city}`} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Journey Date */}
              <div className="relative">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Date of Journey
                </label>
                <div className="relative flex items-center">
                  <Calendar className="absolute left-3 w-4 h-4 text-[#B48C56] pointer-events-none" />
                  <input
                    type="date"
                    value={journeyDate}
                    onChange={(e) => setJourneyDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#B48C56]/30 focus:border-[#B48C56] transition"
                  />
                </div>
              </div>

              {/* Passenger Selector */}
              <div className="relative">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Passengers
                </label>
                <div className="relative flex items-center">
                  <Users className="absolute left-3 w-4 h-4 text-[#B48C56] pointer-events-none" />
                  <select
                    value={passengerCount}
                    onChange={(e) => setPassengerCount(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#B48C56]/30 focus:border-[#B48C56] transition"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Passenger' : 'Passengers'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Find Tickets Button */}
              <div className="sm:col-span-2 lg:col-span-1 flex items-end">
                <button
                  type="submit"
                  className="w-full py-3 px-5 rounded-xl bg-[#B48C56] hover:bg-[#A37B47] text-slate-950 font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-slate-950" />
                  <span>Find Tickets</span>
                </button>
              </div>

            </form>

            {/* Quick 3D Bus Inspection Highlight Bar */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium text-slate-700">Interactive 3D Fleet Visualizer Active</span>
              </div>
              <Link
                href="/book/bus-1"
                className="inline-flex items-center gap-1.5 text-[#B48C56] hover:text-[#8E6A38] font-bold transition hover:underline"
              >
                <span>Walk Inside 3D Coach</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. POPULAR DESTINATIONS SECTION (Crisp Light Theme - Ref UI) */}
      {/* ============================================================== */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#B48C56] uppercase tracking-widest block mb-1">
            LET&apos;S GO TOGETHER
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            POPULAR DESTINATIONS
          </h2>
        </div>

        {/* Country Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {['All', 'Hungary', 'Italy', 'Czech Republic', 'France', 'Germany', 'Austria'].map((country) => (
            <button
              key={country}
              onClick={() => setDestinationFilter(country)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                destinationFilter === country
                  ? 'bg-[#071526] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {country}
            </button>
          ))}
        </div>

        {/* Destination Photo Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POPULAR_DESTINATIONS.map((dest) => (
            <div
              key={dest.city}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition duration-300 flex flex-col"
            >
              {/* Photo */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.city}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Price Tag */}
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg shadow font-bold text-xs text-slate-900">
                  from <span className="text-[#B48C56] text-sm font-extrabold">{dest.price}</span>
                </div>

                {/* City & Country */}
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-200">
                    <span>{dest.flag}</span>
                    <span>{dest.country}</span>
                  </div>
                  <h3 className="text-xl font-bold leading-tight drop-shadow-sm">{dest.city}</h3>
                </div>
              </div>

              {/* Card Body */}
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
                  className="mt-4 w-full py-2.5 rounded-xl bg-slate-50 hover:bg-[#071526] hover:text-white text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-1.5 group-hover:border-[#071526]"
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
      {/* 3. DAY AND NIGHT ROUTES (Two Column Feature - Matching Ref) */}
      {/* ============================================================== */}
      <section className="py-16 md:py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Traveler Photo */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=900&q=80"
                  alt="Happy traveler using smartphone with luggage"
                  className="w-full h-[450px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
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
                  SEAMLESS SCHEDULING
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  DAY AND NIGHT ROUTES AVAILABLE FOR THE BEST TIME FOR YOU
                </h2>
              </div>

              <p className="text-sm md:text-base text-slate-600 leading-relaxed font-normal">
                Whether you prefer scenic day journeys through European countryside vistas or overnight sleeper coaches that arrive refreshed at dawn, Novara provides departures tailored to your schedule.
              </p>

              {/* Bullet Features */}
              <div className="space-y-3.5 pt-2">
                {[
                  'Flexible round-the-clock departures connecting 32 major European cities',
                  'Full-flat reclining sleeper suites with memory foam pillows on all night journeys',
                  'Electrochromic panoramic smart-tint windows for glare-free daytime sightseeing',
                  'Guaranteed on-time departures with dedicated express highway transit lanes'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#B48C56] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Button */}
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
      {/* 4. FLEET & AMENITIES SECTION (Deep Navy & Stats - Ref UI) */}
      {/* ============================================================== */}
      <section className="py-20 md:py-28 bg-[#071526] text-white relative overflow-hidden">
        
        {/* Soft Background Radial */}
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

          {/* Coach Fleet Spotlight & 3D Interactive Banner */}
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl mb-16 bg-[#0B192C]">
            <img
              src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1600&q=80"
              alt="Luxury Touring Coach Night City View"
              className="w-full h-80 sm:h-96 object-cover opacity-60"
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

          {/* 4 Stat Counters (Matching Reference Image) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-white/10 pt-12">
            <div>
              <div className="text-4xl md:text-5xl font-black text-[#D8B788] mb-1">05</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Coach Models</div>
              <div className="text-[11px] text-slate-500">Premium Touring Fleet</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-[#D8B788] mb-1">32</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Intercity Routes</div>
              <div className="text-[11px] text-slate-500">Across 8 European Nations</div>
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
      {/* 5. RECENT SCHEDULE / TIMETABLE (Tabbed Table - Ref UI) */}
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
      {/* 6. "BUS TRAVEL WITH EASY" (Digital Ticket Pass - Ref UI) */}
      {/* ============================================================== */}
      <section className="py-16 md:py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Heading & Value Prop */}
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-bold text-[#B48C56] uppercase tracking-widest block">
                PAPERLESS BOARDING
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                BUS TRAVEL <br />
                <span className="text-[#B48C56]">WITH EASY</span>
              </h2>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed font-normal">
                Everything you need for your trip is stored right on your smartphone. Flash your digital QR boarding pass at the bus platform, skip counter queues, and walk directly to your reserved suite.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Instant digital boarding pass saved to Apple Wallet & Google Wallet',
                  'Real-time coach GPS tracking and live terminal bay notifications',
                  'Instant seat re-selection up to 60 minutes before departure'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#B48C56] shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href="/routes"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#071526] hover:bg-[#B48C56] hover:text-slate-950 text-white font-bold text-xs uppercase tracking-wider transition"
                >
                  <span>Book Digital Pass</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Visual Boarding Pass Mockup */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-md bg-gradient-to-br from-[#071526] to-[#0B192C] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700/50">
                {/* Gold Header Band */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#B48C56] text-slate-950 flex items-center justify-center font-bold">
                      <Bus className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-[#D8B788]">Novara Express</div>
                      <div className="text-[10px] text-slate-400">Boarding Pass</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">#NOV-8492</span>
                </div>

                {/* Cities */}
                <div className="grid grid-cols-3 items-center text-center mb-6">
                  <div>
                    <div className="text-2xl font-black">BUD</div>
                    <div className="text-xs text-slate-400">Budapest</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <Compass className="w-5 h-5 text-[#B48C56] animate-pulse" />
                    <span className="text-[10px] font-semibold text-slate-400">2h 45m</span>
                  </div>
                  <div>
                    <div className="text-2xl font-black">VIE</div>
                    <div className="text-xs text-slate-400">Vienna</div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-3 gap-3 bg-white/5 rounded-2xl p-4 text-center mb-6 border border-white/5">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Seat</div>
                    <div className="text-sm font-bold text-[#D8B788]">3A (Window)</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Departure</div>
                    <div className="text-sm font-bold text-white">08:30 AM</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Bay / Gate</div>
                    <div className="text-sm font-bold text-emerald-400">Bay 04</div>
                  </div>
                </div>

                {/* Barcode & QR Simulation */}
                <div className="bg-white rounded-xl p-4 flex items-center justify-between text-slate-900">
                  <div className="space-y-1">
                    <div className="text-xs font-bold">PASSENGER: GUEST VIP</div>
                    <div className="text-[10px] font-mono text-slate-500">PLATFORM TICKET • PAID €32</div>
                  </div>
                  <div className="w-12 h-12 bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-slate-900" />
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. SCENIC HIGHWAY RIBBON (Aerial Forest View - Ref UI) */}
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
            Engineered for smooth long-distance travel across Europe with zero compromise on luxury.
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
      {/* 8. FAQ ACCORDION (With Travel Luggage Visual - Ref UI) */}
      {/* ============================================================== */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Questions Accordion */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold text-[#B48C56] uppercase tracking-widest block mb-1">
                NEED ASSISTANCE?
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                POPULAR QUESTIONS ABOUT BUS ROUTES
              </h2>
            </div>

            <div className="space-y-3 pt-2">
              {FAQS.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-800 hover:text-[#B48C56] transition cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#B48C56] shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Clean Yellow Travel Luggage Photo (Matching Reference) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-100 w-full max-w-sm">
              <img
                src="https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=800&q=80"
                alt="Yellow suitcase ready for European journey"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-semibold text-[#D8B788]">LUGGAGE INCLUDED</span>
                <p className="text-sm font-bold">25kg checked bag + carry-on with every seat</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 9. BLOG & ARTICLES SECTION (Ref UI) */}
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
