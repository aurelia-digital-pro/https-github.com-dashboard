'use client';

import React from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useLicense } from '../../hooks/useLicense';
import {
  LayoutDashboard,
  PieChart,
  TrendingUp,
  Cpu,
  Bookmark,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function Sidebar() {
  const { activePage, setActivePage, sidebarOpen, toggleSidebar } = useUIStore();
  const { currentTier } = useLicense();

  const navigation = [
    { id: 'dashboard', label: 'Trading Desk', icon: LayoutDashboard },
    { id: 'screener', label: 'Market Screener', icon: TrendingUp },
    { id: 'portfolio', label: 'Portfolio Vault', icon: PieChart },
    { id: 'signals', label: 'AI Signals Desk', icon: Cpu },
    { id: 'activate', label: 'Active Licensing', icon: ShieldCheck },
  ];

  return (
    <aside
      className={`fixed md:relative top-0 left-0 h-full z-30 flex flex-col justify-between border-r border-zinc-800 bg-[#09090b] transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="flex flex-col gap-4 py-6">
        {/* Toggle Panel Button */}
        <div className="flex items-center px-4 justify-between h-8">
          {sidebarOpen && (
            <span className="text-xs font-bold text-zinc-500 font-mono tracking-wider uppercase">
              TERMINAL SYSTEMS
            </span>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 ml-auto"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex flex-col gap-1 px-2.5">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isSelected = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id as any)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all w-full ${
                  isSelected
                    ? 'bg-zinc-900 border-l-2 border-blue-500 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/55'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-500' : 'text-zinc-400'}`} />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mini license ribbon at base */}
      {sidebarOpen && (
        <div className="m-4 p-3 rounded-lg border border-zinc-800 bg-[#050507] text-xs">
          <div className="flex items-center gap-1.5 font-bold font-mono text-blue-400 uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            AURELIA {currentTier}
          </div>
          <p className="text-zinc-500 text-[10px] mt-1 line-clamp-2">
            Deterministic smart money analysis engine running locally in standard sandbox.
          </p>
        </div>
      )}
    </aside>
  );
}
