import React from 'react';
import { fetchSatellites } from '../../lib/cosmoDataApi';
import PageHeader from '../../components/PageHeader/PageHeader';
import SpaceGridClient from '../../components/SpaceGridClient/SpaceGridClient';

export const metadata = {
  title: 'Artificial Satellites | Astride',
  description: 'Explore flagship artificial satellites and orbital observatories — from crewed stations to deep-space telescopes and Earth-observing spacecraft.',
};

export const revalidate = 3600;

const SATELLITE_FACTS = [
  { icon: '🛰️', label: 'Objects in Orbit', value: '~9,000+ active satellites' },
  { icon: '🏗️', label: 'Heaviest Satellite', value: 'ISS · ~420,000 kg' },
  { icon: '🔭', label: 'Deepest Observer', value: 'James Webb (L2, 1.5M km)' },
  { icon: '📡', label: 'First Satellite', value: 'Sputnik 1 · Oct 4, 1957' },
  { icon: '🌍', label: 'Lowest Orbit (LEO)', value: '160–2,000 km altitude' },
  { icon: '🌐', label: 'Geostationary Orbit', value: '35,786 km · 24h period' },
];

export default async function SatellitesPage() {
  const { data: satellites, error } = await fetchSatellites();

  if (error) {
    throw new Error('Failed to load satellite catalog');
  }

  return (
    <div className="page satellites-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        .sat-info-strip {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1px;
          background: rgba(255,255,255,0.05);
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 3rem;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .sat-info-cell {
          background: rgba(4,5,14,0.92);
          padding: 1.1rem 1.3rem;
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          transition: background 0.25s;
        }
        .sat-info-cell:hover { background: rgba(96,165,250,0.05); }
        .sat-info-icon { font-size: 1.15rem; flex-shrink: 0; margin-top: 2px; opacity: 0.85; }
        .sat-info-text { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .sat-info-label {
          font-family: 'DM Mono', monospace;
          font-size: 8px; letter-spacing: 0.3em; text-transform: uppercase;
          color: rgba(255,255,255,0.22);
        }
        .sat-info-value {
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem; font-weight: 600;
          color: rgba(255,255,255,0.72);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
      `}</style>

      <PageHeader
        title="Artificial Satellites"
        intro="A curated orbital catalog of crewed stations, Earth-observing spacecraft, weather platforms, and major space telescopes currently in orbit."
        icon="🛰️"
        color="#60a5fa"
        count={satellites?.length}
        suffix="spacecraft"
      />

      <div className="sat-info-strip">
        {SATELLITE_FACTS.map((fact, i) => (
          <div key={i} className="sat-info-cell">
            <span className="sat-info-icon">{fact.icon}</span>
            <div className="sat-info-text">
              <span className="sat-info-label">{fact.label}</span>
              <span className="sat-info-value">{fact.value}</span>
            </div>
          </div>
        ))}
      </div>

      <SpaceGridClient items={satellites} table="satellites" searchPlaceholder="Search satellites by name, mission, or orbit…" />
    </div>
  );
}
