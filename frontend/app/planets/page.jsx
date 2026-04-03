import React from 'react';
import { fetchPlanets, EXOPLANETS } from '../../lib/cosmoDataApi';
import PageHeader from '../../components/PageHeader/PageHeader';
import SpaceGridClient from '../../components/SpaceGridClient/SpaceGridClient';

export const metadata = {
  title: 'Planets of the Solar System',
  description: 'Explore the diverse worlds orbiting our Sun and beyond.',
};

export const revalidate = 3600;

export default async function PlanetsPage() {
  const { data: planets, error } = await fetchPlanets();

  if (error) {
    throw new Error('Failed to load planetary database');
  }

  return (
    <div className="page planets-page">
      <PageHeader 
        title="Solar System Planets" 
        intro="Eight remarkable worlds orbiting our host star, arranged from innermost to outermost."
        icon="🪐"
        color="var(--cat-solarsys, #4b70dd)"
      />
      
      <SpaceGridClient items={planets} table="planets" searchPlaceholder="Search local planets..." />

      <div style={{ marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <PageHeader 
          title="Known Exoplanets" 
          intro="Fascinating worlds orbiting distant stars across our galaxy."
          icon="✨"
          color="#10b981"
        />
        <SpaceGridClient items={EXOPLANETS} table="planets" searchPlaceholder="Search exoplanets..." />
      </div>
    </div>
  );
}
