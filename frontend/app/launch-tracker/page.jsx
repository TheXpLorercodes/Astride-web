'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LaunchTracker.css';

export default function LaunchTracker() {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLaunches();
  }, []);

  const fetchLaunches = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/launches');
      const data = await res.json();
      setLaunches(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status.includes('Go')) return '#10b981';
    if (status.includes('TBD') || status.includes('TBC')) return '#f59e0b';
    return '#3b82f6';
  };

  return (
    <div className="launch-page">
      <header className="launch-header">
        <h1 className="launch-title">Mission <span className="gradient-text">Control</span></h1>
        <p className="launch-subtitle">Live tracking of upcoming global space launches and orbital deployments.</p>
      </header>

      <main className="launch-grid-container">
        {loading ? (
          <div className="launch-loading">Synchronizing with global space agencies...</div>
        ) : launches.length > 0 ? (
          <div className="launch-grid">
            {launches.map((launch, idx) => (
              <motion.div 
                key={launch.id}
                className="launch-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="launch-img-section" style={{ backgroundImage: `url(${launch.image || 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=800'})` }}>
                  <div className="launch-status" style={{ background: getStatusColor(launch.status.name) }}>
                    {launch.status.name.toUpperCase()}
                  </div>
                </div>
                <div className="launch-info">
                  <h3 className="launch-name">{launch.name}</h3>
                  <p className="launch-provider">{launch.launch_service_provider.name}</p>
                  
                  <div className="launch-timer">
                    <span className="timer-label">L-MINUS</span>
                    <span className="timer-val">{new Date(launch.net).toLocaleDateString()}</span>
                  </div>

                  <div className="launch-details">
                    <div className="detail-item">
                      <span className="detail-lbl">ROCKET</span>
                      <span className="detail-val">{launch.rocket.configuration.full_name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-lbl">LOCATION</span>
                      <span className="detail-val">{launch.pad.location.name}</span>
                    </div>
                  </div>

                  <p className="launch-desc">
                    {launch.mission?.description?.slice(0, 120)}...
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="launch-empty">No upcoming missions detected in current orbital windows.</div>
        )}
      </main>
    </div>
  );
}
