'use client';
import React, { useState, useMemo } from 'react';
import SpaceCard from '../SpaceCard/SpaceCard';

export default function SpaceGridClient({ items, table, searchPlaceholder }) {
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(() =>
    (items || []).filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())
    ),
    [items, search]
  );

  const total = items?.length || 0;
  const showing = filteredItems.length;

  return (
    <div style={{ fontFamily: '"Inter", system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .sgc-toolbar {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2.2rem;
          flex-wrap: wrap;
        }

        .sgc-search-wrap {
          position: relative;
          flex: 1;
          min-width: 220px;
          max-width: 480px;
        }

        .sgc-search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.25);
          pointer-events: none;
          display: flex;
          align-items: center;
        }

        .sgc-search-input {
          width: 100%;
          padding: 0.85rem 1.2rem 0.85rem 2.8rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          color: white;
          outline: none;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          font-weight: 400;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
          backdrop-filter: blur(8px);
        }

        .sgc-search-input::placeholder {
          color: rgba(255,255,255,0.25);
        }

        .sgc-search-input:focus {
          border-color: rgba(139,92,246,0.4);
          background: rgba(255,255,255,0.06);
          box-shadow: 0 0 0 3px rgba(139,92,246,0.1);
        }

        .sgc-search-clear {
          position: absolute;
          right: 0.9rem;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.08);
          border: none;
          color: rgba(255,255,255,0.4);
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 14px;
          line-height: 1;
          transition: background 0.2s, color 0.2s;
        }

        .sgc-search-clear:hover {
          background: rgba(255,255,255,0.14);
          color: rgba(255,255,255,0.8);
        }

        .sgc-count-badge {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          white-space: nowrap;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px;
          padding: 6px 12px;
          flex-shrink: 0;
        }

        .sgc-count-badge b {
          color: rgba(255,255,255,0.6);
          font-weight: 500;
        }

        .sgc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.4rem;
        }

        @media (max-width: 640px) {
          .sgc-grid { grid-template-columns: 1fr; }
          .sgc-toolbar { flex-direction: column; align-items: stretch; }
          .sgc-search-wrap { max-width: 100%; }
        }

        .sgc-empty {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          gap: 0.8rem;
          text-align: center;
        }

        .sgc-empty-icon {
          font-size: 2.5rem;
          opacity: 0.4;
          margin-bottom: 0.4rem;
        }

        .sgc-empty-title {
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          color: rgba(255,255,255,0.4);
        }

        .sgc-empty-sub {
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.2);
        }

        .sgc-search-highlight {
          color: rgba(255,255,255,0.6);
          font-weight: 600;
        }
      `}</style>

      {/* Toolbar */}
      <div className="sgc-toolbar">
        <div className="sgc-search-wrap">
          <span className="sgc-search-icon">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M10.5 10.5 13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </span>
          <input
            type="text"
            className="sgc-search-input"
            placeholder={searchPlaceholder || 'Search objects…'}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="sgc-search-clear" onClick={() => setSearch('')} aria-label="Clear search">×</button>
          )}
        </div>

        <div className="sgc-count-badge">
          <b>{showing}</b> / {total} objects
        </div>
      </div>

      {/* Grid */}
      <div className="sgc-grid">
        {filteredItems.length === 0 ? (
          <div className="sgc-empty">
            <div className="sgc-empty-icon">🔭</div>
            <p className="sgc-empty-title">No objects found</p>
            <p className="sgc-empty-sub">
              Nothing matches <span className="sgc-search-highlight">"{search}"</span> — try a different query.
            </p>
          </div>
        ) : (
          filteredItems.map(item => {
            const stats = [];
            if (item.diameter)           stats.push({ label: 'Diameter',   value: item.diameter });
            if (item.distance_from_sun)  stats.push({ label: 'From Sun',   value: item.distance_from_sun });
            if (item.distance_from_earth)stats.push({ label: 'Distance',   value: item.distance_from_earth });
            if (item.star_type)          stats.push({ label: 'Star Type',  value: item.star_type });
            if (item.galaxy_type)        stats.push({ label: 'Galaxy Type',value: item.galaxy_type });
            if (item.orbit_type)         stats.push({ label: 'Orbit',      value: item.orbit_type });
            if (item.velocity)           stats.push({ label: 'Velocity',   value: item.velocity });
            if (item.altitude)           stats.push({ label: 'Altitude',   value: item.altitude });
            if (item.orbital_period)     stats.push({ label: 'Period',     value: item.orbital_period });
            if (item.parent_planet)      stats.push({ label: 'Orbits',     value: item.parent_planet });
            if (item.mass)               stats.push({ label: 'Mass',       value: item.mass });
            if (item.gravity)            stats.push({ label: 'Gravity',    value: item.gravity });
            if (item.temperature)        stats.push({ label: 'Temperature',value: item.temperature });
            if (item.launch_date)        stats.push({ label: 'Launched',   value: item.launch_date });

            return (
              <SpaceCard
                key={item.id}
                id={item.id}
                table={table}
                title={item.name}
                description={item.description}
                color={item.color || '#4b70dd'}
                image={item.image}
                stats={stats}
                badge={item.status}
                subtitle={item.parent_planet || item.galaxy_type || item.star_type || item.mission_type || item.orbit_type}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
