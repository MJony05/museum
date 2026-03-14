import { useEffect, useRef } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface InfoCardProps {
  position: [number, number, number];
  title: string;
  rotation?: [number, number, number];
  cardKey: string;
  hoveredCard: string | null;
  registerCardMesh: (key: string, mesh: THREE.Mesh) => void;
  unregisterCardMesh: (key: string) => void;
}

export default function InfoCard({
  position,
  title,
  rotation = [0, 0, 0],
  cardKey,
  hoveredCard,
  registerCardMesh,
  unregisterCardMesh,
}: InfoCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.layers.set(10);
      registerCardMesh(cardKey, meshRef.current);
    }
    return () => {
      unregisterCardMesh(cardKey);
    };
  }, [cardKey, registerCardMesh, unregisterCardMesh]);

  const isHovered = hoveredCard === cardKey;

  return (
    <group position={position} rotation={rotation}>
      <mesh ref={meshRef}>
        <planeGeometry args={[3.1, 1.8]} />
        <meshBasicMaterial
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <Html
        center
        distanceFactor={5}
        transform
        occlude
        zIndexRange={[0, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div
          className={`w-[320px] h-[180px] rounded-2xl p-6 transition-all duration-300 pointer-events-none backdrop-blur-xl border flex flex-col justify-center items-center text-center
            ${
              isHovered
                ? 'bg-black/70 shadow-[0_8px_32px_rgba(0,0,0,0.5)] scale-105 border-white/50 text-cyan-300'
                : 'bg-black/30 shadow-[0_4px_16px_rgba(0,0,0,0.2)] scale-100 border-white/10 text-white'
            }`}
        >
          <div className="relative">
            <h1 className="text-3xl font-bold leading-tight uppercase tracking-wider m-0 drop-shadow-md">
              {title}
            </h1>
          </div>
        </div>
      </Html>
    </group>
  );
}
