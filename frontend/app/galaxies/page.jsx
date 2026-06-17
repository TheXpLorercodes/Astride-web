import React from 'react';
import { fetchGalaxies } from '../../lib/cosmoDataApi';
import PageHeader from '../../components/PageHeader/PageHeader';
import SpaceGridClient from '../../components/SpaceGridClient/SpaceGridClient';
import Link from 'next/link';

export const metadata = {
  title: 'Galactic Structures | Astride',
  description: 'Explore massive cosmic islands containing billions of stars, dust, gas clouds, and dark matter spanning hundreds of thousands of light-years.',
};

export const revalidate = 3600;

export default async function GalaxiesPage() {
  const { data: galaxies, error } = await fetchGalaxies();

  if (error) {
    throw new Error('Failed to load galaxy database');
  }

  const featuredGalaxy = galaxies?.find(g => g.is_featured);
  const regularGalaxies = galaxies;

  // Quick facts for the info strip
  const GALAXY_FACTS = [
    { icon: '🌌', label: 'Observable Universe', value: '~2 Trillion Galaxies' },
    { icon: '⭐', label: 'Milky Way Stars', value: '100–400 Billion' },
    { icon: '📏', label: 'Milky Way Diameter', value: '~105,700 Light-years' },
    { icon: '🌀', label: 'Galaxy Types', value: 'Spiral, Elliptical, Irregular' },
    { icon: '🕳️', label: 'Our Galactic Center', value: 'Sagittarius A* (Black Hole)' },
    { icon: '🔭', label: 'Nearest Galaxy', value: 'Canis Major Dwarf (~25,000 ly)' },
  ];

  return (
    <div className="page galaxies-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@700;900&family=Playfair+Display:ital,wght@0,700;1,600&family=DM+Mono:wght@400;500&display=swap');

        .gal-featured {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          background: #060812;
          border: 1px solid rgba(139,92,246,0.18);
          box-shadow: 0 30px 80px -20px rgba(0,0,0,0.9), 0 0 0 1px rgba(139,92,246,0.06);
          margin-bottom: 3rem;
          transition: border-color 0.4s, box-shadow 0.4s;
        }

        .gal-featured:hover {
          border-color: rgba(139,92,246,0.35);
          box-shadow: 0 30px 80px -10px rgba(0,0,0,0.9), 0 0 60px -20px rgba(139,92,246,0.2);
        }

        /* Top gradient accent */
        .gal-featured::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, #8b5cf6 30%, #a78bfa 50%, #8b5cf6 70%, transparent 100%);
          z-index: 2;
        }

        .gal-featured-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 440px;
        }

        @media (max-width: 860px) {
          .gal-featured-inner { grid-template-columns: 1fr; }
          .gal-featured-img-col { min-height: 260px; }
          .gal-featured-info-col { border-left: none !important; border-top: 1px solid rgba(139,92,246,0.1) !important; }
        }

        .gal-featured-img-col {
          position: relative;
          overflow: hidden;
          background: #040612;
        }

        .gal-featured-img-col img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          inset: 0;
          display: block;
          filter: saturate(0.9) brightness(0.85);
          transition: transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.5s;
        }

        .gal-featured:hover .gal-featured-img-col img {
          transform: scale(1.06);
          filter: saturate(1.1) brightness(1);
        }

        .gal-featured-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, transparent 30%, rgba(6,8,18,0.6) 70%, rgba(6,8,18,0.95) 100%);
          z-index: 1;
          pointer-events: none;
        }

        @media (max-width: 860px) {
          .gal-featured-img-overlay {
            background: linear-gradient(to bottom, transparent 30%, rgba(6,8,18,0.95) 100%);
          }
        }

        .gal-featured-badge {
          position: absolute;
          top: 1.2rem;
          left: 1.2rem;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 7px;
          background: rgba(139,92,246,0.15);
          border: 1px solid rgba(139,92,246,0.3);
          border-radius: 999px;
          padding: 5px 12px;
          backdrop-filter: blur(8px);
        }

        .gal-featured-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #a78bfa;
          box-shadow: 0 0 6px rgba(167,139,250,0.8);
        }

        .gal-featured-badge-text {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(167,139,250,0.9);
          font-weight: 500;
        }

        .gal-featured-info-col {
          display: flex;
          flex-direction: column;
          padding: 2.4rem 2.6rem;
          border-left: 1px solid rgba(139,92,246,0.1);
          background: rgba(5,5,15,0.6);
          position: relative;
          z-index: 2;
        }

        .gal-featured-eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 1rem;
        }

        .gal-featured-eyebrow-line {
          width: 24px;
          height: 1.5px;
          background: linear-gradient(90deg, #8b5cf6, #a78bfa);
          border-radius: 99px;
        }

        .gal-featured-eyebrow-text {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #a78bfa;
          font-weight: 500;
        }

        .gal-featured-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.8rem, 3vw, 2.8rem);
          font-weight: 700;
          color: #f5f0ff;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin: 0 0 0.6rem;
        }

        .gal-featured-subtitle {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: rgba(167,139,250,0.6);
          margin-bottom: 1.4rem;
          text-transform: uppercase;
        }

        .gal-featured-divider {
          height: 1px;
          background: linear-gradient(90deg, rgba(139,92,246,0.35), rgba(255,255,255,0.04) 60%, transparent);
          margin-bottom: 1.4rem;
        }

        .gal-featured-desc {
          font-family: 'Inter', sans-serif;
          font-size: 0.88rem;
          line-height: 1.8;
          color: rgba(200,195,215,0.7);
          margin: 0 0 1.6rem;
          flex: 1;
        }

        .gal-featured-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 1.6rem;
        }

        @media (max-width: 480px) {
          .gal-featured-stats { grid-template-columns: repeat(2, 1fr); }
        }

        .gal-featured-stat {
          background: rgba(139,92,246,0.06);
          border: 1px solid rgba(139,92,246,0.12);
          border-radius: 12px;
          padding: 0.7rem 0.9rem;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .gal-featured-stat-label {
          font-family: 'DM Mono', monospace;
          font-size: 7.5px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(167,139,250,0.5);
        }

        .gal-featured-stat-value {
          font-family: 'DM Mono', monospace;
          font-size: 0.82rem;
          font-weight: 500;
          color: rgba(245,240,255,0.85);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .gal-featured-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: #0d0b16;
          background: linear-gradient(135deg, #8b5cf6, #a78bfa);
          border-radius: 999px;
          padding: 10px 22px;
          text-decoration: none;
          width: fit-content;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(139,92,246,0.4);
        }

        .gal-featured-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(139,92,246,0.55);
        }

        /* ── Info Strip ───────────────────────────────── */
        .gal-info-strip {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1px;
          background: rgba(255,255,255,0.05);
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 3rem;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .gal-info-cell {
          background: rgba(5,5,14,0.9);
          padding: 1.2rem 1.4rem;
          display: flex;
          align-items: flex-start;
          gap: 0.9rem;
          transition: background 0.25s;
        }

        .gal-info-cell:hover {
          background: rgba(139,92,246,0.05);
        }

        .gal-info-icon {
          font-size: 1.2rem;
          line-height: 1;
          flex-shrink: 0;
          margin-top: 2px;
          opacity: 0.85;
        }

        .gal-info-text {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }

        .gal-info-label {
          font-family: 'DM Mono', monospace;
          font-size: 8px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.22);
        }

        .gal-info-value {
          font-family: 'Inter', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          color: rgba(255,255,255,0.75);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── Section separator ──────────────────────── */
        .gal-catalog-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.8rem;
        }

        .gal-catalog-title {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          white-space: nowrap;
        }

        .gal-catalog-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.06);
        }
      `}</style>

      <PageHeader
        title="Galactic Structures"
        intro="Massive cosmic islands containing billions of stars, vast dust clouds, and dark matter — the fundamental building blocks of our universe."
        icon="🌌"
        color="#8b5cf6"
        count={galaxies?.length}
        suffix="galaxies"
      />

      {/* Quick facts info strip */}
      <div className="gal-info-strip">
        {GALAXY_FACTS.map((fact, i) => (
          <div key={i} className="gal-info-cell">
            <span className="gal-info-icon">{fact.icon}</span>
            <div className="gal-info-text">
              <span className="gal-info-label">{fact.label}</span>
              <span className="gal-info-value">{fact.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Featured galaxy hero */}
      {featuredGalaxy && (
        <div className="gal-featured">
          <div className="gal-featured-inner">
            {/* Image */}
            <div className="gal-featured-img-col">
              {featuredGalaxy.image ? (
                <img src={featuredGalaxy.image} alt={featuredGalaxy.name} />
              ) : (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'radial-gradient(ellipse at 30% 40%, rgba(139,92,246,0.3) 0%, rgba(6,8,20,0.95) 70%)',
                }} />
              )}
              <div className="gal-featured-img-overlay" />
              <div className="gal-featured-badge">
                <div className="gal-featured-badge-dot" />
                <span className="gal-featured-badge-text">Featured · Our Galaxy</span>
              </div>
            </div>

            {/* Info */}
            <div className="gal-featured-info-col">
              <div className="gal-featured-eyebrow">
                <div className="gal-featured-eyebrow-line" />
                <span className="gal-featured-eyebrow-text">Home Galaxy</span>
              </div>

              <h2 className="gal-featured-title">{featuredGalaxy.name}</h2>
              {featuredGalaxy.galaxy_type && (
                <p className="gal-featured-subtitle">{featuredGalaxy.galaxy_type} · Barred Spiral</p>
              )}

              <div className="gal-featured-divider" />

              <p className="gal-featured-desc">
                {featuredGalaxy.description}
              </p>

              <div className="gal-featured-stats">
                {featuredGalaxy.galaxy_type && (
                  <div className="gal-featured-stat">
                    <span className="gal-featured-stat-label">Type</span>
                    <span className="gal-featured-stat-value">{featuredGalaxy.galaxy_type}</span>
                  </div>
                )}
                {featuredGalaxy.age && (
                  <div className="gal-featured-stat">
                    <span className="gal-featured-stat-label">Age</span>
                    <span className="gal-featured-stat-value">{featuredGalaxy.age}</span>
                  </div>
                )}
                {featuredGalaxy.diameter && (
                  <div className="gal-featured-stat">
                    <span className="gal-featured-stat-label">Diameter</span>
                    <span className="gal-featured-stat-value">{featuredGalaxy.diameter}</span>
                  </div>
                )}
                {featuredGalaxy.distance_from_earth && (
                  <div className="gal-featured-stat">
                    <span className="gal-featured-stat-label">Distance</span>
                    <span className="gal-featured-stat-value">{featuredGalaxy.distance_from_earth}</span>
                  </div>
                )}
                {featuredGalaxy.num_stars && (
                  <div className="gal-featured-stat">
                    <span className="gal-featured-stat-label">Stars</span>
                    <span className="gal-featured-stat-value">{featuredGalaxy.num_stars}</span>
                  </div>
                )}
                <div className="gal-featured-stat">
                  <span className="gal-featured-stat-label">Center</span>
                  <span className="gal-featured-stat-value">Sagittarius A*</span>
                </div>
              </div>

              <Link href={`/details/galaxies/${featuredGalaxy.id}`} className="gal-featured-cta">
                Explore in depth
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7h9M7.5 3.5 11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Catalog grid */}
      <div className="gal-catalog-header">
        <span className="gal-catalog-title">Full Catalog</span>
        <div className="gal-catalog-line" />
      </div>

      <SpaceGridClient items={regularGalaxies} table="galaxies" searchPlaceholder="Search galaxies by name or type…" />
    </div>
  );
}
