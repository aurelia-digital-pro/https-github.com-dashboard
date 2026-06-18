'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type NavPage = 'landing' | 'dashboard' | 'screener' | 'portfolio' | 'signals' | 'activate' | 'pricing';

interface UIState {
  activePage: NavPage;
  sidebarOpen: boolean;
  setActivePage: (page: NavPage) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      activePage: 'landing', // Starts on beautiful landing page
      sidebarOpen: true,
      setActivePage: (page) => set({ activePage: page }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: 'aurelia_ui_storage',
    }
  )
);
