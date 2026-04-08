import React, { Suspense } from 'react';
import ISSClient from './ISSClient';
import { fetchISSInfo } from '../../lib/cosmoDataApi';

// Define metadata for the page
export const metadata = {
  title: 'Live ISS Telemetry & Structural Info',
  description: 'Real-time tracking and database-driven details about the International Space Station.',
};

export const revalidate = 3600; // Cache DB queries for an hour since astronauts and built dates rarely change

export default async function ISSPage() {
  const { data: dbInfo, error } = await fetchISSInfo();

  if (error) {
    console.error('Error fetching ISS DB info:', error);
  }

  return (
    <div className="page bg-black min-h-screen text-white">
      <Suspense fallback={<div className="h-screen w-full flex items-center justify-center text-pink-500 animate-pulse">Initializing Telemetry...</div>}>
        <ISSClient issDbData={dbInfo} />
      </Suspense>
    </div>
  );
}