'use client';
import React, { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Astronauts.css';

const FALLBACK_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';

const parseDurationDays = (duration) => {
  if (!duration || typeof duration !== 'string') return null;
  const match = duration.match(/P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/);
  if (!match) return null;
  const days = Number(match[1] || 0);
  const hours = Number(match[2] || 0);
  const minutes = Number(match[3] || 0);
  const seconds = Number(match[4] || 0);
  return days + hours / 24 + minutes / 1440 + seconds / 86400;
};

const formatDays = (value) => {
  if (value == null || Number.isNaN(value)) return '--';
  if (value <= 0) return '--';
  if (value < 1) return '<1';
  return value.toFixed(1);
};

const sortOptions = [
  { key: 'launch', label: 'Launch Order' },
  { key: 'name', label: 'Name' },
  { key: 'nation', label: 'Nation' },
  { key: 'daysInSpace', label: 'Days in Space' },
  { key: 'spacewalks', label: 'Spacewalks' },
  { key: 'daysSpacewalking', label: 'Days Spacewalking' },
  { key: 'missions', label: 'Missions' }
];

export default function AstronautsClient({ initialAstronauts }) {
  const [search, setSearch] = useState('');
  const [inSpaceOnly, setInSpaceOnly] = useState(false);
  const [nation, setNation] = useState('All');
  const [missions, setMissions] = useState('Any');
  const [sortKey, setSortKey] = useState('launch');
  const [sortDir, setSortDir] = useState('asc');
  const [view, setView] = useState('grid');
  const deferredSearch = useDeferredValue(search.trim());
  const [isHydrated, setIsHydrated] = useState(false);

  const astronautList = Array.isArray(initialAstronauts) ? initialAstronauts : [];

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const nationOptions = useMemo(() => {
    const nations = new Set();
    astronautList.forEach((astro) => {
      if (astro.nationality) nations.add(astro.nationality);
    });
    return ['All', ...Array.from(nations).sort((a, b) => a.localeCompare(b))];
  }, [astronautList]);

  const enrichedAstronauts = useMemo(() => {
    return astronautList.map((astro) => {
      const daysInSpace = parseDurationDays(astro.time_in_space);
      const daysSpacewalking = parseDurationDays(astro.eva_time);
      const firstFlight = astro.first_flight ? new Date(astro.first_flight).getTime() : null;
      return {
        ...astro,
        _daysInSpace: daysInSpace,
        _daysSpacewalking: daysSpacewalking,
        _firstFlight: firstFlight,
        _missions: Number.isFinite(astro.flights_count) ? astro.flights_count : 0
      };
    });
  }, [astronautList]);

  const inSpaceAstronauts = useMemo(() => {
    return [...enrichedAstronauts]
      .filter((astro) => astro.in_space)
      .sort((a, b) => {
        const aName = a.name || '';
        const bName = b.name || '';
        return aName.localeCompare(bName);
      });
  }, [enrichedAstronauts]);

  const filteredAstronauts = useMemo(() => {
    let list = enrichedAstronauts;

    if (deferredSearch) {
      const query = deferredSearch.toLowerCase();
      list = list.filter((astro) => {
        const searchTarget = [
          astro.name,
          astro.nationality,
          astro.agency?.name,
          astro.agency?.abbrev,
          astro.status?.name,
          astro.bio,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return searchTarget.includes(query);
      });
    }

    if (inSpaceOnly) {
      list = list.filter((astro) => astro.in_space);
    }

    if (nation !== 'All') {
      list = list.filter((astro) => astro.nationality === nation);
    }

    if (missions !== 'Any') {
      const threshold = Number.parseInt(missions, 10);
      list = list.filter((astro) => (astro.flights_count || 0) >= threshold);
    }

    const compare = (a, b) => {
      const getValue = (astro) => {
        switch (sortKey) {
          case 'name':
            return astro.name || '';
          case 'nation':
            return astro.nationality || '';
          case 'daysInSpace':
            return astro._daysInSpace;
          case 'spacewalks':
            return astro.spacewalks_count ?? null;
          case 'daysSpacewalking':
            return astro._daysSpacewalking;
          case 'missions':
            return astro._missions;
          case 'launch':
          default:
            return astro._firstFlight;
        }
      };

      const aVal = getValue(a);
      const bVal = getValue(b);

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === 'string') {
        const res = aVal.localeCompare(bVal);
        return sortDir === 'asc' ? res : -res;
      }

      if (aVal === bVal) return 0;
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    };

    return [...list].sort(compare);
  }, [enrichedAstronauts, deferredSearch, inSpaceOnly, nation, missions, sortKey, sortDir]);

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDir(key === 'name' || key === 'nation' ? 'asc' : 'desc');
  };

  const resetFilters = () => {
    setSearch('');
    setInSpaceOnly(false);
    setNation('All');
    setMissions('Any');
    setSortKey('launch');
    setSortDir('asc');
    setView('grid');
  };

  const showingCount = filteredAstronauts.length;

  return (
    <div className="astronauts-root">
      <div className="astro-orb orb-left" />
      <div className="astro-orb orb-right" />

      <div className="astronauts-shell">
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="astronauts-hero"
        >
          <div>
            <p className="astronauts-eyebrow">Space Explorers</p>
            <h1 className="astronauts-title">
              Astronaut <span>Records</span>
            </h1>
          </div>
          <p className="astronauts-copy">
            A living archive of human spaceflight, filtered by mission tempo, time in orbit, and expedition cadence.
          </p>
        </motion.header>

        {inSpaceAstronauts.length > 0 && (
          <section className="astro-spotlight">
            <div className="astro-spotlight-header">
              <span className="astro-spotlight-tag">In Space Now</span>
              <div>
                <h2>{inSpaceAstronauts.length} astronauts currently marked in orbit</h2>
                <p>
                  These records are highlighted from the live database so the active crew stands out immediately.
                </p>
              </div>
            </div>

            <div className="astro-spotlight-grid">
              {inSpaceAstronauts.slice(0, 6).map((astro) => {
                const agencyLabel = astro.agency?.abbrev || astro.agency?.name || astro.nationality || 'Orbital Crew';
                const imageSrc = astro.profile_image || astro.profile_image_thumbnail || FALLBACK_IMAGE;

                return (
                  <article key={astro.id} className="astro-spotlight-card">
                    <img
                      src={imageSrc}
                      alt={astro.name}
                      loading="lazy"
                      decoding="async"
                      onError={(event) => {
                        if (event.currentTarget.dataset.fallbackApplied === 'true') {
                          event.currentTarget.style.visibility = 'hidden';
                          return;
                        }

                        event.currentTarget.dataset.fallbackApplied = 'true';
                        event.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                    <div className="astro-spotlight-copy">
                      <span className="astro-status in-space">In Space</span>
                      <h3>{astro.name}</h3>
                      <p>{agencyLabel}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        <section className="astro-toolbar">
          <div className="astro-toolbar-main">
            <button
              type="button"
              className={`astro-toggle ${inSpaceOnly ? 'active' : ''}`}
              onClick={() => setInSpaceOnly((prev) => !prev)}
              aria-pressed={inSpaceOnly}
            >
              In Space
            </button>

            <div className="astro-search">
              <span className="astro-filter-label">Search Names</span>
              <div className="astro-search-input">
                <input
                  type="text"
                  placeholder="Type a name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search astronaut names"
                />
                <span className="astro-search-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-4.35-4.35m1.1-5.15a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="astro-filter disabled" title="Only human records are available right now.">
              <span className="astro-filter-label">Life Form</span>
              <select defaultValue="Human" disabled>
                <option value="Human">Human</option>
              </select>
            </div>

            <div className="astro-filter disabled" title="Gender data is not provided by this source.">
              <span className="astro-filter-label">Gender</span>
              <select defaultValue="Any" disabled>
                <option value="Any">Any</option>
              </select>
            </div>

            <div className="astro-filter">
              <span className="astro-filter-label">Nation</span>
              <select
                value={nation}
                onChange={(e) => setNation(e.target.value)}
                aria-label="Filter by nation"
              >
                {nationOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="astro-filter">
              <span className="astro-filter-label">Missions</span>
              <select
                value={missions}
                onChange={(e) => setMissions(e.target.value)}
                aria-label="Filter by missions"
              >
                <option value="Any">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="5">5+</option>
              </select>
            </div>

            <div className="astro-filter disabled" title="Craft data is not available for this endpoint.">
              <span className="astro-filter-label">Craft</span>
              <select defaultValue="Any" disabled>
                <option value="Any">Any</option>
              </select>
            </div>
          </div>

          <div className="astro-toolbar-sub">
            <div className="astro-view-toggle" role="group" aria-label="View toggle">
              <button
                type="button"
                className={view === 'grid' ? 'active' : ''}
                onClick={() => setView('grid')}
                aria-pressed={view === 'grid'}
              >
                Grid
              </button>
              <button
                type="button"
                className={view === 'list' ? 'active' : ''}
                onClick={() => setView('list')}
                aria-pressed={view === 'list'}
              >
                List
              </button>
            </div>

            <div className="astro-counts">
              <span>Showing</span>
              <strong>{showingCount} Records</strong>
              <span className="astro-count-divider" />
              <strong>{inSpaceAstronauts.length}</strong>
              <span>in space</span>
              <span className="astro-count-tag">Live crew</span>
            </div>

            <button type="button" className="astro-reset" onClick={resetFilters}>
              Reset
            </button>
          </div>
        </section>

        <div className="astro-sort">
          <span className="astro-sort-label">Sort by:</span>
          {sortOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              className={`astro-sort-option ${sortKey === option.key ? 'active' : ''}`}
              data-dir={sortKey === option.key ? sortDir : ''}
              onClick={() => handleSort(option.key)}
            >
              {option.label}
              <span className="sort-arrow" aria-hidden="true" />
            </button>
          ))}
        </div>

        {filteredAstronauts.length > 0 ? (
          <motion.div layout className={`astro-grid ${view === 'list' ? 'list' : ''}`}>
            <AnimatePresence initial={false}>
              {filteredAstronauts.map((astro, index) => {
                const statusText = astro.in_space ? 'In Space' : (astro.status?.name || 'Unknown');
                const statusClass = statusText.toLowerCase().replace(/\s+/g, '-');
                const missionCount = astro.flights_count || 0;
                const daysInSpace = formatDays(astro._daysInSpace);
                const daysSpacewalking = formatDays(astro._daysSpacewalking);
                const imageSrc = astro.profile_image || astro.profile_image_thumbnail || FALLBACK_IMAGE;

                return (
                  <motion.article
                    key={astro.id}
                    layout
                    initial={false}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 18 }}
                    transition={{ duration: 0.25 }}
                    className="astro-card"
                  >
                    <div className="astro-card-media">
                      <span className="astro-card-index">{String(index + 1).padStart(3, '0')}</span>
                      <img
                        src={imageSrc}
                        alt={astro.name}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          if (e.currentTarget.dataset.fallbackApplied === 'true') {
                            e.currentTarget.style.visibility = 'hidden';
                            return;
                          }

                          e.currentTarget.dataset.fallbackApplied = 'true';
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />
                    </div>

                    <div className="astro-card-body">
                      <div className="astro-card-head">
                        <span className={`astro-status ${statusClass}`}>{statusText}</span>
                        <span className="astro-nation">{astro.nationality || 'Unknown Nation'}</span>
                      </div>

                      <div>
                        <h3 className="astro-card-name">{astro.name}</h3>
                        <div className="astro-card-tags">
                          <span>{astro.agency?.abbrev || astro.agency?.name || 'Unknown Agency'}</span>
                          {astro.age ? <span>{astro.age}y</span> : null}
                          {astro.first_flight ? <span>First Flight {astro.first_flight.slice(0, 4)}</span> : null}
                        </div>
                      </div>

                      <div className="astro-card-stats">
                        <div className="astro-stat">
                          <span>Missions</span>
                          <strong>{missionCount}</strong>
                        </div>
                        <div className="astro-stat">
                          <span>Days in Space</span>
                          <strong>{daysInSpace}</strong>
                        </div>
                        <div className="astro-stat">
                          <span>Spacewalks</span>
                          <strong>{astro.spacewalks_count ?? '--'}</strong>
                        </div>
                        <div className="astro-stat">
                          <span>Days Spacewalking</span>
                          <strong>{daysSpacewalking}</strong>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="astro-empty">
            <p>No astronauts align with those parameters.</p>
          </div>
        )}
      </div>
    </div>
  );
}