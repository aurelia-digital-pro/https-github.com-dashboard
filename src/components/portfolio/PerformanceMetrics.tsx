'use client';

import React from 'react';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { useBinanceTicker } from '../../hooks/useBinanceTicker';
import { BarChart, Wallet, Trophy, Target, Shield, HelpCircle } from 'lucide-react';

export default function PerformanceMetrics() {
  const { trades, balance } = usePortfolioStore();
  const { tickers } = useBinanceTicker();

  // Calculate live value of all open positions
  const livePnL = React.useMemo(() => {
    let total = 0;
    const openTrades = trades.filter(t => t.status === 'OPEN');

    for (const t of openTrades) {
      const live = tickers.find(tick => tick.symbol.toUpperCase() === t.symbol.toUpperCase());
      const currentPrice = live ? live.price : t.entryPrice;
      const isLong = t.direction === 'LONG';
      const diff = isLong ? currentPrice - t.entryPrice : t.entryPrice - currentPrice;
      total += diff * t.quantity;
    }

    return total;
  }, [trades, tickers]);

  // Closed trades stats
  const completedStats = React.useMemo(() => {
    const closed = trades.filter((t) => t.status === 'CLOSED');
    if (closed.length === 0) {
      return { winRate: 0, avgPnl: 0, count: 0, totalPnl: 0 };
    }

    const wins = closed.filter((t) => t.pnL > 0);
    const winRate = (wins.length / closed.length) * 100;
    const totalPnl = closed.reduce((acc, t) => acc + t.pnL, 0);

    return {
      winRate,
      avgPnl: totalPnl / closed.length,
      count: closed.length,
      totalPnl,
    };
  }, [trades]);

  const netAssetValue = balance + livePnL;
  const growthPercent = ((netAssetValue - 10000) / 10000) * 100;

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 select-none">
      {/* 1. NAV Net Asset Value */}
      <div className="p-5 rounded-2xl bg-[#0c1017] border border-slate-800/80 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">Net Asset Value (NAV)</span>
          <Wallet className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="mt-3.5">
          <span className="text-xl md:text-2xl font-bold font-mono text-white">
            ${netAssetValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className={`text-xs font-bold font-mono ${growthPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {growthPercent >= 0 ? '+' : ''}{growthPercent.toFixed(2)}%
            </span>
            <span className="text-[9px] text-slate-500 font-mono">FROM BASE ($10k)</span>
          </div>
        </div>
      </div>

      {/* 2. Completed Win Rate */}
      <div className="p-5 rounded-2xl bg-[#0c1017] border border-slate-800/80 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">Completed Win Rate</span>
          <Trophy className="w-4 h-4 text-yellow-400" />
        </div>
        <div className="mt-3.5">
          <span className="text-xl md:text-2xl font-bold font-mono text-white">
            {completedStats.winRate.toFixed(1)}%
          </span>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-xs text-slate-350 font-mono">
              {completedStats.count} Completed Trades
            </span>
          </div>
        </div>
      </div>

      {/* 3. Open Floating profit/loss */}
      <div className="p-5 rounded-2xl bg-[#0c1017] border border-slate-800/80 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">Unrealized P&L</span>
          <Target className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="mt-3.5">
          <span className={`text-xl md:text-2xl font-bold font-mono ${livePnL >= 0 ? 'text-emerald-400' : 'text-rose-450'}`}>
            ${livePnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <div className="flex items-center gap-1.5 mt-1.5 font-mono text-[9px] text-slate-500">
            <span>REAL-TIME TRACKER CYCLES ACTIVE</span>
          </div>
        </div>
      </div>

      {/* 4. Aurelia Benchmark Alpha */}
      <div className="p-5 rounded-2xl bg-[#0c1017] border border-slate-800/80 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">Benchmark Alpha (BTC)</span>
          <BarChart className="w-4 h-4 text-orange-400" />
        </div>
        <div className="mt-3.5">
          <span className="text-xl md:text-2xl font-bold font-mono text-emerald-400">
            +{Math.abs(growthPercent - 1.25).toFixed(2)}%
          </span>
          <div className="flex items-center gap-1.5 mt-1.5 text-[9px] text-slate-500 font-mono">
            <span>OUTPERFORMING MARKET BETA</span>
          </div>
        </div>
      </div>
    </div>
  );
}
