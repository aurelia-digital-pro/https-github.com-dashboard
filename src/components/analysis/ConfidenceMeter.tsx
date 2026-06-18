'use client';

import React from 'react';
import { SignalAnalysis } from '../../types';
import { ShieldAlert, Compass, Sparkles, Orbit, Layers, Target } from 'lucide-react';

interface MeterProps {
  analysis: SignalAnalysis;
}

export default function ConfidenceMeter({ analysis }: MeterProps) {
  const bd = analysis.breakdown;

  const points = [
    { title: 'Market Structure', val: bd.structure, max: 20, icon: Compass, color: 'bg-emerald-500' },
    { title: 'Liquidity Pools / Sweeps', val: bd.liquidity, max: 20, icon: Layers, color: 'bg-orange-500' },
    { title: 'Volatility Suitability', val: bd.volatility, max: 15, icon: Orbit, color: 'bg-indigo-500' },
    { title: 'Timezone Sessions Quality', val: bd.session, max: 15, icon: Target, color: 'bg-pink-500' },
    { title: 'Trend Strengths (ADX)', val: bd.trend, max: 15, icon: ShieldAlert, color: 'bg-amber-500' },
    { title: 'Tactical Momentums (RSI)', val: bd.momentum, max: 15, icon: Sparkles, color: 'bg-cyan-500' },
  ];

  return (
    <div className="w-full bg-[#0c1017] border border-slate-800/80 rounded-2xl p-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5 select-none">
        <div>
          <h3 className="text-sm font-bold text-slate-100 font-sans tracking-tight">Signal Audit Checklist</h3>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5 uppercase">Deterministic scoring breakdown weights</p>
        </div>
        <span className="font-mono font-bold text-lg text-cyan-400">{analysis.confidence}/100</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {points.map((p, idx) => {
          const pct = (p.val / p.max) * 100;
          const Icon = p.icon;
          return (
            <div key={idx} className="p-3 rounded-xl bg-[#070b11] border border-slate-900 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-350">
                  <Icon className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-semibold">{p.title}</span>
                </div>
                <span className="font-mono text-[11px] text-slate-400 font-bold">{p.val} / {p.max}</span>
              </div>
              
              {/* Progress track bar */}
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div
                  className={`h-full ${p.color} rounded-full transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
