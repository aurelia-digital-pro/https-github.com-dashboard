'use client';

import React from 'react';
import { MarketTicker } from '../../types';
import { Sparkles, BarChart2, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface CardProps {
  ticker: MarketTicker;
  isSelected: boolean;
  onClick: () => void;
}

export default function MarketCard({ ticker, isSelected, onClick }: CardProps) {
  const isUp = ticker.change24h >= 0;

  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
        isSelected
          ? 'bg-[#0f1724] border-cyan-500 shadow-lg shadow-cyan-950/25'
          : 'bg-[#0c1017] border-slate-800/80 hover:bg-[#111722] hover:border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between w-full mb-3">
        {/* Name / Icon */}
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-tight text-slate-100">{ticker.symbol}</span>
          <span className="text-slate-500 text-xs font-medium">{ticker.name || 'Cryptocurrency'}</span>
        </div>
        
        {/* Spark trend arrow indicator */}
        <div className={`p-1.5 rounded-lg text-xs font-bold ${isUp ? 'bg-emerald-950/40 text-emerald-400' : 'bg-rose-950/40 text-rose-400'}`}>
          {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        </div>
      </div>

      {/* Main pricing */}
      <div className="flex flex-col gap-1.5 mt-2">
        <span className="font-bold text-lg md:text-xl tracking-tight text-white font-mono">
          ${ticker.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
        </span>
        
        {/* Price Change Percentage */}
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold font-mono ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isUp ? '+' : ''}{ticker.change24h.toFixed(2)}%
          </span>
          <span className="text-[10px] text-slate-500">24H CHANGE</span>
        </div>
      </div>

      {/* Extreme limits stats */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/60 font-mono text-[10px]">
        <div>
          <span className="text-slate-500 uppercase block">24H HIGH</span>
          <span className="text-slate-300">${ticker.high24h.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
        </div>
        <div>
          <span className="text-slate-500 uppercase block">24H LOW</span>
          <span className="text-slate-300">${ticker.low24h.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
}
