'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LiveEarth.css';

export default function LiveEarth() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchEpic();
  }, []);

  const fetchEpic = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/nasa/epic');
      const data = await res.json();
      setImages(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="epic-page">
      <header className="epic-header">
        <h1 className="epic-title">Live <span className="gradient-text">Earth</span></h1>
        <p className="epic-subtitle">Direct feed from the EPIC camera on the DSCOVR satellite, 1 million miles away.</p>
      </header>

      <main className="epic-viewer">
        {loading ? (
          <div className="epic-loading">Establishing deep space connection...</div>
        ) : images.length > 0 ? (
          <div className="epic-container">
            <div className="epic-main-visual">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={images[currentIndex].image}
                  className="epic-image-wrapper"
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <img src={images[currentIndex].url} alt="Earth from Space" />
                  <div className="epic-glow"></div>
                </motion.div>
              </AnimatePresence>

              <div className="epic-nav">
                <button onClick={prevImage} className="epic-nav-btn">←</button>
                <button onClick={nextImage} className="epic-nav-btn">→</button>
              </div>
            </div>

            <div className="epic-details">
              <div className="epic-info-card">
                <h3>TELEMETRY DATA</h3>
                <div className="epic-stats">
                  <div className="epic-stat">
                     <span>DATE</span>
                     <strong>{images[currentIndex].date}</strong>
                  </div>
                  <div className="epic-stat">
                     <span>LATITUDE</span>
                     <strong>{images[currentIndex].centroid_coordinates.lat.toFixed(4)}°</strong>
                  </div>
                  <div className="epic-stat">
                     <span>LONGITUDE</span>
                     <strong>{images[currentIndex].centroid_coordinates.lon.toFixed(4)}°</strong>
                  </div>
                  <div className="epic-stat">
                     <span>DIST TO SUN</span>
                     <strong>149,600,000 KM</strong>
                  </div>
                </div>
                <p className="epic-caption">
                  This image was captured by the Earth Polychromatic Imaging Camera (EPIC) from a distance of approximately 1.5 million kilometers.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="epic-empty">Downlink failed. Satellite may be in Earth&apos;s shadow.</div>
        )}
      </main>
    </div>
  );
}
