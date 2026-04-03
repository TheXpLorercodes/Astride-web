import React from 'react';
import PageHeader from '../../components/PageHeader/PageHeader';

export const metadata = {
  title: 'Launch Calendar',
  description: 'Upcoming scheduled rocket launches from global space agencies.',
};

export const revalidate = 3600;

export default async function LaunchesPage() {
  let launches = [];
  try {
    const res = await fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=12&format=json', { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      launches = data.results || [];
    }
  } catch (err) {
    console.error(err);
  }

  return (
    <div className="page launches-page">
      <PageHeader 
        title="Launch Calendar" 
        intro="Track upcoming orbital and suborbital missions from all major providers globally."
        icon="🚀" 
        color="#f97316" 
      />

      {launches.length === 0 ? (
        <p>No launch data available. Ground control link lost.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
          {launches.map((launch) => (
            <div key={launch.id} className="cosmos-card" style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
              <div style={{ textAlign: 'center', minWidth: '100px', paddingRight: '2rem', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ color: '#f97316', fontWeight: 800, fontSize: '1.5rem', fontFamily: 'Orbitron, sans-serif' }}>
                  {new Date(launch.net).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {new Date(launch.net).getFullYear()}
                </div>
              </div>
              <div style={{ flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '0.5rem' }}>{launch.name}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{launch.mission?.description || 'Classified or unspecified mission payload.'}</p>
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem' }}>
                  <div><span style={{ color: '#f97316' }}>Provider:</span> <strong style={{ color: 'white' }}>{launch.launch_service_provider?.name}</strong></div>
                  <div><span style={{ color: '#f97316' }}>Location:</span> <strong style={{ color: 'white' }}>{launch.pad?.location?.name}</strong></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
