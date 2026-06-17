'use client';
import { motion } from 'framer-motion';

export default function NewsStaggered({ news }) {
  if (!news || news.length === 0) return null;

  const items = news.slice(0, 4);
  const [lead, ...rest] = items;

  const fmtDate = (d) => {
    if (!d) return '';
    const date = new Date(d);
    const now = new Date();
    const diffH = Math.floor((now - date) / 3600000);
    if (diffH < 1) return 'Just now';
    if (diffH < 24) return `${diffH}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div style={{ fontFamily: '"Inter", system-ui, sans-serif', width: '100%' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,700;0,900;1,600&family=DM+Mono:wght@400;500&display=swap');

        .ns-v2 {
          border-radius: 24px;
          overflow: hidden;
          background: #070910;
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 40px 100px -30px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.04);
        }

        .ns-v2-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.1rem 1.8rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          position: relative;
          overflow: hidden;
        }

        /* Left accent stripe on header */
        .ns-v2-header::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, #f59e0b, #f97316);
          border-radius: 0 2px 2px 0;
        }

        .ns-v2-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-left: 4px;
        }

        .ns-v2-header-title {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          font-weight: 500;
        }

        .ns-v2-header-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(245,158,11,0.1);
          border: 1px solid rgba(245,158,11,0.2);
          border-radius: 999px;
          padding: 3px 8px;
        }

        .ns-v2-header-badge-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #f59e0b;
          box-shadow: 0 0 5px rgba(245,158,11,0.8);
          animation: ns-blink 2s ease infinite;
        }

        @keyframes ns-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .ns-v2-header-badge-text {
          font-family: 'DM Mono', monospace;
          font-size: 8px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(245,158,11,0.85);
          font-weight: 500;
        }

        .ns-v2-header-date {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          color: rgba(255,255,255,0.18);
        }

        /* Main bento grid */
        .ns-v2-grid {
          display: grid;
          grid-template-columns: 1.55fr 1fr 1fr;
          min-height: 420px;
        }

        @media (max-width: 860px) {
          .ns-v2-grid {
            grid-template-columns: 1fr 1fr;
          }
          .ns-v2-card-lead {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 560px) {
          .ns-v2-grid {
            grid-template-columns: 1fr;
          }
          .ns-v2-card-lead {
            grid-column: auto;
          }
        }

        /* Lead card */
        .ns-v2-card-lead {
          position: relative;
          overflow: hidden;
          border-right: 1px solid rgba(255,255,255,0.06);
          cursor: pointer;
          display: flex;
          flex-direction: column;
        }

        .ns-v2-card-lead-image {
          position: relative;
          flex: 1;
          min-height: 240px;
          overflow: hidden;
          background: #0a0c14;
        }

        .ns-v2-card-lead-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          inset: 0;
          transition: transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.5s ease;
          filter: brightness(0.9) saturate(0.85);
        }

        .ns-v2-card-lead:hover .ns-v2-card-lead-image img {
          transform: scale(1.06);
          filter: brightness(1) saturate(1);
        }

        .ns-v2-card-lead-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 20%,
            rgba(7,9,16,0.7) 65%,
            rgba(7,9,16,0.97) 100%
          );
          z-index: 1;
          pointer-events: none;
        }

        .ns-v2-card-lead-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1.6rem;
          z-index: 2;
        }

        .ns-v2-card-no-image {
          padding: 1.6rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          flex: 1;
          background: linear-gradient(135deg, rgba(245,158,11,0.04), transparent);
        }

        .ns-v2-source-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'DM Mono', monospace;
          font-size: 8.5px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #f59e0b;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .ns-v2-source-tag::before {
          content: '';
          width: 14px;
          height: 1.5px;
          background: #f59e0b;
          border-radius: 99px;
          opacity: 0.7;
          flex-shrink: 0;
        }

        .ns-v2-lead-headline {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.15rem, 2vw, 1.6rem);
          font-weight: 700;
          color: #faf8f2;
          line-height: 1.25;
          margin: 0 0 0.7rem;
          transition: color 0.25s;
        }

        .ns-v2-card-lead:hover .ns-v2-lead-headline {
          color: #fef3c7;
        }

        .ns-v2-lead-summary {
          font-family: 'Inter', sans-serif;
          font-size: 0.82rem;
          color: rgba(210,205,195,0.55);
          line-height: 1.7;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .ns-v2-read-more {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 600;
          color: #f59e0b;
          text-decoration: none;
          margin-top: 0.5rem;
          transition: gap 0.2s;
        }

        .ns-v2-read-more:hover { gap: 10px; }

        /* Secondary cards */
        .ns-v2-card {
          border-right: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          transition: background 0.3s;
        }

        .ns-v2-card:last-child { border-right: none; }

        .ns-v2-card:hover {
          background: rgba(255,255,255,0.02);
        }

        .ns-v2-card-thumb {
          width: 100%;
          aspect-ratio: 16/9;
          overflow: hidden;
          background: #0a0c16;
          position: relative;
          flex-shrink: 0;
        }

        .ns-v2-card-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s ease, filter 0.4s ease;
          filter: brightness(0.85) saturate(0.75);
        }

        .ns-v2-card:hover .ns-v2-card-thumb img {
          transform: scale(1.05);
          filter: brightness(1) saturate(1);
        }

        .ns-v2-card-thumb-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(7,9,16,0.6) 100%);
        }

        .ns-v2-card-body {
          padding: 1rem 1.2rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }

        .ns-v2-card-source {
          font-family: 'DM Mono', monospace;
          font-size: 8px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(245,158,11,0.65);
          font-weight: 500;
        }

        .ns-v2-card-headline {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 0.88rem;
          font-weight: 700;
          color: rgba(240,236,228,0.88);
          line-height: 1.3;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.25s;
        }

        .ns-v2-card:hover .ns-v2-card-headline {
          color: rgba(254,243,199,0.95);
        }

        .ns-v2-card-date {
          font-family: 'DM Mono', monospace;
          font-size: 8px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.18);
          margin-top: auto;
        }

        .ns-v2-card-link {
          position: absolute;
          inset: 0;
        }

        /* Footer */
        .ns-v2-footer {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 0.9rem 1.8rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ns-v2-footer-label {
          font-family: 'DM Mono', monospace;
          font-size: 8.5px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.15);
        }

        .ns-v2-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #f59e0b;
          text-decoration: none;
          border: 1px solid rgba(245,158,11,0.25);
          border-radius: 999px;
          padding: 8px 18px;
          transition: all 0.3s ease;
          background: rgba(245,158,11,0.05);
        }

        .ns-v2-all-btn:hover {
          background: rgba(245,158,11,0.12);
          border-color: rgba(245,158,11,0.5);
          transform: translateY(-1px);
        }
      `}</style>

      <motion.div
        className="ns-v2"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Header */}
        <div className="ns-v2-header">
          <div className="ns-v2-header-left">
            <span className="ns-v2-header-title">Spaceflight Dispatches</span>
            <div className="ns-v2-header-badge">
              <div className="ns-v2-header-badge-dot" />
              <span className="ns-v2-header-badge-text">Live Feed</span>
            </div>
          </div>
          <span className="ns-v2-header-date">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {/* Bento Grid */}
        <div className="ns-v2-grid">
          {/* Lead card */}
          {lead && (
            <motion.div
              className="ns-v2-card-lead"
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {lead.image_url || lead.urlToImage ? (
                <div className="ns-v2-card-lead-image">
                  <img src={lead.image_url || lead.urlToImage} alt={lead.title} loading="lazy" />
                  <div className="ns-v2-card-lead-overlay" />
                  <div className="ns-v2-card-lead-content">
                    <div className="ns-v2-source-tag">{lead.news_site || lead.source?.name || 'Wire'}</div>
                    <h3 className="ns-v2-lead-headline">{lead.title}</h3>
                    <p className="ns-v2-lead-summary">{lead.summary || lead.description}</p>
                    <a href={lead.url} target="_blank" rel="noopener noreferrer" className="ns-v2-read-more">
                      Read story
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6h8M6 2.5 9.5 6 6 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="ns-v2-card-no-image">
                  <div className="ns-v2-source-tag">{lead.news_site || lead.source?.name || 'Wire'}</div>
                  <h3 className="ns-v2-lead-headline">{lead.title}</h3>
                  <p className="ns-v2-lead-summary">{lead.summary || lead.description}</p>
                  <a href={lead.url} target="_blank" rel="noopener noreferrer" className="ns-v2-read-more">
                    Read story →
                  </a>
                </div>
              )}
            </motion.div>
          )}

          {/* Secondary cards */}
          {rest.map((article, i) => (
            <motion.div
              className="ns-v2-card"
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.18 + i * 0.1 }}
            >
              {(article.image_url || article.urlToImage) && (
                <div className="ns-v2-card-thumb">
                  <img src={article.image_url || article.urlToImage} alt={article.title} loading="lazy" />
                  <div className="ns-v2-card-thumb-overlay" />
                </div>
              )}
              <div className="ns-v2-card-body">
                <span className="ns-v2-card-source">{article.news_site || article.source?.name || 'Wire'}</span>
                <h4 className="ns-v2-card-headline">{article.title}</h4>
                <span className="ns-v2-card-date">{fmtDate(article.published_at)}</span>
              </div>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ns-v2-card-link"
                aria-label={article.title}
              />
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="ns-v2-footer">
          <span className="ns-v2-footer-label">Live editorial feed</span>
          <a href="/news" className="ns-v2-all-btn">
            All dispatches
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M6 2.5 9.5 6 6 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </motion.div>
    </div>
  );
}