'use client';

import React from 'react';
import { SignalAnalysis } from '../../types';
import { Shield, Sparkles, Orbit, Target } from 'lucide-react';

interface BadgeProps {
  analysis: SignalAnalysis;
}

export default function MarketStateBadge({ analysis }: BadgeProps) {
  const isExp = analysis.volatilityRegime === 'EXPANSION';
  const isChop = analysis.volatilityRegime === 'CHOPPY RANGE';

  return (
    <div className="flex items-center gap-3.5 flex-wrap font-mono text-xs select-none">
      {/* Session quality indicator */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0c1017] border border-slate-800">
        <Target className="w-3.5 h-3.5 text-pink-400" />
        <span className="text-slate-400">LIQUIDITY:</span>
        <span className="font-bold text-white uppercase">{analysis.sessionQuality}</span>
      </div>

      {/* Volatility Regime indicator */}
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
        isExp 
          ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400' 
          : isChop 
            ? 'bg-orange-950/20 border-orange-900/30 text-orange-400' 
            : 'bg-[#0c1017] border-slate-800 text-slate-350'
      }`}>
        <Orbit className="w-3.5 h-3.5" />
        <span>REGIME:</span>
        <span className="font-bold uppercase">{analysis.volatilityRegime}</span>
      </div>
    </div>
  );
}
