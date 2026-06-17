'use client';
import nextDynamic from 'next/dynamic';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

import JourneyCTA from '../components/Landing/JourneyCTA';
import APODScroll from '../components/Landing/APODScroll';
import LaunchTimer from '../components/Landing/LaunchTimer';
import NewsStaggered from '../components/Landing/NewsStaggered';
import FloatingTile from '../components/Landing/FloatingTile';
import Footer from '../components/Footer/Footer';

const DynamicISSFloating = nextDynamic(() => import('../components/Landing/ISSFloating'));

const ApodSkeleton = () => (
  <div className="w-full animate-pulse transition-all">
    <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-stretch opacity-60">
      <div className="relative min-h-[300px] md:min-h-[420px] overflow-hidden rounded-[28px] md:rounded-[36px] bg-white/5 border border-white/5" />
      <div className="flex flex-col justify-center items-start text-left min-h-full px-1 md:px-2 space-y-6">
        <div className="w-full max-w-[34rem] space-y-4">
          <div className="h-10 md:h-14 bg-white/10 rounded-lg w-full" />
          <div className="h-10 md:h-14 bg-white/10 rounded-lg w-4/5" />
          <div className="h-[1px] w-24 bg-white/20 my-6" />
          <div className="space-y-3">
            <div className="h-4 bg-white/5 rounded w-full" />
            <div className="h-4 bg-white/5 rounded w-full" />
            <div className="h-4 bg-white/5 rounded w-5/6" />
            <div className="h-4 bg-white/5 rounded w-4/6" />
          </div>
          <div className="pt-6">
            <div className="h-10 bg-white/10 rounded-full w-40" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const IssSkeleton = () => (
  <div className="w-full max-w-[1000px] mx-auto py-10 md:py-16 animate-pulse opacity-60">
    <div className="bg-[#0e0f14] border border-[#232533] mx-auto flex flex-col w-full rounded-sm h-[600px] md:h-[450px]">
       <div className="h-16 border-b border-[#232533] px-6 py-5 flex justify-between items-center">
         <div className="h-4 bg-white/10 w-48 rounded" />
         <div className="h-4 bg-white/10 w-32 rounded" />
       </div>
       <div className="flex-1 flex flex-col lg:flex-row p-8 lg:p-12 gap-12">
         <div className="flex-1 space-y-10">
           <div className="grid grid-cols-2 gap-y-10">
              <div className="space-y-2"><div className="h-3 bg-white/5 w-16" /><div className="h-8 bg-white/10 w-24 rounded" /></div>
              <div className="space-y-2"><div className="h-3 bg-white/5 w-16" /><div className="h-8 bg-white/10 w-24 rounded" /></div>
              <div className="space-y-2"><div className="h-3 bg-white/5 w-16" /><div className="h-8 bg-white/10 w-24 rounded" /></div>
              <div className="space-y-2"><div className="h-3 bg-white/5 w-16" /><div className="h-8 bg-white/10 w-24 rounded" /></div>
           </div>
         </div>
         <div className="flex-[0.8] bg-[#0c0d12] border border-[#232533] rounded-sm" />
       </div>
    </div>
  </div>
);

const LaunchSkeleton = () => (
  <div className="w-full max-w-[1080px] mx-auto flex flex-col items-center animate-pulse opacity-60">
    <div className="h-6 bg-white/10 w-48 rounded-full mb-8" />
    <div className="h-16 md:h-20 bg-white/10 w-3/4 max-w-[600px] rounded-lg mb-12" />
    <div className="grid grid-cols-3 gap-4 md:gap-6 w-full max-w-[860px]">
      <div className="h-32 md:h-40 bg-white/5 border border-white/5 rounded-[24px]" />
      <div className="h-32 md:h-40 bg-white/5 border border-white/5 rounded-[24px]" />
      <div className="h-32 md:h-40 bg-white/5 border border-white/5 rounded-[24px]" />
    </div>
  </div>
);

const NewsSkeleton = () => (
  <div className="w-full animate-pulse opacity-60 space-y-8">
    <div className="h-8 w-64 bg-white/10 rounded mb-10" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex flex-col space-y-4">
          <div className="h-48 bg-white/5 rounded-xl" />
          <div className="h-4 bg-white/10 w-full rounded" />
          <div className="h-4 bg-white/10 w-3/4 rounded" />
          <div className="h-3 bg-white/5 w-1/2 rounded mt-2" />
        </div>
      ))}
    </div>
  </div>
);

export default function LandingPage() {
  const [apod, setApod] = useState(null);
  const [launch, setLaunch] = useState(null);
  const [news, setNews] = useState([]);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const smoothHeroProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    mass: 0.4,
  });
  const heroTitleY = useTransform(smoothHeroProgress, [0, 0.5], [0, -120]);
  const heroTitleOpacity = useTransform(smoothHeroProgress, [0, 0.18, 0.52], [1, 0.96, 0]);
  const heroTitleScale = useTransform(smoothHeroProgress, [0, 0.5], [1, 0.9]);
  const heroSubtitleY = useTransform(smoothHeroProgress, [0, 0.45], [0, -72]);
  const heroSubtitleOpacity = useTransform(smoothHeroProgress, [0, 0.2, 0.45], [1, 0.78, 0]);
  const heroMaskOpacity = useTransform(smoothHeroProgress, [0, 0.4, 0.65], [0, 0.45, 0.8]);
  const tilesLeadInY = useTransform(smoothHeroProgress, [0.1, 0.55], [120, 0]);
  const tilesLeadInOpacity = useTransform(smoothHeroProgress, [0.08, 0.4], [0.35, 1]);

  useEffect(() => {
    async function fetchData() {
      const fetchJson = async (url, fallback) => {
        try {
          const response = await fetch(url);

          if (!response.ok) {
            return fallback;
          }

          return await response.json().catch(() => fallback);
        } catch {
          return fallback;
        }
      };

      const [apodData, launchData, newsData] = await Promise.all([
        fetchJson('/api/apod', null),
        fetchJson('/api/launches?mode=upcoming&limit=5', { results: [] }),
        fetchJson('/api/news?limit=4', { results: [] }),
      ]);

      let nextLaunch = null;
      const upcomingLaunches = launchData?.results || [];
      if (upcomingLaunches.length > 0) {
        const now = new Date();
        nextLaunch = upcomingLaunches.find((launchItem) => new Date(launchItem.net) > now) || upcomingLaunches[0];
      }

      if (apodData) {
        setApod(apodData);
      }
      setLaunch(nextLaunch);
      setNews(newsData?.results || []);
    }
    fetchData();
  }, []);

  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-cyan-500/30 overflow-x-hidden">
      <JourneyCTA />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-48"
        style={{ opacity: heroMaskOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#020617]/90 to-transparent" />
        <div className="absolute inset-x-0 top-[var(--nav-height)] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </motion.div>

      <main className="relative z-10 pt-20">
        <section ref={heroRef} className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-[18%] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-purple-500/[0.08] blur-[140px]" />
            <div className="absolute inset-x-[8%] top-1/3 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ y: heroTitleY, opacity: heroTitleOpacity, scale: heroTitleScale }}
            className="text-center z-20 will-change-transform"
          >
            <h1 className="text-[12vw] md:text-[8vw] font-orbitron font-black tracking-[-0.05em] leading-none mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent drop-shadow-2xl">
              ASTRIDE
            </h1>
            <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mb-10" />
            <motion.p
              style={{ y: heroSubtitleY, opacity: heroSubtitleOpacity }}
              className="font-outfit text-[10px] md:text-lg tracking-[0.6em] text-purple-400 font-bold uppercase drop-shadow-[0_0_20px_rgba(139,92,246,0.5)]"
            >
              Cognitive Orbital Interface
            </motion.p>
          </motion.div>

          <motion.div
            className="absolute bottom-20 left-0 right-0 flex flex-col items-center gap-4 opacity-40 focus-visible:outline-none"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-[9px] tracking-[0.5em] uppercase font-black text-white/40">Initiate Orbital Descent</span>
            <div className="w-[1px] h-24 bg-gradient-to-b from-purple-500 to-transparent" />
          </motion.div>
        </section>

        <motion.div
          style={{ y: tilesLeadInY, opacity: tilesLeadInOpacity }}
          className="relative flex flex-col gap-20 md:gap-28 pb-[30vh] w-full max-w-[1540px] mx-auto px-4 md:px-6 xl:px-8 -mt-[12vh] md:-mt-[16vh]"
        >
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

          <FloatingTile index={0}>
            <Suspense fallback={<ApodSkeleton />}>
              <APODScroll data={apod} />
            </Suspense>
          </FloatingTile>

          <FloatingTile index={1} accent="purple">
            <div className="flex flex-col items-center text-center">
              <Suspense fallback={<IssSkeleton />}>
                <DynamicISSFloating />
              </Suspense>
            </div>
          </FloatingTile>

          <div className="w-full flex justify-center">
            <Suspense fallback={<LaunchSkeleton />}>
              <LaunchTimer data={launch} />
            </Suspense>
          </div>

          <div className="w-full">
            <Suspense fallback={<NewsSkeleton />}>
              <NewsStaggered news={news} />
            </Suspense>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
