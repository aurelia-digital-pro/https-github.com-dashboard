'use client';

import React from 'react';
import { HelpCircle, Terminal, RefreshCw, Cpu, Compass, Layers, ShieldCheck } from 'lucide-react';

export default function FeatureGrid() {
  const cards = [
    {
      title: '100% Client-Side Engine',
      desc: 'All complex indicator calculations and state persistence occur directly in the user browser sandbox. No database connections required.',
      icon: Terminal,
      color: 'text-cyan-400 border-cyan-500/20',
    },
    {
      title: 'Live WebSocket Streams',
      desc: 'Subscribes instantaneously to Binance stream arrays for live millisecond ticks fallback rates. Automatic interval reconnection built-in.',
      icon: RefreshCw,
      color: 'text-emerald-400 border-emerald-500/20',
    },
    {
      title: 'Smart Money Analysis (SMC)',
      desc: 'Detect Swing Point boundaries, Break of Structure (BOS), Change of Characters (CHoCH), Order Blocks, and Fair Value Gaps instantly.',
      icon: Compass,
      color: 'text-orange-400 border-orange-500/20',
    },
    {
      title: 'Simulated Portfolio Ledger',
      desc: 'Manage manual positions, stop losses, take profits, total drawdowns, win-rates, and allocations completely with LocalStorage.',
      icon: Layers,
      color: 'text-indigo-400 border-indigo-500/20',
    },
    {
      title: 'Signal Scoring Core Intel',
      desc: 'Probabilistic index scoring from 0 to 100 based on structural alignments, momentum thresholds, volatility suitability, and session metrics.',
      icon: Cpu,
      color: 'text-pink-400 border-pink-500/20',
    },
    {
      title: 'Cryptographic License Checks',
      desc: 'Instant verification of commercial activation codes using visual canvas device fingerprint hashes and checksum verification blocks.',
      icon: ShieldCheck,
      color: 'text-amber-400 border-amber-500/20',
    },
  ];

  return (
    <section className="py-14 select-none">
      <div className="text-center mb-10">
        <span className="text-[10px] uppercase font-mono font-bold text-slate-500 tracking-wider">AURELIA PRO STANDARDS</span>
        <h2 className="text-xl md:text-2xl font-bold text-slate-100 font-sans mt-1">
          Designed for resale. Engineered for zero administrative overhead.
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-2xl bg-[#0c1017] border border-slate-805 hover:border-slate-700 transition duration-200 flex flex-col gap-4"
            >
              <div className={`p-2.5 rounded-xl border w-fit ${c.color} bg-[#070b11]/60`}>
                <Icon className="w-4 h-4 cursor-default" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-100 font-sans">{c.title}</h3>
                <p className="text-xs text-slate-400 mt-2 font-mono leading-relaxed">{c.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
