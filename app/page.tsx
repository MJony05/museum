'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const CanvasWrapper = dynamic(() => import('./components/CanvasWrapper'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
      }}
    >
      <p style={{ color: '#fff' }}>Loading museum...</p>
    </div>
  ),
});

export default function Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <main className="w-screen h-screen overflow-hidden">
      <CanvasWrapper />

      {/* Crosshair */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[999995] pointer-events-none">
        <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_4px_rgba(0,0,0,0.5)]" />
      </div>
    </main>
  );
}
