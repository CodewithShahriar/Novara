'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  Bus,
  DollarSign,
  TrendingUp,
  Armchair,
  Clock,
  Eye,
} from 'lucide-react';
import { BusDetails, BookingRecord } from '@/lib/types';
import { INITIAL_BUSES, INITIAL_BOOKINGS } from '@/lib/mock-data';

export default function AdminDashboardPage() {
  const [buses, setBuses] = useState<BusDetails[]>(INITIAL_BUSES);
  const [bookings, setBookings] = useState<BookingRecord[]>(INITIAL_BOOKINGS);
  const [selectedBusForSeats, setSelectedBusForSeats] = useState<BusDetails>(INITIAL_BUSES[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'fleet' | 'seats' | 'bookings'>('overview');

  const totalRevenue = bookings.reduce(
    (sum, b) => (b.status === 'CONFIRMED' ? sum + b.totalPrice : sum),
    0
  );
  const activeBookingsCount = bookings.filter((b) => b.status === 'CONFIRMED').length;
  const totalFleetSeats = buses.reduce((sum, b) => sum + b.totalSeats, 0);
  const totalAvailableSeats = buses.reduce((sum, b) => sum + b.availableSeats, 0);
  const occupancyPercent = Math.round(
    ((totalFleetSeats - totalAvailableSeats) / (totalFleetSeats || 1)) * 100
  );

  useEffect(() => {
    async function loadAdminData() {
      try {
        const res = await fetch('/api/admin');
        const data = await res.json();
        if (data.success) {
          if (data.buses?.length) setBuses(data.buses);
          if (data.bookings?.length) setBookings(data.bookings);
          if (data.buses?.length) setSelectedBusForSeats(data.buses[0]);
        }
      } catch (err) {
        // fallback
      }
    }
    loadAdminData();
  }, []);

  const handleToggleSeat = async (seatNumber: string, currentBooked: boolean) => {
    const updatedBooked = !currentBooked;

    setBuses((prev) =>
      prev.map((bus) => {
        if (bus.id === selectedBusForSeats.id) {
          const updatedSeats = bus.seats.map((s) =>
            s.seatNumber === seatNumber ? { ...s, isBooked: updatedBooked } : s
          );
          return {
            ...bus,
            seats: updatedSeats,
            availableSeats: updatedSeats.filter((s) => !s.isBooked).length,
          };
        }
        return bus;
      })
    );

    setSelectedBusForSeats((prev) => {
      const updatedSeats = prev.seats.map((s) =>
        s.seatNumber === seatNumber ? { ...s, isBooked: updatedBooked } : s
      );
      return {
        ...prev,
        seats: updatedSeats,
        availableSeats: updatedSeats.filter((s) => !s.isBooked).length,
      };
    });

    try {
      await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'TOGGLE_SEAT',
          busId: selectedBusForSeats.id,
          seatNumber,
          isBooked: updatedBooked,
        }),
      });
    } catch (e) {
      // Handled
    }
  };

  return (
    <div className="min-h-screen bg-[#070A0F] py-8 sm:py-12 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header */}
        <div className="clean-card rounded-3xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-white">Fleet Dispatch Terminal</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase">
                    Admin Active
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time seat allocation, capacity management & coach schedule dispatch
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/book/${selectedBusForSeats.id}`}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 shadow-lg"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Open 3D Coach View</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="clean-card rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Gross Fleet Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-amber-400 font-mono">
              ${totalRevenue.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-400 font-semibold mt-1">+18.4% vs last week</div>
          </div>

          <div className="clean-card rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Active Bookings</span>
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono">{activeBookingsCount}</div>
            <div className="text-xs text-slate-400 font-semibold mt-1">Confirmed & Issued</div>
          </div>

          <div className="clean-card rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Active Fleet Coaches</span>
              <Bus className="w-4 h-4 text-slate-300" />
            </div>
            <div className="text-2xl font-black text-white font-mono">{buses.length}</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Mercedes & Volvo Coaches</div>
          </div>

          <div className="clean-card rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Average Fleet Occupancy</span>
              <Armchair className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono">{occupancyPercent}%</div>
            <div className="text-xs text-slate-400 mt-1">
              {totalFleetSeats - totalAvailableSeats} of {totalFleetSeats} reserved
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-white/5'
            }`}
          >
            Dashboard Overview
          </button>
          <button
            onClick={() => setActiveTab('seats')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'seats'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-white/5'
            }`}
          >
            3D Seat Inventory Manager
          </button>
          <button
            onClick={() => setActiveTab('fleet')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'fleet'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-white/5'
            }`}
          >
            Fleet & Schedules ({buses.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'bookings'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-white/5'
            }`}
          >
            Bookings Log ({bookings.length})
          </button>
        </div>

        {/* TAB 1: SEAT INVENTORY MANAGER */}
        {activeTab === 'seats' && (
          <div className="space-y-6">
            <div className="clean-card rounded-3xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Armchair className="w-5 h-5 text-amber-400" />
                    Seat Layout & Availability Manager
                  </h3>
                  <p className="text-xs text-slate-400">
                    Click any seat to instantly toggle between AVAILABLE and BOOKED in the live 3D coach interior.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-400">Select Coach:</span>
                  <select
                    value={selectedBusForSeats.id}
                    onChange={(e) => {
                      const b = buses.find((item) => item.id === e.target.value);
                      if (b) setSelectedBusForSeats(b);
                    }}
                    className="bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    {buses.map((b) => (
                      <option key={b.id} value={b.id} className="bg-slate-900">
                        {b.name} ({b.operator})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid of Seats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                {selectedBusForSeats.seats.map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => handleToggleSeat(seat.seatNumber, seat.isBooked)}
                    className={`p-3.5 rounded-2xl border flex flex-col items-center justify-between gap-2 transition hover:scale-105 shadow-md ${
                      seat.isBooked
                        ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                        : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-black text-white">{seat.seatNumber}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900/60 text-amber-400">
                        ${seat.price}
                      </span>
                    </div>

                    <div className="text-[10px] font-bold uppercase tracking-wider text-center">
                      {seat.isBooked ? 'Booked' : 'Available'}
                    </div>

                    <span className="text-[10px] text-slate-400">{seat.tier}</span>
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-emerald-400" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-rose-500" />
                    <span>Booked</span>
                  </div>
                </div>
                <span>Changes sync directly to the 3D cabin model in real-time</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="clean-card rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Recent Passenger Bookings
                </h3>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs text-amber-400 font-semibold hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {bookings.slice(0, 4).map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-xl bg-slate-800/60 border border-white/5 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-400">{b.bookingRef}</span>
                        <span className="text-slate-300">• {b.passengerName}</span>
                      </div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        {b.fromCity} → {b.toCity} (Suites: {b.seats.join(', ')})
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-white">${b.totalPrice}</span>
                      <div className="text-[10px] text-emerald-400 font-bold">{b.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="clean-card rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Bus className="w-4 h-4 text-amber-400" />
                  Coach Occupancy Status
                </h3>
              </div>

              <div className="space-y-4">
                {buses.map((bus) => {
                  const bookedCount = bus.totalSeats - bus.availableSeats;
                  const pct = Math.round((bookedCount / bus.totalSeats) * 100);

                  return (
                    <div key={bus.id} className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span className="font-bold text-white">{bus.name}</span>
                        <span className="text-amber-400 font-bold">
                          {bookedCount}/{bus.totalSeats} seats ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FLEET & SCHEDULES */}
        {activeTab === 'fleet' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {buses.map((b) => (
              <div key={b.id} className="clean-card rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      {b.operator}
                    </span>
                    <h4 className="text-lg font-bold text-white mt-0.5">{b.name}</h4>
                    <p className="text-xs text-slate-400">{b.model}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 uppercase font-semibold">Base Price</span>
                    <div className="text-xl font-black text-amber-400">${b.basePrice}</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5 text-xs text-slate-300 flex items-center justify-between">
                  <span>
                    {b.fromCity} → {b.toCity}
                  </span>
                  <span className="text-amber-400 font-bold">{b.departureTime}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-xs text-emerald-400 font-semibold">
                    {b.availableSeats} of {b.totalSeats} seats open
                  </span>

                  <Link
                    href={`/book/${b.id}`}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-white/10 font-bold text-xs uppercase transition"
                  >
                    Inspect 3D Interior
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: BOOKINGS LOG */}
        {activeTab === 'bookings' && (
          <div className="clean-card rounded-3xl p-6 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-white/10 pb-3 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Ref Code</th>
                  <th className="py-3 px-4">Passenger</th>
                  <th className="py-3 px-4">Coach & Route</th>
                  <th className="py-3 px-4">Suites</th>
                  <th className="py-3 px-4">Fare</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Pass Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{b.bookingRef}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{b.passengerName}</div>
                      <div className="text-[10px] text-slate-400">{b.passengerEmail}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{b.fromCity} → {b.toCity}</div>
                      <div className="text-[10px] text-slate-400">{b.busName}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-amber-400">{b.seats.join(', ')}</td>
                    <td className="py-3.5 px-4 font-bold text-white">${b.totalPrice}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.status === 'CONFIRMED'
                            ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                            : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{b.journeyDate}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/ticket/${b.bookingRef}`}
                        className="text-amber-400 font-bold hover:underline"
                      >
                        View Pass
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
