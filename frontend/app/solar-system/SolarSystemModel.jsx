'use client';
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Stars, Html, Float } from '@react-three/drei';

const PLANET_DATA = [
  { name: 'Mercury', size: 0.8, distance: 15, speed: 1.5, color: '#A5A5A5', emissive: '#222' },
  { name: 'Venus', size: 1.2, distance: 22, speed: 1.1, color: '#E3BB76', emissive: '#442200' },
  { name: 'Earth', size: 1.3, distance: 30, speed: 1.0, color: '#2271B3', emissive: '#001133' },
  { name: 'Mars', size: 1.0, distance: 38, speed: 0.8, color: '#E27B58', emissive: '#330000' },
  { name: 'Jupiter', size: 3.5, distance: 52, speed: 0.5, color: '#D39C7E', emissive: '#221100' },
  { name: 'Saturn', size: 3.0, distance: 68, speed: 0.4, color: '#C5AB6E', emissive: '#222200', hasRings: true },
  { name: 'Uranus', size: 2.0, distance: 82, speed: 0.3, color: '#B5E3E3', emissive: '#002222' },
  { name: 'Neptune', size: 2.0, distance: 95, speed: 0.2, color: '#6081FF', emissive: '#000033' },
];

function Planet({ planet, speedMultiplier, onSelect }) {
  const planetRef = useRef();
  const [hovered, setHovered] = React.useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * planet.speed * (speedMultiplier || 1) * 0.1;
    // Update orbit position
    planetRef.current.position.x = Math.cos(t) * planet.distance;
    planetRef.current.position.z = Math.sin(t) * planet.distance;
    // Rotate planet itself
    planetRef.current.rotation.y += 0.01;
    
    // Smooth Scale Animation
    const targetScale = hovered ? 1.5 : 1;
    planetRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <group>
      {/* Orbit Line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[planet.distance - 0.1, planet.distance + 0.1, 128]} />
        <meshBasicMaterial color="#ffffff" opacity={0.1} transparent />
      </mesh>

      {/* Planet Body */}
      <group 
        ref={planetRef} 
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }} 
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <mesh onClick={() => onSelect(planet.name)}>
          <sphereGeometry args={[planet.size, 32, 32]} />
          <meshStandardMaterial 
            color={planet.color} 
            emissive={planet.emissive} 
            roughness={0.7} 
            metalness={0.3} 
          />
          
          {planet.hasRings && (
             <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[planet.size * 1.5, planet.size * 2.5, 64]} />
                <meshStandardMaterial color={planet.color} opacity={0.4} transparent side={THREE.DoubleSide} />
             </mesh>
          )}
        </mesh>

        {/* HTML Label Overlays - High Contrast */}
        <Html distanceFactor={15} position={[0, planet.size + 1, 0]}>
          <div style={{ 
             color: 'white', 
             background: 'rgba(15, 23, 42, 0.7)', 
             border: `1px solid ${planet.color}40`,
             padding: '4px 10px', 
             borderRadius: '6px', 
             fontSize: '11px', 
             pointerEvents: 'none', 
             whiteSpace: 'nowrap', 
             textTransform: 'uppercase', 
             fontFamily: 'Orbitron, sans-serif',
             fontWeight: 800,
             boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
          }}>
            {planet.name}
          </div>
        </Html>
      </group>
    </group>
  );
}

export default function SolarSystemModel({ speedMultiplier = 1, onSelectPlanet }) {
  const sunRef = useRef();

  return (
    <>
      <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />
      <ambientLight intensity={0.2} />
      
      {/* THE SUN */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[7, 64, 64]} />
        <meshStandardMaterial 
           color="#FFD700" 
           emissive="#FF8C00" 
           emissiveIntensity={2} 
        />
        <pointLight intensity={5000} distance={500} color="#FF8C00" decay={2} />
        
        <Html distanceFactor={10} position={[0, 9, 0]}>
           <div style={{ 
              color: 'white', 
              background: 'rgba(255, 140, 0, 0.4)',
              backdropFilter: 'blur(8px)',
              padding: '6px 15px',
              borderRadius: '8px',
              border: '2px solid rgba(255, 215, 0, 0.6)',
              fontSize: '16px', 
              fontWeight: '900', 
              fontFamily: 'Orbitron, sans-serif',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              boxShadow: '0 0 20px rgba(255, 140, 0, 0.4)',
              pointerEvents: 'none'
           }}>THE SUN</div>
        </Html>
      </mesh>

      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
        {PLANET_DATA.map((planet) => (
          <Planet 
            key={planet.name} 
            planet={planet} 
            speedMultiplier={speedMultiplier} 
            onSelect={onSelectPlanet} 
          />
        ))}
      </Float>

      <OrbitControls makeDefault minDistance={20} maxDistance={300} />
    </>
  );
}
