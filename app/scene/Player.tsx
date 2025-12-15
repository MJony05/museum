'use client';

import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';

export default function Player({ isModalOpen }: { isModalOpen: boolean }) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const moveState = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  // Unlock pointer when modal opens
  useEffect(() => {
    if (isModalOpen && controlsRef.current) {
      controlsRef.current.unlock();
    }
  }, [isModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
          moveState.current.forward = true;
          break;
        case 'KeyS':
          moveState.current.backward = true;
          break;
        case 'KeyA':
          moveState.current.left = true;
          break;
        case 'KeyD':
          moveState.current.right = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
          moveState.current.forward = false;
          break;
        case 'KeyS':
          moveState.current.backward = false;
          break;
        case 'KeyA':
          moveState.current.left = false;
          break;
        case 'KeyD':
          moveState.current.right = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!controlsRef.current || isModalOpen) return;

    const speed = 5;
    velocity.current.set(0, 0, 0);

    if (moveState.current.forward) velocity.current.z -= speed * delta;
    if (moveState.current.backward) velocity.current.z += speed * delta;
    if (moveState.current.left) velocity.current.x -= speed * delta;
    if (moveState.current.right) velocity.current.x += speed * delta;

    controlsRef.current.moveRight(velocity.current.x);
    controlsRef.current.moveForward(-velocity.current.z);
  });

  return (
    <PointerLockControls
      ref={controlsRef}
      enabled={!isModalOpen} // Disable controls when modal is open
    />
  );
}
