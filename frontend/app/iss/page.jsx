'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import './ISSTracker.css';

const ISSMap = dynamic(() => import('./ISSMap'), { ssr: false });

export default function ISSPage() {
  const [issData, setIssData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [path, setPath] = useState([]);

  useEffect(() => {
    let intervalId;

    const fetchISS = async () => {
      try {
        const res = await fetch('/api/iss');
        if (!res.ok) {
          console.warn('ISS signal degraded, waiting for telemetry window...');
          setError(true);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setIssData(data);
        
        // Add current pos to path history
        setPath(prev => {
           const newPath = [...prev, [data.latitude, data.longitude]];
           return newPath.slice(-50); // Keep last 50 points
        });

        setError(false);
      } catch (err) {
        console.warn('ISS connection lost, retrying...', err.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchISS();
    intervalId = setInterval(fetchISS, 15000); // the API route caches for 15s anyway

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="iss-container">
      <div className="iss-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div className="iss-pulse-indicator"></div>
          <h1 className="iss-title">LIVE: ISS TELEMETRY</h1>
        </div>
        <p className="iss-desc">
          Real-time tracking of the International Space Station. Orbiting Earth at roughly 28,000 km/h.
        </p>
      </div>

      <div className="iss-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Map View */}
        <div className="iss-map-wrapper" style={{ height: '500px', width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--accent-pink)' }}>
           {!loading && !error && issData && (
              <ISSMap issData={issData} path={path} />
           )}
           {loading && <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ec4899'}}>Acquiring signal...</div>}
        </div>

        {/* Dashboard Panels */}
        <div className="iss-dashboard-grid">
          <div className="iss-panel">
            <div className="iss-panel-label">Velocity</div>
            <div className="iss-panel-value">
              {loading ? '---' : issData?.velocity.toFixed(2)} <span className="iss-panel-unit">km/h</span>
            </div>
          </div>
          <div className="iss-panel">
            <div className="iss-panel-label">Altitude</div>
            <div className="iss-panel-value">
              {loading ? '---' : issData?.altitude.toFixed(2)} <span className="iss-panel-unit">km</span>
            </div>
          </div>
          <div className="iss-panel">
            <div className="iss-panel-label">Coordinates</div>
            <div className="iss-panel-value coord">
              {loading ? '---' : `${issData?.latitude.toFixed(4)}°, ${issData?.longitude.toFixed(4)}°`}
            </div>
          </div>
          <div className="iss-panel">
            <div className="iss-panel-label">Visibility</div>
            <div className="iss-panel-value" style={{ textTransform: 'capitalize', color: issData?.visibility === 'daylight' ? '#fbbf24' : '#94a3b8' }}>
              {loading ? '---' : issData?.visibility}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
