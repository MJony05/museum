'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Stats } from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Noise,
  Vignette,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import dynamic from 'next/dynamic';

// Lazy-load components
const Museum = dynamic(() => import('../scene/Museum'), { ssr: false });
const Player = dynamic(() => import('../scene/Player'), { ssr: false });

export default function Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
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
    );
  }

  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Canvas camera={{ fov: 75, position: [0, 1.6, 5] }} shadows>
        <Suspense fallback={null}>
          <Museum />
          <Player />
          <Environment files="/textures/newHdr.hdr" background />
          <Environment preset="city" />
        </Suspense>

        <EffectComposer>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <DepthOfField
            focusDistance={0.02}
            focalLength={0.02}
            bokehScale={2}
            height={480}
          />
          <Noise premultiply blendFunction={BlendFunction.ADD} opacity={0.05} />
          <Vignette eskil={false} offset={0.1} darkness={0.5} />
        </EffectComposer>

        <Stats />
      </Canvas>

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
