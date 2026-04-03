import React from 'react';

export default function PageHeader({ title, intro, icon = '✨', color = 'var(--accent-purple)' }) {
  return (
    <div style={{ marginBottom: '3rem' }}>
      <div className="section-badge" style={{ color: color, borderColor: color }}>
        <span>{icon}</span>
        Database Query
      </div>
      <h1 className="page-title">{title}</h1>
      <p className="page-intro">{intro}</p>
    </div>
  );
}
