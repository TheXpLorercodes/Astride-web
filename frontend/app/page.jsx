'use client';
import nextDynamic from 'next/dynamic';
import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import JourneyCTA from '../components/Landing/JourneyCTA';
import APODScroll from '../components/Landing/APODScroll';
import LaunchTimer from '../components/Landing/LaunchTimer';
import NewsStaggered from '../components/Landing/NewsStaggered';
import FloatingTile from '../components/Landing/FloatingTile';
import VideoBackground from '../components/Landing/VideoBackground';
import Footer from '../components/Footer/Footer';

// Lazy load 3D/Heavy components
const DynamicStarfield = nextDynamic(() => import('../components/Landing/Starfield'));
const DynamicISSFloating = nextDynamic(() => import('../components/Landing/ISSFloating'));

const SectionSkeleton = () => (
  <div className="h-64 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
  </div>
);

export default function LandingPage() {
  const [apod, setApod] = useState(null);
  const [launch, setLaunch] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [apodRes, launchRes, newsRes] = await Promise.all([
          fetch(`/api/apod`),
          fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=1'),
          fetch(`https://api.spaceflightnewsapi.net/v4/articles/?limit=4`)
        ]);

        const apodData = await apodRes.json();
        const launchData = await launchRes.json();
        const newsData = await newsRes.json();

        setApod(apodData);
        setLaunch(launchData.results ? launchData.results[0] : null);
        setNews(newsData.results || []);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* <VideoBackground /> */}

      {/* <VideoBackground /> */}

      {/* DynamicStarfield removed for performance - BackgroundManager handles the cosmic environment */}
      
      <JourneyCTA />
      
      <main className="relative z-10 pt-20">
        
        {/* HERO SECTION */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center z-20"
          >
            <h1 className="text-[12vw] md:text-[8vw] font-orbitron font-black tracking-[-0.05em] leading-none mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent drop-shadow-2xl">
              ASTRIDE
            </h1>
            <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mb-10" />
            <p className="font-outfit text-[10px] md:text-lg tracking-[0.6em] text-purple-400 font-bold uppercase drop-shadow-[0_0_20px_rgba(139,92,246,0.5)]">
              Cognitive Orbital Interface
            </p>
          </motion.div>

          {/* SCROLL INDICATOR */}
          <motion.div 
            className="absolute bottom-20 left-0 right-0 flex flex-col items-center gap-4 opacity-40 focus-visible:outline-none"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-[9px] tracking-[0.5em] uppercase font-black text-white/40">Initiate Orbital Descent</span>
            <div className="w-[1px] h-24 bg-gradient-to-b from-purple-500 to-transparent" />
          </motion.div>
        </section>

        {/* FLOATING TILES */}
        <div className="flex flex-col gap-16 md:gap-32 pb-[30vh] max-w-[1400px] mx-auto px-4 md:px-10">
          
          <FloatingTile>
            <Suspense fallback={<SectionSkeleton />}>
              <APODScroll data={apod} />
            </Suspense>
          </FloatingTile>

          <FloatingTile>
            <div className="flex flex-col items-center text-center space-y-16">
              <Suspense fallback={<SectionSkeleton />}>
                <DynamicISSFloating />
              </Suspense>
              
              <div className="space-y-8 max-w-3xl border-t border-white/5 pt-16 w-full flex flex-col items-center">
                <div className="inline-block px-4 py-1.5 rounded-full border border-purple-500/30 text-[9px] font-black text-purple-400 tracking-[0.4em] uppercase bg-purple-500/5">
                  Real-Time Orbital Link
                </div>
                <h3 className="text-3xl md:text-5xl font-orbitron font-black tracking-tighter text-white uppercase leading-tight">
                  Orbital Telemetry <br/>
                  <span className="text-gray-500 text-lg md:text-xl font-outfit font-normal tracking-[0.2em]">ISS LIVE LINK // STRATOS-1</span>
                </h3>
                <p className="text-gray-400 leading-relaxed text-base md:text-lg max-w-xl opacity-70">
                  Monitoring the International Space Station as it transits the thermosphere at 17,500 mph. 
                  Live position, altitude, and velocity data synced via global tracking network.
                </p>
                <div className="pt-6">
                  <Link href="/iss" className="inline-flex items-center gap-4 py-4 px-10 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-black tracking-[0.3em] uppercase hover:bg-purple-500/20 hover:border-purple-500 transition-all group overflow-hidden relative">
                    <span className="relative z-10 transition-transform group-hover:translate-x-1">Access Tracking Interface</span>
                    <span className="relative z-10 group-hover:translate-x-2 transition-transform">→</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </Link>
                </div>
              </div>
            </div>
          </FloatingTile>

          <FloatingTile>
            <Suspense fallback={<SectionSkeleton />}>
              <LaunchTimer data={launch} />
            </Suspense>
          </FloatingTile>
          
          <FloatingTile>
            <Suspense fallback={<SectionSkeleton />}>
              <NewsStaggered news={news} />
            </Suspense>
          </FloatingTile>

        </div>
      </main>

      <Footer />
    </div>
  );
}
