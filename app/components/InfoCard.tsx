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
          className={`w-[310px] h-[180px] rounded-xl p-6 transition-all duration-200 pointer-events-none backdrop-blur-md border-2
            ${
              isHovered
                ? 'bg-[rgba(0,220,220,1)] shadow-[0_12px_40px_rgba(0,255,255,0.5)] scale-108 border-white'
                : 'bg-[rgba(0,200,200,0.95)] shadow-[0_8px_32px_rgba(0,206,209,0.3)] scale-100 border-transparent'
            }`}
        >
          <div className="relative">
            <h1 className="text-4xl font-bold text-white leading-tight uppercase tracking-widest m-0">
              {title}
            </h1>
          </div>
        </div>
      </Html>
    </group>
  );
}
