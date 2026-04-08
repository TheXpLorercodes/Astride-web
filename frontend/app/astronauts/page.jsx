import React, { Suspense } from 'react';
import AstronautsClient from './AstronautsClient';
import { supabaseServer } from '../../lib/supabaseServer';

export const metadata = {
  title: 'Astronaut Records | Astride',
  description: 'Comprehensive database of space explorers and their missions.',
};

// Revalidate once a day since historical astronaut data doesn't change rapidly
export const revalidate = 86400;

async function getAstronauts() {
  try {
    const { data, error } = await supabaseServer
      .from('astronauts')
      .select('*')
      .limit(1000);

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Astronaut fetch error:', error);
    return [];
  }
}

export default async function AstronautsPage() {
  const astronauts = await getAstronauts();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-pink-500/30">
      <Suspense fallback={
        <div className="h-screen w-full flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin"></div>
          <p className="text-pink-500/70 tracking-widest text-sm uppercase">Accessing Crew Manifest...</p>
        </div>
      }>
        <AstronautsClient initialAstronauts={astronauts} />
      </Suspense>
    </div>
  );
}