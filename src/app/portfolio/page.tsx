'use client';

import React, { useEffect } from 'react';
import { useUIStore } from '../../stores/uiStore';
import Home from '../page';

export default function PortfolioSubPage() {
  const { setActivePage } = useUIStore();

  useEffect(() => {
    setActivePage('portfolio');
  }, [setActivePage]);

  return <Home />;
}
