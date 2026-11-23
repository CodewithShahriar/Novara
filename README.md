# 🚌 NOVARA — Luxury Touring Coach & Interactive 3D Bus Booking Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000?style=for-the-badge&logo=three.js)
![React Three Fiber](https://img.shields.io/badge/R3F-drei-white?style=for-the-badge&logo=three.js)
![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?style=for-the-badge&logo=greensock)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)

<p align="center">
  <strong>Experience the pinnacle of intercity luxury bus travel.</strong><br>
  Explore an authentic 3D cutaway touring coach cabin, inspect hand-stitched leather suites in real-time, and reserve your seat with seamless cinematic camera glide.
</p>

[Visual Showcase](#-visual-showcase) •
[Key Features](#-key-features) •
[3D Experience](#-interactive-3d-coach-experience) •
[Tech Stack](#-technology-stack) •
[Project Structure](#-project-structure) •
[Getting Started](#-getting-started) •
[Routes & Pages](#-routes--pages)

</div>

---

## 📸 Visual Showcase

### 1. Executive Landing Experience & Obsidian Glass Search
Full-bleed cinematic hero featuring luxury intercity touring coach, refined executive serif typography, and dark obsidian glassmorphism search widget.

<div align="center">
  <img src="./public/images/screenshots/hero-preview.jpg" alt="Novara Luxury Hero & Search" width="100%" style="border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.4);" />
</div>

<br />

### 2. Interactive 3D Passenger Suite Inspection (Flagship Feature)
Real-time 3D cutaway model of a 3-axle European touring coach. Inspect all 36 suites, glide directly down the aisle into any selected seat with zero obstruction, and toggle 2D blueprint layouts.

<div align="center">
  <img src="./public/images/screenshots/3d-booking-preview.jpg" alt="Interactive 3D Coach Suite Inspection" width="100%" style="border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.4);" />
</div>

<br />

### 3. Filterable Intercity Routes & Live Schedules
Direct city-to-city catalog with real-time schedule filtering, price sorting, amenity badges, and 1-click 3D suite selection.

<div align="center">
  <img src="./public/images/screenshots/routes-preview.png" alt="Routes & Schedules Catalog" width="100%" style="border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.4);" />
</div>

<br />

### 4. Verified Encrypted Digital Boarding Pass
Airline-grade boarding pass modal featuring verified QR code with ISO finder patterns, barcode, baggage allowances, terminal gate details, and print/save PDF actions.

<div align="center">
  <img src="./public/images/screenshots/boarding-pass-preview.jpg" alt="Verified Encrypted Boarding Pass" width="70%" style="border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.4);" />
</div>

---

## 🌟 Overview

**Novara** is a production-quality, modern, futuristic bus ticket booking platform designed with a high-end aviation and luxury automotive aesthetic. Instead of conventional flat seat grids, Novara places users inside an authentic, photorealistic 3D passenger coach inspired by European 3-axle touring coaches.

Passengers can interactively rotate, zoom, and inspect individual seats, transition cinematically into individual suite details, and complete real-time bookings across web and mobile viewports.

---

## 🚀 Key Features

### 💺 Interactive 3D Coach Cabin (Flagship Feature)
- **Top Angled Cutaway Perspective:** Unobstructed bird's-eye view allowing clear inspection of all 36 passenger seats across 9 rows.
- **Cinematic Seat Zoom Experience:** Powered by **GSAP**; clicking any seat smoothly animates the camera into the central aisle to inspect the selected suite from a natural passenger eye-level, eliminating exterior wall and preceding headrest clipping.
- **Intro Swoop Animation:** On initial scene load, the camera starts at a graceful 3/4 side profile view and smoothly swoops into the aligned overhead cabin aisle view.
- **Seat Availability System:** Real-time visual feedback for `AVAILABLE`, `SELECTED` (glowing amber/blue highlight ring and elevation), and `BOOKED` (disabled state).
- **Dual 2D Blueprint Seat Map:** Instant modal toggle allowing passengers to view traditional 2D cabin schematics alongside the 3D model.

### 🚌 Authentic Luxury Coach Anatomy
- **Ergonomic Passenger Suites:** High-back contoured bucket seats with horizontal lumbar segments, aisle-side grab rails, retractable tray tables, personal 4K entertainment touchscreens, and signature **crisp white leather antimacassar headrest covers**.
- **Aisle & Flooring Architecture:** Dual raised seating platforms with dark acoustic transit carpet, bordered by a sunken central aisle featuring **ribbed diamond-plate aluminum tread** and **high-visibility safety yellow boundary lines**.
- **Draped Royal Blue Window Curtains:** Neatly folded fabric curtains flanking every window pillar.
- **Driver Cockpit & Telemetry Console:** Warm walnut/amber woodgrain cluster panel, dual speedometer/tachometer dials, digital telemetry HUD, 3-spoke bus steering wheel, floor gear lever, and yellow grab stanchions.
- **Aerodynamic Platinum Silver Exterior:** Sleek metallic finish with curved front bumper, triple LED projector headlights, daytime running lights, swept-back panoramic windshield, rear spoiler, and vertical LED taillights.

### 💳 Complete Booking Ecosystem
- **Search & Discovery Engine:** Filter domestic intercity routes by origin, destination, journey date, and passengers.
- **Real-Time Price Aggregation:** Persistent floating summary bar dynamically calculates multi-seat totals and provides one-click checkout.
- **Checkout & Passenger Manifest:** Secure booking confirmation with passenger contact input and instant payment confirmation.
- **Digital Boarding Pass:** Generates a printable, scannable digital boarding pass complete with booking reference, seat assignment, high-density ISO QR code, barcode, gate, and baggage allowance.
- **Passenger Dashboard:** History of upcoming and completed journeys.

---

## 🎨 Interactive 3D Coach Experience

```
+-------------------------------------------------------------------------+
|                                                                         |
|   [Intro 3/4 Side View]  === AUTO SWOOP ===>  [Overhead Cabin View]     |
|   Side profile of coach                       Aligned overhead view     |
|   showing wheels & body                       looking down the aisle    |
|                                                                         |
|                                                                         |
|   [Overhead Cabin View]  === CLICK SEAT ===>  [Seat Zoom-In Mode]       |
|   Overview of all 36                          Camera glides to aisle    |
|   forward-facing suites                       Direct suite inspection   |
|                                                                         |
|                          <=== CABIN OVERVIEW ===                        |
|                          Camera smoothly glides                         |
|                          back to cabin overview                         |
|                                                                         |
+-------------------------------------------------------------------------+
```

### High-Performance Procedural Textures & Instant Load
To eliminate heavy multi-megabyte external GLTF/texture downloads, Novara utilizes **module-level singleton procedural HTML5 Canvas textures**:
- `getLeatherTexture()`: Luxury royal navy upholstery with geometric micro-pattern & VIP cognac quilted leather.
- `getAisleCarpetTexture()`: Industrial diamond-plate aluminum tread runner with safety yellow borders.
- `getSeatBadgeTexture()`: Instant HTML5 2D canvas generation for all 72 seat numbers with zero network overhead.
- `getDashboardClusterTexture()`: Dual-dial instruments, illuminated pushbuttons, and HUD telemetry screen.
- `getCurtainTexture()`: Drapery fabric with vertical shading folds.
- `getRadialShadowTexture()`: Soft radial contact shadow under the coach chassis.

> **Result:** Instantaneous 3D scene initialization with 0 external network requests.

---

## 🛠 Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16 (App Router)** | Server-side rendering, routing, and static page optimization |
| **UI Library** | **React 19 & TypeScript** | Component architecture and type-safe state management |
| **3D Graphics** | **Three.js** | Core WebGL rendering engine and custom geometry |
| **3D React** | **@react-three/fiber & @react-three/drei** | Declarative Three.js scene graph, PerspectiveCamera, OrbitControls |
| **Cinematic Camera** | **GSAP (GreenSock)** | Smooth power3 camera position & target interpolation |
| **Styling** | **Tailwind CSS 4.0** | Obsidian navy (`#071526`), champagne gold (`#C5A880`), glassmorphism |
| **Icons** | **Lucide React** | Clean minimalist iconography |
| **Database & ORM** | **Prisma ORM & PostgreSQL** | Schema modeling and persistent booking storage |

---

## 📁 Project Structure

```
novara/
├── prisma/
│   └── schema.prisma                  # PostgreSQL database schema & models
├── public/
│   ├── images/
│   │   ├── screenshots/               # High-res README screenshots
│   │   │   ├── hero-preview.jpg
│   │   │   ├── 3d-booking-preview.jpg
│   │   │   ├── routes-preview.png
│   │   │   └── boarding-pass-preview.jpg
│   │   ├── hero-coach.jpg             # High-res dusk terminal coach photo
│   │   ├── timetable-passengers.jpg   # Timetable flexibility feature photo
│   │   └── novara-logo.png            # Transparent brand logo
├── src/
│   ├── app/
│   │   ├── about/page.tsx             # About Novara & company vision
│   │   ├── contact/page.tsx           # Contact & customer support
│   │   ├── book/[busId]/page.tsx      # Flagship 3D Coach Booking Experience
│   │   ├── checkout/page.tsx          # Passenger details & checkout flow
│   │   ├── dashboard/page.tsx         # Passenger bookings history
│   │   ├── routes/page.tsx            # Intercity schedules & filter catalog
│   │   ├── ticket/[bookingRef]/page.tsx# Digital Boarding Pass & QR Ticket
│   │   ├── globals.css                # Obsidian glassmorphic styling
│   │   ├── layout.tsx                 # Root layout with Navbar, Footer & BackToTop
│   │   └── page.tsx                   # Luxury Intercity Landing Homepage
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── BusInteriorScene.tsx   # 3D coach scene & GSAP CameraController
│   │   │   ├── SeatMesh.tsx           # Interactive 3D passenger suite with badges
│   │   │   ├── HeroBus3D.tsx          # Homepage 3D hero coach model
│   │   │   └── textures.ts            # Procedural PBR canvas texture singletons
│   │   ├── booking/
│   │   │   ├── FloatingSummaryBar.tsx # Multi-seat reservation tray
│   │   │   ├── SeatDetailsPanel.tsx   # Suite specs & passenger input drawer
│   │   │   ├── DockedSeatPlan2D.tsx   # Docked 2D seat map
│   │   │   └── SeatMap2DModal.tsx     # 2D schematic layout modal
│   │   ├── layout/
│   │   │   ├── Navbar.tsx             # Glassmorphic navigation header
│   │   │   ├── Footer.tsx             # Corporate footer
│   │   │   └── BackToTop.tsx          # Smooth floating back to top button
│   │   └── tickets/
│   │       └── DigitalTicketCard.tsx  # Boarding pass with ISO QR code
│   └── lib/
│       ├── data-service.ts            # Data access layer & state persistence
│       ├── mock-data.ts               # Realistic intercity coach fleets & seat maps
│       └── types.ts                   # Comprehensive TypeScript definitions
├── package.json                       # Dependencies & scripts
└── README.md                          # Documentation
```

---

## 🚦 Getting Started

### Prerequisites
- **Node.js**: v18.18.0 or newer
- **npm**, **pnpm**, or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/novara.git
   cd novara
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/novara?schema=public"
   ```

4. **Initialize Prisma (Optional for local DB):**
   ```bash
   npx prisma generate
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🧭 Routes & Pages

| Route | Description |
| :--- | :--- |
| `/` | **Landing Page:** Luxury hero, "Bus Travel With Easy" ticket section, popular destinations, day & night routes, schedule, and FAQ. |
| `/routes` | **Schedules & Routes:** Filterable directory of intercity express lines, departure times, and fares. |
| `/book/[busId]` | **3D Seat Selection:** Full-screen 3D cutaway coach, intro swoop, suite zoom inspection, 2D blueprint, and live summary tray. |
| `/checkout` | **Checkout & Review:** Suite breakdown, passenger details, baggage add-ons, and payment confirmation. |
| `/ticket/[bookingRef]` | **Digital Ticket:** Downloadable boarding pass with verified 29x29 ISO QR code, terminal, and gate details. |
| `/dashboard` | **Passenger Hub:** Manage active and past bookings. |
| `/about` | **About Novara:** Company vision, fleet engineering, safety records, and sustainability. |
| `/contact` | **Contact & Support:** 24/7 passenger assistance, terminal locations, and feedback. |

---

## ⚡ Build & Verification

To verify the production build:

```bash
npm run build
```

Production output:
- **0 errors, 0 warnings**
- All routes compiled and statically optimized (SSG / SSR hybrid).

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <sub>Built with ❤️ by the Novara Engineering Team.</sub>
</div>
