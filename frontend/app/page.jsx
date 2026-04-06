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

const SectionSkeleton = () => (
  <div className="h-64 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
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
      try {
        const [apodRes, launchRes, newsRes] = await Promise.all([
          fetch('/api/apod'),
          fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=1'),
          fetch('https://api.spaceflightnewsapi.net/v4/articles/?limit=4')
        ]);

        const apodData = await apodRes.json();
        const launchData = await launchRes.json();
        const newsData = await newsRes.json();

        setApod(apodData);
        setLaunch(launchData.results ? launchData.results[0] : null);
        setNews(newsData.results || []);
      } catch (err) {
        console.error('Fetch error:', err);
      }
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
            <Suspense fallback={<SectionSkeleton />}>
              <APODScroll data={apod} />
            </Suspense>
          </FloatingTile>

          <FloatingTile index={1}>
            <div className="flex flex-col items-center text-center">
              <Suspense fallback={<SectionSkeleton />}>
                <DynamicISSFloating />
              </Suspense>
            </div>
          </FloatingTile>

          <div className="w-full flex justify-center">
            <Suspense fallback={<SectionSkeleton />}>
              <LaunchTimer data={launch} />
            </Suspense>
          </div>

          <div className="w-full">
            <Suspense fallback={<SectionSkeleton />}>
              <NewsStaggered news={news} />
            </Suspense>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
