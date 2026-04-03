import React from 'react';
import { fetchAsteroids } from '../../lib/cosmoDataApi';
import PageHeader from '../../components/PageHeader/PageHeader';
import SpaceGridClient from '../../components/SpaceGridClient/SpaceGridClient';

export const metadata = {
  title: 'Near-Earth Asteroids',
  description: 'Rocky remnants from the formation of our solar system.',
};

export const revalidate = 3600;

export default async function AsteroidsPage() {
  const { data: asteroids, error } = await fetchAsteroids();

  if (error) {
    throw new Error('Failed to load asteroid database');
  }

  return (
    <div className="page asteroids-page">
      <PageHeader 
        title="Near-Earth Asteroids" 
        intro="Rocky remnants from the formation of our solar system, closely monitored for their orbital proximity to Earth."
        icon="☄️"
        color="var(--cat-asteroids, #9ca3af)"
      />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="cosmos-card">
          <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>What are Asteroids?</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Asteroids are rocky objects that orbit the Sun, most residing in the asteroid belt between Mars and Jupiter. They range from small boulders to objects hundreds of kilometers across.</p>
        </div>
        <div className="cosmos-card">
          <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Near-Earth Objects</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Some asteroids have orbits that bring them close to Earth. Space agencies track these objects to ensure planetary safety and study their composition.</p>
        </div>
      </div>

      <SpaceGridClient items={asteroids} table="asteroids" searchPlaceholder="Search asteroids..." />
    </div>
  );
}
