'use client';

import React from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useLicense } from '../../hooks/useLicense';
import { Shield, Sparkles, Key, Wallet2, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { activePage, setActivePage } = useUIStore();
  const { currentTier, isLicensed } = useLicense();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur-md px-6 py-3 flex items-center justify-between">
      {/* Brand logo */}
      <div 
        onClick={() => setActivePage('landing')} 
        className="flex items-center gap-2 cursor-pointer group"
      >
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold italic tracking-tighter text-white">
          A
        </div>
        <div>
          <span className="font-sans font-bold text-lg tracking-tight text-white uppercase">
            Aurelia <span className="text-blue-500">Pro</span>
          </span>
          <span className="font-mono text-[10px] text-blue-400 ml-1.5 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded">
            v3.0.1
          </span>
        </div>
      </div>

      {/* Main interactive Nav Links */}
      <nav className="hidden md:flex items-center gap-1.5">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'screener', label: 'Market Screener' },
          { id: 'portfolio', label: 'Portfolio' },
          { id: 'signals', label: 'AI Signals' },
          { id: 'pricing', label: 'Pricing' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activePage === item.id
                ? 'bg-[#18181b] text-zinc-100 border border-zinc-800'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Monetization, Tier status and activation shortcuts */}
      <div className="flex items-center gap-3">
        {/* Licensing Status */}
        <div 
          onClick={() => setActivePage('activate')}
          className="flex items-center gap-1.5 cursor-pointer px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800 hover:border-zinc-700 transition-all text-[11px] font-mono tracking-widest text-zinc-400"
        >
          {currentTier === 'elite' ? (
            <div className="flex items-center gap-2 px-1 text-blue-400">
              <span className="text-[11px] font-bold uppercase tracking-widest">Elite License</span>
            </div>
          ) : currentTier === 'pro' ? (
            <div className="flex items-center gap-2 px-1 text-blue-400">
              <span className="text-[11px] font-bold uppercase tracking-widest">Pro License</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-zinc-400 uppercase">
              <span className="inline-block w-2-2 h-2 bg-zinc-650 rounded-full"></span>
              <span>Free License</span>
            </div>
          )}
        </div>

        {/* Dynamic button to unlock */}
        {!isLicensed ? (
          <button
            onClick={() => setActivePage('pricing')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white uppercase bg-blue-600 hover:bg-blue-500 rounded-lg transition-all transform hover:scale-[1.02]"
          >
            Upgrade Pro
          </button>
        ) : (
          <button
            onClick={() => setActivePage('activate')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-zinc-300 font-mono hover:text-white bg-[#18181b] border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all"
          >
            <Key className="w-3.5 h-3.5 text-blue-500" />
            License Vault
          </button>
        )}
      </div>
    </header>
  );
}
