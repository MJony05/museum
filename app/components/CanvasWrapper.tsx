'use client';

import { Suspense, useState, useEffect } from 'react';
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

const Museum = dynamic(() => import('../scene/Museum'), { ssr: false });
const Player = dynamic(() => import('../scene/Player'), { ssr: false });

export default function CanvasWrapper() {
  const [selectedCard, setSelectedCard] = useState<any>(null);

  // Disable pointer lock when modal is open
  useEffect(() => {
    if (selectedCard) {
      document.exitPointerLock();
    }
  }, [selectedCard]);

  return (
    <>
      <Canvas camera={{ fov: 75, position: [0, 1.6, 5] }} shadows>
        <Suspense fallback={null}>
          <Museum OnCardClick={setSelectedCard} />
          <Player isModalOpen={!!selectedCard} />
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

      {/* Modal */}
      {selectedCard && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            cursor: 'default',
          }}
          onClick={() => setSelectedCard(null)}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              borderRadius: '20px',
              maxWidth: '1200px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              position: 'relative',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedCard(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: 'none',
                background: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = 'scale(1.1)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = 'scale(1)')
              }
            >
              ×
            </button>

            {/* Left side - Image */}
            <div
              style={{
                flex: '0 0 45%',
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                borderRadius: '20px 0 0 20px',
                padding: '60px 40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <div
                style={{
                  width: '300px',
                  height: '300px',
                  borderRadius: '20px',
                  background: `url(${selectedCard.image}) center/cover`,
                  backgroundColor: '#2a5298',
                  marginBottom: '30px',
                  border: '5px solid rgba(255, 255, 255, 0.2)',
                }}
              />
              <h2
                style={{
                  fontSize: '28px',
                  margin: '10px 0',
                  textAlign: 'center',
                }}
              >
                {selectedCard.subtitle}
              </h2>
            </div>

            {/* Right side - Content */}
            <div style={{ flex: '1', padding: '60px 50px', overflowY: 'auto' }}>
              <h1
                style={{
                  fontSize: '42px',
                  fontWeight: 'bold',
                  marginBottom: '30px',
                  color: '#1e3c72',
                }}
              >
                {selectedCard.title}
              </h1>

              <div
                style={{
                  fontSize: '18px',
                  lineHeight: '1.8',
                  color: '#333',
                  whiteSpace: 'pre-line',
                }}
              >
                {selectedCard.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
