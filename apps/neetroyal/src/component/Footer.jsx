import React from 'react';
import { Youtube, Twitter, Instagram, Linkedin, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white pt-10 pb-0 px-8 sm:px-16 overflow-hidden relative font-sans">
      {/* Top 3-Column Navigation Grid */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8 pb-6">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-2.5">
      
          <span className="text-xl font-extrabold tracking-tight text-emerald-400">
            NEET<span className="text-emerald-400">ROYAL</span>
          </span>
        </div>

        {/* Center: Left-Aligned Text Block (Centered in Container) */}
        <div className="flex flex-col gap-2.5 text-sm text-slate-300 font-normal leading-tight text-left">
          <a href="#terms" className="hover:text-white transition-colors">
            Terms & Conditions
          </a>
          <a href="#privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#refund" className="hover:text-white transition-colors">
            Refund & Cancellation
          </a>
        </div>

        {/* Right: Rounded Social Icons + Copyright */}
        <div className="flex flex-col items-center md:items-end gap-2.5">
          <div className="flex items-center gap-2.5">
            <a
              href="#youtube"
              className="w-10 h-10 rounded-2xl bg-[#161618] flex items-center justify-center text-white hover:bg-zinc-800 transition-colors border border-zinc-800/60"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a
              href="#twitter"
              className="w-10 h-10 rounded-2xl bg-[#161618] flex items-center justify-center text-white hover:bg-zinc-800 transition-colors border border-zinc-800/60"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#instagram"
              className="w-10 h-10 rounded-2xl bg-[#161618] flex items-center justify-center text-white hover:bg-zinc-800 transition-colors border border-zinc-800/60"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#linkedin"
              className="w-10 h-10 rounded-2xl bg-[#161618] flex items-center justify-center text-white hover:bg-zinc-800 transition-colors border border-zinc-800/60"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
          <p className="text-[11px] text-zinc-500 font-sans tracking-normal pt-0.5">
            © 2026 NEETROYAL. All rights reserved.
          </p>
        </div>

      </div>

      {/* Bottom Giant Watermark with Dark Fade Gradient */}
      <div className="w-full flex justify-center pointer-events-none select-none -mb-6 pt-2">
        <h1 className="text-[13.5vw] font-black tracking-tighter leading-none uppercase bg-gradient-to-b from-zinc-700 via-zinc-900 to-black bg-clip-text text-transparent">
          NEETROYAL
        </h1>
      </div>
    </footer>
  );
}