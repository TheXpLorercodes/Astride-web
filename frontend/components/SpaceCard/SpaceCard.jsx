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
  image,
  badge,
}) {
  // Pick up to 3 stats to show
  const visibleStats = stats.slice(0, 3);

  // Status color mapping for known badge values
  const statusColors = {
    active: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', text: '#10b981' },
    inactive: { bg: 'rgba(100,116,139,0.12)', border: 'rgba(100,116,139,0.25)', text: '#64748b' },
    'in transit': { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)', text: '#fbbf24' },
    default: { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)', text: '#a78bfa' },
  };
  const badgeStyle = badge ? (statusColors[badge.toLowerCase()] || statusColors.default) : null;

  return (
    <Link href={`/details/${table}/${id}`} className="sc-v2" style={{ '--sc-color': color }}>
      {/* Background glow */}
      <div className="sc-v2-glow" />

      {/* Top corner accent */}
      <div className="sc-v2-corner-tl" />
      <div className="sc-v2-corner-tr" />

      {/* Visual orb / image */}
      <div className="sc-v2-visual">
        {image ? (
          <img src={image} alt={title} className="sc-v2-img" />
        ) : (
          <div className="sc-v2-sphere" />
        )}
        <div className="sc-v2-shadow" />
        <div className="sc-v2-ring" />
      </div>

      {/* Content */}
      <div className="sc-v2-content">
        {/* Badge row */}
        <div className="sc-v2-badge-row">
          {badge && (
            <span
              className="sc-v2-status-badge"
              style={{ background: badgeStyle.bg, border: `1px solid ${badgeStyle.border}`, color: badgeStyle.text }}
            >
              <span className="sc-v2-badge-dot" style={{ background: badgeStyle.text }} />
              {badge}
            </span>
          )}
          {subtitle && !badge && (
            <span className="sc-v2-subtitle">{subtitle}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="sc-v2-title">{title}</h3>

        {/* Description */}
        <p className="sc-v2-desc">
          {description?.length > 100 ? description.substring(0, 100) + '…' : description}
        </p>

        {/* Stats */}
        {visibleStats.length > 0 && (
          <div className="sc-v2-stats">
            {visibleStats.map((s, i) => (
              <div key={i} className="sc-v2-stat">
                <span className="sc-v2-stat-label">{s.label}</span>
                <span className="sc-v2-stat-value">{s.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* CTA arrow */}
        <div className="sc-v2-cta">
          <span>Explore</span>
          <svg className="sc-v2-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7h9M7.5 3.5 11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </Link>
  );
}
