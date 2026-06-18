'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useMarketStore } from '../../stores/marketStore';
import { useChartStore } from '../../stores/chartStore';
import { useBinanceKlines } from '../../hooks/useBinanceKlines';
import { useTechnicalAnalysis } from '../../hooks/useTechnicalAnalysis';
import { useMarketStructure } from '../../hooks/useMarketStructure';
import { Loader2, AlertCircle, Maximize2, Palette } from 'lucide-react';

export default function TradingChart() {
  const { selectedSymbol, selectedTimeframe } = useMarketStore();
  const { showEMA20, showEMA200, showVWAP, activeIndicator } = useChartStore();
  const { candles, loading, error } = useBinanceKlines(selectedSymbol, selectedTimeframe, 250);

  const indicators = useTechnicalAnalysis(candles);
  const structure = useMarketStructure(candles);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<any>(null);
  const candleSeriesRef = useRef<any>(null);

  const [activeCrosshair, setActiveCrosshair] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !chartContainerRef.current || candles.length === 0) return;

    // Use dynamic import to safely instantiate on the client
    let chart: any = null;

    import('lightweight-charts').then(({ createChart }) => {
      if (!chartContainerRef.current) return;

      // Clean old chart container
      chartContainerRef.current.innerHTML = '';

      chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          background: { color: '#0c1017' },
          textColor: '#94a3b8',
        },
        grid: {
          vertLines: { color: 'rgba(51, 65, 85, 0.15)' },
          horzLines: { color: 'rgba(51, 65, 85, 0.15)' },
        },
        crosshair: {
          mode: 1, // Normal crosshair
        },
        rightPriceScale: {
          borderColor: 'rgba(51, 65, 85, 0.4)',
        },
        timeScale: {
          borderColor: 'rgba(51, 65, 85, 0.4)',
          timeVisible: true,
        },
      });

      chartInstanceRef.current = chart;

      // Add standard candle series
      const candleSeries = chart.addCandlestickSeries({
        upColor: '#10b981',
        downColor: '#f43f5e',
        borderDownColor: '#f43f5e',
        borderUpColor: '#10b981',
        wickDownColor: '#f43f5e',
        wickUpColor: '#10b981',
      });
      candleSeriesRef.current = candleSeries;

      // Map candles
      const formattedCandles = candles.map(c => ({
        time: c.time,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      }));
      candleSeries.setData(formattedCandles);

      // Overlay EMA 20 if enabled
      if (showEMA20 && indicators.ema20.length > 0) {
        const ema20Series = chart.addLineSeries({
          color: '#3b82f6',
          lineWidth: 1.5,
          title: 'EMA 20',
        });
        const formattedEma20 = candles.map((c, idx) => ({
          time: c.time,
          value: indicators.ema20[idx],
        })).filter(e => e.value > 0);
        ema20Series.setData(formattedEma20);
      }

      // Overlay EMA 200 if enabled
      if (showEMA200 && indicators.ema200.length > 0) {
        const ema200Series = chart.addLineSeries({
          color: '#fbbf24',
          lineWidth: 2,
          title: 'EMA 200',
        });
        const formattedEma200 = candles.map((c, idx) => ({
          time: c.time,
          value: indicators.ema200[idx],
        })).filter(e => e.value > 0);
        ema200Series.setData(formattedEma200);
      }

      // Overlay VWAP if enabled
      if (showVWAP && indicators.vwap.length > 0) {
        const vwapSeries = chart.addLineSeries({
          color: '#8b5cf6',
          lineWidth: 1.5,
          lineStyle: 1, // Dotted
          title: 'VWAP',
        });
        const formattedVWAP = candles.map((c, idx) => ({
          time: c.time,
          value: indicators.vwap[idx],
        })).filter(e => e.value > 0);
        vwapSeries.setData(formattedVWAP);
      }

      // Subscribe to Crosshair Movement
      chart.subscribeCrosshairMove((param: any) => {
        if (!param || !param.time) {
          setActiveCrosshair(null);
          return;
        }
        const candle = param.seriesData.get(candleSeries);
        if (candle) {
          setActiveCrosshair({
            time: param.time,
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
          });
        }
      });

      // Fit content
      chart.timeScale().fitContent();

      // Responsive resize observer
      const resizeObserver = new ResizeObserver((entries) => {
        if (entries[0] && chart) {
          chart.applyOptions({ width: entries[0].contentRect.width });
          chart.timeScale().fitContent();
        }
      });
      resizeObserver.observe(chartContainerRef.current);

      return () => {
        resizeObserver.disconnect();
        if (chart) {
          chart.remove();
        }
      };
    });

    return () => {
      if (chart) {
        chart.remove();
      }
    };
  }, [candles, showEMA20, showEMA200, showVWAP, indicators]);

  return (
    <div className="relative w-full bg-[#0c1017] border border-slate-800/80 rounded-2xl overflow-hidden p-4">
      {/* Top bar indicators */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-100 font-sans tracking-tight text-md">
            {selectedSymbol} <span className="font-mono text-xs text-slate-500">[{selectedTimeframe}]</span>
          </span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/50">
            Real-time Feed Ready
          </span>
        </div>

        {/* OHLC tooltip overlay */}
        <div className="flex gap-4 font-mono text-[11px] text-slate-400">
          {activeCrosshair ? (
            <>
              <span>O: <span className="text-white">${activeCrosshair.open?.toFixed(2)}</span></span>
              <span>H: <span className="text-emerald-400">${activeCrosshair.high?.toFixed(2)}</span></span>
              <span>L: <span className="text-rose-400">${activeCrosshair.low?.toFixed(2)}</span></span>
              <span>C: <span className="text-white">${activeCrosshair.close?.toFixed(2)}</span></span>
            </>
          ) : candles.length > 0 ? (
            <>
              <span>O: <span className="text-white">${candles[candles.length - 1].open?.toFixed(2)}</span></span>
              <span>H: <span className="text-emerald-400">${candles[candles.length - 1].high?.toFixed(2)}</span></span>
              <span>L: <span className="text-rose-400">${candles[candles.length - 1].low?.toFixed(2)}</span></span>
              <span>C: <span className="text-white">${candles[candles.length - 1].close?.toFixed(2)}</span></span>
            </>
          ) : null}
        </div>
      </div>

      {/* Loading Skeleton state or main workspace container */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-25 bg-[#0c1017]/90 flex flex-col items-center justify-center gap-3 rounded-lg h-[400px]">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            <span className="text-slate-400 text-xs font-semibold">Connecting exchange kline histories...</span>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-25 bg-[#0c1017]/90 flex flex-col items-center justify-center gap-3 rounded-lg h-[400px]">
            <AlertCircle className="w-8 h-8 text-rose-500" />
            <span className="text-rose-400 text-xs font-semibold">{error}</span>
          </div>
        )}

        {/* Dynamic Canvas Container */}
        <div ref={chartContainerRef} className="w-full bg-[#0c1017] h-[400px] rounded-lg overflow-hidden" />
      </div>
    </div>
  );
}
