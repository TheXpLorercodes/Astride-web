import React from 'react';
import { fetchGalaxies } from '../../lib/cosmoDataApi';
import PageHeader from '../../components/PageHeader/PageHeader';
import SpaceGridClient from '../../components/SpaceGridClient/SpaceGridClient';
import Link from 'next/link';

export const metadata = {
  title: 'Galactic Structures',
  description: 'Massive cosmic islands containing billions of stars.',
};

export const revalidate = 3600;

export default async function GalaxiesPage() {
  const { data: galaxies, error } = await fetchGalaxies();

  if (error) {
    throw new Error('Failed to load galaxy database');
  }

  const featuredGalaxy = galaxies?.find(g => g.is_featured);
  const regularGalaxies = galaxies?.filter(g => !g.is_featured);

  return (
    <div className="page galaxies-page">
      <PageHeader 
        title="Galactic Structures" 
        intro="Massive cosmic islands containing billions of stars, dust, and dark matter."
        icon="🌌"
        color="var(--cat-galaxies, #8b5cf6)"
      />
      
      {featuredGalaxy && (
        <Link href={`/details/galaxies/${featuredGalaxy.id}`} style={{ textDecoration: 'none' }}>
          <div className="cosmos-card" style={{ marginBottom: '3rem', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderColor: 'rgba(139, 92, 246, 0.5)' }}>
             <h2 style={{ fontSize: '2rem', color: 'white', fontFamily: 'Orbitron, sans-serif' }}>Our Home: The {featuredGalaxy.name}</h2>
             <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>{featuredGalaxy.description}</p>
             <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <div className="stat"><span className="stat-label">Type: </span> <span className="stat-value">{featuredGalaxy.galaxy_type}</span></div>
                <div className="stat"><span className="stat-label">Age: </span> <span className="stat-value">{featuredGalaxy.age}</span></div>
                <div className="stat"><span className="stat-label">Diameter: </span> <span className="stat-value">{featuredGalaxy.diameter}</span></div>
             </div>
          </div>
        </Link>
      )}

      <SpaceGridClient items={galaxies} table="galaxies" searchPlaceholder="Search galaxies..." />
    </div>
  );
}
