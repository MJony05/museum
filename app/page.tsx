'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Stats } from '@react-three/drei';

// Lazy-load big 3D bits so the page mounts fast
const Museum = dynamic(() => import('./scene/Museum'), { ssr: false });
const Player = dynamic(() => import('./scene/Player'), { ssr: false });

export default function Page() {
  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Canvas
        style={{ background: '#dce3f0' }}
        camera={{ fov: 75, position: [0, 1.6, 5] }} // ~eye height 1.6m
        shadows
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

          {/* Scene */}
          <Museum />

          {/* First-person controls + WASD movement */}
          <Player />
          <Environment files="/textures/newHdr.hdr" background />
          {/* Optional: quick global env/reflections */}
          <Environment preset="city" />
        </Suspense>

        {/* Optional debug overlay (FPS, draw calls) */}
        <Stats />
      </Canvas>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
        <div className="w-2 h-2 rounded-full bg-white"></div>
      </div>
    </main>
  );
}
