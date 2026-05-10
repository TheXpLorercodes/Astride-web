'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import LaunchTimer from '../../components/Landing/LaunchTimer';
import './Launches.css';

const sortOptions = [
  { key: 'net', label: 'Launch Time' },
  { key: 'provider', label: 'Provider' },
  { key: 'mission', label: 'Mission' },
  { key: 'vehicle', label: 'Vehicle' },
  { key: 'location', label: 'Location' },
  { key: 'status', label: 'Status' }
];

const formatDate = (value) => {
  if (!value) return 'TBD';
  const date = new Date(value);
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};

const formatTime = (value) => {
  if (!value) return 'TBD';
  const date = new Date(value);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC';
};

const getCountdown = (netTime) => {
  if (!netTime) return 'TBD';
  const diff = netTime - Date.now();
  if (diff <= 0) return 'Live';
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `T-${days}d ${hours}h`;
  return `T-${hours}h`;
};

const getStatusClass = (status) => {
  const normalized = (status || '').toLowerCase();
  if (normalized.includes('go')) return 'go';
  if (normalized.includes('tbd')) return 'tbd';
  if (normalized.includes('tbc')) return 'tbc';
  if (normalized.includes('hold')) return 'hold';
  if (normalized.includes('success')) return 'success';
  if (normalized.includes('failure')) return 'failure';
  if (normalized.includes('in flight')) return 'flight';
  return 'default';
};

export default function LaunchesClient({ initialLaunches }) {
  const [now, setNow] = useState(Date.now());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [providerFilter, setProviderFilter] = useState('All');
  const [missionFilter, setMissionFilter] = useState('Any');
  const [locationFilter, setLocationFilter] = useState('All');
  const [windowFilter, setWindowFilter] = useState('Any');
  const [sortKey, setSortKey] = useState('net');
  const [sortDir, setSortDir] = useState('asc');
  const [view, setView] = useState('grid');

  const launchList = Array.isArray(initialLaunches) ? initialLaunches : [];

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const enrichedLaunches = useMemo(() => {
    return launchList.map((launch) => {
      const netTime = launch.net ? new Date(launch.net).getTime() : null;
      const provider = launch.launch_service_provider?.name || 'Unknown Provider';
      const status = launch.status?.name || 'Unknown';
      const missionType = launch.mission?.type || 'Unknown';
      const vehicle = launch.rocket?.configuration?.full_name || 'Vehicle TBD';
      const locationName = launch.pad?.location?.name || 'Unknown Site';
      const locationKey = launch.pad?.location?.country_code || locationName;
      return {
        ...launch,
        _netTime: netTime,
        _provider: provider,
        _status: status,
        _missionType: missionType,
        _vehicle: vehicle,
        _location: locationName,
        _locationKey: locationKey
      };
    });
  }, [launchList]);

  const nextLaunch = useMemo(() => {
    const upcomingLaunches = enrichedLaunches
      .filter((launch) => launch._netTime && launch._netTime >= now)
      .sort((a, b) => a._netTime - b._netTime);

    return upcomingLaunches[0] || enrichedLaunches[0] || null;
  }, [enrichedLaunches, now]);

  const statusOptions = useMemo(() => {
    const statuses = new Set();
    enrichedLaunches.forEach((launch) => {
      if (launch._status) statuses.add(launch._status);
    });
    return ['All', ...Array.from(statuses).sort((a, b) => a.localeCompare(b))];
  }, [enrichedLaunches]);

  const providerOptions = useMemo(() => {
    const providers = new Set();
    enrichedLaunches.forEach((launch) => {
      if (launch._provider) providers.add(launch._provider);
    });
    return ['All', ...Array.from(providers).sort((a, b) => a.localeCompare(b))];
  }, [enrichedLaunches]);

  const missionOptions = useMemo(() => {
    const missions = new Set();
    enrichedLaunches.forEach((launch) => {
      if (launch._missionType) missions.add(launch._missionType);
    });
    return ['Any', ...Array.from(missions).sort((a, b) => a.localeCompare(b))];
  }, [enrichedLaunches]);

  const locationOptions = useMemo(() => {
    const locations = new Set();
    enrichedLaunches.forEach((launch) => {
      if (launch._locationKey) locations.add(launch._locationKey);
    });
    return ['All', ...Array.from(locations).sort((a, b) => a.localeCompare(b))];
  }, [enrichedLaunches]);

  const filteredLaunches = useMemo(() => {
    let list = enrichedLaunches;

    if (search) {
      const query = search.toLowerCase();
      list = list.filter((launch) => launch.name?.toLowerCase().includes(query));
    }

    if (statusFilter !== 'All') {
      list = list.filter((launch) => launch._status === statusFilter);
    }

    if (providerFilter !== 'All') {
      list = list.filter((launch) => launch._provider === providerFilter);
    }

    if (missionFilter !== 'Any') {
      list = list.filter((launch) => launch._missionType === missionFilter);
    }

    if (locationFilter !== 'All') {
      list = list.filter((launch) => launch._locationKey === locationFilter);
    }

    if (windowFilter !== 'Any') {
      const now = Date.now();
      const windows = {
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
        '90d': 90 * 24 * 60 * 60 * 1000
      };
      const limit = windows[windowFilter];
      if (limit) {
        list = list.filter((launch) => launch._netTime && launch._netTime - now <= limit && launch._netTime - now >= 0);
      }
    }

    const compare = (a, b) => {
      const getValue = (launch) => {
        switch (sortKey) {
          case 'provider':
            return launch._provider;
          case 'mission':
            return launch.mission?.name || launch._missionType;
          case 'vehicle':
            return launch._vehicle;
          case 'location':
            return launch._location;
          case 'status':
            return launch._status;
          case 'net':
          default:
            return launch._netTime;
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
  }, [enrichedLaunches, search, statusFilter, providerFilter, missionFilter, locationFilter, windowFilter, sortKey, sortDir]);

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDir(key === 'net' ? 'asc' : 'desc');
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setProviderFilter('All');
    setMissionFilter('Any');
    setLocationFilter('All');
    setWindowFilter('Any');
    setSortKey('net');
    setSortDir('asc');
    setView('grid');
  };

  return (
    <div className="launches-root">
      <div className="launch-orb orb-left" />
      <div className="launch-orb orb-right" />

      <div className="launches-shell">
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="launches-hero"
        >
          <div>
            <p className="launches-eyebrow">Global Launch Index</p>
            <h1 className="launches-title">Launch <span>Directory</span></h1>
          </div>
          <p className="launches-copy">
            Track the next wave of orbital missions, flight windows, and launch providers in real time.
          </p>
        </motion.header>

        {nextLaunch && (
          <section className="launch-countdown-hero">
            <LaunchTimer data={nextLaunch} />
            <div className="launch-countdown-hero-actions">
              <div className="launch-countdown-hero-copy">
                <p className="launch-countdown-eyebrow">Launch tracker</p>
                <p>
                  Open the dedicated mission view for detailed timing, site data, and flight context.
                </p>
              </div>
              <Link className="launch-countdown-hero-link" href={`/launches/${nextLaunch.id}`}>
                Open tracker
              </Link>
            </div>
          </section>
        )}

        <section className="launch-toolbar">
          <div className="launch-toolbar-main">
            <div className="launch-filter launch-search">
              <span className="launch-filter-label">Search Names</span>
              <div className="launch-search-input">
                <input
                  type="text"
                  placeholder="Type a mission"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search launch names"
                />
                <span className="launch-search-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-4.35-4.35m1.1-5.15a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="launch-filter">
              <span className="launch-filter-label">Status</span>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="launch-filter">
              <span className="launch-filter-label">Provider</span>
              <select value={providerFilter} onChange={(e) => setProviderFilter(e.target.value)}>
                {providerOptions.map((provider) => (
                  <option key={provider} value={provider}>
                    {provider}
                  </option>
                ))}
              </select>
            </div>

            <div className="launch-filter">
              <span className="launch-filter-label">Mission Type</span>
              <select value={missionFilter} onChange={(e) => setMissionFilter(e.target.value)}>
                {missionOptions.map((mission) => (
                  <option key={mission} value={mission}>
                    {mission}
                  </option>
                ))}
              </select>
            </div>

            <div className="launch-filter">
              <span className="launch-filter-label">Window</span>
              <select value={windowFilter} onChange={(e) => setWindowFilter(e.target.value)}>
                <option value="Any">Any</option>
                <option value="24h">Next 24h</option>
                <option value="7d">Next 7d</option>
                <option value="30d">Next 30d</option>
                <option value="90d">Next 90d</option>
              </select>
            </div>

            <div className="launch-filter">
              <span className="launch-filter-label">Location</span>
              <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                {locationOptions.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="launch-toolbar-sub">
            <div className="launch-view-toggle" role="group" aria-label="View toggle">
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

            <div className="launch-counts">
              <span>Showing</span>
              <strong>{filteredLaunches.length}</strong>
              <span>of</span>
              <strong>{launchList.length}</strong>
              <span>launches</span>
            </div>

            <button type="button" className="launch-reset" onClick={resetFilters}>
              Reset
            </button>
          </div>
        </section>

        <div className="launch-sort">
          <span className="launch-sort-label">Sort by:</span>
          {sortOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              className={`launch-sort-option ${sortKey === option.key ? 'active' : ''}`}
              data-dir={sortKey === option.key ? sortDir : ''}
              onClick={() => handleSort(option.key)}
            >
              {option.label}
              <span className="sort-arrow" aria-hidden="true" />
            </button>
          ))}
        </div>

        {filteredLaunches.length > 0 ? (
          <motion.div layout className={`launch-grid ${view === 'list' ? 'list' : ''}`}>
            <AnimatePresence>
              {filteredLaunches.map((launch, index) => {
                const statusLabel = launch._status;
                const countdown = getCountdown(launch._netTime);
                return (
                  <motion.article
                    key={launch.id}
                    layout
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 18 }}
                    transition={{ duration: 0.4, delay: index * 0.03 }}
                    className="launch-card"
                  >
                    <div
                      className="launch-card-media"
                      style={{
                        backgroundImage: `url(${launch.image || 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=1200'})`
                      }}
                    >
                      <div className={`launch-status ${getStatusClass(statusLabel)}`}>
                        {statusLabel}
                      </div>
                      <div className="launch-card-date">
                        <span>{formatDate(launch.net)}</span>
                        <strong>{formatTime(launch.net)}</strong>
                      </div>
                    </div>

                    <div className="launch-card-body">
                      <div className="launch-card-head">
                        <h3>{launch.name}</h3>
                        <span className="launch-provider">{launch._provider}</span>
                      </div>

                      <p className="launch-card-desc">
                        {launch.mission?.description || 'Mission description is pending from the provider.'}
                      </p>

                      <div className="launch-card-stats">
                        <div>
                          <span>Vehicle</span>
                          <strong>{launch._vehicle}</strong>
                        </div>
                        <div>
                          <span>Launch Site</span>
                          <strong>{launch._location}</strong>
                        </div>
                        <div>
                          <span>Mission Type</span>
                          <strong>{launch._missionType}</strong>
                        </div>
                        <div>
                          <span>Window</span>
                          <strong>{launch.window_start ? formatTime(launch.window_start) : 'TBD'}</strong>
                        </div>
                      </div>

                      <div className="launch-card-cta">
                        <Link className="launch-track-link launch-track-button" href={`/launches/${launch.id}`}>
                          Launch Tracker
                        </Link>
                        <span className="launch-countdown-chip">{countdown}</span>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="launch-empty">No launches match these filters right now.</div>
        )}
      </div>
    </div>
  );
}
