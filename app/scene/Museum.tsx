'use client';

import { useGLTF, Html } from '@react-three/drei';
import { useEffect } from 'react';
import * as THREE from 'three';
import Umumtexnik from './exhibits/Umumtexnik';
import Rektor from './exhibits/Rektor';

export default function Museum() {
  const { scene } = useGLTF('/models/borjomi-glTF-n7-v2.glb');

  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const child = obj as THREE.Mesh;
        const name = child.name.toLowerCase();

        if (name.includes('obj_000068') || name.includes('obj_000069')) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#cccccc'),
            roughness: 0.5,
            metalness: 0.1,
          });
        }

        if (name.includes('glass')) {
          child.material = new THREE.MeshPhysicalMaterial({
            transmission: 0.95,
            transparent: true,
            roughness: 0.05,
            metalness: 0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05,
            thickness: 1.0,
            envMapIntensity: 2.0,
            ior: 1.5,
            color: new THREE.Color('#e8f4f8'),
            side: THREE.DoubleSide,
          });
        }

        if (name.includes('water')) {
          child.material = new THREE.MeshPhysicalMaterial({
            transmission: 0.9,
            transparent: true,
            roughness: 0.1,
            metalness: 0,
            thickness: 0.5,
            envMapIntensity: 1.5,
            ior: 1.33,
            color: new THREE.Color('#88ccdd'),
            side: THREE.DoubleSide,
          });
        }

        if (name.includes('hologram')) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#00aaaa'),
            emissive: new THREE.Color('#00aaaa'),
            emissiveIntensity: 0.8,
            metalness: 0.3,
            roughness: 0.2,
          });
        }

        if (name.includes('light')) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#aaaaaa'),
            emissive: new THREE.Color('#008888'),
            emissiveIntensity: 0.5,
          });
        }
      }
    });
  }, [scene]);

  return (
    <>
      <primitive object={scene} scale={1} />

      {/* Smaller card to fit the display */}
      <Rektor />
      <Umumtexnik />
    </>
  );
}

useGLTF.preload('/models/borjomi-glTF-n7-v2.glb');
