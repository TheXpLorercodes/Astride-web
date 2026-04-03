import React from 'react';
import { MOONS } from '../../lib/cosmoDataApi';
import PageHeader from '../../components/PageHeader/PageHeader';
import SpaceGridClient from '../../components/SpaceGridClient/SpaceGridClient';

export const metadata = {
  title: 'Moons & Satellites',
  description: 'Explore the major moons orbiting planets in our solar system.',
};

export default function MoonsPage() {
  return (
    <div className="page moons-page">
      <PageHeader 
        title="Moons & Satellites" 
        intro="The fascinating natural satellites that orbit the planets in our solar system, from volcanic worlds to ice-crusted oceans."
        icon="🌒"
        color="var(--cat-moons, #d1d5db)"
      />
      
      <SpaceGridClient items={MOONS} table="moons" searchPlaceholder="Search moons..." />
    </div>
  );
}
