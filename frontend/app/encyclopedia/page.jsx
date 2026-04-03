import React from 'react';
import { fetchAllCelestialObjects } from '../../lib/cosmoDataApi';
import EncyclopediaClient from './EncyclopediaClient';
import './Encyclopedia.css';

const CATEGORIES = [
  { id: 'planets', name: 'Solar System', icon: '☀️' },
  { id: 'stars', name: 'Stars & Constellations', icon: '⭐' },
  { id: 'galaxies', name: 'Galaxies & Nebulae', icon: '🌌' },
  { id: 'asteroids', name: 'Asteroids & Comets', icon: '☄️' }
];

export const metadata = {
  title: 'Cosmic Codex | Encyclopedia',
  description: 'A comprehensive database of celestial objects, fetched directly from our astronomical servers.'
};

export default async function EncyclopediaPage() {
  const allObjects = await fetchAllCelestialObjects();

  return (
    <EncyclopediaClient 
      initialObjects={allObjects} 
      categories={CATEGORIES} 
    />
  );
}
