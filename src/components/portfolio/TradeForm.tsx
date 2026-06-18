'use client';

import React, { useState } from 'react';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { useSignalStore } from '../../stores/signalStore';
import { Wallet, ArrowUpRight, ArrowDownRight, Tag, HelpCircle, Plus } from 'lucide-react';

export default function TradeForm() {
  const { balance, addTrade, trades } = usePortfolioStore();
  const { addAlertLog } = useSignalStore();

  const [symbol, setSymbol] = useState('BTC/USDT');
  const [direction, setDirection] = useState<'LONG' | 'SHORT'>('LONG');
  const [entryPrice, setEntryPrice] = useState<number>(65000);
  const [quantity, setQuantity] = useState<number>(0.1);
  const [stopLoss, setStopLoss] = useState<number>(63500);
  const [takeProfit, setTakeProfit] = useState<number>(69000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (entryPrice <= 0 || quantity <= 0) {
      alert('Error: Price and Quantity must be positive values');
      return;
    }

    const value = entryPrice * quantity;
    if (value > balance + 50000) {
      // Allow realistic leverage simulation, but check caps
      alert('Error: Insufficient capital to open position even with margin leverage');
      return;
    }

    addTrade({
      symbol: symbol.toUpperCase(),
      direction,
      entryPrice,
      quantity,
      stopLoss: stopLoss || undefined,
      takeProfit: takeProfit || undefined,
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
    });

    addAlertLog(symbol, `Manual simulated ${direction} position opened for ${quantity} ${symbol} at $${entryPrice}`, 'info');

    // Reset simple values
    setQuantity(0.1);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-[#0c1017] border border-slate-800/80 rounded-2xl p-6 flex flex-col gap-5 select-none"
    >
      <div>
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-sans tracking-tight">
          <Wallet className="w-4 h-4 text-cyan-400" />
          Simulate Manual Position Entry
        </h3>
        <p className="text-[11px] text-slate-400 mt-1 font-mono">
          Enter custom simulated positions to test real-time P&L tracking, drawdowns, and limits.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        {/* Long / Short Button */}
        <button
          type="button"
          onClick={() => setDirection('LONG')}
          className={`py-2 p-3 text-xs font-bold rounded-lg border flex items-center justify-center gap-1.5 transition-all uppercase ${
            direction === 'LONG'
              ? 'bg-emerald-950/20 border-emerald-500 text-emerald-400'
              : 'bg-[#070b11] border-slate-800/60 text-slate-500 hover:text-slate-300'
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Long</span>
        </button>

        <button
          type="button"
          onClick={() => setDirection('SHORT')}
          className={`py-2 p-3 text-xs font-bold rounded-lg border flex items-center justify-center gap-1.5 transition-all uppercase ${
            direction === 'SHORT'
              ? 'bg-rose-950/20 border-rose-500 text-rose-450'
              : 'bg-[#070b11] border-slate-800/60 text-slate-500 hover:text-slate-300'
          }`}
        >
          <ArrowDownRight className="w-4 h-4" />
          <span>Short</span>
        </button>
      </div>

      <div className="flex flex-col gap-3 font-mono text-xs">
        {/* Symbol / Size */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400">SYM CODE</label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-800 bg-[#070b11] text-white focus:border-cyan-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400">QTY SIZE</label>
            <input
              type="number"
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
              className="px-3 py-2 rounded-lg border border-slate-800 bg-[#070b11] text-white focus:border-cyan-500 focus:outline-none"
              min="0.0001"
              required
            />
          </div>
        </div>

        {/* Price limits */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400">ENTRY ($)</label>
            <input
              type="number"
              step="any"
              value={entryPrice}
              onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
              className="px-2.5 py-2 rounded-lg border border-slate-800 bg-[#070b11] text-white focus:border-cyan-500 focus:text-cyan-400 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400">STOP LOSS</label>
            <input
              type="number"
              step="any"
              value={stopLoss}
              onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
              className="px-1.5 py-2 rounded-lg border border-slate-800 bg-[#070b11] text-rose-300 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400">TAKE PROFIT</label>
            <input
              type="number"
              step="any"
              value={takeProfit}
              onChange={(e) => setTakeProfit(parseFloat(e.target.value) || 0)}
              className="px-1.5 py-2 rounded-lg border border-slate-800 bg-[#070b11] text-emerald-300 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Launcher trigger button */}
      <button
        type="submit"
        className="w-full mt-2 py-3 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold uppercase transition-all tracking-normal text-xs flex items-center justify-center gap-1.5"
      >
        <Plus className="w-4 h-4 text-black font-bold" />
        Launch New Trade Position
      </button>
    </form>
  );
}
