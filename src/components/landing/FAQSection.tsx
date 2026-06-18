'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQSection() {
  const faqs = [
    {
      q: 'Does this platform require any monthly server hosting fees?',
      a: 'Absolutely not. Aurelia Pro runs 100% in the customer browser. You can host this entire commercial application on GitHub Pages, Netlify or Cloudflare Pages completely free of charge.',
    },
    {
      q: 'Where is my trading data and position ledgers stored?',
      a: 'Your holdings, custom alerts watchlists, and active configurations are stored securely inside your browser LocalStorage via Zustand persistent middleware. Your trading info never leaves your terminal.',
    },
    {
      q: 'How does the license activation mechanism work without a database?',
      a: 'Verification models check activation keys mathematically against your device hardware canvas fingerprint hashes using deterministic cryptographic checks. Since compliance is purely local, authentication occurs instantly.',
    },
    {
      q: 'Can this static app connect to live market indices?',
      a: 'Yes, our market feed client connects directly to free public exchange REST API routes & real-time WebSocket ticker streams continuously under the hood with zero credential keys required.',
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="py-12 select-none border-t border-slate-850/40">
      <div className="text-center mb-8">
        <span className="text-[10px] uppercase font-mono font-bold text-slate-500 tracking-wider">SUPPORT DOMAIN</span>
        <h2 className="text-xl md:text-2xl font-bold text-slate-100 font-sans mt-1">Frequently Answered Diagnostics</h2>
      </div>

      <div className="max-w-3xl mx-auto flex flex-col gap-3">
        {faqs.map((f, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={i}
              onClick={() => setOpenIdx(isOpen ? null : i)}
              className="p-4 rounded-xl bg-[#0c1017] border border-slate-805 hover:hover:border-slate-750 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-200 font-sans">{f.q}</span>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </div>

              {isOpen && (
                <p className="text-xs text-slate-400 font-mono mt-3 leading-relaxed border-t border-slate-800/40 pt-3">
                  {f.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
