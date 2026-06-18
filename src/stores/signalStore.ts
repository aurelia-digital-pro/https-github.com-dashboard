'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SignalStoreState {
  watchlist: string[];
  alertLogs: { id: string; symbol: string; message: string; timestamp: string; type: 'info' | 'alarm' }[];
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  addAlertLog: (symbol: string, message: string, type?: 'info' | 'alarm') => void;
  clearAlertLogs: () => void;
}

export const useSignalStore = create<SignalStoreState>()(
  persist(
    (set) => ({
      watchlist: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'],
      alertLogs: [],
      addToWatchlist: (sym) => set((state) => {
        if (state.watchlist.includes(sym)) return {};
        return { watchlist: [...state.watchlist, sym] };
      }),
      removeFromWatchlist: (sym) => set((state) => ({
        watchlist: state.watchlist.filter(s => s !== sym),
      })),
      addAlertLog: (symbol, message, type = 'info') => set((state) => ({
        alertLogs: [
          {
            id: `alert-${Date.now()}-${Math.random()}`,
            symbol,
            message,
            timestamp: new Date().toLocaleTimeString(),
            type,
          },
          ...state.alertLogs.slice(0, 49), // Keep only last 50 alerts
        ],
      })),
      clearAlertLogs: () => set({ alertLogs: [] }),
    }),
    {
      name: 'aurelia_signal_storage',
    }
  )
);
