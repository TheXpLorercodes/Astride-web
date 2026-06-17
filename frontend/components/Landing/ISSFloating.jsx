'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ISSFloating() {
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fmt = (v, d = 2) => (v == null || isNaN(v) ? '——' : Number(v).toFixed(d));
  const fmtCoord = (v, pos, neg) => {
    if (v == null || isNaN(v)) return { base: '——.——', dir: '' };
    return { base: Math.abs(v).toFixed(4), dir: v >= 0 ? pos : neg };
  };

  useEffect(() => {
    let id;
    let cancelled = false;

    const poll = async () => {
      try {
        const r = await fetch('/api/iss');
        if (!r.ok) throw new Error('signal lost');
        const d = await r.json();
        if (!cancelled) { setTelemetry(d); setError(null); setLoading(false); }
      } catch (e) {
        if (!cancelled) { setError(true); setLoading(false); }
      }
    };

    poll();
    id = setInterval(poll, 15000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  const lat = telemetry?.latitude;
  const lng = telemetry?.longitude;
  const alt = telemetry?.altitude;
  const vel = telemetry?.velocity;
  const vis = telemetry?.visibility || 'daylight';
  const isNight = vis.toLowerCase() === 'eclipsed';

  const latP = fmtCoord(lat, 'N', 'S');
  const lngP = fmtCoord(lng, 'E', 'W');

  const launchEpoch = 911630400000;
  const orbitDuration = 5560800;
  const orbitCount = Math.floor((Date.now() - launchEpoch) / orbitDuration);

  // ISS position on the orbital SVG ellipse (0–100% of ellipse perimeter)
  const orbitPhase = lat != null
    ? ((lng + 180) / 360) // 0..1 fraction around the orbit
    : 0.25;

  // Ellipse params (in SVG units, cx=200, cy=100, rx=170, ry=70)
  const ex = 200 + 170 * Math.cos(orbitPhase * 2 * Math.PI);
  const ey = 100 + 70 * Math.sin(orbitPhase * 2 * Math.PI);

  const metrics = [
    {
      id: 'alt',
      label: 'Altitude',
      value: loading ? '——' : `${fmt(alt, 1)}`,
      unit: 'km',
      icon: '↑',
      color: '#00ff88',
    },
    {
      id: 'vel',
      label: 'Velocity',
      value: loading ? '——' : Number(vel).toLocaleString('en', { maximumFractionDigits: 0 }),
      unit: 'km/h',
      icon: '⟶',
      color: '#f97316',
    },
    {
      id: 'orbit',
      label: 'Orbit #',
      value: loading ? '——' : orbitCount.toLocaleString(),
      unit: '',
      icon: '↺',
      color: '#60a5fa',
    },
    {
      id: 'mode',
      label: 'Phase',
      value: loading ? '——' : (isNight ? 'NIGHT' : 'DAYLIGHT'),
      unit: '',
      icon: isNight ? '☽' : '☀',
      color: isNight ? '#a78bfa' : '#fbbf24',
    },
  ];

  return (
    <div style={{ fontFamily: '"Inter", system-ui, sans-serif', width: '100%' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        .iss-v2 {
          background: #050a0e;
          border: 1px solid rgba(0,255,136,0.12);
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          box-shadow:
            0 0 0 1px rgba(0,255,136,0.05),
            0 40px 100px -30px rgba(0,0,0,0.95),
            inset 0 1px 0 rgba(0,255,136,0.06);
          transition: border-color 0.4s, box-shadow 0.4s;
        }

        .iss-v2:hover {
          border-color: rgba(0,255,136,0.22);
          box-shadow:
            0 0 0 1px rgba(0,255,136,0.1),
            0 40px 100px -20px rgba(0,0,0,0.95),
            0 0 60px -20px rgba(0,255,136,0.12),
            inset 0 1px 0 rgba(0,255,136,0.08);
        }

        /* Scanline texture */
        .iss-v2::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(0,255,136,0.009) 3px,
            rgba(0,255,136,0.009) 4px
          );
          pointer-events: none;
          z-index: 0;
        }

        /* Ambient gradient blobs */
        .iss-v2-ambience {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background:
            radial-gradient(ellipse at 15% 20%, rgba(0,180,255,0.05) 0%, transparent 45%),
            radial-gradient(ellipse at 85% 80%, rgba(0,255,136,0.05) 0%, transparent 45%);
        }

        .iss-v2-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.6rem;
          border-bottom: 1px solid rgba(0,255,136,0.09);
          position: relative;
          z-index: 2;
        }

        .iss-v2-live {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .iss-v2-live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #00ff88;
          box-shadow: 0 0 8px #00ff88, 0 0 16px rgba(0,255,136,0.5);
          animation: iss-v2-pulse 2s ease infinite;
          flex-shrink: 0;
        }

        @keyframes iss-v2-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }

        .iss-v2-live-text {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(0,255,136,0.85);
          font-weight: 500;
        }

        .iss-v2-id {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.18);
        }

        .iss-v2-body {
          display: grid;
          grid-template-columns: 1fr 1fr;
          position: relative;
          z-index: 2;
        }

        @media (max-width: 680px) {
          .iss-v2-body { grid-template-columns: 1fr; }
          .iss-v2-orbital-panel { border-left: none !important; border-top: 1px solid rgba(0,255,136,0.09) !important; }
        }

        .iss-v2-coords-panel {
          padding: 1.8rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.6rem;
        }

        .iss-v2-coord-block {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .iss-v2-coord-label {
          font-family: 'DM Mono', monospace;
          font-size: 8.5px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
        }

        .iss-v2-coord-value {
          font-family: 'DM Mono', monospace;
          font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 300;
          color: #e0f8ee;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .iss-v2-coord-dir {
          font-size: 0.45em;
          color: #00ff88;
          font-weight: 600;
          letter-spacing: 0.08em;
          margin-left: 5px;
          vertical-align: text-top;
        }

        .iss-v2-orbital-panel {
          border-left: 1px solid rgba(0,255,136,0.09);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1.6rem;
          gap: 1rem;
          position: relative;
          overflow: hidden;
          background: rgba(0,0,0,0.2);
        }

        .iss-v2-orbital-svg {
          width: 100%;
          max-width: 340px;
        }

        .iss-v2-orbital-label {
          font-family: 'DM Mono', monospace;
          font-size: 8px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(0,255,136,0.35);
          text-align: center;
        }

        .iss-v2-metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid rgba(0,255,136,0.09);
          position: relative;
          z-index: 2;
        }

        @media (max-width: 680px) {
          .iss-v2-metrics { grid-template-columns: repeat(2, 1fr); }
        }

        .iss-v2-metric {
          padding: 1.1rem 1.2rem;
          border-right: 1px solid rgba(0,255,136,0.07);
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .iss-v2-metric:last-child { border-right: none; }

        .iss-v2-metric-header {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .iss-v2-metric-icon {
          font-size: 10px;
          line-height: 1;
        }

        .iss-v2-metric-label {
          font-family: 'DM Mono', monospace;
          font-size: 7.5px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
        }

        .iss-v2-metric-value {
          font-family: 'DM Mono', monospace;
          font-size: 1.05rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          line-height: 1.2;
        }

        .iss-v2-metric-unit {
          font-size: 0.65em;
          opacity: 0.6;
          font-weight: 400;
          margin-left: 2px;
        }

        .iss-v2-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1.6rem;
          border-top: 1px solid rgba(0,255,136,0.09);
          position: relative;
          z-index: 2;
        }

        .iss-v2-refresh-info {
          font-family: 'DM Mono', monospace;
          font-size: 8px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.14);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .iss-v2-refresh-bar {
          width: 40px;
          height: 2px;
          background: rgba(255,255,255,0.06);
          border-radius: 99px;
          overflow: hidden;
          position: relative;
        }

        .iss-v2-refresh-bar::after {
          content: '';
          position: absolute;
          inset-y: 0;
          left: 0;
          width: 30%;
          background: rgba(0,255,136,0.5);
          border-radius: 99px;
          animation: iss-v2-progress 15s linear infinite;
        }

        @keyframes iss-v2-progress {
          from { width: 0%; }
          to { width: 100%; }
        }

        .iss-v2-cta {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: #050a0e;
          background: linear-gradient(135deg, #00ff88, #00e57a);
          border-radius: 999px;
          padding: 8px 18px;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 18px rgba(0,255,136,0.3);
        }

        .iss-v2-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,255,136,0.45);
        }

        /* ISS icon SVG animation */
        @keyframes iss-v2-orbit {
          from { offset-distance: 0%; }
          to { offset-distance: 100%; }
        }
      `}</style>

      <motion.div
        className="iss-v2"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="iss-v2-ambience" />

        {/* Header */}
        <div className="iss-v2-header">
          <div className="iss-v2-live">
            <div className="iss-v2-live-dot" />
            <span className="iss-v2-live-text">
              {error ? 'Signal Lost' : loading ? 'Acquiring…' : 'Live Telemetry'}
            </span>
          </div>
          <span className="iss-v2-id">ISS · ZARYA-01 · LEO · 408 km</span>
        </div>

        {/* Body */}
        <div className="iss-v2-body">
          {/* Coordinates */}
          <div className="iss-v2-coords-panel">
            <div className="iss-v2-coord-block">
              <span className="iss-v2-coord-label">Latitude</span>
              <div className="iss-v2-coord-value">
                {loading ? '——.——' : latP.base}
                {!loading && <span className="iss-v2-coord-dir">{latP.dir}°</span>}
              </div>
            </div>
            <div className="iss-v2-coord-block">
              <span className="iss-v2-coord-label">Longitude</span>
              <div className="iss-v2-coord-value">
                {loading ? '——.——' : lngP.base}
                {!loading && <span className="iss-v2-coord-dir">{lngP.dir}°</span>}
              </div>
            </div>
          </div>

          {/* Orbital SVG */}
          <div className="iss-v2-orbital-panel">
            <svg
              className="iss-v2-orbital-svg"
              viewBox="0 0 400 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Earth */}
              <defs>
                <radialGradient id="earthGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1e3a5f" />
                  <stop offset="100%" stopColor="#0a1628" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                  <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="issGlow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>

              {/* Orbital rings (background) */}
              <ellipse cx="200" cy="100" rx="160" ry="68" stroke="rgba(0,255,136,0.06)" strokeWidth="1" strokeDasharray="4 6" />
              <ellipse cx="200" cy="100" rx="140" ry="58" stroke="rgba(0,180,255,0.04)" strokeWidth="0.5" />

              {/* Earth */}
              <circle cx="200" cy="100" r="36" fill="url(#earthGrad)" />
              <circle cx="200" cy="100" r="36" stroke="rgba(30,100,160,0.6)" strokeWidth="1" />
              {/* Atmosphere glow */}
              <circle cx="200" cy="100" r="42" stroke="rgba(0,100,200,0.15)" strokeWidth="5" fill="none" />

              {/* Main orbit path */}
              <ellipse cx="200" cy="100" rx="160" ry="68" stroke="rgba(0,255,136,0.14)" strokeWidth="1" />

              {/* ISS dot - animated */}
              {!loading && !error && (
                <motion.g
                  filter="url(#issGlow)"
                  animate={{
                    cx: ex,
                    cy: ey,
                  }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear', repeatType: 'mirror' }}
                >
                  <circle cx={ex} cy={ey} r="5" fill="#00ff88" />
                  <circle cx={ex} cy={ey} r="9" fill="none" stroke="rgba(0,255,136,0.4)" strokeWidth="1" />
                </motion.g>
              )}

              {/* Loading state */}
              {(loading || error) && (
                <motion.circle
                  cx="360"
                  cy="100"
                  r="5"
                  fill={error ? '#f87171' : '#00ff88'}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}

              {/* Crosshair at center */}
              <line x1="196" y1="100" x2="204" y2="100" stroke="rgba(0,255,136,0.15)" strokeWidth="0.5" />
              <line x1="200" y1="96" x2="200" y2="104" stroke="rgba(0,255,136,0.15)" strokeWidth="0.5" />
            </svg>
            <span className="iss-v2-orbital-label">Orbital Track · Real-Time</span>
          </div>
        </div>

        {/* Metrics strip */}
        <div className="iss-v2-metrics">
          {metrics.map((m, i) => (
            <motion.div
              className="iss-v2-metric"
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
            >
              <div className="iss-v2-metric-header">
                <span className="iss-v2-metric-icon" style={{ color: m.color }}>{m.icon}</span>
                <span className="iss-v2-metric-label">{m.label}</span>
              </div>
              <span className="iss-v2-metric-value" style={{ color: m.color }}>
                {m.value}
                {m.unit && <span className="iss-v2-metric-unit">{m.unit}</span>}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="iss-v2-footer">
          <div className="iss-v2-refresh-info">
            <div className="iss-v2-refresh-bar" />
            Refresh: 15s
          </div>
          <Link href="/iss" className="iss-v2-cta">
            Full Map
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M6.5 2.5 10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}