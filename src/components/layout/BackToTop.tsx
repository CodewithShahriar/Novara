'use client';

import React, { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-[#071526]/90 backdrop-blur-md border border-[#B48C56]/60 text-[#D8B788] hover:text-slate-950 hover:bg-[#B48C56] shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_10px_28px_rgba(180,140,86,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer group"
    >
      <ChevronUp className="w-5 h-5 stroke-[2.5] group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
}
