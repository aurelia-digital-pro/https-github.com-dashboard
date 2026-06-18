'use client';

import React, { useEffect } from 'react';
import { useUIStore } from '../../stores/uiStore';
import Home from '../page';

export default function DashboardSubPage() {
  const { setActivePage } = useUIStore();

  useEffect(() => {
    setActivePage('dashboard');
  }, [setActivePage]);

  return <Home />;
}
