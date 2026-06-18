'use client';

import React from 'react';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { Layers } from 'lucide-react';

export default function AllocationChart() {
  const { trades } = usePortfolioStore();

  const openTrades = trades.filter((t) => t.status === 'OPEN');

  // Compute allocation sums per symbol
  const allocations = React.useMemo(() => {
    const map: { [key: string]: number } = {};
    let total = 0;

    for (const t of openTrades) {
      const value = t.entryPrice * t.quantity;
      map[t.symbol] = (map[t.symbol] || 0) + value;
      total += value;
    }

    return Object.keys(map).map((sym) => ({
      symbol: sym,
      value: map[sym],
      pct: total > 0 ? (map[sym] / total) * 100 : 0,
    }));
  }, [openTrades]);

  // Color selection
  const colors = ['#0ea5e9', '#8b5cf6', '#ec4899', '#fbbf24', '#10b981', '#f43f5e'];

  return (
    <div className="w-full bg-[#0c1017] border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-4">
        <Layers className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">
          Portfolio Asset Allocations
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
        {/* Simple Donut SVG Wheel */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90 animate-fade-in" viewBox="0 0 100 100">
            {/* Background base Ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#070b11"
              strokeWidth="10"
            />
            {/* Slices calculation */}
            {allocations.map((a, idx) => {
              // Calculate cumulative rotation offsets
              let strokeOffset = 100;
              let accumulatedPct = 0;
              for (let i = 0; i < idx; i++) {
                accumulatedPct += allocations[i].pct;
              }
              strokeOffset = 251.2 - (251.2 * a.pct) / 100;
              const rotationOffset = (accumulatedPct / 100) * 360;

              return (
                <circle
                  key={a.symbol}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={colors[idx % colors.length]}
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={strokeOffset}
                  className="transition-all duration-500"
                  transform={`rotate(${rotationOffset} 50 50)`}
                />
              );
            })}
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="font-mono font-bold text-xs text-slate-400">TOTAL CAP</span>
            <span className="font-mono font-bold text-md text-white">
              ${allocations.reduce((acc, a) => acc + a.value, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 flex flex-col gap-2.5 font-mono text-xs w-full sm:w-auto">
          {allocations.map((a, idx) => (
            <div key={a.symbol} className="flex items-center justify-between p-2 rounded bg-[#070b11] border border-slate-900">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }}></span>
                <span className="font-bold text-slate-250">{a.symbol}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-semibold">${a.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                <span className="text-[10px] text-slate-500">({a.pct.toFixed(1)}%)</span>
              </div>
            </div>
          ))}

          {allocations.length === 0 && (
            <div className="text-center py-6 text-slate-500 font-sans text-xs w-full">
              Zero active capital allocated.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
