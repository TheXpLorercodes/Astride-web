'use client';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './ObjectDetails.css';

const SECTION_LABELS = {
  planets: { overview: 'PLANETARY OVERVIEW', metrics: 'ORBITAL & PHYSICAL METRICS' },
  moons: { overview: 'LUNAR OVERVIEW', metrics: 'ORBITAL & SURFACE METRICS' },
  satellites: { overview: 'SATELLITE OVERVIEW', metrics: 'ORBITAL & SYSTEM SPECIFICATIONS' },
  stars: { overview: 'STELLAR OVERVIEW', metrics: 'STELLAR CLASSIFICATION & OUTPUT' },
  galaxies: { overview: 'GALACTIC OVERVIEW', metrics: 'STRUCTURE & SCALE METRICS' },
  asteroids: { overview: 'SMALL-BODY OVERVIEW', metrics: 'ORBIT & COMPOSITION METRICS' }
};

function getMetricItems(table, item) {
  if (table === 'moons') {
    return [
      ['Parent Planet', item.parent_planet || 'Unknown'],
      ['Diameter', item.diameter || 'Unknown'],
      ['Mass', item.mass || 'Unknown'],
      ['Gravity', item.gravity || 'Unknown'],
      ['Orbital Period', item.orbital_period || 'Unknown'],
      ['Rotation', item.rotation_period || 'Unknown'],
      ['Surface Temp', item.temperature || 'Unknown'],
      ['Atmosphere', item.atmosphere_label || 'Minimal']
    ];
  }

  if (table === 'stars') {
    return [
      ['Star Type', item.star_type || 'Unknown'],
      ['Temperature', item.temperature || 'Unknown'],
      ['Luminosity', item.luminosity || 'Unknown'],
      ['Example Star', item.example_star || 'Unknown']
    ];
  }

  if (table === 'galaxies') {
    return [
      ['Galaxy Type', item.galaxy_type || 'Unknown'],
      ['Diameter', item.diameter || 'Unknown'],
      ['Distance', item.distance || 'Unknown'],
      ['Stars', item.number_of_stars || 'Unknown'],
      ['Age', item.age || 'Unknown'],
      ['Constellation', item.constellation || 'Unknown'],
      ['Featured', item.is_featured ? 'YES' : 'NO']
    ];
  }

  if (table === 'asteroids') {
    return [
      ['Diameter', item.diameter || 'Unknown'],
      ['Orbital Period', item.orbital_period || 'Unknown'],
      ['Spectral Type', item.spectral_type || 'Unknown'],
      ['Discovered', item.discovery_date || 'Unknown'],
      ['Hazard Class', item.is_potentially_hazardous ? 'Potentially Hazardous' : 'Tracked']
    ];
  }

  if (table === 'satellites') {
    return [
      ['Operator', item.operator || 'Unknown'],
      ['Mission Type', item.mission_type || 'Unknown'],
      ['Orbit', item.orbit_type || 'Unknown'],
      ['Altitude', item.altitude || 'Unknown'],
      ['Velocity', item.velocity || 'Unknown'],
      ['Mass', item.mass || 'Unknown'],
      ['Power', item.power || 'Unknown'],
      ['Orbital Period', item.orbital_period || 'Unknown'],
      ['Inclination', item.inclination || 'Unknown'],
      ['Dimensions', item.dimensions || 'Unknown'],
      ['Status', item.status || 'Unknown'],
      ['Launch Date', item.launch_date || 'Unknown']
    ];
  }

  return [
    ['Diameter', item.diameter || 'Unknown'],
    ['Mass', item.mass || 'Unknown'],
    ['Gravity', item.gravity || 'Unknown'],
    ['Length of Day', item.day_length || 'Unknown'],
    ['Orbital Period', item.orbital_period || item.year_length || 'Unknown'],
    ['Temp Avg', item.temperature || 'Unknown'],
    ['Moons', item.number_of_moons || item.moon_count || '0'],
    ['Rings', item.has_rings || item.rings ? 'YES' : 'NO']
  ];
}

function getFactBlocks(item, encData) {
  if (Array.isArray(item.facts) && item.facts.length > 0) {
    return item.facts.map((fact, idx) => ({ id: `fact-${idx}`, title: null, text: fact }));
  }

  const overviewBlocks = encData?.tabs?.overview;
  if (Array.isArray(overviewBlocks) && overviewBlocks.length > 0) {
    return overviewBlocks.map((block, idx) => ({
      id: `overview-${idx}`,
      title: block.title || null,
      text: block.text || ''
    }));
  }

  return [];
}

export default function ObjectDetailsClient({ table, id, item, related, encData, siblings }) {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!item) return <div className="odc-error">Object Not Found</div>;

  const themeColor = item.color || encData?.colorRef || '#0ea5e9';
  const sectionLabels = SECTION_LABELS[table] || SECTION_LABELS.planets;
  const metricItems = getMetricItems(table, item);
  const factBlocks = getFactBlocks(item, encData);
  const atmosphereItems = item.atmosphere || item.composition || encData?.tabs?.composition || [];
  const missionLinks = related.filter((r) => r.table === 'missions');
  const satelliteLinks = related.filter((r) => r.table === 'planets' || r.table === 'moons' || r.relation_type === 'moon');
  const isPlanetLike = table === 'planets' || table === 'moons';
  const showAtmosphere = Array.isArray(atmosphereItems) && atmosphereItems.length > 0;
  const showSelector = Array.isArray(siblings) && siblings.length > 0;
  const showSatelliteSystems = table === 'satellites' && Array.isArray(item.main_parts) && item.main_parts.length > 0;

  return (
    <div className="odc-container" style={{ '--theme': themeColor }}>
      <div className="odc-nav-bar">
        <button className="odc-back-btn" onClick={() => router.back()}>
          <span className="mr-2">{'<-'}</span> RETURN EXPLORER
        </button>
        <div className="odc-system-status">
          <span className="status-dot"></span>
          ACTIVE LINK // {item.name.toUpperCase()}
        </div>
      </div>

      <section className="odc-hero-section">
        <div className="odc-visual-wrapper-3d">
          <motion.div
            className="odc-planet-sphere-3d"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 240, ease: 'linear' }}
            style={{
              backgroundImage: `url(${item.image || ''})`,
              boxShadow: `inset -60px -60px 100px rgba(0,0,0,0.9), 0 0 120px ${themeColor}40`
            }}
          >
            {['Earth', 'Mars', 'Venus'].includes(item.name) && (
              <motion.div
                className="odc-planet-clouds-3d"
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 180, ease: 'linear' }}
              ></motion.div>
            )}

            <div className="odc-atmosphere-glow" style={{ boxShadow: `inset 0 0 50px ${themeColor}60, 0 0 100px ${themeColor}30` }}></div>
            <div className="odc-scanline-overlay"></div>
          </motion.div>

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
            {item.tagline || encData?.tagline || 'PRIMARY CELESTIAL BODY // SECTOR-01'}
          </motion.p>
        </div>
      </section>

      <main className="odc-scrolling-content">
        <section className="odc-detail-tile">
          <div className="odc-tile-header">
            <span className="odc-tile-icon">[]</span>
            <h3>{sectionLabels.overview}</h3>
          </div>
          <div className="odc-tile-body">
            <p className="odc-description-hero">{item.hero_paragraph || item.description || encData?.description}</p>
            <div className="odc-facts-grid-3d">
              {factBlocks.length > 0 ? (
                factBlocks.map((block) => (
                  <div key={block.id} className="odc-fact-item-3d">
                    <span className="text-purple-500 font-black mr-4">//</span>
                    {block.title ? (
                      <>
                        <strong className="text-white/40 uppercase text-[10px] mr-2 tracking-widest">{block.title}:</strong>
                        {block.text}
                      </>
                    ) : (
                      block.text
                    )}
                  </div>
                ))
              ) : (
                <div className="odc-fact-item-3d opacity-50 italic text-sm py-4">
                  <span className="text-purple-500 font-black mr-4">//</span>
                  Extended encyclopedic telemetry for {item.name} is currently offline.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="odc-detail-tile">
          <div className="odc-tile-header">
            <span className="odc-tile-icon">##</span>
            <h3>{sectionLabels.metrics}</h3>
          </div>
          <div className="odc-tile-body">
            <div className="odc-metrics-grid">
              {metricItems.map(([label, value]) => (
                <MetricItem key={label} label={label} value={value} />
              ))}
            </div>
          </div>
        </section>

        {showAtmosphere && (
          <section className="odc-detail-tile">
            <div className="odc-tile-header">
              <span className="odc-tile-icon">~~</span>
              <h3>ATMOSPHERIC TELEMETRY</h3>
            </div>
            <div className="odc-tile-body">
              <div className="odc-atmos-list-3d">
                {atmosphereItems.map((atm, idx) => (
                  <div key={idx} className="odc-atmos-item-3d">
                    <div className="odc-atmos-header-3d">
                      <span>{atm.element || atm.layer || 'TRACE'}</span>
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
            </div>
          </section>
        )}

        {showSatelliteSystems && (
          <section className="odc-detail-tile">
            <div className="odc-tile-header">
              <span className="odc-tile-icon">::</span>
              <h3>WORKING SYSTEMS</h3>
            </div>
            <div className="odc-tile-body">
              <div className="odc-facts-grid-3d">
                {item.main_parts.map((part, idx) => (
                  <div key={idx} className="odc-fact-item-3d">
                    <span className="text-purple-500 font-black mr-4">//</span>
                    <strong className="text-white/40 uppercase text-[10px] mr-2 tracking-widest">{part.name}:</strong>
                    {part.function}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="odc-detail-tile">
          <div className="odc-tile-header">
            <span className="odc-tile-icon">{'>>'}</span>
            <h3>MISSION TRACKER</h3>
          </div>
          <div className="odc-tile-body">
            {missionLinks.length > 0 ? (
              <div className="odc-mission-timeline">
                {missionLinks.map((m, idx) => (
                  <Link href={`/details/missions/${m.id}`} key={idx} className="odc-mission-entry">
                    <div className="odc-mission-marker" style={{ background: themeColor }}></div>
                    <div className="odc-mission-info">
                      <span className="text-[9px] font-black tracking-widest text-[#94a3b8] uppercase">{m.relation_type}</span>
                      <h4 className="text-xl font-bold text-white mb-2">{m.name}</h4>
                      <p className="text-sm text-gray-500 line-clamp-2">Telemetry and archived mission logs processed...</p>
                    </div>
                    <div className="text-white/20">{'->'}</div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm italic py-4 text-center">No active or historical missions recorded.</div>
            )}
          </div>
        </section>

        {isPlanetLike && (
          <section className="odc-detail-tile">
            <div className="odc-tile-header">
              <span className="odc-tile-icon">()</span>
              <h3>NATURAL SATELLITES</h3>
            </div>
            <div className="odc-tile-body">
              {satelliteLinks.length > 0 ? (
                <div className="odc-moons-grid">
                  {satelliteLinks.map((moon, idx) => (
                    <Link href={`/details/${moon.table === 'moons' ? 'moons' : 'planets'}/${moon.id}`} key={idx} className="odc-moon-card">
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
        )}

        {showSelector && (
          <section className="odc-detail-tile border-none bg-transparent shadow-none mt-20">
            <div className="odc-tile-header border-none mb-10">
              <span className="odc-tile-icon text-white/20">{'<>'}</span>
              <h3 className="text-white/40">SYSTEM DATABASE ARCHIVE</h3>
            </div>
            <div className="odc-selector-strip-3d">
              {siblings.map((sib) => (
                <Link
                  key={sib.id}
                  href={`/details/${table}/${sib.id}`}
                  scroll={false}
                  className={`odc-selector-btn-3d ${item.id === sib.id ? 'active' : ''}`}
                  style={item.id === sib.id ? { borderColor: themeColor, boxShadow: `0 0 30px ${themeColor}20` } : {}}
                >
                  <div className="odc-selector-img-3d" style={{ backgroundImage: `url(${sib.image || 'https://via.placeholder.com/40'})` }}></div>
                  <span>{sib.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
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
