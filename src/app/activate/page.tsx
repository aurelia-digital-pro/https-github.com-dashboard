'use client';

import React, { useEffect } from 'react';
import { useUIStore } from '../../stores/uiStore';
import Home from '../page';

export default function ActivateSubPage() {
  const { setActivePage } = useUIStore();

  useEffect(() => {
    setActivePage('activate');
  }, [setActivePage]);

  return <Home />;
}
