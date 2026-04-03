'use client';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Global Error:', error);
  }, [error]);

  return (
    <div className="error-page">
      <h1>CRITICAL ANOMALY</h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px' }}>
        A fatal error occurred at the routing level. The system encountered an unrecoverable state while navigating the cosmos.
      </p>
      <button className="btn-primary" onClick={() => reset()}>
        Attempt Navigation Reset
      </button>
    </div>
  );
}
