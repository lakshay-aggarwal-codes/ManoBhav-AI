'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// A sparse point-cloud sphere with a slow independent inner core rotation.
// Kept intentionally lightweight (single geometry, no postprocessing) so the
// hero section stays fast on low-end and mobile devices.
function ParticleCore() {
  const outerRef = useRef(null);
  const innerRef = useRef(null);

  const outerPositions = useMemo(() => {
    const count = 900;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.2 + Math.random() * 0.15;
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * Math.PI * 2;
      positions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = r * Math.cos(theta);
    }
    return positions;
  }, []);

  const innerPositions = useMemo(() => {
    const count = 260;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.3 * Math.cbrt(Math.random());
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * Math.PI * 2;
      positions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = r * Math.cos(theta);
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (outerRef.current) {
      outerRef.current.rotation.y += delta * 0.06;
      outerRef.current.rotation.x += delta * 0.015;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.12;
    }
  });

  return (
    <group>
      <points ref={outerRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={outerPositions.length / 3}
            array={outerPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.028} color="#6c63ff" transparent opacity={0.75} sizeAttenuation />
      </points>

      <points ref={innerRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={innerPositions.length / 3}
            array={innerPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.022} color="#38d9c9" transparent opacity={0.9} sizeAttenuation />
      </points>

      <mesh>
        <sphereGeometry args={[1.05, 32, 32]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.05} />
      </mesh>
    </group>
  );
}

export default function EmotionSphere() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.6} />
      <ParticleCore />
    </Canvas>
  );
}
