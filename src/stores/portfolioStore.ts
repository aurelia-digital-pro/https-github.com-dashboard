'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Trade } from '../types';

interface PortfolioState {
  balance: number;
  trades: Trade[];
  addTrade: (trade: Omit<Trade, 'id' | 'pnL' | 'pnlPercent' | 'status'>) => void;
  closeTrade: (id: string, exitPrice: number) => void;
  deleteTrade: (id: string) => void;
  importBackup: (backup: { balance: number; trades: Trade[] }) => void;
  resetPortfolio: () => void;
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      balance: 10000,
      trades: [],
      addTrade: (t) => set((state) => {
        const id = `trade-${Date.now()}`;
        const newTrade: Trade = {
          ...t,
          id,
          status: 'OPEN',
          pnL: 0,
          pnlPercent: 0,
        };
        return {
          trades: [newTrade, ...state.trades],
        };
      }),
      closeTrade: (id, exitPrice) => set((state) => {
        const updated = state.trades.map((t) => {
          if (t.id === id && t.status === 'OPEN') {
            const isLong = t.direction === 'LONG';
            const priceDiff = isLong ? exitPrice - t.entryPrice : t.entryPrice - exitPrice;
            const pnlPercent = (priceDiff / t.entryPrice) * 100;
            const pnL = priceDiff * t.quantity;

            return {
              ...t,
              status: 'CLOSED' as const,
              exitPrice,
              pnL,
              pnlPercent,
            };
          }
          return t;
        });

        // Add PnL to cash balance
        const closedTrade = state.trades.find(t => t.id === id);
        let balanceCredit = 0;
        if (closedTrade) {
          const isLong = closedTrade.direction === 'LONG';
          const diff = isLong ? exitPrice - closedTrade.entryPrice : closedTrade.entryPrice - exitPrice;
          balanceCredit = diff * closedTrade.quantity;
        }

        return {
          trades: updated,
          balance: state.balance + balanceCredit,
        };
      }),
      deleteTrade: (id) => set((state) => ({
        trades: state.trades.filter((t) => t.id !== id),
      })),
      importBackup: (backup) => set({
        balance: backup.balance,
        trades: backup.trades,
      }),
      resetPortfolio: () => set({ balance: 10000, trades: [] }),
    }),
    {
      name: 'aurelia_portfolio_storage',
    }
  )
);
