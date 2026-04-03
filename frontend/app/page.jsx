import dynamic from 'next/dynamic';
import { Suspense } from 'react';
// We'll wrap this with dynamic below
import AsteroidHero from '../components/Landing/AsteroidHero';
import APODScroll from '../components/Landing/APODScroll';
// We'll wrap this with dynamic below
import LaunchTimer from '../components/Landing/LaunchTimer';
import NewsStaggered from '../components/Landing/NewsStaggered';
import JourneyCTA from '../components/Landing/JourneyCTA';

// Lazy load heavy/client-only components
const DynamicStarfield = dynamic(() => import('../components/Landing/Starfield'));
const DynamicISSFloating = dynamic(() => import('../components/Landing/ISSFloating'));

async function APODSection() {
  const NASA_KEY = process.env.NASA_API_KEY;
  const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`, { next: { revalidate: 3600 } });
  const apod = await res.json();
  return <APODScroll data={apod.error ? null : apod} />;
}

async function LaunchSection() {
  const res = await fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=1', { next: { revalidate: 3600 } });
  const launches = await res.json();
  return <LaunchTimer data={launches.results ? launches.results[0] : null} />;
}

async function NewsSection() {
  const res = await fetch(`https://newsapi.org/v2/everything?q=space+nasa&sortBy=publishedAt&pageSize=4&apiKey=${process.env.NEWS_API_KEY || 'e356cfc7a77d4c0680a65cc65591ac79'}`, { next: { revalidate: 3600 } });
  const news = await res.json();
  return <NewsStaggered news={news.articles ? news.articles : []} />;
}

// Low-overhead skeleton for loading states
const SectionSkeleton = () => (
  <div className="h-64 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
  </div>
);

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-purple-500/30">
      <Suspense fallback={null}>
        <DynamicStarfield />
      </Suspense>
      
      <JourneyCTA />
      
      <main className="relative z-10">
        <AsteroidHero />
        
        <div className="space-y-40 pb-40">
          <Suspense fallback={<SectionSkeleton />}>
            <APODSection />
          </Suspense>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 px-6 md:px-20 max-w-7xl mx-auto items-center">
            <Suspense fallback={<SectionSkeleton />}>
              <DynamicISSFloating />
            </Suspense>
            <div className="hidden lg:block space-y-6">
              <h3 className="text-sm font-orbitron font-bold tracking-[0.4em] text-cyan-400 uppercase">Orbital Telemetry</h3>
              <p className="text-gray-400 leading-relaxed max-w-sm">
                Real-time tracking of the International Space Station as it transits the thermosphere at 17,500 mph. 
                Monitoring position, trajectory, and live link status.
              </p>
            </div>
          </div>

          <Suspense fallback={<SectionSkeleton />}>
            <LaunchSection />
          </Suspense>
          
          <Suspense fallback={<SectionSkeleton />}>
            <NewsSection />
          </Suspense>
        </div>
      </main>

      <footer className="py-20 text-center border-t border-white/5 bg-black/50 backdrop-blur-md">
        <p className="text-[10px] tracking-[0.8em] text-gray-600 uppercase">
          Astride Gateway // Unauthorized Access Prohibited
        </p>
      </footer>
    </div>
  );
}
