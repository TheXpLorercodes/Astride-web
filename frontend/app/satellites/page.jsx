import React from 'react';
import { fetchSatellites } from '../../lib/cosmoDataApi';
import PageHeader from '../../components/PageHeader/PageHeader';
import SpaceGridClient from '../../components/SpaceGridClient/SpaceGridClient';

export const metadata = {
  title: 'Artificial Satellites',
  description: 'Explore flagship artificial satellites and orbital observatories with orbit, velocity, and systems data.',
};

export const revalidate = 3600;

export default async function SatellitesPage() {
  const { data: satellites, error } = await fetchSatellites();

  if (error) {
    throw new Error('Failed to load satellite catalog');
  }

  return (
    <div className="page satellites-page">
      <PageHeader
        title="Artificial Satellites"
        intro="A curated orbital catalog of crewed stations, Earth-observing spacecraft, weather platforms, and major space telescopes."
        icon="🛰️"
        color="#60a5fa"
      />

      <SpaceGridClient items={satellites} table="satellites" searchPlaceholder="Search satellites..." />
    </div>
  );
}
