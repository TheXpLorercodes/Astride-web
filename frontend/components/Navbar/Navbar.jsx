'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './Navbar.css';

export default function Navbar() {
  const pathname = usePathname();
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsExploreOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  }, [pathname]);

  // Handle click outside search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
        setIsSearching(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    
    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSearchResults(data.results || []);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        
        {/* Logo */}
        <Link href="/" className="logo">
          <span className="logo-icon">◈</span>
          CosmoVerse
        </Link>
        
        {/* Desktop Search */}
        <div className="nav-search-container" ref={searchRef}>
          <input 
            type="text" 
            placeholder="Search planets, stars, missions..." 
            className="nav-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setIsSearching(true)}
          />
          {searchQuery && (
            <div className={`nav-search-results ${searchResults.length > 0 || isSearching ? 'active' : ''}`}>
               {isSearching ? <div className="p-4 text-sm text-gray-400">Searching...</div> : null}
               {!isSearching && searchResults.length === 0 && searchQuery.length >= 2 ? (
                 <div className="p-4 text-sm text-gray-400">No objects found.</div>
               ) : null}
               {searchResults.map((res) => (
                 <Link href={`/details/${res.table}/${res.id}`} key={`${res.table}-${res.id}`} className="search-result-item" onClick={() => setSearchQuery('')}>
                   <div className="search-res-type">{res.typeLabel}</div>
                   <div className="search-res-name">{res.name}</div>
                 </Link>
               ))}
            </div>
          )}
        </div>

        {/* Desktop Links */}
        <div className="nav-links desktop-only">
          <Link href="/news" className={`nav-link ${pathname === '/news' ? 'active' : ''}`}>News</Link>
          <Link href="/launches" className={`nav-link ${pathname === '/launches' ? 'active' : ''}`}>Launches</Link>
          <Link href="/apod" className={`nav-link ${pathname === '/apod' ? 'active' : ''}`}>APOD</Link>
          
          <div 
            className="dropdown mega-dropdown"
            onMouseEnter={() => setIsExploreOpen(true)}
            onMouseLeave={() => setIsExploreOpen(false)}
          >
            <button 
              className={`nav-link dropdown-trigger ${['/planets', '/moons', '/stars', '/galaxies', '/asteroids', '/encyclopedia', '/solar-system', '/mars-gallery', '/asteroid-watch', '/launch-tracker', '/live-earth', '/universe-scale', '/nasa-search', '/space-weather'].includes(pathname) ? 'active' : ''}`}
            >
              Explore <span className={`arrow ${isExploreOpen ? 'open' : ''}`}>▼</span>
            </button>
            
            <div className={`mega-menu ${isExploreOpen ? 'active' : ''}`}>
              <div className="mega-menu-content">
                <div className="mega-column">
                  <h4 className="column-title">Space Objects</h4>
                  <Link href="/planets" className="mega-item"><span className="item-icon">🪐</span> Planets</Link>
                  <Link href="/moons" className="mega-item"><span className="item-icon">🌒</span> Moons</Link>
                  <Link href="/asteroids" className="mega-item"><span className="item-icon">☄️</span> Asteroids</Link>
                  <Link href="/stars" className="mega-item"><span className="item-icon">⭐</span> Stars</Link>
                  <Link href="/galaxies" className="mega-item"><span className="item-icon">🌌</span> Galaxies</Link>
                </div>
                
                <div className="mega-column">
                  <h4 className="column-title">Exploration</h4>
                  <Link href="/asteroid-watch" className="mega-item"><span className="item-icon">🛡️</span> Asteroid Watch</Link>
                  <Link href="/launch-tracker" className="mega-item"><span className="item-icon">🚀</span> Launch Tracker</Link>
                  <Link href="/live-earth" className="mega-item"><span className="item-icon">🌍</span> Live Earth</Link>
                </div>

                <div className="mega-column">
                  <h4 className="column-title">Learn</h4>
                  <Link href="/encyclopedia" className="mega-item"><span className="item-icon">📚</span> Encyclopedia</Link>
                  <Link href="/nasa-search" className="mega-item"><span className="item-icon">🔎</span> NASA Archive</Link>
                  <Link href="/space-weather" className="mega-item"><span className="item-icon">🌤️</span> Space Weather</Link>
                </div>

                <div className="mega-column">
                  <h4 className="column-title">Explore</h4>
                  <Link href="/solar-system" className="mega-item"><span className="item-icon">☀️</span> Solar System 3D</Link>
                  <Link href="/universe-scale" className="mega-item"><span className="item-icon">📏</span> Universe Scale</Link>
                </div>

                <div className="mega-column">
                  <h4 className="column-title">Gallery</h4>
                  <Link href="/mars-gallery" className="mega-item"><span className="item-icon">🔴</span> Mars Gallery</Link>
                </div>
              </div>
            </div>
          </div>
          
          <Link href="/iss" className="nav-link iss-link">
            <span className="iss-pulse"></span>
            ISS Tracker
          </Link>
        </div>

        <button 
          className={`mobile-toggle ${isMobileMenuOpen ? 'active' : ''}`} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Navigation"
          style={{ zIndex: 9999 }}
        >
          <span style={{ backgroundColor: 'white' }}></span>
          <span style={{ backgroundColor: 'white' }}></span>
          <span style={{ backgroundColor: 'white' }}></span>
        </button>

      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-search">
           <input 
            type="text" 
            placeholder="Search catalog..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {searchQuery.length >= 2 && (
             <div className="mobile-search-results">
                 {searchResults.map((res) => (
                     <Link href={`/details/${res.table}/${res.id}`} key={`mob-${res.table}-${res.id}`}>{res.typeLabel}: {res.name}</Link>
                 ))}
             </div>
        )}
        {!searchQuery && (
            <div className="mobile-links-container">
                <Link href="/" className="mobile-link">Home</Link>
                <Link href="/news" className="mobile-link">Space News</Link>
                <Link href="/launches" className="mobile-link">Upcoming Launches</Link>
                <Link href="/apod" className="mobile-link">NASA APOD</Link>
                <Link href="/iss" className="mobile-link iss-mobile-link">🛰️ Live ISS Tracker</Link>
                
                <div className="mobile-group-title">Space Objects</div>
                <Link href="/planets" className="mobile-link nested">🪐 Planets</Link>
                <Link href="/moons" className="mobile-link nested">🌒 Moons</Link>
                <Link href="/asteroids" className="mobile-link nested">☄️ Asteroids</Link>
                <Link href="/stars" className="mobile-link nested">⭐ Stars</Link>
                <Link href="/galaxies" className="mobile-link nested">🌌 Galaxies</Link>

                <div className="mobile-group-title">Exploration</div>
                <Link href="/asteroid-watch" className="mobile-link nested">🛡️ Asteroid Watch</Link>
                <Link href="/launch-tracker" className="mobile-link nested">🚀 Launch Tracker</Link>
                <Link href="/live-earth" className="mobile-link nested">🌍 Live Earth</Link>

                <div className="mobile-group-title">Learn</div>
                <Link href="/encyclopedia" className="mobile-link nested">📚 Encyclopedia</Link>
                <Link href="/nasa-search" className="mobile-link nested">🔎 NASA Archive</Link>
                <Link href="/space-weather" className="mobile-link nested">🌤️ Space Weather</Link>

                <div className="mobile-group-title">Explore</div>
                <Link href="/solar-system" className="mobile-link nested">☀️ Solar System 3D</Link>
                <Link href="/universe-scale" className="mobile-link nested">📏 Universe Scale</Link>

                <div className="mobile-group-title">Gallery</div>
                <Link href="/mars-gallery" className="mobile-link nested">🔴 Mars Gallery</Link>
            </div>
        )}
      </div>
    </nav>
  );
}
