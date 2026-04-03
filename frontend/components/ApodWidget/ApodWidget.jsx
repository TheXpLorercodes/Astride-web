import React from 'react';
import Link from 'next/link';

export default function ApodWidget({ apodData }) {
  if (!apodData || apodData.error) return null;

  return (
    <div className="cosmos-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ height: '200px', position: 'relative' }}>
        {apodData.media_type === 'video' ? (
           <iframe src={apodData.url} style={{width:'100%', height:'100%', border:'none'}} title={apodData.title} />
        ) : (
           <img src={apodData.url} alt={apodData.title} style={{width:'100%', height:'100%', objectFit:'cover'}} />
        )}
        <div style={{position: 'absolute', top: '1rem', left: '1rem', background: 'var(--accent-purple)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700}}>NASA APOD</div>
      </div>
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 style={{fontSize: '1.1rem', marginBottom: '0.5rem'}}>{apodData.title}</h3>
        <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flexGrow: 1}}>
          {apodData.explanation}
        </p>
        <Link href="/apod" className="btn-ghost" style={{marginTop: '1rem', alignSelf: 'flex-start', padding: '0.5rem 1rem'}}>View Full Gallery →</Link>
      </div>
    </div>
  );
}
