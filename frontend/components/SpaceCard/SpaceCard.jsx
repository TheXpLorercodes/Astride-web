import React from 'react';
import Link from 'next/link';
import './SpaceCard.css';

export default function SpaceCard({ 
  id, 
  title, 
  subtitle, 
  description, 
  table, 
  color = '#8b5cf6',
  stats = [],
  image
}) {
  return (
    <Link href={`/details/${table}/${id}`} className="mars-style-card" style={{ '--card-color': color }}>
      
      <div className="mars-card-top">
         <div className="mars-card-titles">
            <h3>{title}</h3>
            <p className="mars-card-subtitle">{subtitle || stats[0]?.value || 'Archival Data'}</p>
         </div>
         <div className="mars-card-plus">+</div>
      </div>

      <div className="mars-card-body">
         <p className="mars-card-desc">{description?.length > 80 ? description.substring(0, 80) + '...' : description}</p>
         
         {stats.length > 0 && (
          <div className="mars-card-stats">
             {stats.slice(0,1).map((s, i) => (
                <div key={i} className="mars-stat-pill">
                   <span className="label">{s.label}:</span>
                   <span className="value">{s.value}</span>
                </div>
             ))}
          </div>
         )}
      </div>

      <div className="mars-card-planet-wrap">
         {image ? (
            <img src={image} alt={title} className="mars-card-planet-img" />
         ) : (
            <div className="mars-card-sphere" style={{ background: `radial-gradient(circle at 30% 30%, #fff, ${color} 60%)` }}></div>
         )}
         <div className="mars-card-planet-shadow"></div>
      </div>

    </Link>
  );
}
