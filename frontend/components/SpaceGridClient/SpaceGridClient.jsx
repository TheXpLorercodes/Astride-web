'use client';
import React, { useState } from 'react';
import SpaceCard from '../SpaceCard/SpaceCard';

export default function SpaceGridClient({ items, table, searchPlaceholder }) {
  const [search, setSearch] = useState('');

  const filteredItems = items?.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div>
      <div style={{ marginBottom: '2rem', maxWidth: '400px' }}>
        <input 
          type="text" 
          placeholder={searchPlaceholder || 'Search objects...'} 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            background: 'rgba(21, 27, 61, 0.7)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            borderRadius: '12px',
            color: 'white',
            outline: 'none',
            fontSize: '1rem'
          }}
        />
      </div>
      
      {filteredItems.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>No objects match your search.</p>
      ) : (
        <div className="grid-3">
          {filteredItems.map((item) => {
            const stats = [];
            if (item.diameter) stats.push({ label: 'Diameter', value: item.diameter });
            if (item.distance_from_sun) stats.push({ label: 'From Sun', value: item.distance_from_sun });
            if (item.distance_from_earth) stats.push({ label: 'Distance', value: item.distance_from_earth });
            if (item.star_type) stats.push({ label: 'Type', value: item.star_type });
            if (item.galaxy_type) stats.push({ label: 'Type', value: item.galaxy_type });
            if (item.orbit_type) stats.push({ label: 'Orbit', value: item.orbit_type });
            if (item.velocity) stats.push({ label: 'Velocity', value: item.velocity });
            
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
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
