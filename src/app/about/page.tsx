'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Armchair, Sparkles, Check } from 'lucide-react';

export default function AboutPage() {
  const pillars = [
    {
      num: '01',
      title: 'The Flagship Fleet',
      tag: 'AERODYNAMIC 3-AXLE ENGINEERING',
      description:
        'Engineered specifically for serene, long-distance highway cruising. Triple-axle active air suspension, dual-layer acoustic glazing, and clean bio-hybrid powertrains eliminate road vibration and engine roar.',
    },
    {
      num: '02',
      title: 'The 3D Digital Twin',
      tag: 'MILLIMETER CABIN PREVIEW',
      description:
        'Eliminating generic seating diagrams. Our proprietary WebGL 3D cabin model allows you to walk through the coach, inspect your exact suite, check aisle clearance, and preview actual window perspectives prior to departure.',
    },
    {
      num: '03',
      title: 'Downtown-to-Downtown Speed',
      tag: 'EFFORTLESS 5-MINUTE BOARDING',
      description:
        'Departing and arriving directly at central metropolitan concourses. Bypass lengthy airport security checkpoints, TSA lines, and baggage claim delays with direct walk-on boarding.',
    },
  ];

  const specs = [
    { label: 'Coach Architecture', detail: '3-Axle Low-Drag Aerodynamic Touring Chassis' },
    { label: 'Suite Ergonomics', detail: 'Italian Leather Recliners with Forward Privacy Wings' },
    { label: 'In-Seat Power', detail: '100W USB-C PD Fast Charging + Inductive Qi Wireless' },
    { label: 'Connectivity', detail: 'Complimentary High-Speed Starlink Satellite Wi-Fi' },
    { label: 'Cabin Airflow', detail: 'Medical-Grade HEPA Filtration Refreshed Every 3 Mins' },
    { label: 'Luggage Security', detail: 'Climate-Protected Lower Holds with Verified RFID Tags' },
  ];

  const metrics = [
    { value: '32+', label: 'Intercity Corridors' },
    { value: '120+', label: 'Daily Non-Stop Trips' },
    { value: '99.4%', label: 'Punctual Arrival Rate' },
    { value: '-82%', label: 'Carbon vs Regional Flights' },
  ];

  return (
    <div className="min-h-screen bg-[#071322] text-white selection:bg-[#B48C56] selection:text-white">
      
      {/* 1. HERO NARRATIVE SECTION */}
      <section className="pt-20 pb-16 sm:pt-24 sm:pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B48C56]/20 border border-[#B48C56]/30 text-[#D8B788] text-[11px] font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#D8B788]" />
            <span>ABOUT NOVARA INTERCITY</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight mb-6">
            Aviation-Grade Elegance, <br />
            <span className="text-[#C5A880] font-serif italic font-normal">Re-Imagined</span> for the Highway.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
            Novara was established with a clear mission: long-distance highway travel should be a calm, productive, and comfortable journey — free from crowded airport terminals, prolonged TSA queues, and cramped transit seating. We pair bespoke European touring coach engineering with guaranteed comfort and the industry’s first interactive 3D cabin reservation twin.
          </p>
        </div>

        {/* Cinematic Main Showcase Image (Authentic Project Coach Image) */}
        <div className="mt-12 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
          <img
            src="/images/hero-coach.jpg"
            alt="Novara Touring Coach at Terminal"
            className="w-full h-[360px] sm:h-[480px] lg:h-[540px] object-cover brightness-105 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071322]/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold tracking-wider uppercase text-[#D8B788]">
              Apex Touring GT BioDrive Flagship
            </span>
            <span className="font-mono text-slate-400">Bay 02 Concourse</span>
          </div>
        </div>
      </section>

      {/* 2. KEY METRICS STRIP (Minimal & Typographic) */}
      <section className="border-y border-white/10 bg-[#0B1E34]/50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            {metrics.map((m, idx) => (
              <div key={idx} className="border-l-2 border-[#B48C56]/40 pl-4">
                <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  {m.value}
                </div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. THREE GUIDING PILLARS (Clean, Numbered, Airy) */}
      <section className="py-20 sm:py-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14 text-left">
          <span className="text-xs font-bold text-[#D8B788] uppercase tracking-widest block mb-2">
            CORE FOUNDATIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Crafted for Uninterrupted Serenity
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="bg-[#0B1E34]/70 border border-white/10 rounded-2xl p-7 lg:p-8 flex flex-col justify-between hover:border-[#B48C56]/40 transition shadow-xl"
            >
              <div>
                <div className="text-3xl font-mono font-bold text-[#C5A880] mb-4">
                  {p.num}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  {p.tag}
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                  {p.title}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {p.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FLEET SPECIFICATIONS & PASSENGER CABIN (Editorial Split with Authentic Photo) */}
      <section className="py-20 border-t border-white/10 bg-[#061222]/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Authentic Project Image */}
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative h-[380px] sm:h-[440px]">
              <img
                src="/images/timetable-passengers.jpg"
                alt="Novara Travelers Boarding"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061222]/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-xs text-slate-300 flex items-center justify-between">
                <span className="font-semibold text-white">Boarding Concourse</span>
                <span className="text-[#D8B788] font-mono">5-Minute Walk-On</span>
              </div>
            </div>

            {/* Right Clean Technical Specifications */}
            <div className="text-left">
              <span className="text-xs font-bold text-[#D8B788] uppercase tracking-widest block mb-2">
                FLEET STANDARDS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4">
                Tailored for Executive Highway Travel
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                Every vehicle in our long-range touring coach fleet is maintained under rigorous European safety standards, featuring certified chauffeurs, live GPS telemetry, and hospital-grade cabin hygiene.
              </p>

              <div className="space-y-3">
                {specs.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2.5 border-b border-white/10 text-xs"
                  >
                    <span className="text-slate-400 font-semibold">{s.label}</span>
                    <span className="text-white font-medium text-right pl-4">{s.detail}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. MINIMAL CLASSY CALL TO ACTION */}
      <section className="py-20 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
          Ready to Experience Modern Highway Travel?
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto mb-8 leading-relaxed font-normal">
          Inspect individual leather suites in real 3D, check window alignments, and secure your direct journey across cities.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/book/bus-1"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#D8B788] via-[#B48C56] to-[#8C6B3D] hover:from-[#E2C799] hover:to-[#B48C56] text-slate-950 font-black text-xs uppercase tracking-widest shadow-xl transition-all transform hover:scale-105 cursor-pointer"
          >
            <Armchair className="w-4 h-4 stroke-[2.5]" />
            <span>Launch 3D Cabin Tour</span>
          </Link>
          <Link
            href="/routes"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#0B1E34] hover:bg-white/10 text-white border border-white/15 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            <span>Explore Routes & Timetables</span>
            <ArrowRight className="w-4 h-4 text-[#D8B788]" />
          </Link>
        </div>
      </section>

    </div>
  );
}
