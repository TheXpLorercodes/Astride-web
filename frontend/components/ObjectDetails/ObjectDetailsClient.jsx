'use client';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './ObjectDetails.css';

/* ─── Per-table metric definitions ─────────────────────────────── */
function getMetricItems(table, item) {
  const v = (val) => val || '—';

  if (table === 'planets') return [
    ['Diameter', v(item.diameter)],
    ['Mass', v(item.mass)],
    ['Surface Gravity', v(item.gravity)],
    ['Orbital Period', v(item.orbital_period || item.year_length)],
    ['Day Length', v(item.day_length)],
    ['Avg Temperature', v(item.temperature)],
    ['Distance from Sun', v(item.distance_from_sun)],
    ['Axial Tilt', v(item.axial_tilt)],
    ['Moons', v(item.number_of_moons ?? item.moon_count)],
    ['Rings', item.rings || item.has_rings ? 'Yes' : 'No'],
    ['Atmosphere', v(item.atmosphere_label || item.atmosphere_type)],
    ['Magnetic Field', v(item.magnetic_field)],
    ['Density', v(item.density)],
    ['Escape Velocity', v(item.escape_velocity)],
    ['Type', v(item.planet_type || (item.is_exoplanet ? 'Exoplanet' : 'Solar'))],
  ].filter(([, val]) => val !== '—');

  if (table === 'moons') return [
    ['Parent Planet', v(item.parent_planet)],
    ['Diameter', v(item.diameter)],
    ['Mass', v(item.mass)],
    ['Gravity', v(item.gravity)],
    ['Orbital Period', v(item.orbital_period)],
    ['Rotation Period', v(item.rotation_period)],
    ['Surface Temperature', v(item.temperature)],
    ['Atmosphere', v(item.atmosphere_label)],
    ['Distance from Planet', v(item.distance_from_planet)],
    ['Discovery Year', v(item.discovery_year)],
    ['Discovered By', v(item.discovered_by)],
  ].filter(([, val]) => val !== '—');

  if (table === 'stars') return [
    ['Star Type / Class', v(item.star_type)],
    ['Temperature', v(item.temperature)],
    ['Luminosity', v(item.luminosity)],
    ['Mass', v(item.mass)],
    ['Radius', v(item.radius)],
    ['Age', v(item.age)],
    ['Distance from Earth', v(item.distance_from_earth)],
    ['Constellation', v(item.constellation)],
    ['Absolute Magnitude', v(item.absolute_magnitude)],
    ['Spectral Type', v(item.spectral_type)],
    ['Example Star', v(item.example_star)],
    ['Lifecycle Stage', v(item.lifecycle_stage)],
  ].filter(([, val]) => val !== '—');

  if (table === 'galaxies') return [
    ['Galaxy Type', v(item.galaxy_type)],
    ['Diameter', v(item.diameter)],
    ['Distance from Earth', v(item.distance || item.distance_from_earth)],
    ['Number of Stars', v(item.number_of_stars || item.num_stars)],
    ['Age', v(item.age)],
    ['Mass', v(item.mass)],
    ['Constellation', v(item.constellation)],
    ['Redshift', v(item.redshift)],
    ['Central Black Hole', v(item.central_black_hole)],
    ['Group / Cluster', v(item.group_cluster)],
    ['Discovery', v(item.discovery_year || item.discovery)],
    ['Also Known As', v(item.alternate_names || item.aka)],
  ].filter(([, val]) => val !== '—');

  if (table === 'asteroids') return [
    ['Diameter', v(item.diameter)],
    ['Orbital Period', v(item.orbital_period)],
    ['Spectral Type', v(item.spectral_type)],
    ['Composition', v(item.composition)],
    ['Semi-Major Axis', v(item.semi_major_axis)],
    ['Eccentricity', v(item.eccentricity)],
    ['Inclination', v(item.inclination)],
    ['Rotation Period', v(item.rotation_period)],
    ['Discovered', v(item.discovery_date)],
    ['Discovered By', v(item.discovered_by)],
    ['Orbit Class', v(item.orbit_type)],
    ['Velocity', v(item.velocity)],
    ['Hazard Class', item.is_potentially_hazardous ? 'Potentially Hazardous' : 'Non-Hazardous'],
  ].filter(([, val]) => val !== '—');

  if (table === 'satellites') return [
    ['Operator', v(item.operator)],
    ['Mission Type', v(item.mission_type)],
    ['Orbit Type', v(item.orbit_type)],
    ['Altitude', v(item.altitude)],
    ['Velocity', v(item.velocity)],
    ['Orbital Period', v(item.orbital_period)],
    ['Inclination', v(item.inclination)],
    ['Dimensions', v(item.dimensions)],
    ['Mass', v(item.mass)],
    ['Power', v(item.power)],
    ['Launch Date', v(item.launch_date)],
    ['Status', v(item.status)],
  ].filter(([, val]) => val !== '—');

  return [];
}

/* ─── Hero quick stats (top 4 most important) ───────────────────── */
function getHeroStats(table, item) {
  if (table === 'planets') return [
    { label: 'Diameter', val: item.diameter },
    { label: 'Mass', val: item.mass },
    { label: 'Orbital Period', val: item.orbital_period || item.year_length },
    { label: 'Avg Temp', val: item.temperature },
    { label: 'Distance', val: item.distance_from_sun },
  ].filter(s => s.val).slice(0, 4);

  if (table === 'moons') return [
    { label: 'Orbits', val: item.parent_planet },
    { label: 'Diameter', val: item.diameter },
    { label: 'Gravity', val: item.gravity },
    { label: 'Orbital Period', val: item.orbital_period },
  ].filter(s => s.val).slice(0, 4);

  if (table === 'stars') return [
    { label: 'Class', val: item.star_type },
    { label: 'Temperature', val: item.temperature },
    { label: 'Luminosity', val: item.luminosity },
    { label: 'Distance', val: item.distance_from_earth },
  ].filter(s => s.val).slice(0, 4);

  if (table === 'galaxies') return [
    { label: 'Type', val: item.galaxy_type },
    { label: 'Diameter', val: item.diameter },
    { label: 'Distance', val: item.distance || item.distance_from_earth },
    { label: 'Age', val: item.age },
  ].filter(s => s.val).slice(0, 4);

  if (table === 'asteroids') return [
    { label: 'Diameter', val: item.diameter },
    { label: 'Orbit Class', val: item.orbit_type },
    { label: 'Spectral Type', val: item.spectral_type },
    { label: 'Orbital Period', val: item.orbital_period },
  ].filter(s => s.val).slice(0, 4);

  if (table === 'satellites') return [
    { label: 'Orbit', val: item.orbit_type },
    { label: 'Altitude', val: item.altitude },
    { label: 'Velocity', val: item.velocity },
    { label: 'Status', val: item.status },
  ].filter(s => s.val).slice(0, 4);

  return [];
}

/* ─── Section labels ─────────────────────────────────────────────── */
const LABELS = {
  planets:   { overview: 'Planetary Overview',      metrics: 'Physical & Orbital Data', composition: 'Internal Structure' },
  moons:     { overview: 'Lunar Overview',           metrics: 'Surface & Orbital Metrics', composition: 'Composition' },
  stars:     { overview: 'Stellar Overview',         metrics: 'Stellar Classification & Output', composition: 'Internal Layers' },
  galaxies:  { overview: 'Galactic Overview',        metrics: 'Structure & Scale Data', composition: 'Mass Distribution' },
  asteroids: { overview: 'Small-Body Overview',      metrics: 'Orbital & Physical Data', composition: 'Composition' },
  satellites:{ overview: 'Satellite Overview',       metrics: 'Orbital & System Specs', composition: 'Instruments' },
};

function getFactBlocks(item, encData) {
  if (Array.isArray(item.facts) && item.facts.length > 0)
    return item.facts.map((f, i) => ({ id: i, title: null, text: f }));
  const blocks = encData?.tabs?.overview;
  if (Array.isArray(blocks) && blocks.length > 0)
    return blocks.map((b, i) => ({ id: i, title: b.title || null, text: b.text || '' }));
  return [];
}

/* ─── Main component ─────────────────────────────────────────────── */
export default function ObjectDetailsClient({ table, id, item, related, encData, siblings }) {
  const router = useRouter();

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (!item) return <div style={{ color: 'white', padding: '4rem', textAlign: 'center' }}>Object not found.</div>;

  const theme = item.color || encData?.colorRef || '#8b5cf6';
  const labels = LABELS[table] || LABELS.planets;
  const metrics = getMetricItems(table, item);
  const heroStats = getHeroStats(table, item);
  const factBlocks = getFactBlocks(item, encData);
  const composition = item.atmosphere || item.composition || encData?.tabs?.composition || [];
  const showComposition = Array.isArray(composition) && composition.length > 0;
  const showSystems = table === 'satellites' && Array.isArray(item.main_parts) && item.main_parts.length > 0;
  const showMissions = related.filter(r => r.table === 'missions').length > 0;
  const missionLinks = related.filter(r => r.table === 'missions');
  const moonLinks = related.filter(r => r.table === 'planets' || r.table === 'moons' || r.relation_type === 'moon');
  const isPlanetLike = table === 'planets' || table === 'moons';
  const encMissions = encData?.tabs?.missions || [];
  const encCategorySpecific = encData?.tabs?.categorySpecific;

  return (
    <div className="odc-container" style={{ '--theme': theme }}>
      {/* ─ Nav ─ */}
      <div className="odc-nav-bar">
        <button className="odc-back-btn" onClick={() => router.back()}>
          ← Back
        </button>
        <div className="odc-system-status">
          <span className="status-dot" />
          {item.name.toUpperCase()}
        </div>
      </div>

      {/* ─ Hero ─ */}
      <section className="odc-hero-section">
        <div className="odc-hero-bg" />
        {item.image && (
          <div className="odc-hero-image-bg" style={{ backgroundImage: `url(${item.image})` }} />
        )}

        <div className="odc-visual-wrapper-3d">
          <motion.div
            className="odc-planet-sphere-3d"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 260, ease: 'linear' }}
            style={{
              backgroundImage: item.image ? `url(${item.image})` : `radial-gradient(circle at 32% 30%, color-mix(in srgb, ${theme} 55%, white), ${theme} 50%, color-mix(in srgb, ${theme} 50%, black))`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: `inset -60px -60px 100px rgba(0,0,0,0.9), 0 0 100px ${theme}35`,
            }}
          >
            {['Earth', 'Mars', 'Venus'].includes(item.name) && (
              <motion.div className="odc-planet-clouds-3d" animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 180, ease: 'linear' }} />
            )}
            <div className="odc-atmosphere-glow" style={{ boxShadow: `inset 0 0 50px ${theme}50, 0 0 80px ${theme}20` }} />
            <div className="odc-scanline-overlay" />
          </motion.div>

          {(item.rings || item.has_rings) && (
            <div className="odc-planet-rings-container">
              <div className="odc-planet-rings" style={{ borderColor: `${theme}25` }} />
              <div className="odc-planet-rings odc-rings-inner" style={{ borderColor: `${theme}45` }} />
            </div>
          )}
        </div>

        <div className="odc-hero-text">
          <motion.h1
            className="odc-planet-name-3d"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textShadow: `0 0 60px ${theme}70` }}
          >
            {item.name}
          </motion.h1>
          <motion.p
            className="odc-tagline-3d"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {item.tagline || encData?.tagline || `${table.replace(/s$/, '').toUpperCase()} · DEEP SPACE ARCHIVE`}
          </motion.p>

          {heroStats.length > 0 && (
            <motion.div
              className="odc-hero-stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {heroStats.map(s => (
                <div key={s.label} className="odc-hero-stat">
                  <span className="odc-hero-stat-val">{s.val}</span>
                  <span className="odc-hero-stat-lbl">{s.label}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ─ Content ─ */}
      <main className="odc-scrolling-content">

        {/* Asteroid hazard badge */}
        {table === 'asteroids' && (
          <div>
            {item.is_potentially_hazardous ? (
              <div className="odc-hazard-badge">⚠ Potentially Hazardous Object</div>
            ) : (
              <div className="odc-safe-badge">✓ Non-Hazardous · Tracked Object</div>
            )}
          </div>
        )}

        {/* ── Overview ── */}
        <section>
          <div className="odc-section-header">
            <span className="odc-section-eyebrow">{labels.overview}</span>
            <div className="odc-section-rule" />
          </div>

          <p className="odc-description-hero">
            {item.hero_paragraph || item.description || encData?.heroParagraph || encData?.description || ''}
          </p>

          {factBlocks.length > 0 && (
            <div className="odc-facts-grid-3d">
              {factBlocks.map((block) => (
                <div key={block.id} className="odc-fact-item-3d">
                  <div className="odc-fact-bullet" />
                  <span>
                    {block.title && <strong style={{ color: 'rgba(255,255,255,0.55)', marginRight: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{block.title}:</strong>}
                    {block.text}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Full Metrics ── */}
        {metrics.length > 0 && (
          <section>
            <div className="odc-section-header">
              <span className="odc-section-eyebrow">{labels.metrics}</span>
              <div className="odc-section-rule" />
            </div>
            <div className="odc-metrics-grid">
              {metrics.map(([label, value]) => (
                <div key={label} className="odc-metric-card">
                  <div className="odc-metric-val">{value}</div>
                  <div className="odc-metric-lbl">{label}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Composition / Atmosphere / Internal Structure ── */}
        {showComposition && (
          <section>
            <div className="odc-section-header">
              <span className="odc-section-eyebrow">{labels.composition}</span>
              <div className="odc-section-rule" />
            </div>
            <div className="odc-atmos-list-3d">
              {composition.map((atm, idx) => (
                <div key={idx} className="odc-atmos-item-3d">
                  <div className="odc-atmos-header-3d">
                    <span>{atm.element || atm.layer || atm.name || 'Component'}</span>
                    <span style={{ fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>
                      {atm.percentage || atm.pct}%
                    </span>
                  </div>
                  <div className="odc-atmos-bar-bg-3d">
                    <motion.div
                      className="odc-atmos-bar-fill-3d"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${atm.percentage || atm.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      style={{ background: atm.color || theme }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Category-specific extra section (from encData) ── */}
        {encCategorySpecific && (
          <section>
            <div className="odc-section-header">
              <span className="odc-section-eyebrow">{encCategorySpecific.label || 'Deep Context'}</span>
              <div className="odc-section-rule" />
            </div>
            <h3 className="odc-section-title">{encCategorySpecific.title}</h3>
            <p className="odc-description-hero" style={{ fontSize: '1rem' }}>{encCategorySpecific.text}</p>
          </section>
        )}

        {/* ── Systems / Main Parts (Satellites) ── */}
        {showSystems && (
          <section>
            <div className="odc-section-header">
              <span className="odc-section-eyebrow">Onboard Systems</span>
              <div className="odc-section-rule" />
            </div>
            <div className="odc-systems-grid">
              {item.main_parts.map((part, idx) => (
                <div key={idx} className="odc-system-card">
                  <h4 className="odc-system-name">{part.name}</h4>
                  <p className="odc-system-fn">{part.function}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Extra info rows for any additional fields ── */}
        {(item.discovery || item.discovery_date || item.discovered_by || encData?.discovery || item.alternate_names || item.aka) && (
          <section>
            <div className="odc-section-header">
              <span className="odc-section-eyebrow">Discovery & Classification</span>
              <div className="odc-section-rule" />
            </div>
            <div className="odc-info-rows">
              {(item.discovery_date || encData?.discovery) && (
                <div className="odc-info-row">
                  <span className="odc-info-key">Discovery</span>
                  <span className="odc-info-val">{item.discovery_date || encData?.discovery}</span>
                </div>
              )}
              {(item.discovered_by) && (
                <div className="odc-info-row">
                  <span className="odc-info-key">Discovered By</span>
                  <span className="odc-info-val">{item.discovered_by}</span>
                </div>
              )}
              {(item.alternate_names || item.aka) && (
                <div className="odc-info-row">
                  <span className="odc-info-key">Also Known As</span>
                  <span className="odc-info-val">{item.alternate_names || item.aka}</span>
                </div>
              )}
              {encData?.alternateNames && encData.alternateNames.length > 0 && (
                <div className="odc-info-row">
                  <span className="odc-info-key">Alternate Names</span>
                  <span className="odc-info-val">{encData.alternateNames.join(', ')}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Mission History ── */}
        {(missionLinks.length > 0 || encMissions.length > 0) && (
          <section>
            <div className="odc-section-header">
              <span className="odc-section-eyebrow">Mission History</span>
              <div className="odc-section-rule" />
            </div>
            <div className="odc-mission-timeline">
              {encMissions.map((m, i) => (
                <div key={`enc-${i}`} className="odc-mission-entry" style={{ textDecoration: 'none' }}>
                  <div className="odc-mission-marker" style={{ background: theme }} />
                  <div className="odc-mission-info">
                    {m.year && <div className="odc-mission-type">{m.year}</div>}
                    <div className="odc-mission-name">{m.name}</div>
                    {m.summary && <p className="odc-mission-desc">{m.summary}</p>}
                  </div>
                </div>
              ))}
              {missionLinks.map((m, i) => (
                <Link href={`/details/missions/${m.id}`} key={`db-${i}`} className="odc-mission-entry">
                  <div className="odc-mission-marker" style={{ background: theme }} />
                  <div className="odc-mission-info">
                    <div className="odc-mission-type">{m.relation_type}</div>
                    <div className="odc-mission-name">{m.name}</div>
                    {m.description && <p className="odc-mission-desc">{m.description}</p>}
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'Inter', fontSize: '0.8rem' }}>→</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Natural satellites (for planets) ── */}
        {isPlanetLike && moonLinks.length > 0 && (
          <section>
            <div className="odc-section-header">
              <span className="odc-section-eyebrow">Natural Satellites</span>
              <div className="odc-section-rule" />
            </div>
            <div className="odc-moons-grid">
              {moonLinks.map((moon, idx) => (
                <Link href={`/details/${moon.table === 'moons' ? 'moons' : 'planets'}/${moon.id}`} key={idx} className="odc-moon-card">
                  <div className="odc-moon-visual" style={{ background: `radial-gradient(circle at 32% 30%, rgba(255,255,255,0.15), ${theme}25)` }} />
                  <div className="odc-moon-name">{moon.name}</div>
                  <div className="odc-moon-tag">Natural Satellite</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── No missions state ── */}
        {missionLinks.length === 0 && encMissions.length === 0 && (
          <section>
            <div className="odc-section-header">
              <span className="odc-section-eyebrow">Mission History</span>
              <div className="odc-section-rule" />
            </div>
            <div className="odc-empty">No recorded missions in the database for this object.</div>
          </section>
        )}

        {/* ── Sibling selector ── */}
        {Array.isArray(siblings) && siblings.length > 0 && (
          <section>
            <div className="odc-section-header">
              <span className="odc-section-eyebrow">Explore Others</span>
              <div className="odc-section-rule" />
            </div>
            <div className="odc-selector-strip-3d">
              {siblings.map((sib) => (
                <Link
                  key={sib.id}
                  href={`/details/${table}/${sib.id}`}
                  scroll={false}
                  className={`odc-selector-btn-3d${item.id === sib.id ? ' active' : ''}`}
                  style={item.id === sib.id ? { borderColor: theme, boxShadow: `0 0 24px ${theme}25` } : {}}
                >
                  <div
                    className="odc-selector-img-3d"
                    style={{
                      backgroundImage: sib.image ? `url(${sib.image})` : undefined,
                      background: !sib.image ? `radial-gradient(circle at 32% 30%, ${sib.color || theme}99, ${sib.color || theme}44)` : undefined,
                    }}
                  />
                  <span>{sib.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
