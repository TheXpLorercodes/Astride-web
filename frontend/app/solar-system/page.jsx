'use client';
import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { useRouter } from 'next/navigation';
import SolarSystemModel from './SolarSystemModel';
import FavoritesButton from '../../components/Favorites/FavoritesButton';
import './SolarSystem3D.css';

export const dynamic = 'force-dynamic';

const planetData = {
  Mercury: { desc: "The smallest planet and closest to the Sun.", type: "Terrestrial" },
  Venus: { desc: "The hottest planet in our solar system.", type: "Terrestrial" },
  Earth: { desc: "Our home, the only known planet with life.", type: "Terrestrial" },
  Mars: { desc: "The Red Planet, home to Olympus Mons.", type: "Terrestrial" },
  Jupiter: { desc: "The largest planet, a gas giant with 79 moons.", type: "Gas Giant" },
  Saturn: { desc: "The ringed planet, second-largest in the system.", type: "Gas Giant" },
  Uranus: { desc: "An ice giant with a unique sideways tilt.", type: "Ice Giant" },
  Neptune: { desc: "The most distant major planet from the Sun.", type: "Ice Giant" }
};

export default function SolarSystemPage() {
  const router = useRouter();
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [detailsVisible, setDetailsVisible] = useState(false);

  const handleSelect = (name) => {
    setSelectedPlanet(name);
    setDetailsVisible(true);
  };

  return (
    <div className="ss3d-canvas-container">
      
      {/* UI OVERLAY */}
      <div className="ss3d-overlay">
        <div className="ss3d-glass-hud">
          <h1>Sol-Orrery v5.0</h1>
          <p>INTERACTIVE PHOTOREALISTIC ENGINE</p>
          
          <div className="ss3d-controls">
            <label>TIME VELOCITY: {speedMultiplier}X</label>
            <input 
              type="range" min="0" max="10" step="0.5" 
              value={speedMultiplier} 
              onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))} 
            />
          </div>

          <div className="ss3d-instructions">
            {"DRAG TO ROTATE // SCROLL TO ZOOM // CLICK PLANETS"}
          </div>
        </div>

        {detailsVisible && selectedPlanet && (
          <div className="ss3d-detail-panel card-entry">
             <div className="panel-header">
               <h2 className="gradient-text">{selectedPlanet}</h2>
               <FavoritesButton 
                 itemId={`planet-${selectedPlanet.toLowerCase()}`} 
                 itemType="planet" 
                 itemData={{ title: selectedPlanet, url: `/textures/planets/${selectedPlanet.toLowerCase()}.jpg` }} 
               />
             </div>
             <p className="type-badge">{planetData[selectedPlanet]?.type || 'Celestial Body'}</p>
             <p>{planetData[selectedPlanet]?.desc || `System metrics for ${selectedPlanet} stabilized.`}</p>
             
             <div className="panel-actions">
               <Link href={`/details/planets/${selectedPlanet.toLowerCase()}`} className="btn-v4-explore">
                  FULL DATABASE →
               </Link>
               <button className="close-btn-v2" onClick={() => setDetailsVisible(false)}>Minimize</button>
             </div>
          </div>
        )}
      </div>

      {/* 3D CANVAS */}
      <Canvas 
        camera={{ position: [0, 60, 100], fov: 45 }}
        style={{ height: '100vh', width: '100vw' }}
      >
        <Suspense fallback={null}>
          <SolarSystemModel 
            speedMultiplier={speedMultiplier} 
            onSelectPlanet={handleSelect} 
          />
        </Suspense>
      </Canvas>

      {/* LOADING FALLBACK */}
      <div className="ss3d-loader">
         <div className="loader-inner">INITIALIZING VOID...</div>
      </div>

    </div>
  );
}
