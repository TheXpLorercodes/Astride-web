'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import './Navbar.css';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  
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

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsExploreOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  }, [pathname]);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

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
          {user && <Link href="/dashboard" className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}>Mission Control</Link>}
          
          <div 
            className="dropdown mega-dropdown"
            onMouseEnter={() => setIsExploreOpen(true)}
            onMouseLeave={() => setIsExploreOpen(false)}
          >
            <button className="nav-link dropdown-trigger">
              Explore <span className={`arrow ${isExploreOpen ? 'open' : ''}`}>▼</span>
            </button>
            
            <div className={`mega-menu ${isExploreOpen ? 'active' : ''}`}>
              <div className="mega-menu-content">
                <div className="mega-column">
                  <h4 className="column-title">Space Objects</h4>
                  <Link href="/planets" className="mega-item">🪐 Planets</Link>
                  <Link href="/moons" className="mega-item">🌒 Moons</Link>
                  <Link href="/asteroids" className="mega-item">☄️ Asteroids</Link>
                  <Link href="/stars" className="mega-item">⭐ Stars</Link>
                  <Link href="/galaxies" className="mega-item">🌌 Galaxies</Link>
                </div>
                <div className="mega-column">
                  <h4 className="column-title">Exploration</h4>
                  <Link href="/asteroid-watch" className="mega-item">🛡️ Asteroid Watch</Link>
                  <Link href="/launch-tracker" className="mega-item">🚀 Launch Tracker</Link>
                  <Link href="/live-earth" className="mega-item">🌍 Live Earth</Link>
                </div>
                <div className="mega-column">
                  <h4 className="column-title">Learn</h4>
                  <Link href="/encyclopedia" className="mega-item">📚 Encyclopedia</Link>
                  <Link href="/nasa-search" className="mega-item">🔎 NASA Archive</Link>
                  <Link href="/space-weather" className="mega-item">🌤️ Space Weather</Link>
                </div>
                <div className="mega-column">
                  <h4 className="column-title">Explore</h4>
                  <Link href="/solar-system" className="mega-item">☀️ Solar System 3D</Link>
                  <Link href="/universe-scale" className="mega-item">📏 Universe Scale</Link>
                </div>
                <div className="mega-column">
                  <h4 className="column-title">Gallery</h4>
                  <Link href="/mars-gallery" className="mega-item">🔴 Mars Gallery</Link>
                </div>
              </div>
            </div>
          </div>
          
          <Link href="/iss" className="nav-link iss-link">
            <span className="iss-pulse"></span>
            ISS Tracker
          </Link>

          {loading ? (
            <div className="nav-auth-loading">...</div>
          ) : user ? (
            <div className="nav-user-menu">
              <button onClick={handleLogout} className="nav-link auth-btn logout">Logout</button>
            </div>
          ) : (
            <Link href="/auth/login" className="nav-link auth-btn login">Login</Link>
          )}
        </div>

        <button 
          className={`mobile-toggle ${isMobileMenuOpen ? 'active' : ''}`} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-links-container">
          {user && <Link href="/dashboard" className="mobile-link">Mission Control</Link>}
          <Link href="/news" className="mobile-link">News</Link>
          <Link href="/launches" className="mobile-link">Launches</Link>
          <Link href="/iss" className="mobile-link">ISS Tracker</Link>
          
          {user ? (
            <button onClick={handleLogout} className="mobile-link" style={{ color: 'var(--accent-pink)', textAlign: 'left', background: 'none', border: 'none', width: '100%' }}>Logout</button>
          ) : (
            <Link href="/auth/login" className="mobile-link" style={{ color: 'var(--accent-cyan)' }}>Login</Link>
          )}
          
          <div className="mobile-group-title">Explore Categories</div>
          <Link href="/planets" className="mobile-link nested">Planets</Link>
          <Link href="/mars-gallery" className="mobile-link nested">Mars Gallery</Link>
          {/* ... shorthand for brevity ... */}
        </div>
      </div>
    </nav>
  );
}
