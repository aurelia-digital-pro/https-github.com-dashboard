'use client';

import React, { useState, useMemo } from 'react';
import { useBinanceTicker } from '../../hooks/useBinanceTicker';
import { useSignalStore } from '../../stores/signalStore';
import { useMarketStore } from '../../stores/marketStore';
import { useUIStore } from '../../stores/uiStore';
import {
  TrendingUp,
  TrendingDown,
  Star,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown,
  Filter,
} from 'lucide-react';

export default function ScreenerTable() {
  const { tickers } = useBinanceTicker();
  const { watchlist, addToWatchlist, removeFromWatchlist, addAlertLog } = useSignalStore();
  const { setSelectedSymbol, setSelectedTimeframe } = useMarketStore();
  const { setActivePage } = useUIStore();

  const [search, setSearch] = useState('');
  const [filterRSI, setFilterRSI] = useState<'ALL' | 'OVERSOLD' | 'OVERBOUGHT'>('ALL');
  const [sortBy, setSortBy] = useState<'symbol' | 'price' | 'change' | 'volume'>('change');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sparkline mini canvas generator
  const drawMiniSparkline = (prices: number[], isUp: boolean) => {
    if (prices.length < 2) return null;
    const max = Math.max(...prices);
    const min = Math.min(...prices);
    const range = max - min === 0 ? 1 : max - min;
    const points = prices
      .map((p, idx) => {
        const x = (idx / (prices.length - 1)) * 60;
        const y = 30 - ((p - min) / range) * 20;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg className="w-16 h-8" viewBox="0 0 60 30">
        <polyline
          fill="none"
          stroke={isUp ? '#10b981' : '#f43f5e'}
          strokeWidth="1.5"
          points={points}
        />
      </svg>
    );
  };

  const handleSelectSymbol = (sym: string) => {
    setSelectedSymbol(sym);
    addAlertLog(sym, `Switched focus workspace to target: ${sym}`, 'info');
    setActivePage('dashboard');
  };

  const toggleWatchlist = (e: React.MouseEvent, sym: string) => {
    e.stopPropagation();
    if (watchlist.includes(sym)) {
      removeFromWatchlist(sym);
      addAlertLog(sym, `Removed from custom watchlist: ${sym}`, 'info');
    } else {
      addToWatchlist(sym);
      addAlertLog(sym, `Added to custom watchlist: ${sym}`, 'info');
    }
  };

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Filter and sort tickers
  const processedTickers = useMemo(() => {
    return tickers
      .filter((t) => {
        const matchesSearch = t.symbol.toLowerCase().includes(search.toLowerCase());
        
        // Simulating RSI positions under different symbol characteristics for extreme screener filtering
        const simulatedRSI = t.symbol.includes('BTC') ? 66 : t.symbol.includes('ETH') ? 31 : t.symbol.includes('SOL') ? 78 : 45;
        const matchesRSI =
          filterRSI === 'ALL' ||
          (filterRSI === 'OVERSOLD' && simulatedRSI < 35) ||
          (filterRSI === 'OVERBOUGHT' && simulatedRSI > 65);

        return matchesSearch && matchesRSI;
      })
      .sort((a, b) => {
        let valA: any = a.symbol;
        let valB: any = b.symbol;

        if (sortBy === 'price') {
          valA = a.price;
          valB = b.price;
        } else if (sortBy === 'change') {
          valA = a.change24h;
          valB = b.change24h;
        } else if (sortBy === 'volume') {
          valA = a.volume24h;
          valB = b.volume24h;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [tickers, search, filterRSI, sortBy, sortOrder]);

  return (
    <div className="w-full bg-[#0c1017] border border-slate-800/80 rounded-2xl overflow-hidden p-6">
      {/* Table Headers, search and filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-100">Market Intelligence Screener</h2>
          <p className="text-xs text-slate-400 mt-1">
            Live sorting of trending crypto and forex benchmarks. Click rows to inspect in layout chart.
          </p>
        </div>

        {/* Input/Filters block */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search symbol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-800 bg-[#070b11] focus:border-cyan-500/80 focus:outline-none text-slate-200 w-44 font-mono"
            />
          </div>

          {/* RSI Filters dropdown */}
          <div className="flex items-center gap-1 bg-[#070b11] border border-slate-800 rounded-lg p-1">
            {(['ALL', 'OVERSOLD', 'OVERBOUGHT'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setFilterRSI(r)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all uppercase ${
                  filterRSI === r
                    ? 'bg-cyan-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r.toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table panel */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800/80 text-slate-400 hover:bg-transparent">
              <th className="py-3 px-4">Watch</th>
              <th onClick={() => handleSort('symbol')} className="py-3 px-4 cursor-pointer hover:text-white transition-all select-none">
                Symbol <ArrowUpDown className="w-3 h-3 inline ml-1" />
              </th>
              <th onClick={() => handleSort('price')} className="py-3 px-4 cursor-pointer hover:text-white transition-all select-none">
                Live Price <ArrowUpDown className="w-3 h-3 inline ml-1" />
              </th>
              <th onClick={() => handleSort('change')} className="py-3 px-4 cursor-pointer hover:text-white transition-all select-none">
                24H Change <ArrowUpDown className="w-3 h-3 inline ml-1" />
              </th>
              <th className="py-3 px-4">SMC Trigger Phase</th>
              <th className="py-3 px-4">Simulated RSI(14)</th>
              <th onClick={() => handleSort('volume')} className="py-3 px-4 cursor-pointer hover:text-white text-right transition-all select-none">
                24H Volume <ArrowUpDown className="w-3 h-3 inline ml-1" />
              </th>
              <th className="py-3 px-4 text-center">Trend Spark</th>
            </tr>
          </thead>
          <tbody>
            {processedTickers.map((t) => {
              const isFav = watchlist.includes(t.symbol);
              const isUp = t.change24h >= 0;
              // Simulating indicator details beautifully for extreme realism
              const simRSI = t.symbol.includes('BTC') ? 66 : t.symbol.includes('ETH') ? 31 : t.symbol.includes('SOL') ? 78 : 45;
              const isOversold = simRSI < 35;
              const isOverbought = simRSI > 65;

              return (
                <tr
                  key={t.symbol}
                  onClick={() => handleSelectSymbol(t.symbol)}
                  className="border-b border-slate-800/40 hover:bg-[#111722]/60 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4">
                    <button
                      onClick={(e) => toggleWatchlist(e, t.symbol)}
                      className="text-slate-500 hover:text-yellow-400 transition-all transform hover:scale-110"
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                    </button>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-100">{t.symbol}</td>
                  <td className="py-3 px-4 text-white font-semibold">
                    ${t.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                  </td>
                  <td className={`py-3 px-4 font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isUp ? '+' : ''}{t.change24h.toFixed(2)}%
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      t.symbol.includes('BTC') || t.symbol.includes('SOL')
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                        : 'bg-indigo-950/40 text-indigo-400 border border-indigo-800/40'
                    }`}>
                      {t.symbol.includes('BTC') ? 'EXPANSION' : t.symbol.includes('ETH') ? 'ACCUMULATION' : 'DISTRIBUTION'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-bold ${isOversold ? 'text-emerald-400' : isOverbought ? 'text-rose-400' : 'text-slate-400'}`}>
                        {simRSI}
                      </span>
                      <span className="text-[9px] text-slate-500">
                        {isOversold ? '(Oversold)' : isOverbought ? '(Overbought)' : ''}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300">
                    ${t.volume24h.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-2 px-4 flex justify-center items-center">
                    {drawMiniSparkline(t.sparkline, isUp)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {processedTickers.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No active currency matches the current filters. Clear search or select &quot;All&quot;.
          </div>
        )}
      </div>
    </div>
  );
}
