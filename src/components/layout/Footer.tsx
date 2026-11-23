'use client';

import React from 'react';
import Link from 'next/link';
import { Bus, ShieldCheck, Zap, Globe, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#05070B] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-md">
                <Bus className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">NOVARA</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              International express touring coach network delivering high-comfort intercity travel with interactive 3D seat reservation and certified safety.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Fleet Status: All Coaches On Schedule</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Booking & Travel
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/routes" className="hover:text-amber-400 transition">
                  Browse Schedules & Fares
                </Link>
              </li>
              <li>
                <Link href="/book/bus-1" className="hover:text-amber-400 transition">
                  3D Seat Reservation
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-amber-400 transition">
                  Manage My Booking
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-400 transition">
                  Fleet Dispatch Terminal
                </Link>
              </li>
            </ul>
          </div>

          {/* Fleet Specifications */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Coach Amenities
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Mercedes & Volvo Luxury Touring Coaches</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Zero-G Reclining Ergonomic Leather Suites</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>High-Speed Starlink Wi-Fi Onboard</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Medical-Grade Clean Air HEPA Filtration</span>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Help & Support
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>+1 (800) 555-NOVARA</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>support@novaracoach.com</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-2 border-t border-white/5">
                100% full refund available up to 60 minutes before scheduled coach departure.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Novara Luxury Coach Corporation. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Carriage</span>
            <span className="hover:text-slate-400 cursor-pointer">Luggage Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
