'use client';

import React from 'react';
import { useChartStore } from '../../stores/chartStore';
import { Sliders } from 'lucide-react';

export default function IndicatorPanel() {
  const {
    showEMA20,
    showEMA50,
    showEMA200,
    showBB,
    showVWAP,
    activeIndicator,
    toggleEMA20,
    toggleEMA50,
    toggleEMA200,
    toggleBB,
    toggleVWAP,
    setActiveIndicator,
  } = useChartStore();

  return (
    <div className="w-full bg-[#0c1017] border border-slate-800/80 rounded-2xl p-5 flex flex-col gap-5">
      {/* Group header */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Sliders className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">
          Indicators Controls Panel
        </span>
      </div>

      {/* Overlays list */}
      <div className="flex flex-col gap-2.5">
        <span className="text-[10px] font-bold text-slate-500 font-mono block">CHART OVERLAYS</span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {/* EMA 20 */}
          <button
            onClick={toggleEMA20}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border flex items-center justify-between transition-all ${
              showEMA20
                ? 'bg-blue-950/20 border-blue-500 text-blue-400'
                : 'bg-[#070b11] border-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <span>EMA 20</span>
            <span className={`w-1.5 h-1.5 rounded-full ${showEMA20 ? 'bg-blue-450' : 'bg-slate-700'}`}></span>
          </button>

          {/* EMA 50 */}
          <button
            onClick={toggleEMA50}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border flex items-center justify-between transition-all ${
              showEMA50
                ? 'bg-indigo-950/20 border-indigo-500 text-indigo-400'
                : 'bg-[#070b11] border-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <span>EMA 50</span>
            <span className={`w-1.5 h-1.5 rounded-full ${showEMA50 ? 'bg-indigo-450' : 'bg-slate-700'}`}></span>
          </button>

          {/* EMA 200 */}
          <button
            onClick={toggleEMA200}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border flex items-center justify-between transition-all ${
              showEMA200
                ? 'bg-amber-950/20 border-amber-500 text-amber-400'
                : 'bg-[#070b11] border-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <span>EMA 200</span>
            <span className={`w-1.5 h-1.5 rounded-full ${showEMA200 ? 'bg-amber-450' : 'bg-slate-700'}`}></span>
          </button>

          {/* VWAP */}
          <button
            onClick={toggleVWAP}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border flex items-center justify-between transition-all ${
              showVWAP
                ? 'bg-violet-950/20 border-violet-500 text-violet-400'
                : 'bg-[#070b11] border-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <span>VWAP</span>
            <span className={`w-1.5 h-1.5 rounded-full ${showVWAP ? 'bg-violet-450' : 'bg-slate-700'}`}></span>
          </button>
        </div>
      </div>

      {/* Sub-window Oscillator Selector */}
      <div className="flex flex-col gap-2.5">
        <span className="text-[10px] font-bold text-slate-500 font-mono block">OSCILLATOR ANALYSIS SUB-WINDOW</span>
        <div className="flex items-center gap-2">
          {(['RSI', 'MACD', 'STOCH', 'NONE'] as const).map((ind) => (
            <button
              key={ind}
              onClick={() => setActiveIndicator(ind)}
              className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
                activeIndicator === ind
                  ? 'bg-cyan-500 text-black border-cyan-500 shadow-md shadow-cyan-950/20'
                  : 'bg-[#070b11] border-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
