import React, { Suspense } from 'react';
import LaunchesClient from './LaunchesClient';
import { supabaseServer } from '../../lib/supabaseServer';

export const metadata = {
  title: 'Launch Calendar',
  description: 'Upcoming scheduled rocket launches from global space agencies.',
};

export const revalidate = 3600;

export default async function LaunchesPage() {
  let launches = [];
  try {
    const { data, error } = await supabaseServer
      .from('launches')
      .select('*')
      .order('net', { ascending: true })
      .limit(200);

    if (error) {
      throw new Error(error.message);
    }

    launches = data || [];
  } catch (err) {
    console.error('Launch fetch error:', err);
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Suspense
        fallback={
          <div className="h-screen w-full flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin"></div>
            <p className="text-cyan-200/70 tracking-widest text-sm uppercase">Initializing launch network...</p>
          </div>
        }
      >
        <LaunchesClient initialLaunches={launches} />
      </Suspense>
    </div>
  );
}
