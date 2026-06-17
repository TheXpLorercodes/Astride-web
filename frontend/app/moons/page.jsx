import React from 'react';
import { MOONS } from '../../lib/cosmoDataApi';
import PageHeader from '../../components/PageHeader/PageHeader';
import SpaceGridClient from '../../components/SpaceGridClient/SpaceGridClient';

export const metadata = {
  title: 'Moons & Natural Satellites | Astride',
  description: 'Explore the major moons orbiting planets in our solar system — from volcanic Io to ocean-world Europa and methane-lake Titan.',
};

const MOON_FACTS = [
  { icon: '🪐', label: 'Most Moons', value: 'Saturn · 146 confirmed' },
  { icon: '🌊', label: 'Ocean World', value: 'Europa (subsurface ocean)' },
  { icon: '🌋', label: 'Most Volcanic', value: 'Io (500+ active volcanoes)' },
  { icon: '🌫️', label: 'Thickest Atmosphere', value: 'Titan (denser than Earth)' },
  { icon: '❄️', label: 'Coldest Moon', value: 'Triton at -235°C' },
  { icon: '🌊', label: 'Cryovolcanism', value: 'Enceladus (water plumes)' },
];

export default function MoonsPage() {
  return (
    <div className="page moons-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        .mn-info-strip {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1px;
          background: rgba(255,255,255,0.05);
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 3rem;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .mn-info-cell {
          background: rgba(4,5,14,0.92);
          padding: 1.1rem 1.3rem;
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          transition: background 0.25s;
        }
        .mn-info-cell:hover { background: rgba(209,213,219,0.04); }
        .mn-info-icon { font-size: 1.15rem; flex-shrink: 0; margin-top: 2px; opacity: 0.85; }
        .mn-info-text { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .mn-info-label {
          font-family: 'DM Mono', monospace;
          font-size: 8px; letter-spacing: 0.3em; text-transform: uppercase;
          color: rgba(255,255,255,0.22);
        }
        .mn-info-value {
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem; font-weight: 600;
          color: rgba(255,255,255,0.72);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
      `}</style>

      <PageHeader
        title="Moons & Natural Satellites"
        intro="The fascinating natural satellites that orbit the planets — from volcanic worlds to ice-crusted oceans hiding potential for life."
        icon="🌒"
        color="#d1d5db"
        count={MOONS.length}
        suffix="major moons"
      />

      <div className="mn-info-strip">
        {MOON_FACTS.map((fact, i) => (
          <div key={i} className="mn-info-cell">
            <span className="mn-info-icon">{fact.icon}</span>
            <div className="mn-info-text">
              <span className="mn-info-label">{fact.label}</span>
              <span className="mn-info-value">{fact.value}</span>
            </div>
          </div>
        ))}
      </div>

      <SpaceGridClient items={MOONS} table="moons" searchPlaceholder="Search moons by name or planet…" />
    </div>
  );
}
