'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ISSFloating() {
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCoordParts = (value, positive, negative) => {
    if (value === null || value === undefined || Number.isNaN(value)) return { base: '--.----', dir: ' ' };
    const dir = value >= 0 ? positive : negative;
    return { base: Math.abs(value).toFixed(4), dir: `°${dir}` };
  };

  const formatNumber = (value, digits) => {
    if (value === null || value === undefined || Number.isNaN(value)) return '--';
    return Number(value).toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  useEffect(() => {
    let intervalId;
    let cancelled = false;

    const fetchISS = async () => {
      try {
        setError(null);
        if (!telemetry) setLoading(true);
        const res = await fetch('/api/iss');
        if (!res.ok) throw new Error('Telemetry unavailable');
        const data = await res.json();
        if (cancelled) return;
        setTelemetry(data);
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        setError(err.message ?? 'Telemetry unavailable');
        setLoading(false);
      }
    };

    const startPolling = () => {
      fetchISS();
      intervalId = setInterval(fetchISS, 15000);
    };

    const stopPolling = () => {
      if (intervalId) clearInterval(intervalId);
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        stopPolling();
        startPolling();
      } else {
        stopPolling();
      }
    };

    startPolling();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelled = true;
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const latitude = telemetry?.latitude;
  const longitude = telemetry?.longitude;
  const altitudeKm = telemetry?.altitude;
  const velocityKmh = telemetry?.velocity;
  const footprintKm = telemetry?.footprint;
  const visibility = telemetry?.visibility || 'daylight';
  
  const isNight = visibility.toLowerCase() === 'eclipsed';

  const hasCoords = typeof latitude === 'number' && typeof longitude === 'number';
  const mapX = hasCoords ? clamp(((longitude + 180) / 360) * 100, 4, 96) : 50;
  const mapY = hasCoords ? clamp(((90 - latitude) / 180) * 100, 4, 96) : 50;
  
  const footprintSize = footprintKm ? Math.max(28, Math.min(120, footprintKm / 80)) : 48;
  const footprintProgress = footprintKm ? Math.min(100, (footprintKm / 9000) * 100) : 40;
  
  const launchEpoch = 911630400000;
  const orbitDuration = 5560800;
  const estimatedOrbit = Math.floor((Date.now() - launchEpoch) / orbitDuration);

  const statusTone = error ? 'text-[#f59e0b]' : loading ? 'text-[#2dd4bf]' : 'text-[#a855f7]';
  const statusBg = error ? 'bg-[#f59e0b]' : loading ? 'bg-[#2dd4bf]' : 'bg-[#a855f7]';

  const latParts = loading ? { base: '--.----', dir: ' ' } : getCoordParts(latitude, 'N', 'S');
  const lngParts = loading ? { base: '--.----', dir: ' ' } : getCoordParts(longitude, 'E', 'W');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="relative w-full max-w-[1000px] mx-auto py-10 md:py-16 font-sans"
    >
      <div className="bg-[#0e0f14] border border-[#232533] mx-auto flex flex-col w-full text-white shadow-[0_30px_80px_-45px_rgba(2,6,23,0.9)] relative overflow-hidden rounded-sm">
        
        {/* Subtle background glow mapping to purple/cyan */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

        {/* HEADER */}
        <div className="px-6 py-5 flex flex-col sm:flex-row items-baseline sm:items-center justify-between border-b mx-4 border-[#232533] gap-2 lg:gap-0 z-10">
          <div className="flex items-center gap-3">
            {/* Globe icon using SVG */}
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-400 opacity-90" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(45 12 12)" />
              <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-45 12 12)" />
            </svg>
            <h2 className="text-white font-extrabold tracking-[0.2em] text-[13px] uppercase">
              ISS-Live Telemetry
            </h2>
          </div>
          
          <div className="flex items-center gap-4 text-[11px] font-mono tracking-widest font-bold mt-2 sm:mt-0">
            <div className={`flex items-center gap-2 ${statusTone}`}>
              <div className={`w-2.5 h-2.5 rounded-full ${statusBg} ${!error && !loading ? 'animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]' : ''}`} />
              {error ? 'CONNECTION LOST' : loading ? 'ACQUIRING SIGNAL...' : 'ACTIVE POLLING'}
            </div>
            <div className="hidden sm:block w-px h-3 bg-[#3f4150]" />
            <span className="text-[#6b7280] hidden sm:block">NODE: ZARYA-01</span>
          </div>
        </div>

        {/* MAIN BODY */}
        <div className="flex flex-col lg:flex-row p-8 lg:p-12 gap-x-12 gap-y-12 z-10 w-full">
          
          {/* LEFT PANE */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-y-10 gap-x-4 lg:gap-x-12">
              
              <div>
                <div className="text-[10px] text-[#818b9c] font-bold tracking-[0.15em] mb-1.5 uppercase">Latitude</div>
                <div className="text-4xl lg:text-[2.6rem] text-[#f3f4f6] font-normal tracking-tight">
                  {latParts.base}<span className="text-cyan-400 font-light ml-1">{latParts.dir}</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-[#818b9c] font-bold tracking-[0.15em] mb-1.5 uppercase">Longitude</div>
                <div className="text-4xl lg:text-[2.6rem] text-[#f3f4f6] font-normal tracking-tight">
                  {lngParts.base}<span className="text-cyan-400 font-light ml-1">{lngParts.dir}</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-[#818b9c] font-bold tracking-[0.15em] mb-1.5 uppercase">Altitude</div>
                <div className="text-4xl lg:text-[2.6rem] text-[#f3f4f6] font-normal tracking-tight">
                  {formatNumber(altitudeKm, 1)}<span className="text-purple-400 text-2xl font-light tracking-normal ml-2">km</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-[#818b9c] font-bold tracking-[0.15em] mb-1.5 uppercase">Velocity</div>
                <div className="text-4xl lg:text-[2.6rem] text-[#f3f4f6] font-normal tracking-tight whitespace-nowrap">
                  {formatNumber(velocityKmh, 0)}<span className="text-purple-400 text-2xl font-light tracking-normal ml-2">km/h</span>
                </div>
              </div>
            </div>

            <div className="mt-14 mb-4 lg:mb-0">
              <div className="text-[10px] text-[#818b9c] font-bold tracking-[0.15em] mb-3 uppercase">Ground Footprint</div>
              <div className="flex items-center justify-between">
                <div className="text-[1.35rem] text-[#f3f4f6] font-normal tracking-tight flex items-baseline gap-1">
                  {formatNumber(footprintKm, 0)} <span className="text-[10px] text-[#818b9c] font-bold tracking-[0.15em] ml-1">km²</span>
                </div>
                
                <div className="flex-1 max-w-[240px] ml-6 h-1 bg-[#1a1c23] rounded overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-600 to-cyan-300 transition-all duration-1000 ease-out" 
                    style={{ width: `${loading ? 0 : footprintProgress}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANE: MAP */}
          <div className="flex-[0.8] flex flex-col justify-between border-l-0 lg:border-l border-[#232533] lg:pl-12">
            <div className="flex items-center justify-between mb-4 text-[10px] font-bold tracking-[0.15em]">
              <span className="text-[#818b9c] uppercase">Orbital Projection</span>
              <span className="text-cyan-400 uppercase tracking-widest">Live Tracking</span>
            </div>

            {/* GLOBE MAP BOX container */}
            <div className="relative w-full aspect-[4/3] rounded-sm border border-[#232533] bg-[#0c0d12] overflow-hidden flex items-center justify-center p-4">
              
              {/* Cyans corners */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-cyan-500/50 opacity-80" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-cyan-500/50 opacity-80" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-cyan-500/50 opacity-80" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-cyan-500/50 opacity-80" />

              {/* Fake globe background (circular gradient with subtle equator/meridian) */}
              <div className="relative w-[85%] max-w-[280px] aspect-square rounded-full border border-[#232533] bg-[#08090c] overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.06),transparent_60%)]" />
                <div className="absolute inset-0 opacity-15 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:12%_12%]" />
                
                {/* Lines */}
                <div className="absolute inset-x-0 top-1/2 h-px bg-[#232533]/60" />
                <div className="absolute inset-y-0 left-1/2 w-px bg-[#232533]/60" />

                {/* Tracking Dot containing footprints */}
                <div 
                  className="absolute transition-all duration-[15000ms] ease-linear"
                  style={{ left: `${mapX}%`, top: `${mapY}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <div 
                    className="absolute inset-0 rounded-full bg-cyan-400/5 border border-cyan-400/30 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                    style={{ width: `${footprintSize}px`, height: `${footprintSize}px` }}
                  >
                    <div className="w-[7px] h-[7px] rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,1)] z-10" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row of Map */}
            <div className="mt-8 flex items-start justify-between">
              <div className="flex items-center gap-3">
                {isNight ? (
                  <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.9 15.3c-.6.2-1.3.3-2 .3-4.4 0-8-3.6-8-8 0-.7.1-1.4.3-2C7.3 6.3 4 10.3 4 15c0 5 4 9 9 9 4.7 0 8.7-3.3 9.4-7.2-1-.8-1.5-1.5-1.5-1.5z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-[#f59e0b]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="5" strokeWidth="2" />
                    <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M19.78 4.22l-1.42 1.42" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
                <div>
                  <div className="text-[10px] text-white font-bold tracking-[0.15em] mb-1.5 uppercase">
                    {loading ? 'STATUS' : isNight ? 'NIGHT PHASE' : 'DAY PHASE'}
                  </div>
                  <div className="text-[9px] text-[#818b9c] tracking-[0.1em] uppercase">
                    {loading ? '---' : visibility.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-[#818b9c] font-bold tracking-[0.15em] uppercase mb-1.5">ORBIT NO.</div>
                <div className="text-xl text-white font-normal uppercase tracking-tight">
                  {formatNumber(estimatedOrbit, 0)}
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-[#232533] mx-4 py-6 px-4 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 z-10">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
            <button className="bg-white text-black hover:bg-[#e5e7eb] transition-colors text-[10px] font-extrabold tracking-[0.15em] px-8 py-3.5 uppercase rounded-sm">
              Export Logs
            </button>
            <Link 
              href="/iss" 
              className="bg-transparent border border-[#3f4150] text-[#d1d5db] hover:border-[#818b9c] transition-colors text-[10px] font-extrabold tracking-[0.15em] px-8 py-3.5 uppercase rounded-sm"
            >
              Map View
            </Link>
          </div>
          <div className="text-[10px] text-[#818b9c] font-bold tracking-[0.15em] uppercase text-center sm:text-right">
            REFRESH CYCLE: 15.0S
          </div>
        </div>

      </div>
    </motion.div>
  );
}
