'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './Dashboard.css';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [launches, setLaunches] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    } else if (user) {
      loadDashboardData();
    }
  }, [user, authLoading]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Load Favorites
      const { data: favData } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setFavorites(favData || []);

      // 2. Load Upcoming Launches
      const launchRes = await fetch('/api/launches');
      const launchData = await launchRes.json();
      setLaunches(launchData.results?.slice(0, 3) || []);

      // 3. Load Space Weather
      const weatherRes = await fetch('/api/nasa/donki');
      const weatherData = await weatherRes.json();
      setWeather(weatherData[0] || null);

    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id) => {
     const { error } = await supabase.from('favorites').delete().eq('id', id);
     if (!error) {
       setFavorites(favorites.filter(f => f.id !== id));
     }
  };

  if (authLoading || loading) {
    return <div className="loading-container">Synchronizing with Starlink...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="welcome-section">
          <h1>Command Center</h1>
          <p>Welcome back, <strong>{user?.email?.split('@')[0]}</strong>. All systems nominal.</p>
        </div>
        <div className="status-badge online">
          <span className="dot"></span> Online - Deep Space Network Connected
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="main-column">
          
          {/* Favorites Section */}
          <section className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Your Discoveries</h2>
              <span className="count">{favorites.length} Saved Items</span>
            </div>
            
            {favorites.length === 0 ? (
              <div className="empty-state">
                <p>Your galactic gallery is empty. Save photos from the Mars Gallery or APOD to see them here!</p>
                <Link href="/apod" className="auth-link">Explore Now</Link>
              </div>
            ) : (
              <div className="favorites-grid">
                {favorites.map((fav) => (
                  <div key={fav.id} className="fav-card">
                    <img src={fav.item_data.url} alt={fav.item_data.title} className="fav-img" />
                    <div className="fav-info">
                      <p className="fav-type">{fav.item_type}</p>
                      <h4 className="fav-title">{fav.item_data.title}</h4>
                      <button onClick={() => removeFavorite(fav.id)} className="text-xs text-red-400 mt-2 hover:underline">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Activity Section / Recent Logs could go here */}
        </div>

        <div className="side-column">
          {/* Space Weather Widget */}
          <section className="dashboard-section">
            <h2 className="section-title">Solar Activity</h2>
            <div style={{ marginTop: '1rem' }}>
              {weather ? (
                <div>
                  <div className={`status-badge ${weather.type === 'CME' ? 'alert' : 'online'}`}>
                    {weather.type} Detected
                  </div>
                  <p style={{ fontSize: '0.9rem', marginTop: '0.8rem', color: 'var(--text-secondary)' }}>
                    Source: {weather.sourceLocation || 'N/A'}<br/>
                    Peak Time: {new Date(weather.startTime).toLocaleString()}
                  </p>
                </div>
              ) : (
                <p>Quiet Solar Cycle locally.</p>
              )}
            </div>
          </section>

          {/* Launch Tracker Widget */}
          <section className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Next Launches</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {launches.map((l) => (
                <div key={l.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'white' }}>{l.name}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(l.net).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
