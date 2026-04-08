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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', alignItems: 'stretch' }}>
          {news.slice(0, 4).map((item) => (
            <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', borderRadius: '2px', padding: '1rem', color: '#1a1a1a', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <div style={{ height: '180px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor: '#f3f4f6', color: '#6b7280'}}>No Image</div>
                )}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #d1d5db', paddingBottom: '0.2rem', marginBottom: '1rem', fontSize: '0.65rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <span>{item.news_site.toUpperCase()}</span>
                  <span>{new Date(item.published_at).toLocaleDateString('en-GB')}</span>
                </div>
                
                <h3 style={{ fontSize: '1.4rem', fontFamily: 'Georgia, Times, serif', color: '#111827', marginBottom: '1rem', lineHeight: '1.3', fontWeight: 600 }}>
                  {item.title}
                </h3>
                
                <p style={{ fontSize: '0.85rem', color: '#4b5563', marginBottom: '1.5rem', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.summary}
                </p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <img src={`https://ui-avatars.com/api/?name=${item.news_site}&background=random`} alt="Author" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827' }}>{item.news_site}</span>
                    <span style={{ fontSize: '0.65rem', color: '#6b7280' }}>Space Journalist</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontFamily: 'Georgia, Times, serif', fontStyle: 'italic', paddingBottom: '0.25rem' }}>Louge</span>
                  <div style={{ backgroundColor: '#1a1a1a', color: '#ffffff', padding: '0.6rem 1.2rem', fontSize: '0.8rem', fontWeight: 500 }}>
                    Read more
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
