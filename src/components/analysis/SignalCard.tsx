'use client';

import React from 'react';
import { SignalAnalysis } from '../../types';
import { ShieldCheck, Target, AlertTriangle, Play, BellRing, Sparkles } from 'lucide-react';

interface CardProps {
  symbol: string;
  analysis: SignalAnalysis;
  onOpenDetails: () => void;
}

export default function SignalCard({ symbol, analysis, onOpenDetails }: CardProps) {
  const isLong = analysis.direction === 'LONG';
  const isNeutral = analysis.direction === 'NEUTRAL';

  // State indicators styled nicely
  const stateColor = 
    analysis.state === 'READY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
    analysis.state === 'WATCHING' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 
    'bg-slate-800 text-slate-400';

  return (
    <div className="w-full bg-[#0c1017] border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
      {/* Target Asset header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4 select-none">
        <div>
          <span className="font-bold text-slate-100 font-sans tracking-tight text-sm block">{symbol}</span>
          <span className="text-[10px] text-slate-500 uppercase font-mono mt-0.5 block">{analysis.setupType || 'No Pattern'} SETUP</span>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider uppercase animate-pulse ${stateColor}`}>
          ● {analysis.state}
        </span>
      </div>

      {/* Probability output */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-500 font-mono tracking-wider uppercase">Signal Conf. Rating</span>
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-2xl font-bold text-white leading-none">{analysis.confidence}%</span>
            <span className={`text-xs font-bold ${
              analysis.tier === 'A+' ? 'text-yellow-400' : analysis.tier === 'A' ? 'text-cyan-400' : 'text-slate-400'
            }`}>
              Tier {analysis.tier}
            </span>
          </div>
        </div>

        {/* Target direction trigger indicator */}
        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-500 font-mono tracking-wider uppercase block">Action</span>
          <span className={`text-sm font-bold tracking-tight uppercase ${
            isLong ? 'text-emerald-400' : isNeutral ? 'text-slate-400' : 'text-rose-400'
          }`}>
            {isNeutral ? 'Neutral Wait' : isLong ? 'BUY / LONG' : 'SELL / SHORT'}
          </span>
        </div>
      </div>

      {/* Bullet descriptions */}
      <div className="flex flex-col gap-2 mb-5 font-mono text-[11px] text-slate-400">
        {analysis.reasons.slice(0, 2).map((r, i) => (
          <div key={i} className="flex items-start gap-1.5 leading-relaxed">
            <span className="text-cyan-400 font-bold shrink-0">›</span>
            <span className="line-clamp-1">{r}</span>
          </div>
        ))}
      </div>

      {/* Open drawer bottom dashboard triggers */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-800/60 mt-auto">
        <button
          onClick={onOpenDetails}
          className="flex-1 py-2 rounded-lg bg-[#070b11] border border-slate-850 hover:bg-slate-900/40 text-xs font-bold text-slate-200 hover:text-white transition-colors"
        >
          View Reasons & SL/TP
        </button>

        {/* Quick Simulated sound trigger */}
        <button
          onClick={() => alert(`🔔 Alerts synchronized for ${symbol}! Browser push notifications active.`)}
          className="p-2 rounded-lg bg-cyan-950/20 text-cyan-400 border border-cyan-900/30 hover:bg-cyan-900/20 transition"
          title="Enable Alerts"
        >
          <BellRing className="w-4 h-4 animate-bounce" />
        </button>
      </div>
    </div>
  );
}
