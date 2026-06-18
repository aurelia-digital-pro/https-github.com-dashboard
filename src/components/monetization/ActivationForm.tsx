'use client';

import React, { useState } from 'react';
import { useLicense } from '../../hooks/useLicense';
import { getDeviceFingerprint } from '../../lib/license/fingerprint';
import { ShieldCheck, Sparkles, Key, KeySquare, HelpCircle } from 'lucide-react';

export default function ActivationForm() {
  const { currentTier, activate, license } = useLicense();
  const [key, setKey] = useState('');
  const [message, setMessage] = useState('');

  const fingerprint = getDeviceFingerprint();

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    
    const result = activate(key.trim());
    
    if (result.success) {
      setMessage('✔ Success: Golden core license registered! Elite and Pro terminal capabilities fully activated.');
    } else {
      setMessage(`❌ Activation failed: ${result.error || 'Code checksum mismatch for your device signature.'}`);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-[#09090b] border border-zinc-800 rounded-2xl p-6 flex flex-col gap-5 select-none">
      <div>
        <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
          <KeySquare className="w-4 h-4 text-blue-500" />
          Terminal Activation Console
        </h3>
        <p className="text-[11px] text-zinc-400 font-mono mt-1 leading-relaxed">
          Unlock maximum capability by keying in your commercial license. Your activation binds dynamically to your device fingerprint.
        </p>
      </div>

      {/* Device fingerprint display */}
      <div className="p-3 bg-[#050507] rounded-lg border border-zinc-800/80 font-mono text-[10px] text-zinc-500">
        <span className="block uppercase tracking-wider text-[9px] text-zinc-550 mb-1">LOCAL DEVICE IDENTITY SIGNATURE</span>
        <span className="block text-zinc-400 select-all truncate">{JSON.stringify(fingerprint)}</span>
      </div>

      <form onSubmit={handleActivate} className="flex flex-col gap-4 font-mono text-xs">
        <div className="flex flex-col gap-1.5">
          <label className="text-zinc-400">ACTIVATION CODE</label>
          <input
            type="text"
            placeholder="AURELIA-XXXX-XXXX-XXXX"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="px-3.5 py-2.5 rounded-lg border border-zinc-800 bg-[#050507] text-white focus:border-blue-500 focus:outline-none focus:text-blue-400 tracking-wider text-center"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-blue-650 hover:bg-blue-600 text-white font-bold uppercase transition cursor-pointer"
        >
          Activate License
        </button>
      </form>

      {/* Dynamic Status displays */}
      {message && (
        <div className={`p-4 rounded-xl border text-xs font-mono leading-relaxed ${
          message.includes('Success') 
            ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400' 
            : 'bg-rose-955/10 border-rose-950/20 text-rose-400'
        }`}>
          {message}
        </div>
      )}

      {license && license.code && (
        <div className="p-4 rounded-xl border border-dashed border-zinc-800 text-xs font-mono flex flex-col gap-1 text-zinc-500 mt-2">
          <div className="flex items-center gap-1.5 font-bold text-zinc-205">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span>CORE REGISTRATION LOGGED</span>
          </div>
          <span>Active Code: <span className="text-white select-all">{license.code}</span></span>
          <span>Access Tier: <span className="text-blue-500 font-bold uppercase">{license.tier}</span></span>
          <span>Registered: <span className="text-zinc-405">{license.activatedAt}</span></span>
        </div>
      )}
    </div>
  );
}
