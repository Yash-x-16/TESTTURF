import React from 'react';

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
              aria-label="YouTube"
              className="w-10 h-10 rounded-2xl bg-[#161618] flex items-center justify-center text-white hover:bg-zinc-800 transition-colors border border-zinc-800/60"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a
              href="#twitter"
              aria-label="Twitter"
              className="w-10 h-10 rounded-2xl bg-[#161618] flex items-center justify-center text-white hover:bg-zinc-800 transition-colors border border-zinc-800/60"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a
              href="#instagram"
              aria-label="Instagram"
              className="w-10 h-10 rounded-2xl bg-[#161618] flex items-center justify-center text-white hover:bg-zinc-800 transition-colors border border-zinc-800/60"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="#linkedin"
              aria-label="LinkedIn"
              className="w-10 h-10 rounded-2xl bg-[#161618] flex items-center justify-center text-white hover:bg-zinc-800 transition-colors border border-zinc-800/60"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
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