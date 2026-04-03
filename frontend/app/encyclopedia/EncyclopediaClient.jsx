'use client';
import React, { useState } from 'react';
import './Encyclopedia.css';
import Link from 'next/link';

export default function EncyclopediaClient({ initialObjects, categories }) {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [activeObjId, setActiveObjId] = useState(initialObjects[0]?.id);

  const activeObj = initialObjects.find(o => o.id === activeObjId) || initialObjects[0];

  return (
    <div className="encyc-page">
      <div className="encyc-layout">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="encyc-sidebar">
          <div className="encyc-sidebar-header">
            <span className="encyc-icon">📚</span>
            <h2>Cosmic Codex</h2>
          </div>
          
          <div className="encyc-nav-sections">
            {categories.map(cat => (
              <div key={cat.id} className="encyc-nav-group">
                <button 
                  className={`encyc-cat-title ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <span className="cat-icon">{cat.icon}</span> {cat.name}
                </button>
                
                <div className={`encyc-obj-list ${activeCategory === cat.id ? 'open' : ''}`}>
                  {initialObjects.filter(o => o.categoryId === cat.id).map(obj => (
                    <button 
                      key={obj.id} 
                      className={`encyc-obj-link ${activeObjId === obj.id ? 'active' : ''}`}
                      onClick={() => setActiveObjId(obj.id)}
                    >
                      {obj.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="encyc-content-area">
          {activeObj ? (
            <div className="encyc-article">
              <header className="encyc-article-header">
                <div>
                  <span className="encyc-badge" style={{color: activeObj.color, borderColor: activeObj.color}}>
                    {activeObj.categoryId?.toUpperCase() || 'OBJECT'}
                  </span>
                  <h1 className="encyc-h1">{activeObj.name}</h1>
                  <p className="encyc-tagline">{activeObj.description || 'No description available in database.'}</p>
                </div>
                
                <div className="encyc-hero-visual">
                   <div className="vis-sphere" style={{
                     backgroundImage: `url(${activeObj.image})`,
                     backgroundSize: 'cover',
                     boxShadow: `0 0 30px ${activeObj.color || '#3b82f6'}80`
                   }}></div>
                </div>
              </header>

              <div className="encyc-content-grid">
                
                {/* Left Column: Story & Details */}
                <div className="encyc-story-col">
                  <p className="encyc-lead">{activeObj.hero_paragraph || activeObj.description}</p>
                  
                  {activeObj.facts && Array.isArray(activeObj.facts) ? (
                    <div className="encyc-text-block">
                       <h4 style={{color: activeObj.color}}>Known Facts</h4>
                       <ul>
                         {activeObj.facts.map((f, i) => <li key={i}>{f}</li>)}
                       </ul>
                    </div>
                  ) : (
                    <div className="encyc-text-block">
                       <p>Detailed architectural records for {activeObj.name} are currently being synchronized from the primary database.</p>
                    </div>
                  )}

                  <div className="encyc-discovery-box" style={{borderLeftColor: activeObj.color}}>
                    <div className="disc-label">Archival Discovery Record</div>
                    <p>{activeObj.discovery || "Historical records for this object's discovery are currently being indexed."}</p>
                  </div>
                </div>

                {/* Right Column: Key Stats & Database Link */}
                <div className="encyc-data-col">
                   <div className="encyc-stats-card">
                      <h3 className="card-title">Vital Composition</h3>
                      <div className="comp-list">
                         {activeObj.composition && Array.isArray(activeObj.composition) ? (
                           activeObj.composition.map((c, i) => (
                             <div key={i} className="comp-item">
                                <div className="comp-lbl">
                                  <span>{c.layer}</span> <strong>{c.pct}%</strong>
                                </div>
                                <div className="comp-bar-bg">
                                  <div className="comp-bar-fill" style={{width: `${c.pct}%`, background: c.color}}></div>
                                </div>
                             </div>
                           ))
                         ) : (
                           <p style={{fontSize: '0.9rem', color: '#94a3b8'}}>Compositional telemetry not yet available.</p>
                         )}
                      </div>
                   </div>

                   <Link href={`/details/${activeObj.categoryId}/${activeObj.id}`} className="encyc-db-link">
                      <div className="db-link-content">
                         <h4>Access Live Telemetry</h4>
                         <p>View current raw data feeds and real-time state vectors.</p>
                      </div>
                      <span className="arrow">→</span>
                   </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="encyc-empty-state">
               Select an object from the codex to begin research.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
