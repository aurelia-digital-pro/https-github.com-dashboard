'use client';

import React, { useEffect } from 'react';
import { useUIStore } from '../../stores/uiStore';
import Home from '../page';

export default function SignalsSubPage() {
  const { setActivePage } = useUIStore();

  useEffect(() => {
    setActivePage('signals');
  }, [setActivePage]);

  return <Home />;
}
