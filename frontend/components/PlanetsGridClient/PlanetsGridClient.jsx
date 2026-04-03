'use client';
import React, { useState } from 'react';
import SpaceCard from '../SpaceCard/SpaceCard';

export default function PlanetsGridClient({ planets }) {
  const [search, setSearch] = useState('');

  const filteredPlanets = planets?.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div>
      <div style={{ marginBottom: '2rem', maxWidth: '400px' }}>
        <input 
          type="text" 
          placeholder="Search planets..." 
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
      
      {filteredPlanets.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>No planets match your search.</p>
      ) : (
        <div className="grid-3">
          {filteredPlanets.map((planet) => (
            <SpaceCard
              key={planet.id}
              id={planet.id}
              table="planets"
              title={planet.name}
              description={planet.description}
              color={planet.color || '#4b70dd'}
              image={planet.image}
              stats={[
                { label: 'Diameter', value: planet.diameter },
                { label: 'From Sun', value: planet.distance_from_sun }
              ]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
