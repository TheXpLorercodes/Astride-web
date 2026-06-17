import React from 'react';

export default function PageHeader({ title, intro, icon = '✨', color = 'var(--accent-purple)', count, suffix }) {
  return (
    <div style={{
      fontFamily: '"Inter", system-ui, sans-serif',
      marginBottom: '3rem',
      position: 'relative',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@700;900&family=DM+Mono:wght@400;500&display=swap');

        .ph-v2 {
          position: relative;
          padding: 2.8rem 0 2rem;
        }

        .ph-v2::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          border-radius: 0 2px 2px 0;
          background: var(--ph-color, #8b5cf6);
          opacity: 0.7;
        }

        .ph-v2-inner {
          padding-left: 1.6rem;
        }

        .ph-v2-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 999px;
          padding: 4px 12px 4px 8px;
          margin-bottom: 1.2rem;
        }

        .ph-v2-eyebrow-icon {
          font-size: 1rem;
          line-height: 1;
        }

        .ph-v2-eyebrow-text {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          font-weight: 500;
        }

        .ph-v2-eyebrow-count {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.18);
          margin-left: 2px;
        }

        .ph-v2-title {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(1.8rem, 4.5vw, 3.2rem);
          font-weight: 900;
          color: #fff;
          line-height: 1;
          letter-spacing: -0.02em;
          margin: 0 0 1rem;
          text-shadow: 0 0 40px rgba(255,255,255,0.05);
        }

        .ph-v2-intro {
          font-family: 'Inter', sans-serif;
          font-size: clamp(0.9rem, 1.5vw, 1.05rem);
          color: rgba(148,163,184,0.85);
          line-height: 1.7;
          max-width: 660px;
          font-weight: 400;
          margin: 0;
        }

        .ph-v2-rule {
          height: 1px;
          background: linear-gradient(90deg, rgba(255,255,255,0.08) 0%, transparent 70%);
          margin-top: 2rem;
        }
      `}</style>

      <div className="ph-v2" style={{ '--ph-color': color }}>
        <div className="ph-v2-inner">
          <div className="ph-v2-eyebrow">
            <span className="ph-v2-eyebrow-icon">{icon}</span>
            <span className="ph-v2-eyebrow-text">Database Query</span>
            {count != null && (
              <span className="ph-v2-eyebrow-count">· {count} {suffix || 'objects'}</span>
            )}
          </div>
          <h1 className="ph-v2-title">{title}</h1>
          <p className="ph-v2-intro">{intro}</p>
        </div>
        <div className="ph-v2-rule" />
      </div>
    </div>
  );
}
