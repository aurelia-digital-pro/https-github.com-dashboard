'use client';

import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface ShellProps {
  children: React.ReactNode;
}

export default function DashboardShell({ children }: ShellProps) {
  return (
    <div className="min-h-screen bg-[#050507] text-zinc-100 flex flex-col font-sans antialiased selection:bg-blue-500/30">
      {/* Top Main Navbar */}
      <Navbar />

      <div className="flex flex-1 relative">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Dynamic page client window viewport */}
        <main className="flex-1 min-w-0 bg-[#050507] flex flex-col relative overflow-y-auto">
          <div className="flex-1 p-6 md:p-8">
            {children}
          </div>
          
          {/* Base DisclaimersFooter */}
          <Footer />
        </main>
      </div>
    </div>
  );
}
