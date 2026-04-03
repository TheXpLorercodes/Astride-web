import Starfield from '../components/Landing/Starfield';
import AsteroidHero from '../components/Landing/AsteroidHero';
import APODScroll from '../components/Landing/APODScroll';
import ISSFloating from '../components/Landing/ISSFloating';
import LaunchTimer from '../components/Landing/LaunchTimer';
import NewsStaggered from '../components/Landing/NewsStaggered';
import JourneyCTA from '../components/Landing/JourneyCTA';

async function getLandingData() {
  const NASA_KEY = process.env.NASA_API_KEY;
  
  // Data Fetching Parallel
  const [apodRes, launchRes, newsRes] = await Promise.all([
    fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`, { next: { revalidate: 3600 } }),
    fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=1', { next: { revalidate: 3600 } }),
    fetch(`https://newsapi.org/v2/everything?q=space+nasa&sortBy=publishedAt&pageSize=4&apiKey=${process.env.NEWS_API_KEY || 'e356cfc7a77d4c0680a65cc65591ac79'}`, { next: { revalidate: 3600 } })
  ]);

  const apod = await apodRes.json();
  const launches = await launchRes.json();
  const news = await newsRes.json();

  return {
    apod: apod.error ? null : apod,
    nextLaunch: launches.results ? launches.results[0] : null,
    recentNews: news.articles ? news.articles : []
  };
}

export default async function LandingPage() {
  const data = await getLandingData();

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-purple-500/30">
      <Starfield />
      <JourneyCTA />
      
      <main className="relative z-10">
        <AsteroidHero />
        
        <div className="space-y-40 pb-40">
          <APODScroll data={data.apod} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 px-6 md:px-20 max-w-7xl mx-auto items-center">
            <ISSFloating />
            <div className="hidden lg:block space-y-6">
              <h3 className="text-sm font-orbitron font-bold tracking-[0.4em] text-cyan-400 uppercase">Orbital Telemetry</h3>
              <p className="text-gray-400 leading-relaxed max-w-sm">
                Real-time tracking of the International Space Station as it transits the thermosphere at 17,500 mph. 
                Monitoring position, trajectory, and live link status.
              </p>
            </div>
          </div>

          <LaunchTimer data={data.nextLaunch} />
          
          <NewsStaggered news={data.recentNews} />
        </div>
      </main>

      {/* Footer / Final Tagline */}
      <footer className="py-20 text-center border-t border-white/5 bg-black/50 backdrop-blur-md">
        <p className="text-[10px] tracking-[0.8em] text-gray-600 uppercase">
          Astride Gateway // Unauthorized Access Prohibited
        </p>
      </footer>
    </div>
  );
}
