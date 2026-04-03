import Link from 'next/link';
import { fetchPlanets } from '../lib/cosmoDataApi';
import Planet3D from '../components/Planet3D/Planet3D';

export default async function HomePage() {
  const { data: planets } = await fetchPlanets();
  
  // Randomizing for a fresh feel on each load
  const featured = planets?.[Math.floor(Math.random() * (planets?.length || 1))] || planets?.[0];

  return (
    <div className="page home-v4">
      
      {/* ── MINIMAL 3D HERO ────────────────────────────────── */}
      <section className="minimal-hero">
         
         <div className="hero-content-center">
            <h1 className="hero-title-v4">
              Explore the <br/>
              <span className="gradient-text">Infinite</span>
            </h1>
            <p className="hero-meta">EST. CELESTIAL GATEWAY // SEC-9</p>
         </div>

         <div className="hero-3d-wrapper">
            <Planet3D 
               texture={featured?.image || '/hero-earth.png'} 
               size="clamp(300px, 45vw, 600px)"
               glowColor={featured?.color || '#3b82f6'}
            />
         </div>

         <div className="hero-bottom-actions">
            <Link href="/planets" className="btn-v4-explore">
               Begin Journey
            </Link>
            <div className="v4-scroll-indicator">
               <span>SCROLL DOWN</span>
               <div className="indicator-line"></div>
            </div>
         </div>

      </section>

      {/* DASHBOARD GRIDS ARE REMOVED AS REQUESTED TO KEEP IT SIMPLE AND BEAUTIFUL */}

    </div>
  );
}
