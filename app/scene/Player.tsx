'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';

export default function Player() {
  const controlsRef = useRef<any>(null);
  const keysRef = useRef({
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false,
    ShiftLeft: false,
  });

  // Keep camera at eye height (optional)
  const { camera } = useThree();
  useEffect(() => {
    camera.position.y = 1.6; // ~eye height
  }, [camera]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code in keysRef.current)
        keysRef.current[e.code as keyof typeof keysRef.current] = true;
    };
    const up = (e: KeyboardEvent) => {
      if (e.code in keysRef.current)
        keysRef.current[e.code as keyof typeof keysRef.current] = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls || !controls.isLocked) return;

    // Movement speed (m/s)
    const base = 2.5;
    const sprint = 4.5;
    const speed = (keysRef.current.ShiftLeft ? sprint : base) * delta;

    // Forward/back
    const forward =
      (keysRef.current.KeyW ? 1 : 0) - (keysRef.current.KeyS ? 1 : 0);
    if (forward !== 0) controls.moveForward(forward * speed);

    // Strafe
    const strafe =
      (keysRef.current.KeyD ? 1 : 0) - (keysRef.current.KeyA ? 1 : 0);
    if (strafe !== 0) controls.moveRight(strafe * speed);

    // Keep constant eye height if your model has flat floors
    controls.getObject().position.y = 1.6;
  });

  // Click inside canvas to lock mouse; press ESC to release
  return <PointerLockControls ref={controlsRef} />;
}
