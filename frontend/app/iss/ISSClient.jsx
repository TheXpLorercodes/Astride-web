'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import './ISSTracker.css';

const ISSMap = dynamic(() => import('./ISSMap'), { ssr: false });

const ASTRONAUT_FALLBACK_IMAGE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#0f172a"/>
      <stop offset="1" stop-color="#111827"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="28%" r="70%">
      <stop offset="0" stop-color="#22d3ee" stop-opacity="0.35"/>
      <stop offset="0.5" stop-color="#a855f7" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="600" height="750" rx="36" fill="url(#bg)"/>
  <rect width="600" height="750" rx="36" fill="url(#glow)"/>
  <circle cx="300" cy="290" r="120" fill="none" stroke="#22d3ee" stroke-opacity="0.18" stroke-width="6"/>
  <circle cx="300" cy="290" r="78" fill="none" stroke="#f472b6" stroke-opacity="0.22" stroke-width="4" stroke-dasharray="10 10"/>
  <path d="M300 170l40 82 90 13-65 63 15 89-80-42-80 42 15-89-65-63 90-13z" fill="#fbbf24" fill-opacity="0.12" stroke="#fbbf24" stroke-opacity="0.35" stroke-width="4"/>
  <text x="300" y="530" text-anchor="middle" fill="#f8fafc" font-family="Orbitron, Arial, sans-serif" font-size="36" letter-spacing="8">CREW</text>
  <text x="300" y="580" text-anchor="middle" fill="#94a3b8" font-family="Spline Sans Mono, monospace" font-size="16" letter-spacing="6">NO IMAGE</text>
</svg>
`)}`;

export default function ISSClient({ issDbData }) {
  const [issData, setIssData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [path, setPath] = useState([]);
  const telemetryCards = [
    {
      label: 'Velocity',
      accent: 'pink',
      value: loading ? '---' : `${issData?.velocity.toFixed(2)} km/h`,
    },
    {
      label: 'Altitude',
      accent: 'cyan',
      value: loading ? '---' : `${issData?.altitude.toFixed(2)} km`,
    },
    {
      label: 'Coordinates',
      accent: 'violet',
      value: loading ? '---' : `${issData?.latitude.toFixed(4)}°, ${issData?.longitude.toFixed(4)}°`,
      isCoord: true,
    },
    {
      label: 'Visibility',
      accent: 'amber',
      value: loading ? '---' : issData?.visibility,
      valueClassName: 'iss-panel-value--visibility',
    },
  ];
  const archiveStats = issDbData
    ? [
        { label: 'Construction Origin', value: issDbData.built_date, accent: 'pink' },
        { label: 'Member Nations', value: issDbData.participating_countries, accent: 'cyan' },
        { label: 'Expedition Duration', value: issDbData.crew_stay_duration, accent: 'violet' },
      ]
    : [];
  const moduleAccents = ['pink', 'cyan', 'violet', 'amber'];
  const astronautAccents = ['pink', 'cyan', 'violet', 'amber'];

  useEffect(() => {
    let intervalId;

    const fetchISS = async () => {
      try {
        const res = await fetch('/api/iss');
        if (!res.ok) {
          console.warn('ISS signal degraded, waiting for telemetry window...');
          setError(true);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setIssData(data);
        
        // Add current pos to path history
        setPath(prev => {
           const newPath = [...prev, [data.latitude, data.longitude]];
           return newPath.slice(-50); // Keep last 50 points
        });

        setError(false);
      } catch (err) {
        console.warn('ISS connection lost, retrying...', err.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchISS();
    intervalId = setInterval(fetchISS, 15000); // the API route caches for 15s anyway

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="iss-container">
      <div className="iss-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div className="iss-pulse-indicator"></div>
          <h1 className="iss-title">LIVE: ISS TELEMETRY</h1>
        </div>
        <p className="iss-desc">
          Real-time tracking of the International Space Station. Orbiting Earth at roughly 28,000 km/h.
        </p>
      </div>

      <div className="iss-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Map View */}
        <div className="iss-map-wrapper" style={{ height: '500px', width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--accent-pink)' }}>
           {!loading && !error && issData && (
              <ISSMap issData={issData} path={path} />
           )}
           {loading && <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ec4899'}}>Acquiring signal...</div>}
        </div>

        {/* Dashboard Panels */}
        <div className="iss-dashboard-shell">
          <div className="iss-section-head">
            <div>
              <p className="iss-section-eyebrow">Live telemetry</p>
              <h2 className="iss-section-title">Orbital snapshot</h2>
            </div>
            <p className="iss-section-copy">
              <span className="iss-copy-accent iss-copy-accent--pink">Real-time orbital telemetry.</span>
              <span> Speed, altitude, coordinates, and visibility are rendered as luminous control tiles.</span>
            </p>
          </div>

          <div className="iss-orbital-strip">
            <div className="iss-orbital-chip iss-orbital-chip--pink">
              <span className="iss-orbital-chip-label">Track</span>
              <strong>{loading ? 'Warming up' : `${path.length} trail points`}</strong>
            </div>
            <div className="iss-orbital-chip iss-orbital-chip--cyan">
              <span className="iss-orbital-chip-label">Speed</span>
              <strong>{telemetryCards[0].value}</strong>
            </div>
            <div className="iss-orbital-chip iss-orbital-chip--violet">
              <span className="iss-orbital-chip-label">Light</span>
              <strong>{telemetryCards[3].value}</strong>
            </div>
            <div className="iss-orbital-chip iss-orbital-chip--amber">
              <span className="iss-orbital-chip-label">Altitude</span>
              <strong>{telemetryCards[1].value}</strong>
            </div>
          </div>

          <div className="iss-dashboard-grid">
            {telemetryCards.map((card) => (
              <div key={card.label} className={`iss-panel iss-panel--${card.accent}`}>
                <div className="iss-panel-label">{card.label}</div>
                <div className={`iss-panel-value ${card.isCoord ? 'coord' : ''} ${card.valueClassName || ''}`.trim()} style={card.label === 'Visibility' ? { textTransform: 'capitalize', color: issData?.visibility === 'daylight' ? '#fbbf24' : '#94a3b8' } : undefined}>
                  {card.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Database Static Info Area */}
        {issDbData && (
          <div className="iss-archive-shell">
            <div className="iss-section-head iss-section-head--center">
              <div>
                <p className="iss-section-eyebrow">Station archives</p>
                <h2 className="iss-section-title">Expedition and structural records</h2>
              </div>
              <p className="iss-section-copy">
                <span className="iss-copy-accent iss-copy-accent--cyan">Mission dossier.</span>
                <span> Structural history, module inventory, and crew records are arranged in color-coded cards.</span>
              </p>
            </div>

            <div className="iss-archive-banner">
              {archiveStats.map((item) => (
                <div key={item.label} className={`iss-archive-metric iss-archive-metric--${item.accent}`}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>

            {/* Station Overview block */}
            <section className="iss-archive-panel">
              <div className="iss-archive-panel-copy">
                <div className="iss-info-section-head iss-info-section-head--archive">
                  <div className="iss-info-section-mark"></div>
                  <h3>Orbital structure</h3>
                </div>

                <h4 className="iss-archive-panel-title">Assembled in orbital layers</h4>
                <p className="iss-archive-panel-text">{issDbData.construction_details}</p>
              </div>

              <div className="iss-archive-facts">
                <div className="iss-archive-fact iss-archive-fact--pink">
                  <span>Construction Origin</span>
                  <strong>{issDbData.built_date}</strong>
                </div>
                <div className="iss-archive-fact iss-archive-fact--cyan">
                  <span>Member Nations</span>
                  <strong>{issDbData.participating_countries}</strong>
                </div>
                <div className="iss-archive-fact iss-archive-fact--violet">
                  <span>Expedition Duration</span>
                  <strong>{issDbData.crew_stay_duration}</strong>
                </div>
              </div>
            </section>

            {/* Modules Grid */}
            {issDbData.modules && issDbData.modules.length > 0 && (
              <section className="iss-info-section">
                <div className="iss-info-section-head">
                  <div className="iss-info-section-mark iss-info-section-mark--cyan"></div>
                  <h3>Core modules</h3>
                </div>

                <div className="iss-module-grid">
                  {issDbData.modules.map((mod, idx) => (
                    <div key={idx} className={`iss-module-card iss-module-card--${moduleAccents[idx % moduleAccents.length]}`}>
                      <div className="iss-module-card-top">
                        <span className="iss-module-chip">{mod.type}</span>
                        <h4>{mod.name}</h4>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed">{mod.purpose}</p>
                      <div className="iss-module-footer">
                        <p>{mod.agency}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Astronauts Grid */}
            {issDbData.astronauts && issDbData.astronauts.length > 0 && (
              <section className="iss-info-section">
                <div className="iss-info-section-head">
                  <div className="iss-info-section-mark iss-info-section-mark--violet"></div>
                  <h3>Active crew manifest</h3>
                </div>

                <div className="iss-astronaut-grid">
                  {issDbData.astronauts.map((astro, idx) => (
                    <div key={idx} className={`iss-astronaut-card iss-astronaut-card--${astronautAccents[idx % astronautAccents.length]} group relative overflow-hidden transition-all`}>
                      <div className="iss-astronaut-avatar">
                        <img
                          src={ASTRONAUT_FALLBACK_IMAGE}
                          alt={astro.name}
                          className="iss-astronaut-avatar-image iss-astronaut-photo--placeholder"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="iss-astronaut-copy">
                        <div className="iss-astronaut-meta">{astro.agency} &middot; {astro.role}</div>
                        <h4>{astro.name}</h4>
                      </div>
                      <div className="iss-astronaut-orb" />
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
