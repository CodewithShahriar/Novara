'use client';

import React from 'react';
import Link from 'next/link';
import { Bus, ShieldCheck, Zap, Globe, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#050F1E] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#B48C56] to-[#8C6B3D] flex items-center justify-center text-white shadow-md">
                <Bus className="w-5 h-5 text-white stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">NOVARA</span>
                <span className="ml-1 text-[10px] font-bold text-[#D8B788] uppercase tracking-widest">EUROPE</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Premier European intercity coach operator providing high-frequency routes between iconic cultural capitals with interactive 3D seat reservation and guaranteed comfort.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Fleet Status: All European Corridors Active</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D8B788] mb-4">
              Booking & Routes
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/routes" className="hover:text-white transition">
                  European Intercity Timetable
                </Link>
              </li>
              <li>
                <Link href="/book/bus-1" className="hover:text-white transition">
                  Interactive 3D Seat Booking
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition">
                  Manage Digital Boarding Pass
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition">
                  Fleet Operations Terminal
                </Link>
              </li>
            </ul>
          </div>

          {/* Fleet Specifications */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D8B788] mb-4">
              Travel Amenities
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B48C56]" />
                <span>Modern Euro 6 & Electric Luxury Coaches</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-[#B48C56]" />
                <span>Contoured Reclining Leather Passenger Suites</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-[#B48C56]" />
                <span>Complimentary Onboard Starlink Wi-Fi</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B48C56]" />
                <span>Restroom, Powder Room & Climate Control</span>
              </li>
            </ul>
          </div>

          {/* Customer Service & Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D8B788] mb-4">
              Help & Inquiries
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#B48C56]" />
                <span className="text-white font-medium">+44 (0) 20 7946 0912</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#B48C56]" />
                <span>travel@novaracoach.eu</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-2 border-t border-white/5">
                Free ticket changes and refunds available up to 60 minutes before scheduled coach departure.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Novara Luxury Touring Coach Lines S.A. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer transition">Terms of Carriage</span>
            <span className="hover:text-slate-400 cursor-pointer transition">Passenger Rights</span>
            <span className="hover:text-slate-400 cursor-pointer transition">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
