'use client';

import { useState, useEffect, useCallback } from 'react';
import { Candle } from '../types';
import { fetchHistoricalKlines } from '../lib/binance/client';

/**
 * Hook to retrieve candlestick histories for a symbol and timeframe.
 */
export function useBinanceKlines(symbol: string, timeframe: string, limit: number = 200) {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadKlines = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHistoricalKlines(symbol, timeframe, limit);
      if (data.length > 0) {
        setCandles(data);
      } else {
        throw new Error('Zero historical candles available');
      }
    } catch (e: any) {
      setError(e?.message || 'Failed downloading candles');
    } finally {
      setLoading(false);
    }
  }, [symbol, timeframe, limit]);

  useEffect(() => {
    let active = true;
    const task = setTimeout(() => {
      if (active) {
        loadKlines();
      }
    }, 0);
    return () => {
      active = false;
      clearTimeout(task);
    };
  }, [loadKlines]);

  return {
    candles,
    loading,
    error,
    refresh: loadKlines,
  };
}
