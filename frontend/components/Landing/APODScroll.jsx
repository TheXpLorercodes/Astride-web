'use client';
import { motion } from 'framer-motion';

export default function APODScroll({ data }) {
  if (!data) return null;

  const fmtDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div style={{ fontFamily: '"Inter", system-ui, sans-serif', width: '100%' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,700;0,900;1,600&family=DM+Mono:wght@400;500&display=swap');

        .apod-v2 {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          background: #060811;
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 40px 120px -30px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05);
          transition: box-shadow 0.5s ease, border-color 0.5s ease;
        }

        .apod-v2:hover {
          box-shadow: 0 40px 120px -20px rgba(0,0,0,0.9), 0 0 0 1px rgba(245,158,11,0.2), inset 0 1px 0 rgba(255,255,255,0.07);
        }

        .apod-v2-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          overflow: hidden;
          background: #0a0c16;
        }

        @media (min-width: 900px) {
          .apod-v2-layout {
            display: grid;
            grid-template-columns: 1.05fr 0.95fr;
            min-height: 560px;
          }
          .apod-v2-image-wrap {
            aspect-ratio: unset;
            height: 100%;
            min-height: 460px;
          }
        }

        .apod-v2-image-wrap img,
        .apod-v2-image-wrap iframe,
        .apod-v2-image-wrap video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          inset: 0;
          transition: transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .apod-v2:hover .apod-v2-image-wrap img {
          transform: scale(1.06);
        }

        .apod-v2-image-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            transparent 40%,
            rgba(6,8,17,0.7) 80%,
            rgba(6,8,17,0.95) 100%
          );
          z-index: 1;
          pointer-events: none;
        }

        @media (max-width: 899px) {
          .apod-v2-image-gradient {
            background: linear-gradient(
              to bottom,
              transparent 40%,
              rgba(6,8,17,0.8) 80%,
              rgba(6,8,17,0.98) 100%
            );
          }
        }

        .apod-v2-badge {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
          padding: 1.1rem 1.4rem;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .apod-v2-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(245,158,11,0.12);
          border: 1px solid rgba(245,158,11,0.25);
          border-radius: 999px;
          padding: 4px 10px;
          width: fit-content;
          backdrop-filter: blur(8px);
        }

        .apod-v2-badge-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #f59e0b;
          box-shadow: 0 0 6px rgba(245,158,11,0.8);
        }

        .apod-v2-badge-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(245,158,11,0.9);
          font-weight: 500;
        }

        .apod-v2-badge-date {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.5);
          padding-left: 4px;
        }

        .apod-v2-info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 2.4rem 2.6rem;
          background: #060811;
          position: relative;
          z-index: 2;
        }

        .apod-v2-eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 1.2rem;
        }

        .apod-v2-eyebrow-line {
          width: 28px;
          height: 1.5px;
          background: linear-gradient(90deg, #f59e0b, #fbbf24);
          border-radius: 99px;
          flex-shrink: 0;
        }

        .apod-v2-eyebrow-text {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #f59e0b;
          font-weight: 500;
        }

        .apod-v2-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.55rem, 2.4vw, 2.4rem);
          font-weight: 900;
          color: #faf7f0;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin: 0 0 1.6rem;
        }

        .apod-v2-divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, rgba(245,158,11,0.3), rgba(255,255,255,0.06) 60%, transparent);
          margin-bottom: 1.4rem;
        }

        .apod-v2-text {
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
          line-height: 1.8;
          color: rgba(210,205,195,0.65);
          font-weight: 400;
          display: -webkit-box;
          -webkit-line-clamp: 6;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        .apod-v2-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 2rem;
          padding-top: 1.4rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .apod-v2-copyright {
          font-family: 'DM Mono', monospace;
          font-size: 8.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
        }

        .apod-v2-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: #0d0d14;
          background: linear-gradient(135deg, #f59e0b, #fbbf24);
          border-radius: 999px;
          padding: 9px 20px;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(245,158,11,0.35);
          white-space: nowrap;
        }

        .apod-v2-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(245,158,11,0.5);
          background: linear-gradient(135deg, #fbbf24, #fcd34d);
        }

        .apod-v2-btn svg {
          transition: transform 0.25s ease;
        }

        .apod-v2-btn:hover svg {
          transform: translateX(3px);
        }

        /* ambient glow */
        .apod-v2-glow {
          position: absolute;
          top: -60px;
          right: -40px;
          width: 360px;
          height: 360px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
      `}</style>

      <motion.div
        className="apod-v2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="apod-v2-layout">
          {/* Image column */}
          <div className="apod-v2-image-wrap">
            {data.media_type === 'video' ? (
              data.url?.includes('youtube.com') || data.url?.includes('vimeo.com') ? (
                <iframe src={data.url} title={data.title} allow="autoplay; encrypted-media" allowFullScreen />
              ) : (
                <video src={data.url} autoPlay muted loop playsInline />
              )
            ) : (
              <img src={data.url} alt={data.title} />
            )}
            <div className="apod-v2-image-gradient" />
            <div className="apod-v2-badge">
              <div className="apod-v2-badge-pill">
                <div className="apod-v2-badge-dot" />
                <span className="apod-v2-badge-label">NASA · APOD</span>
              </div>
              <span className="apod-v2-badge-date">{fmtDate(data.date)}</span>
            </div>
          </div>

          {/* Info column */}
          <div className="apod-v2-info">
            <div className="apod-v2-glow" />

            <div>
              <div className="apod-v2-eyebrow">
                <div className="apod-v2-eyebrow-line" />
                <span className="apod-v2-eyebrow-text">Astronomy Picture of the Day</span>
              </div>

              <motion.h2
                className="apod-v2-title"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                {data.title}
              </motion.h2>

              <div className="apod-v2-divider" />

              <p className="apod-v2-text">{data.explanation}</p>
            </div>

            <div className="apod-v2-footer">
              {data.copyright ? (
                <span className="apod-v2-copyright">© {data.copyright}</span>
              ) : (
                <span className="apod-v2-copyright">NASA / JPL</span>
              )}
              <a href="/apod" className="apod-v2-btn">
                Archive
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7h9M7.5 3.5 11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}