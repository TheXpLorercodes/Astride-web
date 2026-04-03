'use client';
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="cosmos-card" style={{ textAlign: 'center', padding: '3rem 2rem', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
          <h3 style={{ color: '#ef4444', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <span>⚠️</span> System Failure Detected
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            We encountered an unexpected anomaly in this sector of the application.
          </p>
          <button 
            className="btn-ghost" 
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Reboot Systems
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
