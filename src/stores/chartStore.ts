'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChartState {
  showEMA20: boolean;
  showEMA50: boolean;
  showEMA200: boolean;
  showBB: boolean;
  showVWAP: boolean;
  activeIndicator: 'RSI' | 'MACD' | 'STOCH' | 'NONE';
  drawings: any[];
  toggleEMA20: () => void;
  toggleEMA50: () => void;
  toggleEMA200: () => void;
  toggleBB: () => void;
  toggleVWAP: () => void;
  setActiveIndicator: (ind: 'RSI' | 'MACD' | 'STOCH' | 'NONE') => void;
  addDrawing: (drawing: any) => void;
  clearDrawings: () => void;
}

export const useChartStore = create<ChartState>()(
  persist(
    (set) => ({
      showEMA20: true,
      showEMA50: false,
      showEMA200: true,
      showBB: false,
      showVWAP: true,
      activeIndicator: 'RSI',
      drawings: [],
      toggleEMA20: () => set((state) => ({ showEMA20: !state.showEMA20 })),
      toggleEMA50: () => set((state) => ({ showEMA50: !state.showEMA50 })),
      toggleEMA200: () => set((state) => ({ showEMA200: !state.showEMA200 })),
      toggleBB: () => set((state) => ({ showBB: !state.showBB })),
      toggleVWAP: () => set((state) => ({ showVWAP: !state.showVWAP })),
      setActiveIndicator: (ind) => set({ activeIndicator: ind }),
      addDrawing: (drawing) => set((state) => ({ 
        drawings: [...state.drawings, { ...drawing, timestamp: Date.now() }] 
      })),
      clearDrawings: () => set({ drawings: [] }),
    }),
    {
      name: 'aurelia_chart_storage',
    }
  )
);
