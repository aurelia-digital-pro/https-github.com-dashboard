import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aurelia Pro — Pure Client-Side Trading Intelligence',
  description: 'Enterprise level Smart Money Concepts (SMC) tracking and portfolio vault simulations with Zero Server overhead.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#070b11] text-slate-100 min-h-screen antialiased selection:bg-cyan-500/30" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

