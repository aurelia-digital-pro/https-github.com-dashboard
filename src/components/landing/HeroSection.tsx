'use client';

import React from 'react';
import { useUIStore } from '../../stores/uiStore';
import { Sparkles, Terminal, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export default function HeroSection() {
  const { setActivePage } = useUIStore();

  return (
    <section className="relative py-14 md:py-20 flex flex-col items-center justify-center text-center overflow-hidden border-b border-slate-850/40 select-none">
      {/* Visual neon ambient layout halos */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-cyan-700/5 blur-3xl pointer-events-none" />

      {/* Ribbon */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold font-mono tracking-wider uppercase text-cyan-400 bg-cyan-950/20 border border-cyan-800/40 rounded-full animate-fade-in">
        <Sparkles className="w-3.5 h-3.5" />
        Aurelia Core Platform v3.5 Launch
      </div>

      {/* Headline */}
      <h1 className="max-w-3xl mt-6 text-3xl sm:text-5xl font-bold font-sans tracking-tight text-white leading-[1.12]">
        Deterministic <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">Trading Intelligence</span> Generated 100% Client-Side
      </h1>

      {/* Subtitle description */}
      <p className="max-w-xl mt-4 text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
        Say goodbye to heavy hosting fees, custom auth databases, and slow servers. A pure static SaaS offering real-time Binance rates, Smart Money Concepts (SMC) tracking, and local portfolio simulation.
      </p>

      {/* Action buttons */}
      <div className="flex items-center gap-3.5 mt-8 flex-wrap justify-center">
        <button
          onClick={() => setActivePage('dashboard')}
          className="flex items-center gap-1.5 px-6 py-3 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 text-black font-extrabold uppercase transition hover:opacity-90 shadow-lg shadow-cyan-950/20 text-xs"
        >
          <span>Launch Trading Desk</span>
          <ArrowRight className="w-4 h-4 text-black" />
        </button>

        <button
          onClick={() => setActivePage('pricing')}
          className="px-6 py-3 rounded-xl bg-[#070b11] border border-slate-805 hover:bg-[#111722]/50 text-slate-300 font-bold uppercase transition text-xs"
        >
          Explore Premium Plans
        </button>
      </div>

      {/* Bottom telemetry line */}
      <div className="flex items-center gap-6 mt-12 text-[10px] text-slate-500 font-mono flex-wrap justify-center uppercase">
        <div className="flex items-center gap-1">
          <Terminal className="w-3.5 h-3.5 text-slate-600" />
          <span>ZERO BACKEND REQD</span>
        </div>
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
          <span>CRYPTOGRAPHIC VERIFICATIONS</span>
        </div>
      </div>
    </section>
  );
}
