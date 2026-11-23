'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle,
  Sparkles,
  Shield,
  HelpCircle,
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bookingRef: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const contactCards = [
    {
      title: '24/7 Telephone Concierge',
      desc: 'Immediate dispatch assistance, route updates, and urgent seat adjustments.',
      contact: '+1 (800) 589-6682',
      badge: 'Toll-Free 24/7',
      icon: Phone,
    },
    {
      title: 'Digital Support Desk',
      desc: 'Booking confirmations, corporate private charters, and receipt inquiries.',
      contact: 'concierge@novaracoach.com',
      badge: 'Avg Response < 15m',
      icon: Mail,
    },
    {
      title: 'Executive Terminal Bay',
      desc: 'Central Transit Concourse, Executive Express Gate 4.',
      contact: 'Downtown Grand Station',
      badge: 'Luggage Check Available',
      icon: MapPin,
    },
    {
      title: 'Operating Hours',
      desc: 'Our dispatch team and automated digital twin engine operate continuously.',
      contact: '365 Days • Non-Stop',
      badge: 'Live Operations',
      icon: Clock,
    },
  ];

  return (
    <div className="min-h-screen bg-[#071526] text-white">
      {/* 1. HERO BANNER */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-[#071526] via-[#0B192C] to-[#071526] text-center px-4 overflow-hidden">
        <div className="relative max-w-4xl mx-auto z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B48C56]/20 border border-[#B48C56]/30 text-[#D8B788] text-xs font-bold uppercase tracking-widest mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            Passenger Concierge & Support
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            We Are Here to <span className="text-[#C5A880] font-serif italic">Assist You</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Have questions about your upcoming journey, seat specifications, or special luggage requirements? Our dedicated concierge is available 24/7.
          </p>
        </div>
      </section>

      {/* 2. CONTACT CHANNELS CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-16 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactCards.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div
                key={idx}
                className="bg-[#0B192C] border border-white/10 rounded-2xl p-6 shadow-xl hover:border-[#B48C56]/40 transition group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#B48C56]/15 border border-[#B48C56]/30 flex items-center justify-center text-[#D8B788] group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                    {c.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{c.title}</h3>
                <p className="text-xs text-slate-400 mb-3">{c.desc}</p>
                <div className="text-xs font-bold text-[#D8B788] font-mono">{c.contact}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. INTERACTIVE CONTACT FORM & FAQ SUMMARY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Form (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0B192C] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Send a Direct Message</h2>
            <p className="text-xs text-slate-400 mb-8">
              Fill out the details below and a passenger relation agent will reach out within minutes.
            </p>

            {isSubmitted ? (
              <div className="p-8 text-center bg-[#071526] rounded-2xl border border-emerald-500/30">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Message Dispatched Successfully</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto mb-6">
                  Thank you, {formData.fullName || 'esteemed passenger'}. Your inquiry has been routed to our passenger desk. A confirmation has been logged.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-2 rounded-xl bg-[#B48C56] hover:bg-[#A37B47] text-slate-950 font-bold text-xs uppercase tracking-wider transition"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alexander Vance"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#071526] border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#B48C56]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#071526] border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#B48C56]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +1 555-019-2834"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#071526] border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#B48C56]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Booking Reference Code (If applicable)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NOV-8492"
                      value={formData.bookingRef}
                      onChange={(e) => setFormData({ ...formData, bookingRef: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#071526] border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#B48C56]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Inquiry Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#071526] border border-white/15 text-white text-xs focus:outline-none focus:border-[#B48C56]"
                  >
                    <option value="General Inquiry">General Passenger Inquiry</option>
                    <option value="Seat Selection or Change">Seat Selection or Suite Change</option>
                    <option value="Luggage & Special Equipment">Luggage & Special Baggage Policy</option>
                    <option value="Corporate Charter Booking">Corporate or Private Coach Charter</option>
                    <option value="Refund & Cancellation">Refund & Rescheduling Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe your inquiry in detail..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#071526] border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#B48C56] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-[#B48C56] hover:bg-[#A37B47] text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-xl flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>Transmit Inquiry to Concierge</span>
                </button>
              </form>
            )}
          </div>

          {/* Quick FAQ / Assistance Panel (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0B192C] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#D8B788]" />
                Guaranteed Response Time
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                All inquiries submitted through this portal are prioritized by passenger departure time. For passengers traveling within the next 4 hours, telephone contact is recommended for instant terminal dispatch coordination.
              </p>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-start gap-3 text-xs text-slate-300">
                  <Sparkles className="w-4 h-4 text-[#D8B788] shrink-0 mt-0.5" />
                  <span>Instant digital boarding pass retrieval via SMS & Email.</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-slate-300">
                  <Sparkles className="w-4 h-4 text-[#D8B788] shrink-0 mt-0.5" />
                  <span>Complimentary seat changes up to 2 hours before scheduled departure.</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-slate-300">
                  <Sparkles className="w-4 h-4 text-[#D8B788] shrink-0 mt-0.5" />
                  <span>Dedicated undercarriage luggage assistance by terminal staff.</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0B192C] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl text-center">
              <h4 className="text-sm font-bold text-white mb-2">Want to explore schedules?</h4>
              <p className="text-xs text-slate-400 mb-6">
                View real-time departure boards and reserve your preferred 3D coach suite.
              </p>
              <Link
                href="/routes"
                className="inline-block w-full py-3 rounded-xl bg-[#071526] hover:bg-[#B48C56] hover:text-slate-950 text-white border border-white/15 font-bold text-xs uppercase tracking-wider transition"
              >
                Browse All Routes
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
