'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Timeframe } from '../types';

interface MarketState {
  selectedSymbol: string;
  selectedTimeframe: Timeframe;
  setSelectedSymbol: (symbol: string) => void;
  setSelectedTimeframe: (tf: Timeframe) => void;
}

export const useMarketStore = create<MarketState>()(
  persist(
    (set) => ({
      selectedSymbol: 'BTC/USDT',
      selectedTimeframe: '1h',
      setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
      setSelectedTimeframe: (tf) => set({ selectedTimeframe: tf }),
    }),
    {
      name: 'aurelia_market_storage',
    }
  )
);
