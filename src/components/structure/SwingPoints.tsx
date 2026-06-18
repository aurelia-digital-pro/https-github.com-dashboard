'use client';

import React from 'react';
import { useMarketStore } from '../../stores/marketStore';
import { useBinanceKlines } from '../../hooks/useBinanceKlines';
import { useMarketStructure } from '../../hooks/useMarketStructure';
import { Compass, CheckSquare, Sparkles } from 'lucide-react';

export default function SwingPoints() {
  const { selectedSymbol, selectedTimeframe } = useMarketStore();
  const { candles } = useBinanceKlines(selectedSymbol, selectedTimeframe, 250);
  const structure = useMarketStructure(candles);

  const recentSwings = [...structure.swings].slice(-5).reverse();

  return (
    <div className="w-full bg-[#0c1017] border border-slate-800/80 rounded-2xl p-5">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-4">
        <Compass className="w-4 h-4 text-emerald-400" />
        <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">
          Swings Structural Boundaries
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {recentSwings.map((s, idx) => {
          const isHigh = s.type === 'HIGH';
          return (
            <div
              key={`${s.index}-${idx}`}
              className="flex items-center justify-between p-3 rounded-lg bg-[#070b11] border border-slate-900 font-mono text-xs"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isHigh ? 'bg-orange-500' : 'bg-emerald-500 animate-pulse'}`}></span>
                <span className="font-bold text-slate-300">SWING {s.type}</span>
              </div>
              <div className="flex items-center gap-2 text-right">
                <span className="text-white font-bold">${s.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                <span className="text-[10px] text-slate-500">IND: #{s.index}</span>
              </div>
            </div>
          );
        })}

        {recentSwings.length === 0 && (
          <div className="text-center py-6 text-slate-500 text-xs">
            Calculating swing valleys... Keep running database records.
          </div>
        )}
      </div>
    </div>
  );
}
