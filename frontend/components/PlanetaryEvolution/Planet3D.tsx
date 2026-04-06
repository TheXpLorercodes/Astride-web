'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Biome } from '../../utils/physicsEvolution';

interface PlanetProps {
  biome: Biome;
  mass: number;
}

function PlanetSphere({ biome, mass }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  const materialProps = useMemo(() => {
    switch (biome) {
      case 'Terran':
        return { color: '#3b82f6', roughness: 0.6, metalness: 0.1 };
      case 'Ocean':
        return { color: '#1e3a8a', roughness: 0.2, metalness: 0.5 };
      case 'Icy':
        return { color: '#f0fdfa', roughness: 0.3, metalness: 0.8 };
      case 'Volcanic':
        return { color: '#ea580c', emissive: '#7f1d1d', emissiveIntensity: 0.5, roughness: 0.8, metalness: 0.3 };
      case 'Gas Giant':
        return { color: '#fcd34d', roughness: 0.4, metalness: 0.1 };
      case 'Barren':
      default:
        return { color: '#78716c', roughness: 0.9, metalness: 0.2 };
    }
  }, [biome]);

  // Scale planet visually, but not linearly (log scale so gas giants don't explode the canvas)
  const visualScale = Math.max(0.5, Math.min(3, 1 + Math.log10(mass)));

  return (
    <group scale={visualScale}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      {biome === 'Terran' && (
        <mesh>
          <sphereGeometry args={[2.02, 64, 64]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.2} roughness={1} />
        </mesh>
      )}
      {biome === 'Volcanic' && (
        <mesh>
          <sphereGeometry args={[2.05, 64, 64]} />
          <meshStandardMaterial color="#ef4444" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
        </mesh>
      )}
    </group>
  );
}

export default function Planet3D({ biome, mass }: PlanetProps) {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.1} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <PlanetSphere biome={biome} mass={mass} />
        <OrbitControls enableZoom={true} enablePan={false} autoRotate={false} />
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}
