import React from 'react';
import PageHeader from '../../components/PageHeader/PageHeader';

export const metadata = {
  title: 'Space News Feed',
  description: 'Latest headlines regarding space agencies, exploration, and commercial spaceflight.',
};

export const revalidate = 3600;

export default async function NewsPage() {
  let news = [];
  try {
    const res = await fetch('https://api.spaceflightnewsapi.net/v4/articles/?limit=24', { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      news = data.results || [];
    }
  } catch (err) {
    console.error(err);
  }

  return (
    <div className="page news-page">
      <PageHeader 
        title="Spaceflight News" 
        intro="Direct feed from top aerospace publishers covering exploration, agencies, and astronomy."
        icon="📰" 
        color="#ec4899" 
      />

      {news.length === 0 ? (
        <p>No news available at the moment. Telemetry link degraded.</p>
      ) : (
        <div className="grid-3">
          {news.map((item) => (
            <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="cosmos-card" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '160px', overflow: 'hidden', borderRadius: '8px', marginBottom: '1rem', background: 'rgba(255,255,255,0.05)' }}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}>No Image</div>
                )}
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', flexGrow: 1 }}>{item.summary}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#ec4899', fontWeight: 600 }}>
                <span>{item.news_site}</span>
                <span>{new Date(item.published_at).toLocaleDateString()}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
