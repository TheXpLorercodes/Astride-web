'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PlanetsDashboard.css';

const TABS = ['Overview', 'Stats', 'Atmosphere', 'Missions'];

export default function PlanetsDashboard({ planets }) {
  const [selectedId, setSelectedId] = useState(planets?.[0]?.id);
  const [activeTab, setActiveTab] = useState(TABS[0]);

  if (!planets || planets.length === 0) return null;

  const selectedPlanet = planets.find(p => p.id === selectedId) || planets[0];

  return (
    <div className="pd-container" style={{ '--theme': selectedPlanet.color }}>
      {/* HEADER & SELECTOR */}
      <div className="pd-header">
        <h1 className="pd-main-title">Planetary Database</h1>
        <div className="pd-selector-strip">
          {planets.map(p => (
            <button 
              key={p.id}
              className={`pd-selector-btn ${selectedId === p.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedId(p.id);
              }}
              style={selectedId === p.id ? { borderColor: p.color, boxShadow: `0 0 15px ${p.color}40` } : {}}
            >
              <div className="pd-selector-img" style={{ backgroundImage: `url(${p.image})` }}></div>
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* DASHBOARD CONTENT */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedPlanet.id}
          className="pd-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {/* LEFT: VISUAL */}
          <div className="pd-visual-col">
            <motion.div 
              className="pd-planet-sphere"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 100, ease: "linear" }}
              style={{
                backgroundImage: `url(${selectedPlanet.image})`,
                boxShadow: `inset -20px -20px 40px rgba(0,0,0,0.9), 0 0 60px ${selectedPlanet.color}50`
              }}
            >
               <div className="pd-scanline"></div>
            </motion.div>
          </div>

          {/* RIGHT: DATA */}
          <div className="pd-data-col">
            <h2 className="pd-planet-name" style={{ color: selectedPlanet.color, textShadow: `0 0 10px ${selectedPlanet.color}80` }}>
              {selectedPlanet.name}
            </h2>

            {/* TABS */}
            <div className="pd-tabs">
              {TABS.map(tab => (
                <button 
                  key={tab} 
                  className={`pd-tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                  style={activeTab === tab ? { borderBottomColor: selectedPlanet.color, color: selectedPlanet.color } : {}}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: OVERVIEW */}
            {activeTab === 'Overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pd-tab-pane">
                <ul className="pd-facts-list">
                  {(selectedPlanet.facts || []).map((fact, idx) => (
                    <li key={idx}>
                       <span style={{ color: selectedPlanet.color }}>//</span> {fact}
                    </li>
                  ))}
                  {(!selectedPlanet.facts || selectedPlanet.facts.length === 0) && (
                    <li><span style={{ color: selectedPlanet.color }}>//</span> Detailed facts currently being synchronized...</li>
                  )}
                </ul>
              </motion.div>
            )}

            {/* TAB CONTENT: STATS */}
            {activeTab === 'Stats' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pd-tab-pane pd-stats-grid">
                <div className="pd-stat-box">
                   <div className="pd-stat-lbl">Diameter</div>
                   <div className="pd-stat-val">{selectedPlanet.diameter || selectedPlanet.stats?.diameter || 'N/A'}</div>
                </div>
                <div className="pd-stat-box">
                   <div className="pd-stat-lbl">Dist. from Sun</div>
                   <div className="pd-stat-val">{selectedPlanet.distance_from_sun || selectedPlanet.stats?.distanceFromSun || 'N/A'}</div>
                </div>
                <div className="pd-stat-box">
                   <div className="pd-stat-lbl">Orbit Period</div>
                   <div className="pd-stat-val">{selectedPlanet.orbit_period || selectedPlanet.stats?.orbitPeriod || 'N/A'}</div>
                </div>
                <div className="pd-stat-box">
                   <div className="pd-stat-lbl">Surface Temp</div>
                   <div className="pd-stat-val">{selectedPlanet.surface_temperature || selectedPlanet.stats?.surfaceTemperature || 'N/A'}</div>
                </div>
              </motion.div>
            )}

            {/* TAB CONTENT: ATMOSPHERE */}
            {activeTab === 'Atmosphere' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pd-tab-pane">
                <div className="pd-atmos-list">
                  {(selectedPlanet.atmosphere || selectedPlanet.composition || []).map((atm, idx) => (
                    <div key={idx} className="pd-atmos-item">
                      <div className="pd-atmos-header">
                        <span>{atm.element || atm.layer}</span>
                        <span style={{ color: atm.color }}>{atm.percentage || atm.pct}%</span>
                      </div>
                      <div className="pd-atmos-bar-bg">
                        <motion.div 
                          className="pd-atmos-bar-fill" 
                          initial={{ width: 0 }}
                          animate={{ width: `${atm.percentage || atm.pct || 0}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          style={{ background: atm.color }}
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                  {(!selectedPlanet.atmosphere && !selectedPlanet.composition) && (
                    <div style={{ color: 'var(--text-secondary)' }}>Compositional telemetry unknown.</div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB CONTENT: MISSIONS */}
            {activeTab === 'Missions' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pd-tab-pane">
                {(selectedPlanet.missions || []).length > 0 ? (
                  <div className="pd-mission-log">
                    {selectedPlanet.missions.map((m, idx) => (
                      <div key={idx} className="pd-mission-card" style={{ borderLeftColor: selectedPlanet.color }}>
                        <div className="pd-mission-year" style={{ color: selectedPlanet.color }}>{m.year}</div>
                        <div className="pd-mission-name">{m.name}</div>
                        <div className="pd-mission-desc">{m.description}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: 'var(--text-secondary)' }}>No major missions logged for this celestial body.</div>
                )}
              </motion.div>
            )}

          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
