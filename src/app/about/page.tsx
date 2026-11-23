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
} from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: 'Destinations Served', value: '32+', icon: Globe2 },
    { label: 'Daily Express Trips', value: '120+', icon: Clock },
    { label: 'On-Time Arrival Rate', value: '99.4%', icon: CheckCircle2 },
    { label: 'Verified Travelers', value: '45,000+', icon: Award },
  ];

  const pillars = [
    {
      title: '3-Axle Aerodynamic Flagship Coaches',
      desc: 'Engineered for smooth long-range cruising. Triple-axle suspension, dual acoustic glass, and whisper-quiet bio-electric powertrains ensure unmatched stability and serenity.',
      icon: Bus,
    },
    {
      title: 'The World’s First 3D Cabin Booking',
      desc: 'No more generic seat maps. Our proprietary WebGL digital twin allows you to inspect every individual suite, view aisle alignment, and experience real window perspectives before departure.',
      icon: Sparkles,
    },
    {
      title: 'Executive First-Class Amenities',
      desc: 'Ergonomic hand-stitched leather recliners, inductive Qi wireless fast charging, panoramic solar-tinted glass, personal climate airflow, and complimentary high-speed Wi-Fi.',
      icon: Armchair,
    },
    {
      title: 'Punctual City-to-City Terminals',
      desc: 'Centrally located express bays with zero airport security queues. Board effortlessly within minutes and arrive directly in downtown city centers ready for your day.',
      icon: Compass,
    },
  ];

  return (
    <div className="min-h-screen bg-[#071526] text-white">
      {/* 1. HERO BANNER */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-[#071526] via-[#0B192C] to-[#071526]">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1800&q=85')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071526] via-[#071526]/80 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B48C56]/20 border border-[#B48C56]/30 text-[#D8B788] text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            The Novara Standard
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6">
            Redefining <span className="text-[#C5A880] font-serif italic">Luxury</span> Intercity Coach Travel
          </h1>
          <p className="max-w-3xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed">
            Novara was established with a singular vision: to bring first-class aviation elegance and digital innovation to European and intercity highway transit. We combine bespoke touring coach craftsmanship with guaranteed comfort.
          </p>
        </div>
      </section>

      {/* 2. KEY STATS */}
      <section className="relative -mt-10 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-[#0B192C] border border-white/10 rounded-2xl p-6 text-center shadow-xl hover:border-[#B48C56]/40 transition"
              >
                <div className="w-10 h-10 rounded-xl bg-[#B48C56]/15 border border-[#B48C56]/30 mx-auto mb-3 flex items-center justify-center text-[#D8B788]">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl font-black text-white font-mono">{s.value}</div>
                <div className="text-xs text-slate-400 font-semibold mt-1 uppercase tracking-wider">
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. FOUR CORE PILLARS */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-[#D8B788] uppercase tracking-widest block mb-2">
            WHY TRAVEL WITH NOVARA
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Crafted for Unmatched Serenity
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-[#0B192C] border border-white/10 rounded-3xl p-8 hover:border-[#B48C56]/40 transition shadow-2xl relative overflow-hidden group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#B48C56]/20 border border-[#B48C56]/40 flex items-center justify-center text-[#D8B788] mb-6 group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{p.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. FLEET SUSTAINABILITY & SAFETY */}
      <section className="py-16 bg-[#0B192C]/70 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-[#D8B788] uppercase tracking-widest block mb-2">
                FLEET STANDARDS & SAFETY
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-6">
                Next-Gen Precision Engineering
              </h2>
              <div className="space-y-4 text-slate-300 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#D8B788] shrink-0 mt-0.5" />
                  <span>
                    <strong>Triple Electronic Braking & Collision Avoidance:</strong> Real-time LiDAR sensors and lane centering ensure maximum passenger security across all highways.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#D8B788] shrink-0 mt-0.5" />
                  <span>
                    <strong>Climate HEPA Air Purification:</strong> Continuous cabin airflow renewal every 3 minutes with medical-grade multi-stage particulate filtering.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#D8B788] shrink-0 mt-0.5" />
                  <span>
                    <strong>Zero-Emission BioDrive Hybrid Powertrains:</strong> Reducing per-passenger carbon footprint by 82% compared to short-haul domestic flights.
                  </span>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <Link
                  href="/routes"
                  className="px-6 py-3 rounded-xl bg-[#B48C56] hover:bg-[#A37B47] text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg inline-flex items-center gap-2"
                >
                  <span>Explore Schedules</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-xl bg-[#071526] hover:bg-white/10 text-white border border-white/15 font-bold text-xs uppercase tracking-wider transition"
                >
                  Contact Concierge
                </Link>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-80 lg:h-96">
              <img
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=85"
                alt="Novara Luxury Coach"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071526] via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-20 text-center max-w-5xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
          Experience Travel as It Was Meant to Be
        </h2>
        <p className="text-slate-300 text-sm max-w-xl mx-auto mb-8">
          Reserve your preferred forward-facing suite with guaranteed luggage space and panoramic window views.
        </p>
        <Link
          href="/book/bus-1"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#B48C56] hover:bg-[#A37B47] text-slate-950 font-black text-xs uppercase tracking-widest shadow-xl transition transform hover:scale-105"
        >
          <Armchair className="w-4 h-4" />
          <span>Launch 3D Cabin Tour</span>
        </Link>
      </section>
    </div>
  );
}
