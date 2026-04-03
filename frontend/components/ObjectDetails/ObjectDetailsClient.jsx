'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './ObjectDetails.css';
import FavoritesButton from '../Favorites/FavoritesButton';

const TABLE_LABELS = { planets: 'Planet', stars: 'Star', galaxies: 'Galaxy', asteroids: 'Asteroid' };
const SYSTEM_KEYS = ['id', 'name', 'image', 'description', 'created_at', 'color'];

export default function ObjectDetailsClient({ table, id, item, related, encData, siblings }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Overview');

  // Prevent hydration styling flashes
  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (!item) return <div className="odc-error">Object Not Found</div>;

  const themeColor = item.color || encData?.colorRef || '#0ea5e9';
  const dynamicEntries = Object.entries(item).filter(([k, v]) => !SYSTEM_KEYS.includes(k) && v !== null && v !== '');
  // Filter out complex fields if they are handled separately
  const simpleStats = dynamicEntries.filter(([k]) => !['atmosphere', 'facts', 'missions', 'composition', 'hero_paragraph', 'tagline', 'discovery'].includes(k));
  const quickStats = simpleStats.slice(0, 4);

  return (
    <div className="odc-container" style={{ '--theme': themeColor }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <button className="odc-back-btn" onClick={() => router.back()}>← Return Explorer</button>
          <FavoritesButton id={item.id} table={table} name={item.name} />
       </div>

      {/* SIBLINGS SELECTOR - The "Horizontal Swipe" requested */}
      {siblings && siblings.length > 0 && (
        <div className="odc-header">
          <div className="odc-db-label">{TABLE_LABELS[table]?.toUpperCase() || 'OBJECT'} DATABASE <span className="odc-count">{siblings.length} OBJECTS</span></div>
          <div className="odc-selector-strip">
            {siblings.map(sib => (
              <Link 
                key={sib.id} href={`/details/${table}/${sib.id}`} scroll={false}
                className={`odc-selector-btn ${item.id === sib.id ? 'active' : ''}`}
                style={item.id === sib.id ? { borderColor: themeColor, boxShadow: `0 0 20px ${themeColor}40` } : {}}
              >
                <div className="odc-selector-img" style={{ backgroundImage: `url(${sib.image || 'https://via.placeholder.com/40'})` }}></div>
                <span>{sib.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* MAIN DASHBOARD */}
      <AnimatePresence mode="wait">
        <motion.div key={item.id} className="odc-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          
          {/* TOP: VISUAL SPHERE/GLOBE */}
          <div className="odc-visual-wrapper">
            <motion.div 
              className={(encData?.visualType || 'sphere').includes('sphere') ? 'odc-planet-sphere' : 'odc-galaxy-visual'}
              animate={(encData?.visualType || 'sphere').includes('sphere') ? { rotate: 360 } : {}}
              transition={{ repeat: Infinity, duration: 150, ease: "linear" }}
              style={{
                backgroundImage: encData ? undefined : `url(${item.image})`,
                backgroundSize: 'cover',
                background: encData ? `repeating-linear-gradient(45deg, #151b3d, ${themeColor} 50px)` : undefined, 
                boxShadow: `inset -30px -30px 60px rgba(0,0,0,0.9), 0 0 80px ${themeColor}60`
              }}
            >
               {(encData?.visualType || 'sphere').includes('sphere') && <div className="odc-scanline"></div>}
            </motion.div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 className="odc-planet-name" style={{ color: 'white', textShadow: `0 0 30px ${themeColor}CC, 0 0 10px ${themeColor}` }}>{item.name}</h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              {item.tagline || item.description || encData?.tagline}
            </p>
          </div>

          {/* BOTTOM: DATA DASHBOARD */}
          <div className="odc-data-section">
            <div className="odc-tabs">
              <button className={`odc-tab-btn ${activeTab === 'Overview' ? 'active' : ''}`} onClick={() => setActiveTab('Overview')} style={activeTab === 'Overview' ? { borderBottomColor: themeColor, color: 'white' } : {}}>FACTS</button>
              <button className={`odc-tab-btn ${activeTab === 'Stats' ? 'active' : ''}`} onClick={() => setActiveTab('Stats')} style={activeTab === 'Stats' ? { borderBottomColor: themeColor, color: 'white' } : {}}>PROPERTIES</button>
              <button className={`odc-tab-btn ${activeTab === 'Atmosphere' ? 'active' : ''}`} onClick={() => setActiveTab('Atmosphere')} style={activeTab === 'Atmosphere' ? { borderBottomColor: themeColor, color: 'white' } : {}}>ATMOSPHERE</button>
              <button className={`odc-tab-btn ${activeTab === 'Missions' ? 'active' : ''}`} onClick={() => setActiveTab('Missions')} style={activeTab === 'Missions' ? { borderBottomColor: themeColor, color: 'white' } : {}}>MISSIONS</button>
            </div>

            {/* TAB CONTENTS */}
            <div className="odc-tab-pane">
              
              {activeTab === 'Overview' && (
                <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="odc-facts-list">
                  {/* Database Facts First */}
                  {item.facts && Array.isArray(item.facts) ? (
                    item.facts.map((fact, idx) => (
                      <li key={idx}>
                         <span style={{color: themeColor}}>{"//"}</span> {fact}
                      </li>
                    ))
                  ) : encData ? (
                    encData.tabs.overview.body?.map((block, idx) => (
                      <li key={idx}>
                        <div style={{ color: themeColor, fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: 600 }}>{block.title}</div>
                        <div>{block.text}</div>
                      </li>
                    ))
                  ) : (
                    <li><span style={{color: themeColor}}>{"//"}</span> Extended encyclopedic data is not yet available for this body.</li>
                  )}
                </motion.ul>
              )}

              {activeTab === 'Stats' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="odc-stats-grid">
                  {quickStats.map(([k, v]) => (
                    <div className="odc-stat-box" key={k}>
                      <div className="odc-stat-val" style={{ color: '#fff' }}>{typeof v === 'boolean' ? (v ? 'Yes' : 'No') : v}</div>
                      <div className="odc-stat-lbl">{k.replace(/_/g, ' ')}</div>
                    </div>
                  ))}
                  {quickStats.length === 0 && <div style={{ color: '#94a3b8' }}>No recorded quantitative data.</div>}
                </motion.div>
              )}

              {activeTab === 'Atmosphere' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {(item.atmosphere || item.composition || encData?.tabs.composition) ? (
                    <div className="odc-atmos-list">
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>Atmosphere/Composition</div>
                      {(item.atmosphere || item.composition || encData?.tabs.composition).map((atm, idx) => (
                        <div key={idx} className="odc-atmos-item">
                          <div className="odc-atmos-header">
                            <span>{atm.element || atm.layer}</span>
                            <span style={{ color: atm.color }}>{atm.percentage || atm.pct}%</span>
                          </div>
                          <div className="odc-atmos-bar-bg">
                            <motion.div className="odc-atmos-bar-fill" initial={{ width: 0 }} animate={{ width: `${atm.percentage || atm.pct}%` }} transition={{ duration: 1, ease: 'easeOut' }} style={{ background: atm.color }}></motion.div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: '#94a3b8' }}>Atmospheric telemetry not logged.</div>
                  )}
                </motion.div>
              )}

              {activeTab === 'Missions' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {related.filter(r => r.table === 'missions').length > 0 ? (
                    <div className="odc-mission-log">
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>Mission Log</div>
                      {related.filter(r => r.table === 'missions').map((m, idx) => (
                        <Link href={`/details/missions/${m.id}`} key={idx} style={{ textDecoration: 'none' }}>
                          <div className="odc-mission-card" style={{ borderLeftColor: themeColor }}>
                            <div className="odc-mission-year" style={{ color: themeColor }}>{m.relation_type}</div>
                            <div className="odc-mission-name">{m.name}</div>
                            <div className="odc-mission-desc">View mission details processing...</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: '#94a3b8' }}>No linked missions on record.</div>
                  )}
                </motion.div>
              )}
            </div>
          </div>

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
