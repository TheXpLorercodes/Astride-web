import React, { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { MeshStandardMaterial } from 'three'
import { OrbitControls } from '@react-three/drei'

/**
 * Simple 3D planet visualisation.
 * Props:
 *   biome: string indicating current biome, used to select material colour/texture.
 */
const biomeMaterials: Record<string, string> = {
  Frozen: '#a0c4ff',
  Volcanic: '#ff6b6b',
  Desert: '#c2b280',
  Oceanic: '#3b82f6',
  "Ice Ocean": '#73c2fb',
  Steam: '#ffb347',
  Terran: '#4caf50',
  Barren: '#8e8e93',
  Greenhouse: '#ff9800',
  Unknown: '#6b7280',
}

type Planet3DProps = {
  biome: string
}

export const Planet3D: React.FC<Planet3DProps> = ({ biome }) => {
  const color = biomeMaterials[biome] ?? biomeMaterials['Unknown']
  const material = useMemo(() => new MeshStandardMaterial({ color }), [color])

  return (
    <Canvas className="h-full w-full" camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <primitive object={material} attach="material" />
      </mesh>
      <OrbitControls enableZoom={true} />
    </Canvas>
  )
}

export default Planet3D
