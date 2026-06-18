'use client';

import React from 'react';
import { useLicense } from '../../hooks/useLicense';
import { useUIStore } from '../../stores/uiStore';
import { ShieldCheck, Sparkles, Key, Lock } from 'lucide-react';

interface GateProps {
  tier: 'pro' | 'elite';
  children: React.ReactNode;
}

export default function LicenseGate({ tier, children }: GateProps) {
  const { currentTier } = useLicense();
  const { setActivePage } = useUIStore();

  const currentLevel = currentTier === 'elite' ? 3 : currentTier === 'pro' ? 2 : 1;
  const gateLevel = tier === 'elite' ? 3 : 2;

  // Passed gate tier check
  if (currentLevel >= gateLevel) {
    return <>{children}</>;
  }

  return (
    <div className="relative w-full rounded-2xl border border-dashed border-slate-800 bg-[#0c1017]/40 backdrop-blur-sm p-8 flex flex-col items-center justify-center text-center py-14 overflow-hidden group select-none min-h-[220px]">
      {/* Background ambient lock glows */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-44 h-44 rounded-full bg-cyan-500/5 blur-3xl group-hover:bg-cyan-500/10 transition-all duration-300 pointer-events-none" />

      <div className="p-3.5 rounded-full bg-slate-950/60 border border-slate-800 text-slate-500 mb-4 transform group-hover:scale-110 transition-transform">
        <Lock className="w-5 h-5 text-cyan-400" />
      </div>

      <h3 className="text-sm font-bold text-slate-100 font-sans tracking-tight">
        LOCKED SYSTEM: Upgrade Required
      </h3>
      
      <p className="max-w-md text-[11px] text-slate-400 font-mono mt-2 leading-relaxed">
        Accessing the premium {tier.toUpperCase()} module requires a valid license. 
        Unlocks real-time institutional Smart Money Concepts (SMC) tracking and diagnostic AI report structures.
      </p>

      <div className="flex items-center gap-3 mt-5">
        <button
          onClick={() => setActivePage('pricing')}
          className="px-4 py-2 text-xs font-bold text-black uppercase bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-all"
        >
          View Tiers
        </button>
        <button
          onClick={() => setActivePage('activate')}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#070b11] border border-slate-800 hover:border-slate-700 rounded-lg font-mono transition-all"
        >
          <Key className="w-3.5 h-3.5 text-cyan-400" />
          Enter Code
        </button>
      </div>
    </div>
  );
}
