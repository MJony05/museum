'use client';

import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Stats, useProgress, Html } from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import dynamic from 'next/dynamic';
import { ExhibitData } from '../data/exhibits';

const Museum = dynamic(() => import('../scene/Museum'), { ssr: false });
const Player = dynamic(() => import('../scene/Player'), { ssr: false });

// Loading component that tracks actual progress
function LoadingOverlay() {
  const { active, progress } = useProgress();

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black">
      <div className="w-[200px] text-center text-white">
        <div className="text-2xl mb-5 font-bold">Loading Museum...</div>
        <div className="w-full h-1 bg-white/20 rounded-sm overflow-hidden">
          <div
            className="h-full bg-cyan-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2.5 text-sm">{Math.round(progress)}%</div>
      </div>
    </div>
  );
}

export default function CanvasWrapper() {
  const [selectedCard, setSelectedCard] = useState<ExhibitData | null>(null);

  useEffect(() => {
    if (selectedCard) {
      document.exitPointerLock();
    }
  }, [selectedCard]);

  return (
    <>
      <LoadingOverlay />
      <Canvas camera={{ fov: 75, position: [0, 1.6, 5] }} shadows>
        <Suspense fallback={null}>
          <Museum OnCardClickAction={setSelectedCard} />
          <Player isModalOpen={!!selectedCard} />
          <Environment files="/textures/newbg2.jpg" background />

          <EffectComposer>
            <Bloom
              intensity={0.5}
              luminanceThreshold={0.6}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            <Noise
              premultiply
              blendFunction={BlendFunction.ADD}
              opacity={0.03}
            />
            <Vignette eskil={false} offset={0.1} darkness={0.6} />
          </EffectComposer>

          <Stats />
        </Suspense>
      </Canvas>

      {/* Modal */}
      {selectedCard && (
        <div
          className="fixed inset-0 bg-black/85 flex items-center justify-center z-[999999] cursor-default"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="flex relative w-[90%] max-w-[1200px] max-h-[90vh] rounded-[20px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full border-none bg-white text-2xl cursor-pointer flex items-center justify-center z-10 shadow-[0_2px_8px_rgba(0,0,0,0.2)] transition-transform duration-200 hover:scale-110"
            >
              ×
            </button>

            <div className="flex-none w-[45%] rounded-l-[20px] p-[60px_40px] flex flex-col items-center justify-center text-white bg-gradient-to-br from-[#1e3c72] to-[#2a5298]">
              <div
                className="w-[300px] h-[300px] rounded-[20px] mb-[30px] border-[5px] border-white/20 bg-center bg-cover bg-[#2a5298]"
                style={{ backgroundImage: `url(${selectedCard.image})` }}
              />
              <h2 className="text-[28px] my-2.5 text-center">
                {selectedCard.subtitle}
              </h2>
            </div>

            <div className="flex-1 p-[60px_50px] overflow-y-auto">
              <h1 className="text-[42px] font-bold mb-[30px] text-[#1e3c72]">
                {selectedCard.title}
              </h1>

              <div className="text-lg leading-[1.8] text-[#333] whitespace-pre-line">
                {selectedCard.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
