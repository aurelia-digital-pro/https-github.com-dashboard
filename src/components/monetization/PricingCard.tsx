'use client';

import React, { useState } from 'react';
import { useLicense } from '../../hooks/useLicense';
import { generateLicenseKey } from '../../lib/license/generator';
import { ShieldCheck, Sparkles, Key, ExternalLink, HelpCircle } from 'lucide-react';

export default function PricingCard() {
  const { currentTier, fingerprint } = useLicense();
  const [testKey, setTestKey] = useState<{ tier: string; code: string } | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Free Starter',
      price: '$0',
      period: 'Forever',
      desc: 'Standard local ticker rates and basic chart indicators feed tracker.',
      features: [
        'Real-time WebSocket data feed',
        'Basic technical indicators',
        'Portfolio manual log testing',
        'Simple static RSI/EMA parameters',
      ],
      action: 'Active Default',
      locked: false,
    },
    {
      id: 'pro',
      name: 'Professional Desk',
      price: '$29',
      period: 'One-time fee',
      desc: 'Unlocks complete Smart Money Concepts structure mapping with institutional OBs.',
      features: [
        'Everything in Free tier',
        'Smart Money structural swing tracking',
        'BOS and Changes of Character (CHoCH)',
        'Active core order block levels',
        'Inbound Fair Value Gaps mapping',
      ],
      action: 'Purchase Pro Licence',
      locked: true,
      url: 'https://gumroad.com',
    },
    {
      id: 'elite',
      name: 'Elite Intelligence',
      price: '$99',
      period: 'One-time fee',
      desc: 'Our maximum capability terminal logic, including diagnostic AI reasoning engines.',
      features: [
        'Everything in Pro tier',
        'Explainable AI reasoning narrative reports',
        'Dynamic Timing analysis (Why Now?)',
        'Custom Risk and ATR Drawdown rules',
        'Alert triggers and instant panel saves',
      ],
      action: 'Upgrade to Elite License',
      locked: true,
      url: 'https://gumroad.com',
    },
  ];

  const handleGenerateTest = (tier: 'pro' | 'elite') => {
    const key = generateLicenseKey(tier, fingerprint);
    setTestKey({ tier, code: key });
  };

  return (
    <div className="w-full flex flex-col gap-8 select-none">
      {/* 3 cards row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isActive = currentTier === p.id;
          return (
            <div
              key={p.id}
              className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                isActive
                  ? 'bg-[#0f1724] border-cyan-500 shadow-xl shadow-cyan-950/20 ring-1 ring-cyan-500/30'
                  : 'bg-[#0c1017] border-slate-800/80 hover:border-slate-705'
              }`}
            >
              <div>
                {/* Plan header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase font-mono font-bold text-slate-400">{p.name}</span>
                  {isActive && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase bg-cyan-950/40 text-cyan-400 border border-cyan-800/40 animate-pulse">
                      Active
                    </span>
                  )}
                </div>

                {/* Price block */}
                <div className="flex items-baseline gap-1 mt-2.5">
                  <span className="text-3xl md:text-4xl font-bold font-mono text-white">{p.price}</span>
                  <span className="text-xs text-slate-500 font-mono">/ {p.period}</span>
                </div>

                <p className="text-xs text-slate-400 mt-3 font-sans leading-relaxed">
                  {p.desc}
                </p>

                {/* Features list */}
                <ul className="flex flex-col gap-2 mt-5 border-t border-slate-800/40 pt-4 font-mono text-[10px] text-slate-450">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5 leading-normal">
                      <span className="text-cyan-400 font-bold shrink-0">✔</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action buttons */}
              <div className="mt-6">
                {p.locked ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 hover:scale-[1.02] text-black font-bold uppercase transition flex items-center justify-center gap-1.5 text-xs text-center"
                  >
                    <span>{p.action}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-lg bg-[#070b11] border border-slate-800 text-slate-500 font-bold uppercase text-xs cursor-default text-center"
                  >
                    {p.action}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Trial tester / Developer debug activation tool */}
      <div className="w-full p-6 bg-[#0c1017]/50 rounded-2xl border border-dashed border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-[10px] bg-cyan-950/20 border border-cyan-950 text-cyan-400 font-mono font-bold uppercase px-2 py-0.5 rounded">
            CUSTOMER EVALUATION UTILITY (COMMERCIAL CHEAT)
          </span>
          <h3 className="text-sm font-bold text-slate-100 font-sans tracking-tight mt-1.5">
            Evaluate Aurelia Pro Instantly (Generate Trial Checksums)
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            Because Aurelia runs entirely client-side, license verification processes check cryptographic signatures instantly. Use this generator to manufacture valid licensing keys for testing.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap shrink-0">
          <button
            onClick={() => handleGenerateTest('pro')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-200 border border-slate-800 hover:text-white hover:bg-slate-900 rounded-lg transition"
          >
            Generate Test PRO Key
          </button>
          <button
            onClick={() => handleGenerateTest('elite')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-200 border border-slate-800 hover:text-white hover:bg-slate-900 rounded-lg transition"
          >
            Generate Test ELITE Key
          </button>
        </div>
      </div>

      {testKey && (
        <div className="p-4 bg-cyan-950/10 border border-cyan-800/20 text-xs font-mono text-cyan-400 rounded-xl leading-relaxed animate-fade-in">
          <div className="flex items-center gap-1 font-bold mb-1">
            <Key className="w-4 h-4" />
            <span>COPY YOUR CUSTOM TEST {testKey.tier.toUpperCase()} CODE</span>
          </div>
          <p className="select-all font-bold tracking-widest text-[#ecebeb] bg-slate-950 p-2.5 rounded-lg border border-slate-850 truncate">
            {testKey.code}
          </p>
          <p className="text-[10px] text-slate-450 mt-1.5 uppercase">
            👉 Switch to the &quot;Active Licensing&quot; page in the navigation menu, open the activation form console, paste this code, and click Activate to unlock the system.
          </p>
        </div>
      )}
    </div>
  );
}
