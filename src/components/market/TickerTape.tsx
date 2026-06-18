'use client';

import React from 'react';
import { useBinanceTicker } from '../../hooks/useBinanceTicker';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function TickerTape() {
  const { tickers } = useBinanceTicker();

  return (
    <div className="w-full bg-[#080d15] border-b border-slate-800/60 overflow-hidden py-1.5 flex select-none text-xs font-mono">
      <div className="flex shrink-0 animate-marquee items-center gap-8 whitespace-nowrap px-4">
        {tickers.map((t, idx) => {
          const isUp = t.change24h >= 0;
          return (
            <div key={`${t.symbol}-${idx}`} className="flex items-center gap-2">
              <span className="font-bold text-slate-300">{t.symbol.replace('/USDT', '')}</span>
              <span className="text-white">${t.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>
              <span className={`flex items-center gap-0.5 font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {t.change24h.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Repeating section to maintain continuous marquee line flow */}
      <div className="flex shrink-0 aria-hidden:true animate-marquee items-center gap-8 whitespace-nowrap px-4 bg-[#080d15]">
        {tickers.map((t, idx) => {
          const isUp = t.change24h >= 0;
          return (
            <div key={`${t.symbol}-repeat-${idx}`} className="flex items-center gap-2">
              <span className="font-bold text-slate-300">{t.symbol.replace('/USDT', '')}</span>
              <span className="text-white">${t.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>
              <span className={`flex items-center gap-0.5 font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {t.change24h.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
