'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import './LaunchTracker.css';

const LaunchSiteMap = dynamic(() => import('./LaunchSiteMap'), { ssr: false });

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

const padNumber = (value) => String(value).padStart(2, '0');

const getCountdownParts = (net, now) => {
  if (!net) return { days: '00', hours: '00', minutes: '00', seconds: '00', live: false };
  const diff = new Date(net).getTime() - now;
  if (diff <= 0) return { days: '00', hours: '00', minutes: '00', seconds: '00', live: true };
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return {
    days: padNumber(days),
    hours: padNumber(hours),
    minutes: padNumber(minutes),
    seconds: padNumber(seconds),
    live: false
  };
};

const getRelativeLine = (net) => {
  if (!net) return 'Launch timing to be confirmed.';
  const diff = new Date(net).getTime() - Date.now();
  if (diff <= 0) return 'Launch window is live now.';
  const hours = Math.ceil(diff / 3600000);
  if (hours < 24) return `In ${hours} hours.`;
  const days = Math.ceil(hours / 24);
  return `In ${days} days.`;
};

export default function LaunchTrackerPage() {
  const searchParams = useSearchParams();
  const launchId = searchParams.get('launch');
  const [mode, setMode] = useState('upcoming');
  const [launches, setLaunches] = useState([]);
  const [activeLaunch, setActiveLaunch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const url = launchId
          ? `/api/launches?id=${launchId}`
          : `/api/launches?mode=${mode}&limit=20`;
        const res = await fetch(url);
        const data = await res.json();
        const list = data.results || [];
        if (cancelled) return;
        setLaunches(list);
        setActiveLaunch(list[0] || null);
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setLaunches([]);
          setActiveLaunch(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [launchId, mode]);

  const countdown = useMemo(() => getCountdownParts(activeLaunch?.net, now), [activeLaunch?.net, now]);

  const heroImage =
    activeLaunch?.image ||
    activeLaunch?.infographic ||
    activeLaunch?.pad?.map_image ||
    activeLaunch?.pad?.location?.map_image ||
    'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=1200';

  const payloadTitle = activeLaunch?.mission?.name || 'Unknown payload';
  const payloadDesc =
    activeLaunch?.mission?.description ||
    'The payload details for this mission have not been released yet.';
  const payloadType = activeLaunch?.mission?.type || 'Unknown';
  const payloadOrbit = activeLaunch?.mission?.orbit?.name || 'TBD';

  const rocketTitle = activeLaunch?.rocket?.configuration?.full_name || 'Launch vehicle TBD';
  const rocketFamily = activeLaunch?.rocket?.configuration?.family || 'Unknown family';
  const rocketDesc = activeLaunch?.launch_service_provider?.name
    ? `${activeLaunch.launch_service_provider.name} will fly a ${rocketTitle} vehicle for this mission.`
    : 'Launch provider details are pending.';

  const padTitle = activeLaunch?.pad?.name || 'Launch pad';
  const padLocation = activeLaunch?.pad?.location?.name || 'Location pending';
  const padDesc = activeLaunch?.pad?.location?.description ||
    'The launch complex is preparing for this mission. Additional site details are not yet available.';

  const sections = [
    {
      key: 'payload',
      kicker: 'This goes to space',
      title: payloadTitle,
      description: payloadDesc,
      image: heroImage,
      meta: [
        { label: 'Mission Type', value: payloadType },
        { label: 'Orbit', value: payloadOrbit }
      ]
    },
    {
      key: 'rocket',
      kicker: 'On this rocket',
      title: rocketTitle,
      description: rocketDesc,
      image: heroImage,
      meta: [
        { label: 'Rocket Family', value: rocketFamily },
        { label: 'Provider', value: activeLaunch?.launch_service_provider?.name || 'TBD' }
      ]
    },
    {
      key: 'site',
      kicker: 'From this launch site',
      title: padLocation,
      description: padDesc,
      image: activeLaunch?.pad?.map_image || activeLaunch?.pad?.location?.map_image || heroImage,
      meta: [
        { label: 'Launch Pad', value: padTitle },
        { label: 'Country', value: activeLaunch?.pad?.country_code || 'TBD' }
      ]
    }
  ];

  if (loading) {
    return (
      <div className="launch-tracker-root">
        <div className="launch-loading">Synchronizing launch network...</div>
      </div>
    );
  }

  if (!activeLaunch) {
    return (
      <div className="launch-tracker-root">
        <div className="launch-empty">No launch data available for this view.</div>
      </div>
    );
  }

  return (
    <div className="launch-tracker-root">
      <div className="launch-ticker">
        <span>Next Launch</span>
        <strong>
          {countdown.live
            ? 'Live'
            : `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`}
        </strong>
        <span>{activeLaunch.name}</span>
      </div>

      <div className="launch-mode">
        <div className="launch-toggle">
          <button
            type="button"
            className={mode === 'upcoming' ? 'active' : ''}
            onClick={() => setMode('upcoming')}
          >
            Upcoming
          </button>
          <button
            type="button"
            className={mode === 'past' ? 'active' : ''}
            onClick={() => setMode('past')}
          >
            Past
          </button>
        </div>
        <Link className="launch-back" href="/launches">Back to launches</Link>
      </div>

      <section className="launch-hero">
        <div className="launch-countdown">
          <div className="launch-countdown-value">
            {countdown.days}:{countdown.hours}:{countdown.minutes}:{countdown.seconds}
          </div>
          <div className="launch-countdown-labels">
            <span>Days</span>
            <span>Hours</span>
            <span>Minutes</span>
            <span>Seconds</span>
          </div>
        </div>

        <div className="launch-hero-body">
          <h1>
            {getRelativeLine(activeLaunch.net)} {activeLaunch.launch_service_provider?.name || 'Mission Control'}
            {' '}will launch {activeLaunch.mission?.name || activeLaunch.name} from {padLocation}.
          </h1>
          <div className="launch-hero-tags">
            <span>{formatDate(activeLaunch.net)}</span>
            <span>{formatTime(activeLaunch.net)}</span>
            <span>{payloadType}</span>
          </div>
          <p>{payloadDesc}</p>
        </div>
      </section>

      <section className="launch-sections">
        {sections.map((section, index) => (
          <article
            key={section.key}
            className={`launch-section ${index % 2 === 1 ? 'reverse' : ''}`}
          >
            <div className="launch-section-media" style={{ backgroundImage: `url(${section.image})` }}>
              <div className="launch-section-overlay" />
            </div>
            <div className="launch-section-content">
              <p className="launch-section-kicker">{section.kicker}</p>
              <h2>{section.title}</h2>
              <p className="launch-section-copy">{section.description}</p>
              <div className="launch-section-meta">
                {section.meta.map((item) => (
                  <div key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
              <a className="launch-section-cta" href="#launch-map">
                Track launch -&gt;
              </a>
            </div>
          </article>
        ))}
      </section>

      <section className="launch-map" id="launch-map">
        <div className="launch-map-header">
          <p>Launch Site</p>
          <h2>{padTitle}</h2>
        </div>
        <div className="launch-map-card">
          <LaunchSiteMap
            latitude={activeLaunch.pad?.latitude}
            longitude={activeLaunch.pad?.longitude}
            label={padLocation}
          />
        </div>
      </section>
    </div>
  );
}
