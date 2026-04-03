'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SpaceWeather.css';

export default function SpaceWeather() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/nasa/donki');
      const data = await res.json();
      setEvents(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getIntensityColor = (speed) => {
    if (speed > 800) return '#ef4444'; // Extreme
    if (speed > 400) return '#f59e0b'; // Moderate
    return '#10b981'; // Minimal
  };

  return (
    <div className="weather-page">
      <header className="weather-header">
        <h1 className="weather-title">Space <span className="gradient-text">Weather</span></h1>
        <p className="weather-subtitle">Monitoring Coronal Mass Ejections (CMEs) and solar activity.</p>
      </header>

      <main className="weather-container">
        {loading ? (
          <div className="weather-loading">Polling donor sensors for solar activity...</div>
        ) : events.length > 0 ? (
          <div className="weather-timeline">
            {events.reverse().map((event, idx) => (
              <motion.div 
                key={idx}
                className="weather-event"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="event-date">
                  <span className="day">{new Date(event.startTime).getDate()}</span>
                  <span className="month">{new Date(event.startTime).toLocaleString('default', { month: 'short' })}</span>
                </div>
                <div className="event-card">
                  <div className="event-header">
                    <h3>Coronal Mass Ejection Detected</h3>
                    <span className="activity-id">ID: {event.activityID}</span>
                  </div>
                  <div className="event-metrics">
                    <div className="metric">
                       <span>START TIME</span>
                       <strong>{new Date(event.startTime).toLocaleTimeString()}</strong>
                    </div>
                    <div className="metric">
                       <span>INSTRUMENTS</span>
                       <strong>{event.instruments?.[0]?.displayName || 'SOHO'}</strong>
                    </div>
                  </div>
                  <p className="event-note">
                    {event.note?.slice(0, 200)}...
                  </p>
                  <div className="event-footer">
                     <span className="status-badge" style={{ background: '#3b82f6' }}>STABLE TRACKING</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="weather-empty">Solar activity is currently within baseline parameters.</div>
        )}
      </main>
    </div>
  );
}
