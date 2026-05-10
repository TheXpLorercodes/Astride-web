'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import LaunchTimer from '../../../components/Landing/LaunchTimer';
import '../../launch-tracker/LaunchTracker.css';

const LaunchSiteMap = dynamic(() => import('../../launch-tracker/LaunchSiteMap'), { ssr: false });

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=1200';

const formatDate = (value) => {
  if (!value) return 'TBD';
  const date = new Date(value);
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};

const formatTime = (value) => {
  if (!value) return 'TBD';
  const date = new Date(value);
  return `${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })} UTC`;
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

const getLaunchStatus = (status) => {
  if (!status) return 'TBD';
  if (typeof status === 'string') return status;
  return status.name || 'TBD';
};

const getMissionTitle = (launch, trackerProfile) => {
  return trackerProfile?.tracker_title || launch.mission?.name || launch.name || 'Launch tracker';
};

const getHeroImage = (launch, trackerProfile) => {
  return (
    trackerProfile?.hero_image ||
    launch.image ||
    launch.infographic ||
    launch.pad?.map_image ||
    launch.pad?.location?.map_image ||
    FALLBACK_IMAGE
  );
};

const getProviderName = (launch) => launch.launch_service_provider?.name || 'Mission Control';
const getPadTitle = (launch) => launch.pad?.name || 'Launch pad';
const getPadLocation = (launch) => launch.pad?.location?.name || 'Location pending';

export default function LaunchTrackerView({ launch, trackerProfile = null, relatedLaunches = [] }) {
  if (!launch) {
    return null;
  }

  const missionTitle = getMissionTitle(launch, trackerProfile);
  const heroSummary =
    trackerProfile?.tracker_summary ||
    launch.mission?.description ||
    'The mission details for this launch are being tracked in the launch database.';
  const heroImage = getHeroImage(launch, trackerProfile);
  const providerName = getProviderName(launch);
  const launchStatus = getLaunchStatus(launch.status);
  const padTitle = getPadTitle(launch);
  const padLocation = getPadLocation(launch);
  const payloadType = launch.mission?.type || 'Unknown';
  const payloadOrbit = launch.mission?.orbit?.name || 'TBD';
  const rocketTitle = launch.rocket?.configuration?.full_name || 'Launch vehicle TBD';
  const rocketFamily = launch.rocket?.configuration?.family || 'Unknown family';
  const padCountry = launch.pad?.country_code || 'TBD';
  const launchForTimer = { ...launch, name: missionTitle };

  const sections = [
    {
      key: 'payload',
      kicker: 'Mission payload',
      title: launch.mission?.name || 'Unknown payload',
      description:
        launch.mission?.description || 'The payload details for this mission have not been released yet.',
      image: heroImage,
      meta: [
        { label: 'Mission Type', value: payloadType },
        { label: 'Orbit', value: payloadOrbit },
      ],
    },
    {
      key: 'rocket',
      kicker: 'Launch vehicle',
      title: rocketTitle,
      description: launch.launch_service_provider?.name
        ? `${providerName} will fly a ${rocketTitle} vehicle for this mission.`
        : 'Launch provider details are pending.',
      image: heroImage,
      meta: [
        { label: 'Rocket Family', value: rocketFamily },
        { label: 'Provider', value: providerName },
      ],
    },
    {
      key: 'site',
      kicker: 'Launch site',
      title: padLocation,
      description:
        launch.pad?.location?.description ||
        'The launch complex is preparing for this mission. Additional site details are not yet available.',
      image: launch.pad?.map_image || launch.pad?.location?.map_image || heroImage,
      meta: [
        { label: 'Launch Pad', value: padTitle },
        { label: 'Country', value: padCountry },
      ],
    },
  ];

  const crossReferenceCards = Array.isArray(relatedLaunches) ? relatedLaunches.filter(Boolean) : [];

  return (
    <div className="launch-tracker-root">
      <div className="launch-tracker-shell">
        <div className="launch-ticker">
          <span>Launch detail</span>
          <strong>{launchStatus}</strong>
          <span>{providerName}</span>
        </div>

        <div className="launch-mode">
          <div className="launch-detail-chip">Database cross reference</div>
          <Link className="launch-back" href="/launches">
            Back to launches
          </Link>
        </div>

        <section className="launch-hero">
          <LaunchTimer data={launchForTimer} />

          <div className="launch-hero-body">
            <h1>
              {getRelativeLine(launch.net)} {providerName} will launch {missionTitle} from {padLocation}.
            </h1>
            <div className="launch-hero-tags">
              <span>{formatDate(launch.net)}</span>
              <span>{formatTime(launch.net)}</span>
              <span>{payloadType}</span>
            </div>
            <p>{heroSummary}</p>
          </div>
        </section>

        <section className="launch-sections">
          {sections.map((section, index) => (
            <article key={section.key} className={`launch-section ${index % 2 === 1 ? 'reverse' : ''}`}>
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

        {crossReferenceCards.length > 0 && (
          <section className="launch-related" id="launch-related">
            <div className="launch-related-header">
              <p>Cross reference</p>
              <h2>Adjacent launches in the database</h2>
              <span>
                These rows are linked through <code>launch_tracker_profiles</code> and keep the mission chain together.
              </span>
            </div>
            <div className="launch-related-grid">
              {crossReferenceCards.map((item) => (
                <Link key={item.id} className="launch-related-card" href={`/launches/${item.id}`}>
                  <div
                    className="launch-related-card-image"
                    style={{ backgroundImage: `url(${item.image || FALLBACK_IMAGE})` }}
                  >
                    <div className="launch-section-overlay" />
                  </div>
                  <span className="launch-related-card-kicker">{item.relationLabel}</span>
                  <h3>{item.name}</h3>
                  <p>{item.summary}</p>
                  <div className="launch-related-card-footer">
                    <span>{item.provider}</span>
                    <strong>{item.dateLabel}</strong>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="launch-map" id="launch-map">
          <div className="launch-map-header">
            <p>Launch Site</p>
            <h2>{getPadTitle(launch)}</h2>
          </div>
          <div className="launch-map-card">
            <LaunchSiteMap
              latitude={launch.pad?.latitude}
              longitude={launch.pad?.longitude}
              label={padLocation}
            />
          </div>
        </section>
      </div>
    </div>
  );
}