'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AsteroidWatch.css';

export default function AsteroidWatch() {
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchAsteroids();
  }, [date]);

  const fetchAsteroids = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/nasa/asteroids?start_date=${date}`);
      const data = await res.json();
      
      // NeoWs returns an object keyed by date
      const dayData = data.near_earth_objects[date] || [];
      setAsteroids(dayData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getHazardLevel = (isHazard) => {
    return isHazard ? 'CRITICAL' : 'MINIMAL';
  };

  return (
    <div className="neo-page">
      <header className="neo-header">
        <h1 className="neo-title">Asteroid <span className="gradient-text">Watch</span></h1>
        <p className="neo-subtitle">Monitoring Near-Earth Objects (NEOs) as they approach our home planet.</p>
        
        <div className="neo-date-selector">
          <label>Observation Date:</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            className="neo-date-field"
          />
        </div>
      </header>

      <main className="neo-list-container">
        {loading ? (
          <div className="neo-loading">Scanning deep space proximity sensors...</div>
        ) : asteroids.length > 0 ? (
          <div className="neo-list">
            {asteroids.map((neo, idx) => (
              <motion.div 
                key={neo.id}
                className={`neo-card ${neo.is_potentially_hazardous_asteroid ? 'hazardous' : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="neo-hazard-indicator" style={{ background: neo.is_potentially_hazardous_asteroid ? '#ef4444' : '#10b981' }}>
                  {getHazardLevel(neo.is_potentially_hazardous_asteroid)}
                </div>
                <div className="neo-card-main">
                  <h3 className="neo-name">{neo.name}</h3>
                  <div className="neo-stats-grid">
                    <div className="neo-stat">
                      <span className="stat-label">Diameter (Avg)</span>
                      <span className="stat-val">
                        {((neo.estimated_diameter.kilometers.estimated_diameter_min + neo.estimated_diameter.kilometers.estimated_diameter_max) / 2).toFixed(2)} km
                      </span>
                    </div>
                    <div className="neo-stat">
                      <span className="stat-label">Miss Distance</span>
                      <span className="stat-val">
                        {parseFloat(neo.close_approach_data[0].miss_distance.kilometers).toLocaleString()} km
                      </span>
                    </div>
                    <div className="neo-stat">
                      <span className="stat-label">Velocity</span>
                      <span className="stat-val">
                        {parseFloat(neo.close_approach_data[0].relative_velocity.kilometers_per_hour).toLocaleString()} km/h
                      </span>
                    </div>
                  </div>
                </div>
                <div className="neo-card-footer">
                  <span className="approach-time">Closest approach: {neo.close_approach_data[0].close_approach_date_full.split(' ')[1]}</span>
                  <a href={neo.nasa_jpl_url} target="_blank" rel="noopener noreferrer" className="jpl-link">JPL Analysis →</a>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="neo-empty">No objects detected for the selected spatial coordinates.</div>
        )}
      </main>
    </div>
  );
}
