'use client';

import { useGLTF, Html } from '@react-three/drei';
import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

export default function Museum() {
  const { scene } = useGLTF('/models/borjomi-glTF-n7-v2.glb');
  const [selectedExhibit, setSelectedExhibit] = useState(null);
  const [hoveredExhibit, setHoveredExhibit] = useState(null);
  const { camera, raycaster } = useThree();
  const exhibitMeshes = useRef([]);

  // Define all 11 exhibits with their positions, titles, and detailed information
  const exhibits = [
    {
      position: [0, 1.1, -22],
      title: 'UMUMTEXNIK\nFANLAR',
      description:
        'This exhibit showcases the fundamental principles of general technical sciences.',
      details:
        'Explore the foundations of engineering, mathematics, and physics that power modern technology. Interactive displays demonstrate key concepts in mechanics, thermodynamics, and materials science.',
      image: '/images/exhibit1.jpg', // Optional: add image path
    },
    {
      position: [15, 1.1, -15],
      title: 'EXHIBIT\nTWO',
      description: 'Discover the innovations in this remarkable collection.',
      details:
        'A comprehensive look at technological breakthroughs and their impact on society. Features historical artifacts and modern interpretations of classic designs.',
      image: '/images/exhibit2.jpg',
    },
    {
      position: [-15, 1.1, -15],
      title: 'EXHIBIT\nTHREE',
      description: 'Experience the evolution of technology.',
      details:
        'Journey through time to see how innovations have shaped our world. From early mechanical devices to cutting-edge digital systems.',
      image: '/images/exhibit3.jpg',
    },
    {
      position: [20, 1.1, 0],
      title: 'EXHIBIT\nFOUR',
      description: 'Interactive displays of modern engineering.',
      details:
        'Hands-on exhibits that demonstrate the principles of contemporary engineering practices and their real-world applications.',
      image: '/images/exhibit4.jpg',
    },
    {
      position: [-20, 1.1, 0],
      title: 'EXHIBIT\nFIVE',
      description: 'The art and science of innovation.',
      details:
        'Where creativity meets technical precision. Explore how artistic vision and scientific rigor combine to create groundbreaking solutions.',
      image: '/images/exhibit5.jpg',
    },
    {
      position: [15, 1.1, 15],
      title: 'EXHIBIT\nSIX',
      description: 'Sustainable technologies for tomorrow.',
      details:
        'Learn about green technologies and sustainable practices that are shaping our future. Interactive models show renewable energy systems in action.',
      image: '/images/exhibit6.jpg',
    },
    {
      position: [-15, 1.1, 15],
      title: 'EXHIBIT\nSEVEN',
      description: 'Digital revolution and beyond.',
      details:
        'Trace the development of computing from early calculators to quantum computers. See how digital technology has transformed every aspect of our lives.',
      image: '/images/exhibit7.jpg',
    },
    {
      position: [0, 1.1, 22],
      title: 'EXHIBIT\nEIGHT',
      description: 'Aerospace and exploration.',
      details:
        'From the first flights to space exploration, discover the technology that allows us to soar above the clouds and beyond our planet.',
      image: '/images/exhibit8.jpg',
    },
    {
      position: [10, 1.1, -8],
      title: 'EXHIBIT\nNINE',
      description: 'Materials of the future.',
      details:
        'Explore advanced materials that are revolutionizing industries. From carbon nanotubes to smart polymers, see the building blocks of tomorrow.',
      image: '/images/exhibit9.jpg',
    },
    {
      position: [-10, 1.1, -8],
      title: 'EXHIBIT\nTEN',
      description: 'Robotics and automation.',
      details:
        'Meet the robots that are changing manufacturing, healthcare, and daily life. Understand AI and machine learning through interactive demonstrations.',
      image: '/images/exhibit10.jpg',
    },
    {
      position: [0, 1.1, 8],
      title: 'EXHIBIT\nELEVEN',
      description: 'Communication technologies.',
      details:
        'From telegraph to 5G and beyond, explore how we connect across the globe. Learn about fiber optics, satellites, and the future of communication.',
      image: '/images/exhibit11.jpg',
    },
  ];

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

    // Handle click on center crosshair
    const handleClick = () => {
      if (hoveredExhibit !== null) {
        setSelectedExhibit(exhibits[hoveredExhibit]);
      }
    };

    // Handle ESC key to close modal
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedExhibit) {
        setSelectedExhibit(null);
      }
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [scene, hoveredExhibit, selectedExhibit]);

  // Raycast from camera center to detect hovered exhibit
  useFrame(() => {
    if (selectedExhibit) return; // Don't raycast when modal is open

    raycaster.setFromCamera({ x: 0, y: 0 }, camera);
    const intersects = raycaster.intersectObjects(exhibitMeshes.current, true);

    if (intersects.length > 0) {
      const index = exhibitMeshes.current.findIndex(
        (mesh) =>
          mesh === intersects[0].object || intersects[0].object.parent === mesh
      );
      setHoveredExhibit(index !== -1 ? index : null);
    } else {
      setHoveredExhibit(null);
    }
  });

  return (
    <>
      <primitive object={scene} scale={1} />

      {/* Invisible clickable meshes for exhibits */}
      {exhibits.map((exhibit, index) => (
        <mesh
          key={`clickable-${index}`}
          position={exhibit.position}
          ref={(el) => {
            if (el) exhibitMeshes.current[index] = el;
          }}
        >
          <boxGeometry args={[3, 2, 0.5]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      ))}

      {/* Exhibit Cards */}
      {exhibits.map((exhibit, index) => (
        <Html
          key={index}
          position={exhibit.position}
          distanceFactor={5}
          transform
          occlude
        >
          <div
            style={{
              width: '300px',
              height: '180px',
              background:
                hoveredExhibit === index
                  ? 'rgba(0, 220, 220, 0.85)'
                  : 'rgba(0, 200, 200, 0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '24px',
              boxShadow:
                hoveredExhibit === index
                  ? '0 12px 40px rgba(0, 206, 209, 0.6)'
                  : '0 8px 32px rgba(0, 206, 209, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: hoveredExhibit === index ? 'scale(1.08)' : 'scale(1)',
              border:
                hoveredExhibit === index
                  ? '3px solid rgba(255, 255, 255, 0.8)'
                  : 'none',
              pointerEvents: 'auto',
            }}
          >
            <div className="relative">
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
                {exhibit.title.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < exhibit.title.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </h1>
              <div
                style={{
                  position: 'absolute',
                  bottom: '-12px',
                  left: '0',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: 'white',
                  opacity: 0.8,
                }}
              />
              {hoveredExhibit === index && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-50px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    color: '#00c8c8',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  Click to view details
                </div>
              )}
            </div>
          </div>
        </Html>
      ))}

      {/* Modal */}
      {selectedExhibit && (
        <Html fullscreen>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              backdropFilter: 'blur(5px)',
            }}
          >
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(0, 200, 200, 0.95) 0%, rgba(0, 150, 150, 0.95) 100%)',
                borderRadius: '20px',
                padding: '40px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto',
                boxShadow: '0 20px 60px rgba(0, 206, 209, 0.4)',
                position: 'relative',
              }}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedExhibit(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  fontSize: '24px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                ×
              </button>

              {/* Modal content */}
              <h2
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '20px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  lineHeight: '1.2',
                }}
              >
                {selectedExhibit.title.replace('\n', ' ')}
              </h2>

              <p
                style={{
                  fontSize: '20px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '20px',
                  fontWeight: '500',
                }}
              >
                {selectedExhibit.description}
              </p>

              <div
                style={{
                  width: '60px',
                  height: '4px',
                  background: 'white',
                  marginBottom: '20px',
                  opacity: 0.7,
                }}
              />

              <p
                style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.85)',
                  lineHeight: '1.6',
                  marginBottom: '30px',
                }}
              >
                {selectedExhibit.details}
              </p>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setSelectedExhibit(null)}
                  style={{
                    background: 'white',
                    color: '#00c8c8',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 32px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Close
                </button>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 16px',
                  }}
                >
                  Press ESC to close
                </div>
              </div>
            </div>
          </div>
        </Html>
      )}
    </>
  );
}

useGLTF.preload('/models/borjomi-glTF-n7-v2.glb');
