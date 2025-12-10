'use client';

import { Suspense, useEffect, useState } from 'react';
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
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <CanvasWrapper />

      {/* Crosshair */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 50,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'white',
            boxShadow: '0 0 4px rgba(0,0,0,0.5)',
          }}
        />
      </div>
    </main>
  );
}
