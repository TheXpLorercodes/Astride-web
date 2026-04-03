'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Starfield from '../../components/Landing/Starfield';
import JourneyCTA from '../../components/Landing/JourneyCTA';
import './Dashboard.css';

// Reusing some logic from the landing components for the dashboard widgets
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function MissionControl() {
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [launches, setLaunches] = useState([]);
  const [weather, setWeather] = useState(null);
  const [apod, setApod] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    } else if (user) {
      loadAllData();
    }
  }, [user, authLoading]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [favs, launchRes, weatherRes, apodRes, newsRes] = await Promise.all([
        supabase.from('favorites').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        fetch('/api/launches'),
        fetch('/api/nasa/donki'),
        fetch('/api/apod'),
        fetch('/api/news')
      ]);

      setFavorites(favs.data || []);
      
      const lData = await launchRes.json();
      setLaunches(lData.results || []);

      const wData = await weatherRes.json();
      setWeather(wData[0] || null);

      const aData = await apodRes.json();
      setApod(aData);

      const nData = await newsRes.json();
      setNews(nData.articles || []);

    } catch (err) {
      console.error('Mission Control Data Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#02040a]">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-cyan-400 font-orbitron tracking-widest text-xs uppercase"
        >
          Initializing Telemetry...
        </motion.div>
      </div>
    );
  }

  const nextLaunch = launches[0];

  return (
    <div className="mission-control-root relative">
      <Starfield />
      <JourneyCTA />
      
      <div className="dashboard-content relative z-10">
        
        {/* Welcome Block */}
        <section className="dash-welcome">
          <p className="text-cyan-400 font-bold tracking-[0.4em] uppercase text-[10px] mb-2">Systems Nominal // Mission-04</p>
          <h1>Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">{user?.email?.split('@')[0]}</span></h1>
          <p>Explore. Discover. Understand.</p>
        </section>

        {/* Dynamic Grid */}
        <div className="dash-grid">
          
          {/* Main Feature: Solar System 3D Card */}
          <motion.div 
            variants={fadeInUp} initial="hidden" animate="visible"
            className="dash-card card-feature group cursor-pointer"
          >
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h3 className="card-title"><span className="status-dot"></span> Solar System 3D</h3>
                <p className="text-gray-400 max-w-xs mt-4">Explore planets, moons, and celestial bodies in stunning 3D detail.</p>
              </div>
              <Link href="/solar-system" className="w-fit px-8 py-3 bg-purple-600/80 hover:bg-purple-600 text-white rounded-full font-bold text-xs tracking-widest transition-all">
                Launch 3D View →
              </Link>
            </div>
          </motion.div>

          {/* APOD Widget */}
          <motion.div 
            variants={fadeInUp} initial="hidden" animate="visible"
            className="dash-card card-widget"
          >
            <h3 className="card-title">Astronomy Picture of the Day</h3>
            {apod && (
              <div className="relative">
                <img src={apod.url} alt={apod.title} className="w-full h-32 object-cover rounded-xl mb-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                <h4 className="text-sm font-bold text-white mb-2 line-clamp-1">{apod.title}</h4>
                <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">{apod.explanation}</p>
                <div className="mt-4 flex items-center justify-between text-[10px] text-gray-600 font-mono">
                  <span>{apod.date}</span>
                  <Link href="/apod" className="text-cyan-400 hover:underline">View Full →</Link>
                </div>
              </div>
            )}
          </motion.div>

          {/* ISS Tracker */}
          <motion.div 
            variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="dash-card card-wide"
          >
            <h3 className="card-title"><span className="status-dot"></span> ISS Tracker</h3>
            <div className="grid grid-cols-2 gap-8 mt-4">
              <div>
                <span className="card-meta uppercase tracking-widest">Atmosphere Entry</span>
                <p className="card-main-val text-2xl">408 km</p>
              </div>
              <div>
                <span className="card-meta uppercase tracking-widest">Velocity</span>
                <p className="card-main-val text-2xl">7.67 km/s</p>
              </div>
            </div>
            <p className="mt-6 text-[10px] text-gray-500 tracking-[0.3em] font-mono">LIVE TELEMETRY ACTIVE</p>
          </motion.div>

          {/* Next Launch */}
          <motion.div 
            variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="dash-card card-wide"
          >
            <h3 className="card-title">Next Launch</h3>
            {nextLaunch ? (
              <div>
                <h4 className="text-lg font-bold text-white mb-4 line-clamp-1">{nextLaunch.name}</h4>
                <div className="flex gap-10">
                  <div>
                    <p className="text-2xl font-bold text-cyan-400 font-orbitron">{new Date(nextLaunch.net).toLocaleDateString()}</p>
                    <p className="card-meta font-mono mt-1">{new Date(nextLaunch.net).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC</p>
                  </div>
                  <div className="border-l border-white/10 pl-10">
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Pad</p>
                    <p className="text-sm text-white mt-1 line-clamp-1">{nextLaunch.pad?.name || 'TBD'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No upcoming launches detected.</p>
            )}
          </motion.div>

          {/* Latest News - Separate Tiles */}
          <motion.div 
            variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="col-span-12"
          >
            <div className="flex justify-between items-end mb-6">
              <h3 className="card-title m-0">Latest Dispatches</h3>
              <Link href="/news" className="text-[9px] text-gray-500 hover:text-white uppercase tracking-[0.3em] transition-colors font-bold">View Archive →</Link>
            </div>
            <div className="grid grid-cols-12 gap-6">
              {news.slice(0, 4).map((n, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -5 }}
                  className="dash-card dash-news-tile group"
                >
                  <img src={n.urlToImage} alt="" className="news-tile-img" />
                  <h5 className="news-tile-title">{n.title}</h5>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-[8px] text-gray-500 font-mono uppercase">{n.source?.name?.split(' ')[0] || 'NASA'}</span>
                    <span className="text-[14px] text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Systems Access - Custom Tiled UI */}
          <motion.div 
            variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="col-span-12 mt-10"
          >
             <h3 className="card-title mb-6">Quick Systems Access</h3>
             <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                {[
                  { name: 'Simulation', path: '/simulation', icon: '⚡' },
                  { name: 'Star Map', path: '/starmap', icon: '🔭' },
                  { name: 'Archive', path: '/details', icon: '📖' },
                  { name: 'Gallery', path: '/mars-gallery', icon: '🖼️' },
                  { name: 'Astronomy', path: '/apod', icon: '✨' },
                  { name: 'Config', path: '/settings', icon: '⚙️' }
                ].map((action, i) => (
                  <Link key={i} href={action.path} className="quick-action-tile group">
                    <span className="quick-action-icon">{action.icon}</span>
                    <span className="quick-action-label">{action.name}</span>
                  </Link>
                ))}
             </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
