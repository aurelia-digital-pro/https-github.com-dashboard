'use client';

import React, { useEffect } from 'react';
import { useUIStore } from '../../stores/uiStore';
import Home from '../page';

export default function ScreenerSubPage() {
  const { setActivePage } = useUIStore();

  useEffect(() => {
    setActivePage('screener');
  }, [setActivePage]);

  return <Home />;
}
