import React from 'react';
import { fetchAsteroids } from '../../lib/cosmoDataApi';
import PageHeader from '../../components/PageHeader/PageHeader';
import SpaceGridClient from '../../components/SpaceGridClient/SpaceGridClient';

export const metadata = {
  title: 'Near-Earth Asteroids | Astride',
  description: 'Rocky remnants from the formation of our solar system, closely monitored for their orbital proximity to Earth.',
};

export const revalidate = 3600;

const ASTEROID_FACTS = [
  { icon: '☄️', label: 'Main Belt Location', value: 'Between Mars & Jupiter' },
  { icon: '📊', label: 'Known Asteroids', value: '1.1+ million catalogued' },
  { icon: '⚠️', label: 'Potentially Hazardous', value: '2,300+ tracked by NASA' },
  { icon: '🏆', label: 'Largest Asteroid', value: 'Ceres · 940 km diameter' },
  { icon: '🔬', label: 'First Sample Return', value: 'Ryugu (Hayabusa2, 2020)' },
  { icon: '🛡️', label: 'Planetary Defense', value: 'DART mission confirmed' },
];

export default async function AsteroidsPage() {
  const { data: asteroids, error } = await fetchAsteroids();

  if (error) {
    throw new Error('Failed to load asteroid database');
  }

  return (
    <div className="page asteroids-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .ast-info-strip {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1px;
          background: rgba(255,255,255,0.05);
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 2.5rem;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .ast-info-cell {
          background: rgba(4,5,14,0.92);
          padding: 1.1rem 1.3rem;
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          transition: background 0.25s;
        }
        .ast-info-cell:hover { background: rgba(156,163,175,0.04); }
        .ast-info-icon { font-size: 1.15rem; flex-shrink: 0; margin-top: 2px; opacity: 0.85; }
        .ast-info-text { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .ast-info-label {
          font-family: 'DM Mono', monospace;
          font-size: 8px; letter-spacing: 0.3em; text-transform: uppercase;
          color: rgba(255,255,255,0.22);
        }
        .ast-info-value {
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem; font-weight: 600;
          color: rgba(255,255,255,0.72);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        .ast-context-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1rem;
          margin-bottom: 2.5rem;
        }

        .ast-context-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          padding: 1.4rem 1.6rem;
          position: relative;
          overflow: hidden;
        }

        .ast-context-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 3px; height: 100%;
          background: linear-gradient(180deg, #9ca3af, transparent);
          border-radius: 3px 0 0 3px;
        }

        .ast-context-card h3 {
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          color: rgba(255,255,255,0.85);
          margin: 0 0 0.5rem;
        }

        .ast-context-card p {
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          line-height: 1.7;
          color: rgba(148,163,184,0.75);
          margin: 0;
        }
      `}</style>

      <PageHeader
        title="Near-Earth Asteroids"
        intro="Rocky remnants from the formation of our solar system, closely monitored for their orbital proximity to Earth and scientific value."
        icon="☄️"
        color="#9ca3af"
        count={asteroids?.length}
        suffix="tracked objects"
      />

      <div className="ast-info-strip">
        {ASTEROID_FACTS.map((fact, i) => (
          <div key={i} className="ast-info-cell">
            <span className="ast-info-icon">{fact.icon}</span>
            <div className="ast-info-text">
              <span className="ast-info-label">{fact.label}</span>
              <span className="ast-info-value">{fact.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="ast-context-cards">
        <div className="ast-context-card">
          <h3>What are Asteroids?</h3>
          <p>Asteroids are rocky objects that orbit the Sun, most residing in the asteroid belt between Mars and Jupiter. They range from small boulders to dwarf planets like Ceres (940 km wide), and are primordial remnants from the solar system's formation ~4.6 billion years ago.</p>
        </div>
        <div className="ast-context-card">
          <h3>Near-Earth Objects (NEOs)</h3>
          <p>Some asteroids have orbits that bring them within 1.3 AU of the Sun, making them Near-Earth Objects. NASA's Center for Near Earth Object Studies (CNEOS) continuously tracks over 36,000 NEOs to assess any potential impact risk to Earth.</p>
        </div>
        <div className="ast-context-card">
          <h3>Planetary Defense</h3>
          <p>NASA's DART mission (2022) successfully altered the orbit of asteroid Dimorphos, proving that kinetic impactors can deflect potentially hazardous asteroids — a landmark achievement for planetary defense science.</p>
        </div>
      </div>

      <SpaceGridClient items={asteroids} table="asteroids" searchPlaceholder="Search asteroids by name or orbit type…" />
    </div>
  );
}
