'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import './ISSTracker.css';

const ISSMap = dynamic(() => import('./ISSMap'), { ssr: false });

export default function ISSClient({ issDbData }) {
  const [issData, setIssData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [path, setPath] = useState([]);

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
        <div className="iss-dashboard-grid">
          <div className="iss-panel">
            <div className="iss-panel-label">Velocity</div>
            <div className="iss-panel-value">
              {loading ? '---' : issData?.velocity.toFixed(2)} <span className="iss-panel-unit">km/h</span>
            </div>
          </div>
          <div className="iss-panel">
            <div className="iss-panel-label">Altitude</div>
            <div className="iss-panel-value">
              {loading ? '---' : issData?.altitude.toFixed(2)} <span className="iss-panel-unit">km</span>
            </div>
          </div>
          <div className="iss-panel">
            <div className="iss-panel-label">Coordinates</div>
            <div className="iss-panel-value coord">
              {loading ? '---' : `${issData?.latitude.toFixed(4)}°, ${issData?.longitude.toFixed(4)}°`}
            </div>
          </div>
          <div className="iss-panel">
            <div className="iss-panel-label">Visibility</div>
            <div className="iss-panel-value" style={{ textTransform: 'capitalize', color: issData?.visibility === 'daylight' ? '#fbbf24' : '#94a3b8' }}>
              {loading ? '---' : issData?.visibility}
            </div>
          </div>
        </div>

        {/* Database Static Info Area */}
        {issDbData && (
          <div className="mt-16 border-t border-white/10 pt-16 space-y-20 max-w-[1200px] mx-auto">
            
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-orbitron font-bold uppercase text-white tracking-[0.15em] mb-3">
                Station Archives
              </h2>
              <p className="text-gray-400 font-mono text-[11px] tracking-[0.3em]">EXPEDITION & STRUCTURAL RECORDS</p>
            </div>

            {/* Station Overview block */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_8px_#ec4899]"></div>
                <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em]">Orbital Structure</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent ml-4"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-gray-300 font-sans">
                <div className="md:col-span-5 p-6 rounded-2xl bg-[#0a0a0e] border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] tracking-[0.25em] text-pink-500 font-mono uppercase mb-2">Construction Origin</h4>
                      <p className="text-lg text-white font-medium">{issDbData.built_date}</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] tracking-[0.25em] text-pink-500 font-mono uppercase mb-2">Member Nations</h4>
                      <p className="text-lg text-white font-medium">{issDbData.participating_countries} <span className="text-xs text-gray-500 font-normal">AGENCIES</span></p>
                    </div>
                    <div>
                      <h4 className="text-[10px] tracking-[0.25em] text-pink-500 font-mono uppercase mb-2">Expedition Duration</h4>
                      <p className="text-sm text-gray-400 leading-relaxed">{issDbData.crew_stay_duration}</p>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-7 p-6 rounded-2xl bg-gradient-to-br from-[#0a0a0e] to-transparent border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  <h4 className="text-[10px] tracking-[0.25em] text-pink-500 font-mono uppercase mb-4">Structural Assembly</h4>
                  <p className="text-[15px] text-gray-400 leading-8">{issDbData.construction_details}</p>
                </div>
              </div>
            </section>

            {/* Modules Grid */}
            {issDbData.modules && issDbData.modules.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em]">Core Modules</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent ml-4"></div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {issDbData.modules.map((mod, idx) => (
                    <div key={idx} className="p-5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors border border-white/5 rounded-xl flex flex-col justify-between h-full">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-base font-semibold text-white tracking-wide">{mod.name}</h4>
                          <span className="text-[9px] font-mono text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded tracking-wider uppercase border border-cyan-400/20">{mod.type}</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">{mod.purpose}</p>
                      </div>
                      <div className="mt-5 pt-4 border-t border-white/5">
                        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{mod.agency}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Astronauts Grid */}
            {issDbData.astronauts && issDbData.astronauts.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]"></div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em]">Active Crew Manifest</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent ml-4"></div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                  {issDbData.astronauts.map((astro, idx) => (
                    <div key={idx} className="group relative overflow-hidden rounded-xl bg-white/[0.02] border border-white/5 transition-all hover:bg-white/[0.05] hover:border-purple-500/30">
                      <div className="aspect-[4/5] w-full overflow-hidden bg-[#050508]">
                         {astro.photo ? (
                           <img 
                             src={astro.photo} 
                             alt={astro.name} 
                             className="w-full h-full object-cover object-top opacity-70 grayscale-[50%] group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                           />
                         ) : (
                           <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 font-mono gap-2">
                             <div className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center text-sm">?</div>
                             <span className="tracking-widest text-[9px] uppercase">No Visual</span>
                           </div>
                         )}
                         <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <div className="text-[9px] tracking-[0.2em] font-mono text-purple-400 uppercase mb-1">{astro.agency} &middot; {astro.role}</div>
                        <h4 className="text-sm font-orbitron font-medium text-white tracking-wider truncate">{astro.name}</h4>
                      </div>
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
