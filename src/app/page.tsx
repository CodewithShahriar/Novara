'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  ArrowRight,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  Zap,
  Star,
  Award,
  ChevronRight,
  Eye,
  Bus,
  Sparkles,
} from 'lucide-react';
import { CITIES, INITIAL_BUSES } from '@/lib/mock-data';

// Dynamically load 3D Touring Coach Hero
const HeroBus3D = dynamic(() => import('@/components/3d/HeroBus3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] md:h-[500px] flex flex-col items-center justify-center bg-slate-900/60 rounded-3xl border border-white/5">
      <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mb-3" />
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
        Loading 3D Luxury Coach...
      </span>
    </div>
  ),
});

export default function HomePage() {
  const router = useRouter();

  // Search State
  const [fromCity, setFromCity] = useState('Neo-San Francisco');
  const [toCity, setToCity] = useState('Metro Los Angeles');
  const [journeyDate, setJourneyDate] = useState('2026-11-25');
  const [passengerCount, setPassengerCount] = useState(1);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/routes?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(
        toCity
      )}&date=${encodeURIComponent(journeyDate)}&passengers=${passengerCount}`
    );
  };

  return (
    <div className="relative min-h-screen bg-[#070A0F] text-slate-100 overflow-hidden">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-40 right-10 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* 1. HERO SECTION */}
      <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Headings & Value Prop */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-white/10 text-amber-400 text-xs font-semibold shadow-lg backdrop-blur-md">
              <Bus className="w-4 h-4 text-amber-400" />
              <span className="tracking-wide">PREMIUM INTERCITY TOURING COACH NETWORK</span>
            </div>

            {/* Hero Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
              Travel <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">Beyond</span> Ordinary.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Experience the pinnacle of intelligent bus travel. Step inside an interactive 3D luxury coach, inspect real leather suites, and reserve your journey with instant seat confirmation.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#search-booking"
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-xl transition transform hover:-translate-y-0.5 flex items-center gap-2 group"
              >
                <span>Find Your Journey</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <Link
                href="/book/bus-1"
                className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-200 font-semibold text-xs uppercase tracking-wider shadow-lg transition flex items-center gap-2 backdrop-blur-md"
              >
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Explore 3D Bus Cabin</span>
              </Link>
            </div>

            {/* Trust highlights */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-lg mx-auto lg:mx-0">
              <div>
                <div className="text-2xl font-black text-white">100%</div>
                <div className="text-xs text-slate-400">Low-Emission Fleet</div>
              </div>
              <div>
                <div className="text-2xl font-black text-amber-400">3D Real-Time</div>
                <div className="text-xs text-slate-400">Interactive Seat Selection</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white">4.96 ★</div>
                <div className="text-xs text-slate-400">Passenger Rating</div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Touring Coach Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl bg-slate-900/40 p-4 border border-white/10 shadow-2xl backdrop-blur-md">
              <HeroBus3D />
              <div className="absolute bottom-4 left-6 text-[10px] text-slate-400 uppercase tracking-widest font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Novara Royal Class 3D Model</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. SEARCH BOOKING INTERFACE */}
        <div id="search-booking" className="mt-12 sm:mt-16 z-20 relative scroll-mt-28">
          <div className="bg-slate-900/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2">
                <Bus className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-white">
                  Search Bus Routes & Schedules
                </h2>
              </div>
              <span className="text-xs text-slate-400 hidden sm:inline">
                Daily Luxury Express Departures
              </span>
            </div>

            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Origin */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  Origin
                </label>
                <select
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full bg-slate-800/80 border border-white/10 rounded-xl px-3.5 py-3 text-xs text-white font-medium focus:outline-none focus:border-amber-400 transition"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city} className="bg-slate-900 text-white">
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  Destination
                </label>
                <select
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full bg-slate-800/80 border border-white/10 rounded-xl px-3.5 py-3 text-xs text-white font-medium focus:outline-none focus:border-amber-400 transition"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city} className="bg-slate-900 text-white">
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  Journey Date
                </label>
                <input
                  type="date"
                  value={journeyDate}
                  min="2026-11-23"
                  onChange={(e) => setJourneyDate(e.target.value)}
                  className="w-full bg-slate-800/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-amber-400 transition"
                />
              </div>

              {/* Passengers */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  Passengers
                </label>
                <select
                  value={passengerCount}
                  onChange={(e) => setPassengerCount(Number(e.target.value))}
                  className="w-full bg-slate-800/80 border border-white/10 rounded-xl px-3.5 py-3 text-xs text-white font-medium focus:outline-none focus:border-amber-400 transition"
                >
                  <option value={1} className="bg-slate-900 text-white">1 Passenger</option>
                  <option value={2} className="bg-slate-900 text-white">2 Passengers</option>
                  <option value={3} className="bg-slate-900 text-white">3 Passengers</option>
                  <option value={4} className="bg-slate-900 text-white">4 Passengers</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full h-[46px] rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2"
                >
                  <span>Find Your Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 3. POPULAR ROUTES SECTION */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
              Popular Departures
            </div>
            <h2 className="text-3xl font-black text-white">Featured Coach Routes</h2>
          </div>
          <Link
            href="/routes"
            className="mt-4 md:mt-0 text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
          >
            <span>View All Schedules</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              from: 'Neo-San Francisco',
              to: 'Metro Los Angeles',
              duration: '5h 15m',
              price: '$85',
              busId: 'bus-1',
              model: 'Mercedes Tourismo GT',
            },
            {
              from: 'Neo-Seattle',
              to: 'Silicon Austin',
              duration: '4h 15m',
              price: '$110',
              busId: 'bus-2',
              model: 'Volvo 9900 Executive',
            },
            {
              from: 'Neo-San Francisco',
              to: 'Metro Los Angeles',
              duration: '5h 30m',
              price: '$75',
              busId: 'bus-3',
              model: 'Scania Irizar i8',
            },
            {
              from: 'Vegas SkyPort',
              to: 'Neo-San Francisco',
              duration: '7h 00m',
              price: '$95',
              busId: 'bus-4',
              model: 'Setra TopClass S 531',
            },
          ].map((route, i) => (
            <div
              key={i}
              className="clean-card rounded-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-3">
                  <span>{route.duration} Express</span>
                  <span className="text-amber-400 font-bold">From {route.price}</span>
                </div>

                <div className="space-y-1 mb-4">
                  <div className="text-base font-bold text-white">
                    {route.from}
                  </div>
                  <div className="w-4 h-0.5 bg-amber-400 my-1.5" />
                  <div className="text-base font-bold text-white">
                    {route.to}
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-5">
                  {route.model}
                </p>
              </div>

              <Link
                href={`/book/${route.busId}`}
                className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-amber-500 text-slate-200 hover:text-slate-950 font-bold text-xs uppercase tracking-wider text-center transition flex items-center justify-center gap-1.5 border border-white/5"
              >
                <span>Select 3D Seat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED LUXURY COACHES */}
      <section className="py-16 border-y border-white/10 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Fleet Standards
            </span>
            <h2 className="text-3xl font-black text-white mt-2">
              Featured Luxury Touring Coaches
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Equipped with Italian leather seating, onboard restrooms, climate control, and full 3D seat reservation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {INITIAL_BUSES.slice(0, 2).map((bus) => (
              <div
                key={bus.id}
                className="clean-card rounded-3xl p-6 sm:p-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      {bus.operator}
                    </span>
                    <h3 className="text-2xl font-black text-white mt-0.5">{bus.name}</h3>
                    <p className="text-xs text-slate-400">{bus.type}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 uppercase font-semibold">Starting at</span>
                    <div className="text-2xl font-black text-amber-400">${bus.basePrice}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 mb-6 text-xs text-slate-300">
                  {bus.amenities.slice(0, 4).map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="text-emerald-400 font-bold">{bus.availableSeats}</span>
                    <span>/ {bus.totalSeats} seats open</span>
                  </div>

                  <Link
                    href={`/book/${bus.id}`}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition flex items-center gap-2"
                  >
                    <span>Inspect 3D Interior</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE NOVARA */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Executive Features
          </span>
          <h2 className="text-3xl font-black text-white mt-2">
            Why Travel With Novara
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Engineered for optimum comfort on long-distance highway travel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Eye,
              title: '3D Cabin Inspection',
              description:
                'Explore the real 3D bus interior, inspect legroom, window placements, and zoom into individual seats before booking.',
            },
            {
              icon: ShieldCheck,
              title: 'Certified Safety',
              description:
                'Every coach is equipped with radar emergency braking, lane departure sensors, and certified professional drivers.',
            },
            {
              icon: Zap,
              title: 'Ergonomic Leather Suites',
              description:
                'Relax in contoured leather bucket seats with adjustable winged headrests, lumbar support, and fold-out footrests.',
            },
            {
              icon: Award,
              title: 'Guaranteed Punctuality',
              description:
                'Dedicated express highway transit corridors provide reliable on-time departures and real-time coach tracking.',
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="clean-card rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. PASSENGER TESTIMONIALS */}
      <section className="py-20 bg-slate-950/60 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Verified Reviews
            </span>
            <h2 className="text-3xl font-black text-white mt-2">
              What Passengers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Kavita Patel',
                role: 'Frequent Business Commuter',
                quote:
                  'Being able to see the exact 3D seat before booking is fantastic. The leather seats were extremely comfortable and I worked productively the entire journey.',
                rating: 5,
              },
              {
                name: 'Marcus Vance',
                role: 'Traveler',
                quote:
                  'Novara feels like traveling in a first-class aircraft cabin. The reclining seats, AC, and Wi-Fi made a 5-hour journey comfortable and relaxing.',
                rating: 5,
              },
              {
                name: 'Dr. Sarah Sterling',
                role: 'University Lecturer',
                quote:
                  'Punctual, spotless coach interior, and the 3D seat booking was seamless. By far the best intercity coach travel platform available.',
                rating: 5,
              },
            ].map((t, idx) => (
              <div key={idx} className="clean-card rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic mb-6">
                    "{t.quote}"
                  </p>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{t.name}</div>
                  <div className="text-xs text-slate-400">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PRE-FOOTER CTA */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl border border-white/10">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black">
              Ready to Book Your Next Journey?
            </h2>
            <p className="text-sm text-slate-300 font-normal">
              Select your destination, explore the interactive 3D luxury coach, and reserve your seat today.
            </p>
            <div className="pt-3">
              <Link
                href="/routes"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-xl transition"
              >
                <span>Browse Available Schedules</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
