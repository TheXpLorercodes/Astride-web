'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './ObjectDetails.css';
// import FavoritesButton from '../Favorites/FavoritesButton';

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
      {/* ── TOP NAVIGATION ── */}
      <div className="odc-nav-bar">
        <button className="odc-back-btn" onClick={() => router.back()}>
          <span className="mr-2">←</span> RETURN EXPLORER
        </button>
        <div className="odc-system-status">
          <span className="status-dot"></span>
          ACTIVE LINK // {item.name.toUpperCase()}
        </div>
      </div>

      {/* ── STICKY 3D HERO ── */}
      <section className="odc-hero-section">
        <div className="odc-visual-wrapper-3d">
          {/* BASE PLANET LAYER */}
          <motion.div 
            className="odc-planet-sphere-3d"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 240, ease: "linear" }}
            style={{
              backgroundImage: `url(${item.image})`,
              boxShadow: `inset -60px -60px 100px rgba(0,0,0,0.9), 0 0 120px ${themeColor}40`
            }}
          >
            {/* CLOUD LAYER (Terrestrial Only) */}
            {['Earth', 'Mars', 'Venus'].includes(item.name) && (
              <motion.div 
                className="odc-planet-clouds-3d"
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 180, ease: "linear" }}
              ></motion.div>
            )}
            
            <div className="odc-atmosphere-glow" style={{ boxShadow: `inset 0 0 50px ${themeColor}60, 0 0 100px ${themeColor}30` }}></div>
            <div className="odc-scanline-overlay"></div>
          </motion.div>
          
          {/* RING SYSTEM */}
          {(item.rings || item.has_rings) && (
            <div className="odc-planet-rings-container">
              <div className="odc-planet-rings" style={{ borderColor: `${themeColor}20` }}></div>
              <div className="odc-planet-rings odc-rings-inner" style={{ borderColor: `${themeColor}40` }}></div>
            </div>
          )}
        </div>

        <div className="odc-hero-text text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="odc-planet-name-3d"
            style={{ textShadow: `0 0 40px ${themeColor}80` }}
          >
            {item.name}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="odc-tagline-3d"
          >
            {item.tagline || encData?.tagline || "PRIMARY CELESTIAL BODY // SECTOR-01"}
          </motion.p>
        </div>
      </section>

      {/* ── SCROLLING DETAIL TILES ── */}
      <main className="odc-scrolling-content">
        
        {/* SECTION: OVERVIEW */}
        <section className="odc-detail-tile">
          <div className="odc-tile-header">
            <span className="odc-tile-icon">▤</span>
            <h3>PLANETARY OVERVIEW</h3>
          </div>
          <div className="odc-tile-body">
            <p className="odc-description-hero">{item.hero_paragraph || item.description || encData?.description}</p>
            <div className="odc-facts-grid-3d">
              {item.facts && Array.isArray(item.facts) ? (
                item.facts.map((fact, idx) => (
                  <div key={idx} className="odc-fact-item-3d">
                    <span className="text-purple-500 font-black mr-4">{"//"}</span>
                    {fact}
                  </div>
                ))
              ) : encData?.tabs?.overview?.body ? (
                encData.tabs.overview.body.map((block, idx) => (
                  <div key={idx} className="odc-fact-item-3d">
                    <span className="text-purple-500 font-black mr-4">{"//"}</span>
                    <strong className="text-white/40 uppercase text-[10px] mr-2 tracking-widest">{block.title}:</strong> {block.text}
                  </div>
                ))
              ) : (
                <div className="odc-fact-item-3d opacity-50 italic text-sm py-4">
                  <span className="text-purple-500 font-black mr-4">{"//"}</span>
                  Extended encyclopedic telemetry for {item.name} is currently offline.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECTION: TECHNICAL METRICS */}
        <section className="odc-detail-tile">
          <div className="odc-tile-header">
            <span className="odc-tile-icon">⚙</span>
            <h3>ORBITAL & PHYSICAL METRICS</h3>
          </div>
          <div className="odc-tile-body">
            <div className="odc-metrics-grid">
              <MetricItem label="Diameter" value={item.diameter || "Unknown"} />
              <MetricItem label="Mass" value={item.mass || "Pending"} />
              <MetricItem label="Gravity" value={item.gravity || "3.7 m/s²"} />
              <MetricItem label="Length of Day" value={item.day_length || "24.6h"} />
              <MetricItem label="Orbital Period" value={item.orbital_period || item.year_length || "687d"} />
              <MetricItem label="Temp Avg" value={item.temperature || "-65°C"} />
              <MetricItem label="Moons" value={item.number_of_moons || item.moon_count || "0"} />
              <MetricItem label="Rings" value={(item.has_rings || item.rings) ? "YES" : "NO"} />
            </div>
          </div>
        </section>

        {/* SECTION: ATMOSPHERE */}
        <section className="odc-detail-tile">
          <div className="odc-tile-header">
            <span className="odc-tile-icon">☁</span>
            <h3>ATMOSPHERIC TELEMETRY</h3>
          </div>
          <div className="odc-tile-body">
            {(item.atmosphere || item.composition || encData?.tabs.composition) ? (
              <div className="odc-atmos-list-3d">
                {(item.atmosphere || item.composition || encData?.tabs.composition).map((atm, idx) => (
                  <div key={idx} className="odc-atmos-item-3d">
                    <div className="odc-atmos-header-3d">
                      <span>{atm.element || atm.layer || "TRACE"}</span>
                      <span className="font-mono text-white/40">{atm.percentage || atm.pct}%</span>
                    </div>
                    <div className="odc-atmos-bar-bg-3d">
                      <motion.div 
                        className="odc-atmos-bar-fill-3d" 
                        initial={{ width: 0 }} 
                        whileInView={{ width: `${atm.percentage || atm.pct}%` }} 
                        viewport={{ once: true }}
                        style={{ background: atm.color || themeColor }}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm italic py-4">No significant atmosphere detected.</div>
            )}
          </div>
        </section>

        {/* SECTION: EXPLORATION (Missions) */}
        <section className="odc-detail-tile">
          <div className="odc-tile-header">
            <span className="odc-tile-icon">🚀</span>
            <h3>MISSION TRACKER</h3>
          </div>
          <div className="odc-tile-body">
            {related.filter(r => r.table === 'missions').length > 0 ? (
              <div className="odc-mission-timeline">
                {related.filter(r => r.table === 'missions').map((m, idx) => (
                  <Link href={`/details/missions/${m.id}`} key={idx} className="odc-mission-entry">
                    <div className="odc-mission-marker" style={{ background: themeColor }}></div>
                    <div className="odc-mission-info">
                      <span className="text-[9px] font-black tracking-widest text-[#94a3b8] uppercase">{m.relation_type}</span>
                      <h4 className="text-xl font-bold text-white mb-2">{m.name}</h4>
                      <p className="text-sm text-gray-500 line-clamp-2">Telemetry and archived mission logs processed...</p>
                    </div>
                    <div className="text-white/20">→</div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm italic py-4 text-center">No active or historical missions recorded.</div>
            )}
          </div>
        </section>

        {/* SECTION: SATELLITES (Moons) */}
        <section className="odc-detail-tile">
          <div className="odc-tile-header">
            <span className="odc-tile-icon">☾</span>
            <h3>NATURAL SATELLITES</h3>
          </div>
          <div className="odc-tile-body">
            {related.filter(r => r.table === 'planets' || r.relation_type === 'moon').length > 0 ? (
              <div className="odc-moons-grid">
                {related.filter(r => r.table === 'planets' || r.relation_type === 'moon').map((moon, idx) => (
                  <Link href={`/details/planets/${moon.id}`} key={idx} className="odc-moon-card">
                    <div className="odc-moon-visual" style={{ background: `radial-gradient(circle at 30% 30%, #fff2, transparent), ${themeColor}20` }}></div>
                    <div className="odc-moon-name">{moon.name}</div>
                    <div className="text-[10px] text-white/20 uppercase tracking-tighter">SATELLITE</div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm italic py-4 text-center">Zero priority natural satellites detected in orbit.</div>
            )}
          </div>
        </section>

        {/* SIBLINGS SELECTOR - QUICK NAVIGATION */}
        <section className="odc-detail-tile border-none bg-transparent shadow-none mt-20">
          <div className="odc-tile-header border-none mb-10">
            <span className="odc-tile-icon text-white/20">◈</span>
            <h3 className="text-white/40">SYSTEM DATABASE ARCHIVE</h3>
          </div>
          <div className="odc-selector-strip-3d">
            {siblings.map(sib => (
              <Link 
                key={sib.id} href={`/details/${table}/${sib.id}`} scroll={false}
                className={`odc-selector-btn-3d ${item.id === sib.id ? 'active' : ''}`}
                style={item.id === sib.id ? { borderColor: themeColor, boxShadow: `0 0 30px ${themeColor}20` } : {}}
              >
                <div className="odc-selector-img-3d" style={{ backgroundImage: `url(${sib.image || 'https://via.placeholder.com/40'})` }}></div>
                <span>{sib.name}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function MetricItem({ label, value }) {
  return (
    <div className="odc-metric-card">
      <div className="odc-metric-val">{value}</div>
      <div className="odc-metric-lbl">{label}</div>
    </div>
  );
}
