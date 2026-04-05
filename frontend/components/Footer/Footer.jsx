'use client';
import Link from 'next/link';
import './Footer.css';

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Brand Section */}
        <div className="footer-brand">
          <Link href="/" className="footer-logo">
            <span className="logo-icon">◈</span>
            ASTRIDE
          </Link>
          <p className="footer-tagline">Cognitive Orbital Interface // CX-88223-A</p>
          <div className="footer-status mt-8">
            <span className="iss-pulse inline-block mr-2"></span>
            <span className="text-[9px] tracking-[0.2em] text-cyan-400 font-mono">SYSTEMS OPERATIONAL</span>
          </div>
        </div>

        {/* Links Grid */}
        <div className="footer-links-grid">
          <div className="link-column">
            <h4>Exploration</h4>
            <Link href="/planets">Planets</Link>
            <Link href="/moons">Moons</Link>
            <Link href="/stars">Stars</Link>
            <Link href="/galaxies">Galaxies</Link>
          </div>
          <div className="link-column">
            <h4>Missions</h4>
            <Link href="/iss">ISS Tracker</Link>
            <Link href="/launches">Launch Tracker</Link>
            <Link href="/asteroid-watch">Asteroid Watch</Link>
            <Link href="/live-earth">Live Earth</Link>
          </div>
          <div className="link-column">
            <h4>Knowledge</h4>
            <Link href="/encyclopedia">Encyclopedia</Link>
            <Link href="/news">Space News</Link>
            <Link href="/mars-gallery">Mars Gallery</Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
          <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-white/20 to-transparent md:mr-8 hidden md:block" />
          <p className="text-[10px] font-orbitron font-bold tracking-[0.5em] text-white">
            © {currentYear} ASTRIDE
          </p>
          <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent via-white/20 to-transparent md:ml-8 hidden md:block" />
        </div>
        <p className="text-[9px] tracking-[0.8em] text-gray-500 uppercase font-black mt-8 text-center text-xs opacity-30">
          {"Unauthorized Access Prohibited // Terminal Locked"}
        </p>
      </div>
    </footer>
  );
}
