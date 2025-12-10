'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import Canvas to prevent SSR issues
const CanvasWrapper = dynamic(() => import('./components/CanvasWrapper'), {
  ssr: false,
});

export default function Page() {
  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Suspense
        fallback={
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
        }
      >
        <CanvasWrapper />
      </Suspense>

      {/* Crosshair - fixed positioning */}
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
