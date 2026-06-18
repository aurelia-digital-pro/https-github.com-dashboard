'use client';

import React from 'react';
import { useMarketStore } from '../../stores/marketStore';
import { useBinanceKlines } from '../../hooks/useBinanceKlines';
import { useMarketStructure } from '../../hooks/useMarketStructure';
import { ChevronRight, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

export default function BOSMarker() {
  const { selectedSymbol, selectedTimeframe } = useMarketStore();
  const { candles } = useBinanceKlines(selectedSymbol, selectedTimeframe, 250);
  const structure = useMarketStructure(candles);

  const recentBreaks = [...structure.breaks].slice(-5).reverse();

  return (
    <div className="w-full bg-[#0c1017] border border-slate-800/80 rounded-2xl p-5">
      {/* Header element */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-4">
        <Activity className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">
          Structural Reversals (BOS/CHOCH)
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {recentBreaks.map((b, idx) => {
          const isBull = b.direction === 'BULLISH';
          const isCHOCH = b.type === 'CHOCH';
          return (
            <div
              key={`${b.index}-${idx}`}
              className="p-3 rounded-lg bg-[#070b11] border border-slate-900 flex flex-col gap-1.5 font-mono text-xs"
            >
              <div className="flex items-center justify-between">
                <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                  isCHOCH 
                    ? 'bg-purple-950/40 text-purple-400 border border-purple-900/30' 
                    : 'bg-cyan-950/40 text-cyan-400 border border-cyan-900/30'
                }`}>
                  {b.type} [{b.direction}]
                </span>
                <span className="text-[10px] text-slate-500">#{b.index}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 mt-1 text-[11px]">
                <span>Trigger Break:</span>
                <span className="text-slate-100 font-bold">${b.breakPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Executed Close:</span>
                <span className={`font-semibold ${isBull ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${b.triggerPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          );
        })}

        {recentBreaks.length === 0 && (
          <div className="text-center py-6 text-slate-500 text-xs">
            Awaiting structural triggers on current timeframe consolidation.
          </div>
        )}
      </div>
    </div>
  );
}
