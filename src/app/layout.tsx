import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";

export const metadata: Metadata = {
  title: "Novara — Luxury Touring Coach & Intercity Travel",
  description: "Experience the pinnacle of intercity bus travel with interactive 3D seat reservation, hand-stitched leather suites, and direct express routes.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-col antialiased selection:bg-amber-500 selection:text-slate-950">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
