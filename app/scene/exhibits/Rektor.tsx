import { Html } from '@react-three/drei';
import Image from 'next/image';
import React from 'react';

export default function Rektor() {
  return (
    <Html position={[0, 1.2, -22]} distanceFactor={5} transform occlude>
      <div
        style={{
          width: '310px', // Reduced from 600px
          height: '190px', // Reduced from 280px
          background: 'rgba(0, 200, 200)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 206, 209, 0.3)',
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
            UNIVERSITET
            <br />
            REKTORI
          </h1>
          <Image
            src="/images/rektor.jpg"
            width={100}
            height={400}
            alt="rektor"
          />
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
        </div>
      </div>
    </Html>
  );
}
