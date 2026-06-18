'use client';

import React, { useEffect } from 'react';
import { useUIStore } from '../../stores/uiStore';
import Home from '../page';

export default function PricingSubPage() {
  const { setActivePage } = useUIStore();

  useEffect(() => {
    setActivePage('pricing');
  }, [setActivePage]);

  return <Home />;
}
