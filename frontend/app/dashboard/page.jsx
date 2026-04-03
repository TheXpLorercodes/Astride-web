'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import JourneyCTA from '../../components/Landing/JourneyCTA';
import './Dashboard.css';

const DynamicStarfield = dynamic(() => import('../../components/Landing/Starfield'), { ssr: false });

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

// Widget Skeleton Component
const WidgetSkeleton = ({ title, className }) => (
  <div className={`dash-card ${className} flex flex-col items-center justify-center`}>
    <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4" />
    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Syncing {title}...</p>
  </div>
);

// --- Widget Components ---

const APODWidget = () => {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/apod').then(res => res.json()).then(data => {
      setApod(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <WidgetSkeleton title="Orbital Photography" className="card-widget" />;
  if (!apod) return null;

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="dash-card card-widget group cursor-pointer">
      <div className="card-top">
         <div className="flex flex-col">
            <h3 className="card-title">APOD</h3>
            <p className="card-subtitle">{apod.date}</p>
         </div>
         <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-light text-xl">+</div>
      </div>
      <div className="card-body">
         <h4 className="text-white font-bold mb-2 line-clamp-1">{apod.title}</h4>
         <p className="card-desc line-clamp-2">{apod.explanation}</p>
      </div>
      <div className="card-planet-wrap">
         <img src={apod.url} alt={apod.title} className="card-image" />
         <div className="card-shadow"></div>
      </div>
      <Link href="/apod" className="absolute inset-0 z-20"></Link>
    </motion.div>
  );
};

const NextLaunchWidget = () => {
  const [nextLaunch, setNextLaunch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/launches').then(res => res.json()).then(data => {
      setNextLaunch(data.results?.[0] || null);
      setLoading(false);
    });
  }, []);

  if (loading) return <WidgetSkeleton title="Launch Systems" className="card-wide" />;

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="dash-card card-wide">
      <div className="card-top">
         <div className="flex flex-col">
            <h3 className="card-title">Next Launch</h3>
            <p className="card-subtitle">{nextLaunch ? new Date(nextLaunch.net).toLocaleDateString() : 'TBD'}</p>
         </div>
      </div>
      <div className="card-body">
         {nextLaunch ? (
           <div className="space-y-4">
              <h4 className="text-2xl font-bold text-white line-clamp-1">{nextLaunch.name}</h4>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-3 rounded-2xl bg-white/5 border-l-2 border-purple-500">
                    <span className="text-[8px] uppercase font-black text-gray-400 tracking-widest">Time</span>
                    <p className="text-sm font-bold text-white font-orbitron">{new Date(nextLaunch.net).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC</p>
                 </div>
                 <div className="p-3 rounded-2xl bg-white/5 border-l-2 border-purple-500">
                    <span className="text-[8px] uppercase font-black text-gray-400 tracking-widest">Pad</span>
                    <p className="text-sm font-bold text-white line-clamp-1">{nextLaunch.pad?.name || 'Unknown'}</p>
                 </div>
              </div>
           </div>
         ) : (
           <p className="card-desc">No upcoming launches detected in the sector.</p>
         )}
      </div>
      <div className="card-planet-wrap">
         <div className="card-sphere" style={{ background: 'radial-gradient(circle at 30% 30%, #fff, #ef4444 60%)' }}></div>
         <div className="card-shadow"></div>
      </div>
    </motion.div>
  );
};

const NewsGridWidget = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news').then(res => res.json()).then(data => {
      setNews(data.results || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="col-span-12 py-24 text-center text-gray-500 font-mono text-[10px] animate-pulse tracking-[0.5em]">SYNCING GLOBAL DISPATCHES...</div>;

  return (
    <div className="col-span-12 grid grid-cols-12 gap-6 mt-8">
      {news.slice(0, 4).map((n, i) => (
        <motion.div key={i} variants={fadeInUp} initial="hidden" animate="visible" className="planet-card dash-news-tile group">
          <div className="card-top">
             <span className="text-[8px] text-purple-400 font-black uppercase tracking-widest">{n.news_site || 'NASA'}</span>
          </div>
          <div className="card-body !mt-4">
            <h5 className="text-sm font-bold text-white line-clamp-3 group-hover:text-purple-300 transition-colors">{n.title}</h5>
            <Link href={n.url} target="_blank" className="mt-6 block text-[9px] font-black uppercase text-gray-500 hover:text-white transition-colors tracking-widest">Read Dispatch →</Link>
          </div>
          <div className="card-planet-wrap !w-[140px] !h-[140px] !right-[-10%] !top-[-10%]">
             <img src={n.image_url || n.urlToImage} alt="" className="card-image opacity-40 group-hover:opacity-80 transition-opacity" />
             <div className="card-shadow"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// --- Main Dashboard Component ---

export default function MissionControl() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-cyan-400 font-orbitron tracking-widest text-xs uppercase"
        >
          Establishing Secure Link...
        </motion.div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mission-control-root relative">
      <DynamicStarfield />
      <JourneyCTA />
      
      <div className="dashboard-content relative z-10">
        
        <header className="dash-welcome">
          <p className="text-purple-500 font-black tracking-[0.6em] uppercase text-[10px] mb-4">{"Astride // Mission Control"}</p>
          <h1 className="text-white">Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">{user?.email?.split('@')[0]}</span></h1>
          <p className="text-gray-400 tracking-widest uppercase text-xs mt-2">{"All systems nominal // 2026-04-03"}</p>
        </header>

        <div className="dash-grid">
          {/* Solar System 3D Card */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="dash-card card-feature group cursor-pointer">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h3 className="card-title text-4xl">System Explorer</h3>
                <p className="text-gray-300 max-w-sm mt-6 text-lg line-clamp-2">Explore planets, moons, and celestial bodies in high-fidelity 3D environments.</p>
              </div>
              <Link href="/solar-system" className="w-fit px-10 py-4 bg-white text-black hover:bg-gray-200 rounded-full font-black text-[10px] tracking-[0.3em] uppercase transition-all">
                Commence Mission →
              </Link>
            </div>
            <div className="card-planet-wrap !right-[-5%] !top-[-10%] !w-[400px] !h-[400px]">
               <div className="card-sphere" style={{ background: 'radial-gradient(circle at 30% 30%, #fff, #3b82f6 60%)' }}></div>
               <div className="card-shadow"></div>
            </div>
          </motion.div>

          <APODWidget />

          {/* ISS Tracker */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="dash-card card-wide">
            <div className="card-top">
               <div className="flex flex-col">
                  <h3 className="card-title">ISS TRACKER</h3>
                  <p className="card-subtitle text-cyan-400 animate-pulse">LIVE TELEMETRY</p>
               </div>
            </div>
            <div className="card-body">
               <div className="grid grid-cols-2 gap-8">
                  <div>
                    <span className="text-[10px] uppercase font-black text-gray-500 tracking-widest">Altitude</span>
                    <p className="text-3xl font-orbitron font-bold text-white">408 km</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black text-gray-500 tracking-widest">Velocity</span>
                    <p className="text-3xl font-orbitron font-bold text-white">7.67 km/s</p>
                  </div>
               </div>
               <div className="mt-8 pt-8 border-t border-white/5">
                  <Link href="/iss" className="text-[10px] font-black text-gray-400 hover:text-white tracking-[0.3em] uppercase transition-all">Open Sat-Link →</Link>
               </div>
            </div>
            <div className="card-planet-wrap">
               <div className="card-sphere" style={{ background: 'radial-gradient(circle at 30% 30%, #fff, #06b6d4 60%)' }}></div>
               <div className="card-shadow"></div>
            </div>
          </motion.div>

          <NextLaunchWidget />

          <NewsGridWidget />

          {/* Quick Actions */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="col-span-12 mt-16">
             <div className="flex items-center gap-4 mb-8">
                <div className="h-[1px] flex-1 bg-white/10"></div>
                <h3 className="text-[10px] font-black tracking-[0.5em] text-gray-500 uppercase">Auxiliary Systems</h3>
                <div className="h-[1px] flex-1 bg-white/10"></div>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                {[
                  { name: 'Simulation', path: '/simulation', icon: '⚡' },
                  { name: 'Star Map', path: '/starmap', icon: '🔭' },
                  { name: 'Archive', path: '/details', icon: '📖' },
                  { name: 'Gallery', path: '/mars-gallery', icon: '🖼️' },
                  { name: 'Astronomy', path: '/apod', icon: '✨' },
                  { name: 'Settings', path: '/settings', icon: '⚙️' }
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
