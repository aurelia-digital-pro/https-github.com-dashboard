import React from 'react';

export default function Footer() {
  return (
    <div className="w-full flex flex-col mt-auto">
      {/* Bottom Ticker Tape */}
      <footer className="h-8 bg-black border-y border-zinc-800 flex items-center overflow-hidden shrink-0">
        <div className="flex whitespace-nowrap animate-marquee items-center">
          <span className="mx-4 text-[10px] font-bold text-zinc-400">
            <span className="text-blue-500 font-mono">AURELIA_SYSTEM:</span> NO REPAINTING DETECTED
          </span>
          <span className="mx-4 text-[10px] font-bold text-emerald-500">BTC/USDT +4.2%</span>
          <span className="mx-4 text-[10px] font-bold text-rose-500">ETH/USDT -0.4%</span>
          <span className="mx-4 text-[10px] font-bold text-emerald-500">SOL/USDT +1.2%</span>
          <span className="mx-4 text-[10px] font-bold text-zinc-400 font-mono">DXY: 104.22 (-0.12)</span>
          <span className="mx-4 text-[10px] font-bold text-emerald-500 font-mono">XAU/USD: 2314.50 (+0.45%)</span>
          <span className="mx-4 text-[10px] font-bold text-zinc-400">
            <span className="text-blue-500 font-mono">SYSTEM:</span> ENGINE HEARTBEAT OK
          </span>
        </div>
      </footer>
      
      {/* Disclaimer sub-panel */}
      <div className="w-full bg-[#050507] px-8 py-4 flex flex-col md:flex-row items-center justify-between text-zinc-500 text-[10px] uppercase tracking-wider font-mono">
        <div>
          <span>© {new Date().getFullYear()} Aurelia Core Platforms. All rights reserved.</span>
        </div>
        <div className="mt-2 md:mt-0 text-zinc-600 text-center max-w-2xl leading-normal shrink-0">
          ⚠️ RISK DISCLAIMER: Trading crypto/forex involves deep leverage capital loss risk. Indicators show mathematical models only. No financial advice given.
        </div>
      </div>
    </div>
  );
}
