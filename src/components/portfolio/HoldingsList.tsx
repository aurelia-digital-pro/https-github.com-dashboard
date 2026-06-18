'use client';

import React from 'react';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { useBinanceTicker } from '../../hooks/useBinanceTicker';
import { useSignalStore } from '../../stores/signalStore';
import { ShieldAlert, Crosshair, Sparkles, TrendingUp, TrendingDown, ClipboardList } from 'lucide-react';

export default function HoldingsList() {
  const { trades, closeTrade, deleteTrade } = usePortfolioStore();
  const { tickers } = useBinanceTicker();
  const { addAlertLog } = useSignalStore();

  const handleClosePosition = (id: string, symbol: string, exitPrice: number) => {
    closeTrade(id, exitPrice);
    addAlertLog(symbol, `Manual closed position ${id} for ${symbol} at Price $${exitPrice}`, 'info');
  };

  const handleDeletLog = (id: string) => {
    deleteTrade(id);
  };

  // Get current active price for any open trade
  const getLivePrice = (symbol: string, defaultPrice: number): number => {
    const live = tickers.find((t) => t.symbol.toUpperCase() === symbol.toUpperCase());
    return live ? live.price : defaultPrice;
  };

  return (
    <div className="w-full bg-[#0c1017] border border-slate-800/80 rounded-2xl p-6 overflow-hidden">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-4">
        <ClipboardList className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">
          Position Ledgers & Holdings
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800/80 text-slate-400">
              <th className="py-2.5 px-3">Symbol</th>
              <th className="py-2.5 px-3">Direction</th>
              <th className="py-2.5 px-3 uppercase">Entry Price</th>
              <th className="py-2.5 px-3">Current/Exit</th>
              <th className="py-2.5 px-3">Quantity</th>
              <th className="py-2.5 px-3 text-right">P&L ($)</th>
              <th className="py-2.5 px-3 text-right">Status</th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((t) => {
              const isOpen = t.status === 'OPEN';
              const livePrice = isOpen ? getLivePrice(t.symbol, t.entryPrice) : (t.exitPrice || t.entryPrice);
              
              // Calculate dynamic open P&L vs locked-in closed P&L
              const isLong = t.direction === 'LONG';
              const priceDiff = isLong ? livePrice - t.entryPrice : t.entryPrice - livePrice;
              const pnlValue = isOpen ? (priceDiff * t.quantity) : t.pnL;
              const pnlPercentValue = isOpen ? ((priceDiff / t.entryPrice) * 100) : t.pnlPercent;

              const isProfit = pnlValue >= 0;

              return (
                <tr key={t.id} className="border-b border-slate-800/20 hover:bg-[#111722]/50 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-slate-100">{t.symbol}</td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      isLong 
                        ? 'bg-emerald-950/40 text-emerald-450 border border-emerald-900/30' 
                        : 'bg-rose-950/40 text-rose-450 border border-rose-900/30'
                    }`}>
                      {t.direction}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-white">${t.entryPrice.toLocaleString()}</td>
                  <td className="py-3.5 px-3 text-slate-300">${livePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</td>
                  <td className="py-3.5 px-3 text-slate-300 font-bold">{t.quantity}</td>
                  <td className={`py-3.5 px-3 text-right font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ${pnlValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    <span className="block text-[10px] opacity-80">{isProfit ? '+' : ''}{pnlPercentValue.toFixed(2)}%</span>
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold uppercase font-mono">
                    <span className={`px-2 py-0.5 rounded text-[9px] ${
                      isOpen ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-800/30 animate-pulse' : 'bg-slate-900 text-slate-500'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {isOpen ? (
                      <button
                        onClick={() => handleClosePosition(t.id, t.symbol, livePrice)}
                        className="px-2.5 py-1 text-[10px] font-bold uppercase rounded bg-rose-950 text-rose-400 border border-rose-900/40 hover:bg-rose-900/40 transition-all"
                      >
                        Close
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDeletLog(t.id)}
                        className="px-2.5 py-1 text-[10px] font-bold uppercase rounded bg-slate-800 text-slate-400 border border-slate-700/50 hover:bg-slate-700 transition-all"
                      >
                        Clear
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {trades.length === 0 && (
          <div className="text-center py-12 text-slate-500 font-sans">
            Your portfolio transaction log is empty. Submit a manual position above to open trade testing.
          </div>
        )}
      </div>
    </div>
  );
}
