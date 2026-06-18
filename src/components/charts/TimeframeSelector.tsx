'use client';

import React from 'react';
import { useMarketStore } from '../../stores/marketStore';
import { Timeframe } from '../../types';
import { CalendarRange } from 'lucide-react';

export default function TimeframeSelector() {
  const { selectedTimeframe, setSelectedTimeframe } = useMarketStore();

  const intervals: { id: Timeframe; label: string }[] = [
    { id: '1m', label: '1m' },
    { id: '5m', label: '5m' },
    { id: '15m', label: '15m' },
    { id: '1h', label: '1H' },
    { id: '4h', label: '4H' },
    { id: '1d', label: '1D' },
    { id: '1w', label: '1W' },
  ];

  return (
    <div className="flex items-center gap-1.5 bg-[#0c1017] border border-slate-800/80 p-1.5 rounded-xl self-start">
      <div className="p-1 text-slate-500 hidden sm:block">
        <CalendarRange className="w-3.5 h-3.5" />
      </div>
      {intervals.map((item) => (
        <button
          key={item.id}
          onClick={() => setSelectedTimeframe(item.id)}
          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all font-mono uppercase ${
            selectedTimeframe === item.id
              ? 'bg-cyan-500 text-black shadow-md shadow-cyan-950/15'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
