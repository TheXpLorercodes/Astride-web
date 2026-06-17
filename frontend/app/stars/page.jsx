import React from 'react';
import { fetchStars } from '../../lib/cosmoDataApi';
import PageHeader from '../../components/PageHeader/PageHeader';
import SpaceGridClient from '../../components/SpaceGridClient/SpaceGridClient';

export const metadata = {
  title: 'Stellar Classification | Astride',
  description: 'Explore the diverse types of stars illuminating our universe — from red dwarfs to blue supergiants and exotic neutron stars.',
};

export const revalidate = 3600;

const STAR_FACTS = [
  { icon: '⭐', label: 'Stars in Milky Way', value: '100–400 Billion' },
  { icon: '🔴', label: 'Most Common Type', value: 'Red Dwarf (M-class)' },
  { icon: '🔵', label: 'Hottest Stars', value: 'O-class · up to 50,000 K' },
  { icon: '🌞', label: 'Our Star', value: 'Sol · G-type yellow dwarf' },
  { icon: '💥', label: 'Largest Known', value: 'UY Scuti · 1,700× our Sun' },
  { icon: '🕳️', label: 'End State (massive)', value: 'Neutron Star or Black Hole' },
];

export default async function StarsPage() {
  const { data: stars, error } = await fetchStars();

  if (error) {
    throw new Error('Failed to load stellar database');
  }

  return (
    <div className="page stars-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        .st-info-strip {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1px;
          background: rgba(255,255,255,0.05);
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 3rem;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .st-info-cell {
          background: rgba(4,5,14,0.92);
          padding: 1.1rem 1.3rem;
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          transition: background 0.25s;
        }
        .st-info-cell:hover { background: rgba(252,211,77,0.04); }
        .st-info-icon { font-size: 1.15rem; flex-shrink: 0; margin-top: 2px; opacity: 0.85; }
        .st-info-text { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .st-info-label {
          font-family: 'DM Mono', monospace;
          font-size: 8px; letter-spacing: 0.3em; text-transform: uppercase;
          color: rgba(255,255,255,0.22);
        }
        .st-info-value {
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem; font-weight: 600;
          color: rgba(255,255,255,0.72);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
      `}</style>

      <PageHeader
        title="Stellar Classification"
        intro="Understanding the diverse types of stars illuminating our universe — from dim red dwarfs to brilliant blue supergiants and the stellar remnants they leave behind."
        icon="⭐"
        color="#fcd34d"
        count={stars?.length}
        suffix="stellar objects"
      />

      <div className="st-info-strip">
        {STAR_FACTS.map((fact, i) => (
          <div key={i} className="st-info-cell">
            <span className="st-info-icon">{fact.icon}</span>
            <div className="st-info-text">
              <span className="st-info-label">{fact.label}</span>
              <span className="st-info-value">{fact.value}</span>
            </div>
          </div>
        ))}
      </div>

      <SpaceGridClient items={stars} table="stars" searchPlaceholder="Search stars by name or classification…" />
    </div>
  );
}
