'use client';

import { useGLTF, Html } from '@react-three/drei';
import { useEffect, useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function Museum({
  OnCardClick,
}: {
  OnCardClick: (cardData: {}) => void;
}) {
  const { scene } = useGLTF('/models/borjomi-glTF-n7-v2.glb');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const { camera } = useThree();
  const cardMeshes = useRef<{ [key: string]: THREE.Mesh }>({});

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

  // Handle click events
  useEffect(() => {
    const handleClick = () => {
      if (hoveredCard) {
        const cardData = cardDataList[hoveredCard as keyof typeof cardDataList];
        if (cardData) {
          OnCardClick(cardData); // Pass card data to parent
        }
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [hoveredCard, OnCardClick]);

  // Raycast from center of screen every frame
  useFrame(() => {
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(10);
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

    const meshArray = Object.values(cardMeshes.current);
    const intersects = raycaster.intersectObjects(meshArray, false);

    if (intersects.length > 0) {
      const intersectedMesh = intersects[0].object;
      const cardKey = Object.keys(cardMeshes.current).find(
        (key) => cardMeshes.current[key] === intersectedMesh
      );
      if (cardKey && cardKey !== hoveredCard) {
        setHoveredCard(cardKey);
      }
    } else {
      if (hoveredCard !== null) {
        setHoveredCard(null);
      }
    }
  });

  const InfoCard = ({
    position,
    title,
    rotation = [0, 0, 0],
    cardKey,
  }: {
    position: [number, number, number];
    title: string;
    rotation?: [number, number, number];
    cardKey: string;
  }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useEffect(() => {
      if (meshRef.current) {
        meshRef.current.layers.set(10);
        cardMeshes.current[cardKey] = meshRef.current;
      }
      return () => {
        delete cardMeshes.current[cardKey];
      };
    }, [cardKey]);

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
            style={{
              width: '310px',
              height: '180px',
              background: isHovered
                ? 'rgba(0, 220, 220, 1)'
                : 'rgba(0, 200, 200, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: isHovered
                ? '0 12px 40px rgba(0, 255, 255, 0.5)'
                : '0 8px 32px rgba(0, 206, 209, 0.3)',
              transition: 'all 0.2s',
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              border: isHovered ? '2px solid white' : '2px solid transparent',
              pointerEvents: 'none',
            }}
          >
            <div style={{ position: 'relative' }}>
              <h1
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: 'white',
                  lineHeight: '1.2',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  margin: 0,
                }}
              >
                {title}
              </h1>
            </div>
          </div>
        </Html>
      </group>
    );
  };

  const cardDataList = {
    rektor: {
      title: 'UNIVERSITET REKTORI',
      subtitle: 'Prof. Dexkanov Suxrob',
      image: '/images/rektor.jpg',
      content: `Professor Dexkanov Suxrob Osiyo xalqaro universitetining rektori.

Beijing Language and Culture University (bakalavr) (2012-2016)
Herriot Watt University (magistr) Biznes administratsiya (MBA) (2020-2021)`,
    },
    umumtexnik: {
      title: '',
      subtitle: 'Umumtexnik fanlar kafedrasi',
      image: '/images/umumtexnik_logo.jpg',
      content: `Kafedrada 2 yo‘nalishlar bo‘yicha talabalar tahsil olib boriyapti:

– 60610100-Kompyuter ilmlari va dasturlash texnologiyalari (yo’nalishlar bo’yicha)

– 60721500-Konchilik ishi (faoliyat turlari bo’yicha)

Kafedrada mutaxasislik yo‘nalishlardan tashqari tabiiy (fizika) va aniq (matematika) fanlardan professor-o‘qituvchilar faoliyat olib bormoqda.`,
    },
  };

  return (
    <>
      <primitive object={scene} scale={1} />

      <InfoCard
        position={[0, 1.1, -22]}
        title="UNIVERSITET REKTORI"
        cardKey="rektor"
        rotation={[0, 0, 0]}
      />

      <InfoCard
        position={[-11, 1.1, -19]}
        title="Umumtexnik fanlar"
        rotation={[0, 0.3, 0]}
        cardKey="umumtexnik"
      />
    </>
  );
}

useGLTF.preload('/models/borjomi-glTF-n7-v2.glb');
