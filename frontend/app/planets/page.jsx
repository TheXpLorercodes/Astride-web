import React from 'react';
import { fetchPlanets, EXOPLANETS } from '../../lib/cosmoDataApi';
import PageHeader from '../../components/PageHeader/PageHeader';
import SpaceGridClient from '../../components/SpaceGridClient/SpaceGridClient';

export const metadata = {
  title: 'Planets of the Solar System | Astride',
  description: 'Explore the eight remarkable worlds orbiting our Sun, from scorching Mercury to icy Neptune, plus fascinating exoplanets beyond.',
};

export const revalidate = 3600;

const PLANET_FACTS = [
  { icon: '☀️', label: 'Host Star', value: 'Sol / The Sun' },
  { icon: '🪨', label: 'Rocky Planets', value: 'Mercury, Venus, Earth, Mars' },
  { icon: '🌀', label: 'Gas Giants', value: 'Jupiter & Saturn' },
  { icon: '🧊', label: 'Ice Giants', value: 'Uranus & Neptune' },
  { icon: '🌍', label: 'Habitable Zone', value: 'Earth (confirmed life)' },
  { icon: '⏱️', label: 'Longest Day', value: 'Venus · 5,832 hours' },
];

export default async function PlanetsPage() {
  const { data: planets, error } = await fetchPlanets();

  if (error) {
    throw new Error('Failed to load planetary database');
  }

  return (
    <div className="page planets-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .pg-info-strip {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1px;
          background: rgba(255,255,255,0.05);
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 3rem;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .pg-info-cell {
          background: rgba(4,5,14,0.92);
          padding: 1.1rem 1.3rem;
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          transition: background 0.25s;
        }

        .pg-info-cell:hover { background: rgba(75,112,221,0.06); }

        .pg-info-icon { font-size: 1.15rem; flex-shrink: 0; margin-top: 2px; opacity: 0.85; }

        .pg-info-text { display: flex; flex-direction: column; gap: 3px; min-width: 0; }

        .pg-info-label {
          font-family: 'DM Mono', monospace;
          font-size: 8px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.22);
        }

        .pg-info-value {
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255,255,255,0.72);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .pg-section-sep {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 4rem 0 2rem;
        }

        .pg-section-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          white-space: nowrap;
        }

        .pg-section-rule {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.06);
        }
      `}</style>

      <PageHeader
        title="Solar System Planets"
        intro="Eight remarkable worlds orbiting our host star — from scorching Mercury to the distant ice giant Neptune — each with its own unique character."
        icon="🪐"
        color="#4b70dd"
        count={planets?.length}
        suffix="planets"
      />

      {/* Quick facts */}
      <div className="pg-info-strip">
        {PLANET_FACTS.map((fact, i) => (
          <div key={i} className="pg-info-cell">
            <span className="pg-info-icon">{fact.icon}</span>
            <div className="pg-info-text">
              <span className="pg-info-label">{fact.label}</span>
              <span className="pg-info-value">{fact.value}</span>
            </div>
          </div>
        ))}
      </div>

      <SpaceGridClient items={planets} table="planets" searchPlaceholder="Search planets by name or type…" />

      {/* Exoplanets section */}
      <div className="pg-section-sep">
        <span className="pg-section-label">Known Exoplanets</span>
        <div className="pg-section-rule" />
      </div>

      <PageHeader
        title="Known Exoplanets"
        intro="Fascinating worlds orbiting distant stars across the galaxy — potential homes for life beyond our solar system."
        icon="✨"
        color="#10b981"
        count={EXOPLANETS.length}
        suffix="exoplanets"
      />

      <SpaceGridClient items={EXOPLANETS} table="planets" searchPlaceholder="Search exoplanets…" />
    </div>
  );
}
