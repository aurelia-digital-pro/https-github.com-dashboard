'use client';

import React from 'react';
import { useUIStore } from '../stores/uiStore';
import { useMarketStore } from '../stores/marketStore';
import { useBinanceTicker } from '../hooks/useBinanceTicker';
import { useBinanceKlines } from '../hooks/useBinanceKlines';
import { useTechnicalAnalysis } from '../hooks/useTechnicalAnalysis';
import { useMarketStructure } from '../hooks/useMarketStructure';
import DashboardShell from '../components/layout/DashboardShell';
import TickerTape from '../components/market/TickerTape';
import HeroSection from '../components/landing/HeroSection';
import FeatureGrid from '../components/landing/FeatureGrid';
import FAQSection from '../components/landing/FAQSection';

// Charts & panel controls
import TradingChart from '../components/charts/TradingChart';
import IndicatorPanel from '../components/charts/IndicatorPanel';
import DrawingTools from '../components/charts/DrawingTools';
import TimeframeSelector from '../components/charts/TimeframeSelector';

// Market Card & Table details
import MarketCard from '../components/market/MarketCard';
import ScreenerTable from '../components/market/ScreenerTable';

// Signals checklists
import SignalCard from '../components/analysis/SignalCard';
import ConfidenceMeter from '../components/analysis/ConfidenceMeter';
import ReasoningPanel from '../components/analysis/ReasoningPanel';
import MarketStateBadge from '../components/analysis/MarketStateBadge';
import { useSignalEngine } from '../hooks/useSignalEngine';
import LicenseGate from '../components/monetization/LicenseGate';

// Portfolio tools
import TradeForm from '../components/portfolio/TradeForm';
import HoldingsList from '../components/portfolio/HoldingsList';
import AllocationChart from '../components/portfolio/AllocationChart';
import PerformanceMetrics from '../components/portfolio/PerformanceMetrics';

// Monetization activation tables
import PricingCard from '../components/monetization/PricingCard';
import ActivationForm from '../components/monetization/ActivationForm';
import { Sparkles, BarChart3, TrendingUp, Cpu, Key, Layers, BookOpen, Volume2 } from 'lucide-react';

export default function Home() {
  const { activePage, setActivePage } = useUIStore();
  const { selectedSymbol, setSelectedSymbol, selectedTimeframe } = useMarketStore();
  const { tickers } = useBinanceTicker();

  const { candles } = useBinanceKlines(selectedSymbol, selectedTimeframe, 250);
  const indicators = useTechnicalAnalysis(candles);
  const structure = useMarketStructure(candles);

  // Active workspace inputs
  const activeTicker = tickers.find((t) => t.symbol === selectedSymbol) || tickers[0];

  // Run the core score signal analysis
  const signalPackage = useSignalEngine(candles, indicators, structure);
  const signalAnalysis = signalPackage.analysis;
  const signalReasoning = signalPackage.reasoning;

  const handleSelectSymbol = (sym: string) => {
    setSelectedSymbol(sym);
  };

  // 1. Landing View Render
  if (activePage === 'landing') {
    return (
      <div className="min-h-screen bg-[#050507] text-zinc-100 flex flex-col font-sans">
        {/* Horizontal live marquee updates */}
        <TickerTape />

        {/* Top Header Layout Navbar */}
        <header className="w-full bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-40 select-none">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold italic tracking-tighter text-white">
              A
            </div>
            <span className="font-bold text-zinc-100 tracking-tight text-md uppercase">Aurelia <span className="text-blue-500">Pro</span></span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActivePage('dashboard')}
              className="px-4.5 py-1.5 rounded-lg text-xs font-bold text-white uppercase bg-blue-600 hover:bg-blue-500 transition"
            >
              Enterprise Terminal
            </button>
          </div>
        </header>

        {/* Core Sections Grid */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-10">
          <HeroSection />
          
          <FeatureGrid />

          {/* Pricing table plans */}
          <section className="py-10 border-t border-zinc-800">
            <div className="text-center mb-8">
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-500 tracking-wider">SECURE LIFETIME ACQUISITIONS</span>
              <h2 className="text-xl md:text-2xl font-bold text-zinc-100 font-sans mt-1">
                Pricing Tiers Built for Resale
              </h2>
            </div>
            <PricingCard />
          </section>

          <FAQSection />
        </div>

        {/* Simple minimal footer */}
        <footer className="bg-[#050507] border-t border-zinc-800 py-6 text-center text-zinc-500 text-xs mt-14">
          <span>© {new Date().getFullYear()} Aurelia Core Platforms. Static export ready.</span>
        </footer>
      </div>
    );
  }

  // 2. Dashboards Layout Renderer
  return (
    <DashboardShell>
      {/* Dynamic page switches depending on activePage state */}
      {activePage === 'dashboard' && (
        <div className="flex flex-col gap-6">
          {/* Active stats bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-zinc-100 tracking-tight">System Trading Desk</h2>
              <p className="text-xs text-zinc-400 mt-1 uppercase font-mono tracking-wider">
                Active Desk: {selectedSymbol} — Live WebSocket Feeds Active
              </p>
            </div>
            {signalAnalysis && <MarketStateBadge analysis={signalAnalysis} />}
          </div>

          {/* Top selection mini asset cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tickers.slice(0, 4).map((t) => (
              <MarketCard
                key={t.symbol}
                ticker={t}
                isSelected={selectedSymbol === t.symbol}
                onClick={() => handleSelectSymbol(t.symbol)}
              />
            ))}
          </div>

          {/* Main Chart + Config split rows */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Interval & tools selectors */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <TimeframeSelector />
                <DrawingTools />
              </div>
              <TradingChart />
            </div>

            {/* Side interactive indicators sidebar */}
            <div className="flex flex-col gap-6">
              <IndicatorPanel />
              {signalAnalysis && (
                <SignalCard
                  symbol={selectedSymbol}
                  analysis={signalAnalysis}
                  onOpenDetails={() => setActivePage('signals')}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {activePage === 'screener' && <ScreenerTable />}

      {activePage === 'portfolio' && (
        <div className="flex flex-col gap-6">
          {/* Balance / Wins bar */}
          <PerformanceMetrics />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <HoldingsList />
            </div>
            <div className="flex flex-col gap-6">
              <TradeForm />
              <AllocationChart />
            </div>
          </div>
        </div>
      )}

      {activePage === 'signals' && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-extrabold text-zinc-100 tracking-tight">AI Signals Desk</h2>
            <p className="text-xs text-zinc-400 mt-1 uppercase font-mono">
              Probabilistic signal validation and automatic smart money concepts
            </p>
          </div>

          {/* Gated premium indicators content */}
          <LicenseGate tier="pro">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 flex flex-col gap-6">
                {signalAnalysis && (
                  <>
                    <ConfidenceMeter analysis={signalAnalysis} />
                    {/* Elite timing breakdown gate nested appropriately */}
                    <LicenseGate tier="elite">
                      <ReasoningPanel reasoning={signalReasoning} />
                    </LicenseGate>
                  </>
                )}
              </div>

              {/* SMC detail panels */}
              <div className="flex flex-col gap-6">
                <div className="p-4 rounded-xl border border-dashed border-cyan-800/40 bg-[#0f1724]/20 text-xs font-mono text-cyan-400">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>SMART MONEY ANALYSIS ACTIVE</span>
                  </div>
                  <span>Pro level structural sweep calculations initialized dynamically.</span>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {/* Displays swing limits */}
                  <div className="p-1 rounded-xl bg-gradient-to-br from-transparent to-zinc-900 border border-zinc-800">
                    <div className="p-3 bg-[#09090b] rounded-xl flex flex-col gap-4">
                      <span className="text-[10px] font-bold text-zinc-400 font-mono tracking-wider uppercase block">Swing Points</span>
                      <div className="flex items-center justify-between text-xs text-zinc-300">
                        <span>High swing:</span>
                        <span className="font-bold text-orange-400">$68,542</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span>Low swing:</span>
                        <span className="font-bold text-emerald-400">$64,210</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </LicenseGate>
        </div>
      )}

      {activePage === 'activate' && (
        <div className="flex flex-col gap-6 py-6">
          <div className="text-center mb-4">
            <h2 className="text-xl font-extrabold text-zinc-100 tracking-tight">Unlocks Aurelia Pro Tiers</h2>
            <p className="text-xs text-zinc-400 mt-1 uppercase font-mono">
              Key in code licenses and bind identity hashes
            </p>
          </div>
          <ActivationForm />
        </div>
      )}

      {activePage === 'pricing' && (
        <div className="flex flex-col gap-6">
          <div className="text-center mb-4">
            <h2 className="text-xl font-extrabold text-[#ffffff] tracking-tight">License Acquisitions</h2>
            <p className="text-xs text-slate-400 mt-1 uppercase font-mono">
              Lifetime purchases with instant activation codes
            </p>
          </div>
          <PricingCard />
        </div>
      )}
    </DashboardShell>
  );
}
