'use client';

import React from 'react';
import { useMarketStore } from '../../stores/marketStore';
import { useBinanceKlines } from '../../hooks/useBinanceKlines';
import { useMarketStructure } from '../../hooks/useMarketStructure';
import { Layers, Bookmark, Layers2, Sparkles, Orbit } from 'lucide-react';

export default function LiquidityZones() {
  const { selectedSymbol, selectedTimeframe } = useMarketStore();
  const { candles } = useBinanceKlines(selectedSymbol, selectedTimeframe, 250);
  const structure = useMarketStructure(candles);

  const activeOBs = structure.orderBlocks.filter(o => !o.mitigated).slice(-3);
  const activeFVGs = structure.fvgs.filter(f => !f.mitigated).slice(-3);

  return (
    <div className="w-full bg-[#0c1017] border border-slate-800/80 rounded-2xl p-5 flex flex-col gap-6">
      {/* 1. Institutional Order Blocks Section */}
      <div>
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
          <Layers className="w-4 h-4 text-orange-400" />
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">
            Active Order Blocks (Unmitigated)
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {activeOBs.map((ob, idx) => {
            const isBull = ob.type === 'BULLISH';
            return (
              <div
                key={`ob-${ob.index}-${idx}`}
                className={`p-3 rounded-lg border font-mono text-xs ${
                  isBull 
                    ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-300' 
                    : 'bg-rose-950/20 border-rose-900/30 text-rose-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1">
                    <Orbit className="w-3.5 h-3.5 animate-spin" />
                    {ob.type} OB ({ob.strength})
                  </span>
                  <span className="text-[10px] opacity-60">#{ob.index}</span>
                </div>
                <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
                  <span>Zone Bounds:</span>
                  <span className="text-slate-100 font-bold">${ob.low.toFixed(2)} - ${ob.high.toFixed(2)}</span>
                </div>
              </div>
            );
          })}

          {activeOBs.length === 0 && (
            <div className="text-center py-4 text-slate-500 text-xs font-mono">
              Zero unmitigated order blocks. Institutional order flows matched.
            </div>
          )}
        </div>
      </div>

      {/* 2. Institutional Fair Value Gaps Section */}
      <div>
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
          <Layers2 className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">
            Active Fair Value Gaps (Inbound)
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {activeFVGs.map((fvg, idx) => {
            const isBull = fvg.type === 'BULLISH';
            return (
              <div
                key={`fvg-${fvg.index}-${idx}`}
                className={`p-3 rounded-lg border font-mono text-xs ${
                  isBull 
                    ? 'bg-emerald-950/20 border-emerald-800/20 text-emerald-300' 
                    : 'bg-rose-950/20 border-rose-800/20 text-rose-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">{fvg.type} FVG IMBALANCE</span>
                  <span className="text-[10px] opacity-60">Ref: #{fvg.index}</span>
                </div>
                <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
                  <span>Gap Limits:</span>
                  <span className="text-slate-100 font-bold">${fvg.low.toFixed(2)} - ${fvg.high.toFixed(2)}</span>
                </div>
              </div>
            );
          })}

          {activeFVGs.length === 0 && (
            <div className="text-center py-4 text-slate-500 text-xs font-mono">
              No unmitigated fair value gaps tracked. Price action sits balanced.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
