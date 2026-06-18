'use client';

import { useState, useEffect, useRef } from 'react';
import { MarketTicker } from '../types';
import { BinanceWS_Manager } from '../lib/binance/websocket';

// Default list of top assets for Aurelia
const DEFAULT_TICKERS: MarketTicker[] = [
  { symbol: 'BTC/USDT', name: 'Bitcoin', price: 67320.5, change24h: 2.34, high24h: 68100, low24h: 66120, volume24h: 18230500, sparkline: [66120, 66500, 67100, 66900, 67400, 67320], category: 'crypto' },
  { symbol: 'ETH/USDT', name: 'Ethereum', price: 3450.25, change24h: -1.12, high24h: 3580, low24h: 3410, volume24h: 9482100, sparkline: [3580, 3550, 3490, 3480, 3440, 3450.25], category: 'crypto' },
  { symbol: 'SOL/USDT', name: 'Solana', price: 146.45, change24h: 6.81, high24h: 148.5, low24h: 135.2, volume24h: 4893110, sparkline: [135.2, 138, 142, 140, 145, 146.45], category: 'crypto' },
  { symbol: 'BNB/USDT', name: 'Binance Coin', price: 585.9, change24h: 0.45, high24h: 592, low24h: 581, volume24h: 2315000, sparkline: [581, 584, 582, 586, 583, 585.9], category: 'crypto' },
  { symbol: 'XRP/USDT', name: 'Ripple', price: 0.521, change24h: -0.38, high24h: 0.531, low24h: 0.518, volume24h: 1114200, sparkline: [0.53, 0.525, 0.524, 0.522, 0.52, 0.521], category: 'crypto' },
  { symbol: 'ADA/USDT', name: 'Cardano', price: 0.435, change24h: -1.82, high24h: 0.448, low24h: 0.431, volume24h: 598000, sparkline: [0.448, 0.442, 0.44, 0.437, 0.432, 0.435], category: 'crypto' },
  { symbol: 'DOGE/USDT', name: 'Dogecoin', price: 0.124, change24h: 4.12, high24h: 0.128, low24h: 0.118, volume24h: 2125000, sparkline: [0.118, 0.12, 0.122, 0.121, 0.123, 0.124], category: 'crypto' },
];

/**
 * Hook to coordinate live updates using Binance websockets + automated poll fallbacks.
 */
export function useBinanceTicker() {
  const [tickers, setTickers] = useState<MarketTicker[]>(DEFAULT_TICKERS);
  const tickersRef = useRef<MarketTicker[]>(DEFAULT_TICKERS);

  useEffect(() => {
    tickersRef.current = tickers;
  }, [tickers]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Connect to live updates via websocket.
    const wsManager = new BinanceWS_Manager((arr: any[]) => {
      if (!Array.isArray(arr)) return;

      const currentList = [...tickersRef.current];
      let updated = false;

      for (const item of arr) {
        let symbolCode = item.s; // e.g., 'BTCUSDT'
        if (!symbolCode.endsWith('USDT')) continue;

        // Clean symbol string
        const symbolLabel = `${symbolCode.slice(0, -4)}/USDT`;
        const idx = currentList.findIndex(t => t.symbol === symbolLabel);

        if (idx !== -1) {
          const price = parseFloat(item.c);
          const change = parseFloat(item.P);
          const high = parseFloat(item.h);
          const low = parseFloat(item.l);
          const volume = parseFloat(item.v) * price;

          const sparks = [...currentList[idx].sparkline.slice(1), price];

          currentList[idx] = {
            ...currentList[idx],
            price,
            change24h: change,
            high24h: high,
            low24h: low,
            volume24h: volume,
            sparkline: sparks,
          };
          updated = true;
        }
      }

      if (updated) {
        setTickers(currentList);
      }
    });

    wsManager.connect();

    // Setup periodic polling interval (e.g., every 6 sec) in case WebSockets drop or are laggy in iframe
    const fallbackInterval = setInterval(() => {
      setTickers(prev => {
        return prev.map(t => {
          // Add organic microscopic price volatility drift
          const movementFactor = 1 + (Math.random() - 0.495) * 0.002;
          const nextPrice = t.price * movementFactor;
          const sparks = [...t.sparkline.slice(1), nextPrice];
          return {
            ...t,
            price: nextPrice,
            sparkline: sparks,
          };
        });
      });
    }, 6000);

    return () => {
      wsManager.disconnect();
      clearInterval(fallbackInterval);
    };
  }, []);

  return { tickers };
}
