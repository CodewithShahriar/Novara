'use client';

import React from 'react';
import Link from 'next/link';
import {
  Bus,
  Shield,
  Sparkles,
  Award,
  Globe2,
  Clock,
  Compass,
  ArrowRight,
  Armchair,
  CheckCircle2,
  Wifi,
  Zap,
  Leaf,
  ShieldCheck,
  Luggage,
  Wind,
  Check,
  X,
  MapPin,
  Calendar,
} from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: 'Destinations Served', value: '32+', icon: Globe2, desc: 'Direct city-to-city corridors' },
    { label: 'Daily Express Trips', value: '120+', icon: Clock, desc: 'Punctual non-stop departures' },
    { label: 'On-Time Arrival Rate', value: '99.4%', icon: CheckCircle2, desc: 'Monitored via live telemetry' },
    { label: 'Verified Travelers', value: '45,000+', icon: Award, desc: '5-star executive passenger rating' },
    { label: 'Carbon Emissions Cut', value: '-82%', icon: Leaf, desc: 'Vs. short-haul regional flights' },
  ];

  const pillars = [
    {
      title: '3-Axle Aerodynamic Flagship Fleet',
      tag: 'PRECISION ENGINEERING',
      desc: 'Engineered specifically for smooth long-range cruising across national express highways. Triple-axle active air suspension, dual acoustic tempered safety glass, and whisper-quiet bio-hybrid powertrains eliminate vibration and road noise.',
      icon: Bus,
      image: '/images/hero-coach.jpg',
      highlights: ['Active Multi-Link Air Suspension', 'Dual Acoustic Glazing (-18dB Noise)', 'Euro-6 Clean BioDrive Powertrain'],
    },
    {
      title: 'World’s First 3D Cabin Digital Twin',
      tag: 'WEBGL INNOVATION',
      desc: 'No more guessing seat pitch or window angles with generic 2D layouts. Our proprietary WebGL 3D cabin twin lets you walk through the coach, examine every single suite, check aisle clearance, and preview actual window perspectives before booking.',
      icon: Sparkles,
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      highlights: ['Millimeter-Accurate 3D Twin', 'Real Window Alignment Preview', 'Instant Suite Reservation Lock'],
    },
    {
      title: 'First-Class Executive Suite Amenities',
      tag: 'LUXURY COMFORT',
      desc: 'Every suite is hand-tailored with dual-tone Italian leather, forward-cupped privacy headrest wings, high-density work tables, 100W USB-C PD fast chargers, inductive Qi wireless pads, and complimentary ultra-fast Starlink Wi-Fi.',
      icon: Armchair,
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      highlights: ['Ergonomic Privacy Wing Recliners', 'Dedicated 100W PD + Qi Charger', 'Uncapped High-Speed Starlink Wi-Fi'],
    },
    {
      title: 'Express Downtown Concourse Terminals',
      tag: 'EFFORTLESS BOARDING',
      desc: 'Centrally situated express gates in downtown city cores. Skip grueling two-hour airport security checkpoints, TSA lines, and baggage claim delays. Simply arrive 5 minutes before departure, scan your boarding barcode, and relax.',
      icon: Compass,
      image: '/images/timetable-passengers.jpg',
      highlights: ['Direct Downtown City Center Gates', '5-Minute Walk-On Boarding', 'Tag-Protected Compartment Luggage'],
    },
  ];

  const comparisonRows = [
    {
      feature: 'Seat Selection Precision',
      novara: 'Interactive 3D Digital Twin (Exact suite & window view)',
      airline: 'Static 2D diagram with hidden blind windows',
      bus: 'Unassigned or generic random allocation',
    },
    {
      feature: 'Pre-Departure Waiting Time',
      novara: '5 Minutes prior (Direct walk-on boarding)',
      airline: '90 - 120 Minutes (Security, TSA, boarding gates)',
      bus: '20 - 40 Minutes at outdoor street curbs',
    },
    {
      feature: 'Legroom & Suite Recline',
      novara: '42" Pitch with footrest & privacy wings',
      airline: '28" - 31" Cramped standard economy pitch',
      bus: '31" - 33" Standard rigid bus seating',
    },
    {
      feature: 'In-Seat Power & Connectivity',
      novara: '100W USB-C PD + Qi Wireless + Free Starlink',
      airline: 'Spotty paid Wi-Fi or limited USB-A slots',
      bus: 'Rarely functional shared wall outlets',
    },
    {
      feature: 'Environmental Footprint',
      novara: '82% Lower CO2 per passenger mile',
      airline: 'Highest carbon footprint per passenger',
      bus: 'Standard high-emission legacy diesel',
    },
    {
      feature: 'Arrival Hub Location',
      novara: 'Downtown Metro Concourse (Walk directly into city)',
      airline: 'Far suburban airports (Requires expensive taxi/train)',
      bus: 'Highway highway service plazas or street corners',
    },
  ];

  return (
    <div className="min-h-screen bg-[#071526] text-white selection:bg-[#B48C56] selection:text-white">
      
      {/* ============================================================== */}
      {/* 1. CINEMATIC HERO SECTION                                      */}
      {/* ============================================================== */}
      <section className="relative py-24 md:py-36 overflow-hidden bg-gradient-to-b from-[#071526] via-[#0B1E34] to-[#071526]">
        {/* Full-bleed subtle backdrop coach imagery */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-35 mix-blend-luminosity pointer-events-none brightness-110"
          style={{
            backgroundImage: `url('/images/hero-coach.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071526] via-[#071526]/85 to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#B48C56]/20 border border-[#B48C56]/40 text-[#D8B788] text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#D8B788]" />
            <span>THE NOVARA STANDARD IN ROAD TRAVEL</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-tight">
            Aviation-Grade Elegance, <br className="hidden sm:inline" />
            <span className="text-[#C5A880] font-serif italic font-normal">Re-Engineered</span> for the Highway
          </h1>

          <p className="max-w-3xl mx-auto text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed font-normal">
            Novara was established with a singular conviction: intercity transit should be a tranquil, luxurious extension of your day — not an ordeal of airport security lines, crowded terminals, and noisy cabins. We pair bespoke European 3-axle touring coach craftsmanship with guaranteed comfort and the world’s first 3D cabin booking twin.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/book/bus-1"
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#D8B788] via-[#B48C56] to-[#8C6B3D] hover:from-[#E2C799] hover:to-[#B48C56] text-slate-950 font-black text-xs uppercase tracking-widest shadow-xl transition-all transform hover:scale-105 inline-flex items-center gap-2.5 cursor-pointer"
            >
              <Armchair className="w-4 h-4 stroke-[2.5]" />
              <span>Explore 3D Cabin Tour</span>
            </Link>
            <Link
              href="/routes"
              className="px-7 py-3.5 rounded-2xl bg-[#0B1E34]/80 hover:bg-[#0B1E34] text-white border border-white/15 hover:border-[#B48C56]/50 font-bold text-xs uppercase tracking-wider transition backdrop-blur-md inline-flex items-center gap-2"
            >
              <span>View Route Schedules</span>
              <ArrowRight className="w-4 h-4 text-[#D8B788]" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. KEY OPERATIONAL METRICS & VERIFIED STATS                    */}
      {/* ============================================================== */}
      <section className="relative -mt-12 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-[#0B1E34]/90 backdrop-blur-xl border border-[#C5A880]/20 rounded-2xl p-5 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:border-[#B48C56]/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#B48C56]/15 border border-[#B48C56]/30 mx-auto mb-3 flex items-center justify-center text-[#D8B788] group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">{s.value}</div>
                <div className="text-[11px] text-[#D8B788] font-bold mt-1 uppercase tracking-wider">
                  {s.label}
                </div>
                <p className="text-[10px] text-slate-400 mt-1 hidden sm:block">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. FOUR CORE PILLARS OF NOVARA MOBILITY                        */}
      {/* ============================================================== */}
      <section className="py-24 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 sm:mb-20">
          <span className="text-xs font-bold text-[#D8B788] uppercase tracking-widest block mb-2">
            THE ANATOMY OF FIRST-CLASS TRANSIT
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Crafted for Absolute Serenity
          </h2>
          <p className="max-w-2xl mx-auto text-slate-300 text-sm mt-3">
            Every millimeter of the Novara experience has been engineered to elevate intercity road mobility beyond commercial air travel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-[#0B1E34]/85 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-[#B48C56]/40 transition-all shadow-2xl group flex flex-col justify-between"
              >
                {/* Visual Image Header */}
                <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-900">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E34] via-[#0B1E34]/40 to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#071322]/85 backdrop-blur-md border border-[#C5A880]/30 text-[10px] font-black tracking-widest text-[#D8B788] uppercase">
                    <Icon className="w-3.5 h-3.5 text-[#D8B788]" />
                    <span>{p.tag}</span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white mb-3 tracking-tight">
                      {p.title}
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                      {p.desc}
                    </p>
                  </div>

                  {/* Feature Checklist */}
                  <div className="pt-4 border-t border-white/10 space-y-2">
                    {p.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-2 text-xs text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0" />
                        <span className="font-medium">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. HEAD-TO-HEAD: NOVARA VS REGIONAL AIRLINES & REGULAR BUSES   */}
      {/* ============================================================== */}
      <section className="py-20 md:py-28 bg-[#061222]/90 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-[#D8B788] uppercase tracking-widest block mb-2">
              WHY DISCERNING TRAVELERS CHOOSE ROAD LUXURY
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Novara vs Traditional Travel
            </h2>
            <p className="max-w-2xl mx-auto text-slate-300 text-sm mt-3">
              Compare our direct executive coach service with the friction of regional flights and outdated bus lines.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto rounded-3xl border border-[#C5A880]/25 shadow-2xl bg-[#0B1E34]/90 backdrop-blur-xl">
            <table className="w-full text-left text-xs sm:text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-white/15 bg-gradient-to-r from-[#0B1E34] via-[#0F2847] to-[#0B1E34]">
                  <th className="p-4 sm:p-5 font-black uppercase tracking-wider text-slate-400 text-[11px] w-1/4">
                    Travel Dimension
                  </th>
                  <th className="p-4 sm:p-5 font-black uppercase tracking-wider text-[#D8B788] text-[11px] bg-[#B48C56]/15 border-x border-[#B48C56]/30 w-1/3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#D8B788]" />
                      <span>Novara Touring Coach</span>
                    </div>
                  </th>
                  <th className="p-4 sm:p-5 font-black uppercase tracking-wider text-slate-400 text-[11px] w-1/4">
                    Regional Domestic Flights
                  </th>
                  <th className="p-4 sm:p-5 font-black uppercase tracking-wider text-slate-400 text-[11px] w-1/4">
                    Standard Transit Buses
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition">
                    <td className="p-4 sm:p-5 font-bold text-white tracking-wide">
                      {row.feature}
                    </td>
                    <td className="p-4 sm:p-5 font-bold text-white bg-[#B48C56]/10 border-x border-[#B48C56]/20">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 stroke-[3]" />
                        <span>{row.novara}</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 text-slate-300">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{row.airline}</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 text-slate-400">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{row.bus}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. PASSENGER SAFETY, SUSTAINABILITY & CABIN INTEGRITY          */}
      {/* ============================================================== */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span className="text-xs font-bold text-[#D8B788] uppercase tracking-widest block mb-2">
              FLEET STANDARDS & RIGOROUS SAFETY
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-6">
              Next-Gen Precision Engineering
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Our fleet operates under strict European commercial transit guidelines, pairing certified master chauffeurs with the industry’s most advanced collision-avoidance and health safety architectures.
            </p>

            <div className="space-y-4">
              <div className="bg-[#0B1E34]/80 rounded-2xl p-4 border border-white/10 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#C5A880]/20 flex items-center justify-center shrink-0 text-[#C5A880]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Triple Electronic Braking & LiDAR Suite</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Active electronic stability control (ESC), lane tracking telemetry, and automated emergency braking assist provide unmatched security in rain or fog.
                  </p>
                </div>
              </div>

              <div className="bg-[#0B1E34]/80 rounded-2xl p-4 border border-white/10 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#C5A880]/20 flex items-center justify-center shrink-0 text-[#C5A880]">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Continuous Medical-Grade HEPA Air Purification</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    The entire cabin air volume is completely refreshed with fresh outside filtered air every 180 seconds through hospital-grade multi-stage particulate filters.
                  </p>
                </div>
              </div>

              <div className="bg-[#0B1E34]/80 rounded-2xl p-4 border border-white/10 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#C5A880]/20 flex items-center justify-center shrink-0 text-[#C5A880]">
                  <Luggage className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Guaranteed RFID Tag Luggage Security</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Heavy bags are stowed in climate-protected undercarriage holds, tagged upon boarding, and released only to verified pass holders upon arrival.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Image Showcase Card */}
          <div className="relative rounded-3xl overflow-hidden border border-[#C5A880]/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] h-[440px] sm:h-[500px]">
            <img
              src="/images/hero-coach.jpg"
              alt="Novara Touring Coach Exterior"
              className="w-full h-full object-cover brightness-105 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071322] via-[#071526]/30 to-transparent" />
            
            {/* Floating Terminal Badge */}
            <div className="absolute bottom-6 left-6 right-6 bg-[#071526]/90 backdrop-blur-xl border border-white/15 p-4 rounded-2xl shadow-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#B48C56]/20 border border-[#B48C56]/40 flex items-center justify-center text-[#D8B788]">
                  <Bus className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-white">Apex Touring GT Fleet</div>
                  <div className="text-[10px] text-slate-400 font-mono">100% Certified Bio-Hybrid</div>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active In Service
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. IMMERSIVE CALL TO ACTION                                    */}
      {/* ============================================================== */}
      <section className="py-24 text-center max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-br from-[#0B1E34] to-[#071526] rounded-3xl p-8 sm:p-14 border border-[#C5A880]/35 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#B48C56]/10 rounded-full blur-3xl pointer-events-none" />
          
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B48C56]/20 border border-[#B48C56]/30 text-[#D8B788] text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            READY FOR YOUR JOURNEY?
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Experience Travel as It Was Meant to Be
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8 font-normal leading-relaxed">
            Reserve your preferred luxury suite with guaranteed 3D seat confirmation, generous baggage allowance, and direct city-to-city speed.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/book/bus-1"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D8B788] via-[#B48C56] to-[#8C6B3D] hover:from-[#E2C799] hover:to-[#B48C56] text-slate-950 font-black text-xs uppercase tracking-widest shadow-xl transition-all transform hover:scale-105 cursor-pointer"
            >
              <Armchair className="w-4 h-4 stroke-[2.5]" />
              <span>Launch 3D Cabin Tour</span>
            </Link>
            <Link
              href="/routes"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#071526] hover:bg-white/10 text-white border border-white/20 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
            >
              <span>Explore Routes & Dates</span>
              <ArrowRight className="w-4 h-4 text-[#D8B788]" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
