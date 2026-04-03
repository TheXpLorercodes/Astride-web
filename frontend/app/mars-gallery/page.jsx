'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './MarsGallery.css';

const ROVERS = ['curiosity', 'perseverance', 'opportunity', 'spirit'];

export default function MarsGallery() {
  const [rover, setRover] = useState(ROVERS[0]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sol, setSol] = useState(1000);

  useEffect(() => {
    fetchPhotos();
  }, [rover, sol]);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/nasa/mars?rover=${rover}&sol=${sol}`);
      const data = await res.json();
      setPhotos(data.photos || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mars-page">
      <header className="mars-header">
        <h1 className="mars-title">Mars Rover <span className="gradient-text">Exploration</span></h1>
        <p className="mars-subtitle">Browsing high-resolution imagery from the surface of the Red Planet.</p>
        
        <div className="mars-controls">
          <div className="rover-selector">
            {ROVERS.map(r => (
              <button 
                key={r} 
                className={`rover-btn ${rover === r ? 'active' : ''}`}
                onClick={() => setRover(r)}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="sol-input">
            <label>SOL (Martian Day):</label>
            <input 
              type="number" 
              value={sol} 
              onChange={(e) => setSol(e.target.value)} 
              className="sol-field"
            />
          </div>
        </div>
      </header>

      <main className="mars-grid-container">
        {loading ? (
          <div className="mars-loading">Initializing satellite downlink...</div>
        ) : photos.length > 0 ? (
          <div className="mars-grid">
            {photos.slice(0, 24).map((photo, idx) => (
              <motion.div 
                key={photo.id}
                className="mars-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="mars-img-wrapper">
                  <img src={photo.img_src} alt={`Mars by ${rover}`} loading="lazy" />
                  <div className="mars-img-overlay">
                    <span>{photo.camera.full_name}</span>
                  </div>
                </div>
                <div className="mars-card-info">
                  <span className="mars-date">{photo.earth_date}</span>
                  <span className="mars-id">ID: {photo.id}</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="mars-empty">No telemetry found for this SOL. Try another day.</div>
        )}
      </main>
    </div>
  );
}
