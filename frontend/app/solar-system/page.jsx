'use client';
import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useRouter } from 'next/navigation';
import SolarSystemModel from './SolarSystemModel';
import './SolarSystem3D.css';

export default function SolarSystemPage() {
  const router = useRouter();
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [detailsVisible, setDetailsVisible] = useState(false);

  const handleSelect = (name) => {
    // Navigate directly to the planet's detail page
    router.push(`/details/planets/${name.toLowerCase()}`);
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
            DRAG TO ROTATE // SCROLL TO ZOOM // CLICK PLANETS
          </div>
        </div>

        {detailsVisible && selectedPlanet && (
          <div className="ss3d-detail-panel">
             <button className="close-btn" onClick={() => setDetailsVisible(false)}>×</button>
             <h2 className="gradient-text">{selectedPlanet}</h2>
             <p>Archival telemetry active for {selectedPlanet}. System metrics stabilized.</p>
             <a href={`/details/planets?q=${selectedPlanet.toLowerCase()}`} className="btn-v4-explore" style={{ padding: '0.8rem 1.5rem', fontSize: '0.8rem', marginTop: '1rem' }}>
                Access Database
             </a>
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
