'use client';

import React from 'react';
import { AIReasoningReport } from '../../lib/signals/reasoning';
import { ShieldCheck, CalendarClock, Ban, Sparkles, Orbit } from 'lucide-react';

interface PanelProps {
  reasoning: AIReasoningReport;
}

export default function ReasoningPanel({ reasoning }: PanelProps) {
  return (
    <div className="w-full bg-[#0c1017] border border-slate-800/80 rounded-2xl p-6 flex flex-col gap-5 select-none">
      {/* Why Now / Narrative */}
      <div>
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
          <CalendarClock className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">
            Aurelia Brain — Timing Analysis (Why Now?)
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans mt-2">
          {reasoning.whyNow}
        </p>
      </div>

      {/* Triggering checks list */}
      <div>
        <span className="text-[10px] font-bold text-slate-500 font-mono tracking-wider block uppercase mb-2">TRIGGER FACTORS DETECTED</span>
        <div className="flex flex-col gap-2">
          {reasoning.triggerFactors.map((f, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs font-mono text-slate-450 bg-[#070b11] p-3 rounded-lg border border-slate-900/40">
              <span className="shrink-0 text-emerald-400 font-bold font-mono">✔</span>
              <p className="leading-relaxed">{f}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Invalidation trigger rules */}
      <div>
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
          <Ban className="w-4 h-4 text-rose-450" />
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">
            Invalidation Filters (Trade Stop Rules)
          </span>
        </div>
        <p className="text-xs text-rose-300/90 leading-relaxed font-mono bg-rose-955/10 p-4 border border-rose-950/20 rounded-xl mt-2">
          {reasoning.invalidationTrigger}
        </p>
      </div>
    </div>
  );
}
