'use client';

import { useGLTF } from '@react-three/drei';

export default function Museum() {
  const { scene } = useGLTF('/models/borjomi-glTF-n7-v2.glb');

  return <primitive object={scene} scale={1} />;
}

// Preload for better performance
useGLTF.preload('/models/borjomi-glTF-n7-v2.glb');
