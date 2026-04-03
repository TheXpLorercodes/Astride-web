import React from 'react';
import { fetchStars } from '../../lib/cosmoDataApi';
import PageHeader from '../../components/PageHeader/PageHeader';
import SpaceGridClient from '../../components/SpaceGridClient/SpaceGridClient';

export const metadata = {
  title: 'Stellar Classification',
  description: 'Understanding the diverse types of stars illuminating our universe.',
};

export const revalidate = 3600;

export default async function StarsPage() {
  const { data: stars, error } = await fetchStars();

  if (error) {
    throw new Error('Failed to load stellar database');
  }

  return (
    <div className="page stars-page">
      <PageHeader 
        title="Stellar Classification" 
        intro="Understanding the diverse types of stars illuminating our universe and defining cosmic structure."
        icon="⭐"
        color="var(--cat-stars, #fcd34d)"
      />
      
      <SpaceGridClient items={stars} table="stars" searchPlaceholder="Search stars..." />
    </div>
  );
}
