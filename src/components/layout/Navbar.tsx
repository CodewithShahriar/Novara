'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, Bus, Sparkles } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isHome = pathname === '/';

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Routes & Schedules', href: '/routes' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'My Bookings', href: '/dashboard' },
  ];

  return (
    <header
      className={`w-full z-50 transition-colors duration-300 ${
        isHome
          ? 'absolute top-0 left-0 right-0 bg-transparent border-b border-white/10'
          : 'sticky top-0 bg-[#071526]/95 backdrop-blur-xl border-b border-white/10 shadow-xl'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo with Custom Transparent N Icon */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0B1E34] to-[#071526] border border-[#B48C56]/40 flex items-center justify-center p-1.5 shadow-md group-hover:scale-105 group-hover:border-[#B48C56] transition-all">
            <img 
              src="/images/novara-logo.png" 
              alt="Novara Icon" 
              className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" 
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white group-hover:text-[#E0C097] transition-colors">
                NOVARA
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#B48C56]/20 text-[#D8B788] border border-[#B48C56]/30 uppercase tracking-widest">
                INTERCITY
              </span>
            </div>
            <p className="text-[10px] font-semibold tracking-widest text-slate-300 uppercase -mt-0.5">
              Touring Coach Express
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0B1E34]/80 p-1.5 rounded-2xl border border-white/5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-white/10 text-[#E0C097] shadow-sm font-bold border border-white/10'
                    : 'text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/routes"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B48C56] to-[#9E7947] hover:from-[#A8824E] hover:to-[#8F6C3C] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition transform hover:-translate-y-0.5"
          >
            <span>Book Seats</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-[#0B1E34] border border-white/10"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 border-b border-white/10 px-6 py-5 space-y-2 shadow-2xl backdrop-blur-xl">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 font-bold border border-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/routes"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg"
            >
              <span>Book Seats</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
