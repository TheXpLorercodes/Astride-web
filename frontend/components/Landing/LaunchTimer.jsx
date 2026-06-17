'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LaunchTimer({ data }) {
  const [timeLeft, setTimeLeft] = useState({ d: '00', h: '00', m: '00', s: '00' });
  const [launched, setLaunched] = useState(false);
  const [prevTime, setPrevTime] = useState({ d: '00', h: '00', m: '00', s: '00' });

  useEffect(() => {
    if (!data?.net) return;

    const calculate = () => {
      const diff = new Date(data.net) - Date.now();
      if (diff <= 0) { setLaunched(true); return; }
      setLaunched(false);
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const next = {
        d: String(d).padStart(2, '0'),
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0'),
      };
      setPrevTime(t => t);
      setTimeLeft(next);
    };

    calculate();
    const id = setInterval(calculate, 1000);
    return () => clearInterval(id);
  }, [data]);

  if (!data) return null;

  const missionName = data.name?.split('|')[0]?.trim() || data.name;
  const provider = data.launch_service_provider?.name || 'Mission Control';
  const pad = data.pad?.name || data.pad?.location?.name || 'Orbital Platform';
  const missionType = data.mission?.type || 'Classified';
  const launchDate = data.net ? new Date(data.net).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  }) : '';

  const units = [
    { label: 'Days', value: timeLeft.d, key: 'd' },
    { label: 'Hours', value: timeLeft.h, key: 'h' },
    { label: 'Min', value: timeLeft.m, key: 'm' },
    { label: 'Sec', value: timeLeft.s, key: 's' },
  ];

  return (
    <div style={{ fontFamily: '"Inter", system-ui, sans-serif', width: '100%' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Bebas+Neue&family=DM+Mono:wght@400;500&display=swap');

        .lt-v2 {
          background: #080610;
          border: 1px solid rgba(249,115,22,0.15);
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          box-shadow:
            0 0 0 1px rgba(249,115,22,0.05),
            0 40px 100px -30px rgba(0,0,0,0.95),
            inset 0 1px 0 rgba(249,115,22,0.06);
          transition: border-color 0.4s, box-shadow 0.4s;
        }

        .lt-v2:hover {
          border-color: rgba(249,115,22,0.25);
          box-shadow:
            0 0 0 1px rgba(249,115,22,0.1),
            0 40px 100px -20px rgba(0,0,0,0.95),
            0 0 80px -20px rgba(249,115,22,0.1),
            inset 0 1px 0 rgba(249,115,22,0.08);
        }

        /* Top accent bar */
        .lt-v2::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, #f97316 20%, #ef4444 50%, #f97316 80%, transparent 100%);
          z-index: 2;
        }

        .lt-v2-ambient {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background:
            radial-gradient(ellipse at 10% 50%, rgba(249,115,22,0.06) 0%, transparent 55%),
            radial-gradient(ellipse at 90% 20%, rgba(239,68,68,0.05) 0%, transparent 50%);
        }

        .lt-v2-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.1rem 1.8rem;
          border-bottom: 1px solid rgba(249,115,22,0.1);
          position: relative;
          z-index: 2;
        }

        .lt-v2-live-pill {
          display: flex;
          align-items: center;
          gap: 7px;
          background: rgba(249,115,22,0.1);
          border: 1px solid rgba(249,115,22,0.2);
          border-radius: 999px;
          padding: 4px 12px;
        }

        .lt-v2-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #f97316;
          box-shadow: 0 0 6px #f97316, 0 0 12px rgba(249,115,22,0.5);
          animation: lt-v2-blink 1.4s ease infinite;
        }

        @keyframes lt-v2-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }

        .lt-v2-live-text {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(249,115,22,0.9);
          font-weight: 500;
        }

        .lt-v2-provider {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
        }

        .lt-v2-body {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 2rem;
          padding: 2rem 2rem 1.6rem;
          position: relative;
          z-index: 2;
        }

        @media (max-width: 720px) {
          .lt-v2-body {
            grid-template-columns: 1fr;
            gap: 1.6rem;
          }
        }

        .lt-v2-mission-block {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-width: 0;
        }

        .lt-v2-mission-label {
          font-family: 'DM Mono', monospace;
          font-size: 8.5px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(249,115,22,0.65);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .lt-v2-mission-label::before {
          content: '';
          width: 24px;
          height: 1.5px;
          background: linear-gradient(90deg, #f97316, #ef4444);
          border-radius: 99px;
          flex-shrink: 0;
        }

        .lt-v2-mission-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2rem, 4.5vw, 3.6rem);
          letter-spacing: 0.04em;
          line-height: 1;
          color: #fff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .lt-v2-datetime {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.1em;
          margin-top: 2px;
        }

        .lt-v2-countdown {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          flex-shrink: 0;
        }

        @media (max-width: 720px) {
          .lt-v2-countdown { width: 100%; }
        }

        .lt-v2-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(249,115,22,0.06);
          border: 1px solid rgba(249,115,22,0.12);
          border-radius: 14px;
          padding: 1rem 0.7rem 0.8rem;
          min-width: 72px;
          position: relative;
          overflow: hidden;
          transition: background 0.3s, border-color 0.3s;
        }

        .lt-v2-unit:hover {
          background: rgba(249,115,22,0.1);
          border-color: rgba(249,115,22,0.22);
        }

        /* Inner glow on unit */
        .lt-v2-unit::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .lt-v2-digit {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.2rem, 4vw, 3.4rem);
          line-height: 1;
          letter-spacing: 0.02em;
          color: #fff;
          text-shadow: 0 0 30px rgba(249,115,22,0.5), 0 0 60px rgba(249,115,22,0.2);
          position: relative;
          z-index: 1;
        }

        .lt-v2-digit-label {
          font-family: 'DM Mono', monospace;
          font-size: 7px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: rgba(249,115,22,0.55);
          margin-top: 5px;
          position: relative;
          z-index: 1;
        }

        .lt-v2-launched {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.5rem, 6vw, 4rem);
          letter-spacing: 0.08em;
          color: #f97316;
          text-align: center;
          padding: 2rem;
          text-shadow: 0 0 40px rgba(249,115,22,0.6);
          position: relative;
          z-index: 2;
        }

        .lt-v2-meta {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          border-top: 1px solid rgba(249,115,22,0.09);
          position: relative;
          z-index: 2;
        }

        @media (max-width: 560px) {
          .lt-v2-meta { grid-template-columns: 1fr 1fr; }
          .lt-v2-meta-item:last-child { display: none; }
        }

        .lt-v2-meta-item {
          padding: 0.85rem 1.6rem;
          border-right: 1px solid rgba(249,115,22,0.07);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .lt-v2-meta-item:last-child { border-right: none; }

        .lt-v2-meta-label {
          font-family: 'DM Mono', monospace;
          font-size: 7.5px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
        }

        .lt-v2-meta-value {
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          color: rgba(255,255,255,0.65);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .lt-v2-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0.85rem 1.6rem;
          border-top: 1px solid rgba(249,115,22,0.07);
          position: relative;
          z-index: 2;
        }

        .lt-v2-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: #fff;
          background: linear-gradient(135deg, #f97316, #ef4444);
          border-radius: 999px;
          padding: 9px 20px;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 18px rgba(249,115,22,0.35);
        }

        .lt-v2-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(249,115,22,0.5);
        }
      `}</style>

      <motion.div
        className="lt-v2"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="lt-v2-ambient" />

        {/* Header */}
        <div className="lt-v2-header">
          <div className="lt-v2-live-pill">
            <div className="lt-v2-live-dot" />
            <span className="lt-v2-live-text">T-Minus Countdown</span>
          </div>
          <span className="lt-v2-provider">{provider}</span>
        </div>

        {/* Main body: mission name + countdown */}
        <div className="lt-v2-body">
          <div className="lt-v2-mission-block">
            <div className="lt-v2-mission-label">Next Launch</div>
            <div className="lt-v2-mission-name">{missionName}</div>
            {launchDate && <div className="lt-v2-datetime">{launchDate}</div>}
          </div>

          {launched ? (
            <div className="lt-v2-launched">LAUNCHED 🚀</div>
          ) : (
            <div className="lt-v2-countdown">
              {units.map((u) => (
                <motion.div
                  key={u.key}
                  className="lt-v2-unit"
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <span className="lt-v2-digit">{u.value}</span>
                  <span className="lt-v2-digit-label">{u.label}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Meta strip */}
        <div className="lt-v2-meta">
          <div className="lt-v2-meta-item">
            <span className="lt-v2-meta-label">Launch Site</span>
            <span className="lt-v2-meta-value">{pad}</span>
          </div>
          <div className="lt-v2-meta-item">
            <span className="lt-v2-meta-label">Mission Type</span>
            <span className="lt-v2-meta-value">{missionType}</span>
          </div>
          <div className="lt-v2-meta-item">
            <span className="lt-v2-meta-label">Provider</span>
            <span className="lt-v2-meta-value">{provider}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="lt-v2-footer">
          <a href="/launches" className="lt-v2-cta">
            All Launches
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 6.5h9M7.5 3 11 6.5 7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </motion.div>
    </div>
  );
}