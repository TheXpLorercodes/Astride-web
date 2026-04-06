import React from 'react';
import PageHeader from '../../components/PageHeader/PageHeader';

export const metadata = {
  title: 'NASA APOD Archive',
  description: 'Astronomy Picture of the Day gallery.',
};

export const dynamic = 'force-dynamic';

export default async function ApodPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const NASA_KEY = process.env.NASA_API_KEY;
  let items = [];
  
  // Use dates or count
  const count = resolvedParams?.count || 12;
  
  if (NASA_KEY) {
     try {
       const controller = new AbortController();
       const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
       
       const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}&thumbs=true&count=${count}`, {
         signal: controller.signal
       });
       clearTimeout(timeoutId);
       if (res.ok) {
          items = await res.json();
       }
     } catch (e) {
       console.error("NASA API Error:", e);
     }
  }

  // Ensure items is an array (APOD can return object if a single date is queried, but count always returns array)
  if (!Array.isArray(items)) items = [];

  return (
    <div className="page apod-page">
      <PageHeader 
        title="NASA APOD Archive" 
        intro="The Astronomy Picture of the Day gallery. Discover the cosmos! Each picture is featured by a professional astronomer."
        icon="📸" 
        color="#06b6d4" 
      />

      <div className="grid-3">
        {items.map((item, idx) => (
          <div key={idx} className="cosmos-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '220px', position: 'relative' }}>
              {item.media_type === 'video' ? (
                <img src={item.thumbnail_url || item.url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <img src={item.url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.7)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', color: 'white' }}>
                {item.date}
              </div>
            </div>
            <div style={{ padding: '1.5rem', flexGrow: 1 }}>
              <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.explanation}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <a href="/apod?count=24" className="btn-primary" style={{ background: 'var(--secondary-bg)', border: '1px solid var(--accent-cyan)' }}>
          Load More
        </a>
      </div>
    </div>
  );
}
