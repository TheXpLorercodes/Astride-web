'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ISSFloating() {
  const [position, setPosition] = useState({ lat: 0, lng: 0 });
  const [loading, setLoading] = useState(true);

  const altitudeKm = 408.2;
  const velocityKmh = 27600;
  const orbitalPeriod = 92.7;
  const feedUptime = '00:00:05';
  const logLines = [
    '[POWER] Solar array output nominal',
    '[THERM] Radiator temp 18.4C',
    '[NAV] GPS lock - 6 satellites',
    '[COMM] Ku-band uplink active',
  ];

  useEffect(() => {
    const fetchISS = async () => {
      try {
        const res = await fetch('/api/iss');
        const data = await res.json();
        setPosition({
          lat: parseFloat(data.latitude),
          lng: parseFloat(data.longitude),
        });
        setLoading(false);
      } catch (err) {
        console.error('ISS Fetch error:', err);
      }
    };

    fetchISS();
    const interval = setInterval(fetchISS, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full flex flex-col items-center text-left"
    >
      <div className="w-full max-w-[980px] px-1 md:px-0">
        <div className="flex items-center justify-between gap-4 border-b border-white/6 pb-4">
          <p className="text-[8px] md:text-[9px] font-mono uppercase tracking-[0.34em] text-slate-500">
            Telemetry // Stratos-1 | ISS Orbital Link | Node-3 Uplink
          </p>
          <div className="shrink-0 rounded-sm border border-green-500/30 bg-green-500/8 px-3 py-1.5 text-[8px] md:text-[9px] font-mono font-black uppercase tracking-[0.2em] text-green-400">
            COMM-LINK ESTABLISHED
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8 pt-8">
          <div className="space-y-6">
            <div>
              <h2 className="max-w-[8ch] text-[clamp(3rem,7vw,5.4rem)] font-orbitron font-black uppercase leading-[0.88] tracking-[-0.06em] text-white">
                Orbital Telemetry
              </h2>
              <p className="mt-3 text-[11px] md:text-[12px] font-mono uppercase tracking-[0.34em] text-slate-500">
                ISS Live Link // Real-Time Feed
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-[8px] border border-purple-500/25 bg-[#0d1020]/80 px-5 py-5 md:px-6 md:py-6">
                <span className="block text-[8px] font-mono uppercase tracking-[0.34em] text-slate-500">.Latitude</span>
                <p className="mt-6 text-[clamp(2.6rem,5vw,4.2rem)] font-orbitron font-black text-white tracking-[-0.06em] leading-none">
                  {loading ? '--' : position.lat.toFixed(4)}
                </p>
                <p className="mt-4 text-[12px] text-slate-500">{loading ? 'Loading...' : 'Live orbital position'}</p>
              </div>

              <div className="rounded-[8px] border border-purple-500/25 bg-[#0d1020]/80 px-5 py-5 md:px-6 md:py-6">
                <span className="block text-[8px] font-mono uppercase tracking-[0.34em] text-slate-500">.Longitude</span>
                <p className="mt-6 text-[clamp(2.6rem,5vw,4.2rem)] font-orbitron font-black text-white tracking-[-0.06em] leading-none">
                  {loading ? '--' : position.lng.toFixed(4)}
                </p>
                <p className="mt-4 text-[12px] text-slate-500">{loading ? 'Loading...' : 'Live orbital position'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-[8px] border border-white/8 bg-black/20 px-4 py-4">
                <span className="block text-[8px] font-mono uppercase tracking-[0.34em] text-slate-600">Altitude</span>
                <p className="mt-5 text-[1.9rem] font-orbitron font-black text-purple-400 leading-none">--</p>
                <p className="mt-3 text-[12px] text-slate-500">km ASL</p>
                <div className="mt-3 h-[2px] w-full bg-white/8">
                  <div className="h-full w-[58%] bg-purple-400" />
                </div>
              </div>

              <div className="rounded-[8px] border border-white/8 bg-black/20 px-4 py-4">
                <span className="block text-[8px] font-mono uppercase tracking-[0.34em] text-slate-600">Velocity</span>
                <p className="mt-5 text-[1.9rem] font-orbitron font-black text-cyan-400 leading-none">--</p>
                <p className="mt-3 text-[12px] text-slate-500">km/h orbital</p>
                <div className="mt-3 h-[2px] w-full bg-white/8">
                  <div className="h-full w-[84%] bg-cyan-400" />
                </div>
              </div>

              <div className="rounded-[8px] border border-white/8 bg-black/20 px-4 py-4">
                <span className="block text-[8px] font-mono uppercase tracking-[0.34em] text-slate-600">Orbital Period</span>
                <p className="mt-5 text-[1.9rem] font-orbitron font-black text-amber-400 leading-none">{orbitalPeriod}</p>
                <p className="mt-3 text-[12px] text-slate-500">min / revolution</p>
                <div className="mt-3 h-[2px] w-full bg-white/8">
                  <div className="h-full w-[65%] bg-amber-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1.45fr_0.75fr] gap-4">
              <div className="rounded-[8px] border border-purple-500/14 bg-[#0b0e1c]/85 px-4 py-4 min-h-[180px]">
                <div className="relative h-full min-h-[150px] overflow-hidden rounded-[6px]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12),transparent_30%)]" />
                  <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/30 bg-blue-500/15 shadow-[0_0_24px_rgba(59,130,246,0.35)]" />
                  <div className="absolute left-1/2 top-1/2 h-[120px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-purple-400/35" />
                  <div className="absolute left-[66%] top-[40%] h-3 w-3 rounded-full bg-purple-400 shadow-[0_0_14px_rgba(168,85,247,0.9)]" />
                  <div className="absolute left-[68%] top-[33%] text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500">ISS</div>
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] font-mono uppercase tracking-[0.16em] text-blue-200/60">Earth</div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-mono uppercase tracking-[0.2em] text-slate-700">
                    Orbit Visualization - Not To Scale
                  </div>
                </div>
              </div>

              <div className="rounded-[8px] border border-white/8 bg-black/30 px-4 py-4 min-h-[180px]">
                <span className="block text-[8px] font-mono uppercase tracking-[0.34em] text-slate-600 mb-4">Telemetry Log</span>
                <div className="space-y-3">
                  {logLines.map((line, index) => (
                    <div key={line} className={`text-[12px] font-mono leading-5 ${index === 0 || index === 2 || index === 3 ? 'text-green-400' : 'text-slate-400'}`}>
                      <span className="mr-3 text-purple-400">10:32:{index === 3 ? '21' : '19' + index}</span>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-white/6 pt-4">
              <p className="text-[12px] font-mono text-slate-500">
                Next overhead pass: <span className="text-amber-400">calculating...</span>
              </p>
              <div className="flex items-center gap-5">
                <p className="text-[12px] font-mono text-slate-500">
                  Feed uptime: <span className="text-green-400">{feedUptime}</span>
                </p>
                <Link href="/iss" className="inline-flex items-center gap-2 rounded-sm border border-purple-500/25 bg-purple-500/8 px-3 py-2 text-[11px] font-mono font-black uppercase tracking-[0.16em] text-white hover:border-purple-400/40 hover:bg-purple-500/14 transition-colors">
                  Access Tracking Interface
                  <span aria-hidden="true">{'->'}</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="rounded-[8px] border border-white/8 bg-black/18 px-5 py-5 min-h-[540px]">
              <span className="block text-[8px] font-mono uppercase tracking-[0.34em] text-slate-600 mb-4">Node Status</span>
              <div className="space-y-4">
                <div className="rounded-[6px] border border-white/6 bg-white/[0.02] px-4 py-4">
                  <p className="text-[8px] font-mono uppercase tracking-[0.28em] text-slate-600">Altitude</p>
                  <p className="mt-4 text-[2rem] font-orbitron font-black text-purple-400 leading-none">{altitudeKm}</p>
                  <p className="mt-2 text-[12px] text-slate-500">km ASL</p>
                </div>
                <div className="rounded-[6px] border border-white/6 bg-white/[0.02] px-4 py-4">
                  <p className="text-[8px] font-mono uppercase tracking-[0.28em] text-slate-600">Velocity</p>
                  <p className="mt-4 text-[2rem] font-orbitron font-black text-cyan-400 leading-none">{velocityKmh}</p>
                  <p className="mt-2 text-[12px] text-slate-500">km/h orbital</p>
                </div>
                <div className="rounded-[6px] border border-white/6 bg-white/[0.02] px-4 py-4">
                  <p className="text-[8px] font-mono uppercase tracking-[0.28em] text-slate-600">Orbital Period</p>
                  <p className="mt-4 text-[2rem] font-orbitron font-black text-amber-400 leading-none">{orbitalPeriod}</p>
                  <p className="mt-2 text-[12px] text-slate-500">min / revolution</p>
                </div>
                <div className="rounded-[6px] border border-green-500/20 bg-green-500/6 px-4 py-4">
                  <p className="text-[8px] font-mono uppercase tracking-[0.28em] text-green-500">Feed Uptime</p>
                  <p className="mt-4 text-[1.7rem] font-orbitron font-black text-green-400 leading-none">{feedUptime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
