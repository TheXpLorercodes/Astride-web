'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './NASASearch.css';

export default function NASASearch() {
  const [query, setQuery] = useState('nebula');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/nasa/library?q=${query}`);
      const data = await res.json();
      setResults(data.collection?.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="search-page">
      <header className="search-header">
        <h1 className="search-title">NASA <span className="gradient-text">Archive</span></h1>
        <p className="search-subtitle">Search through millions of astronomical images from NASA&apos;s history.</p>
        
        <form className="search-box" onSubmit={handleSearch}>
          <input 
            type="text" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for 'Mars', 'Black Hole', 'Voyager'..."
          />
          <button type="submit">SEARCH</button>
        </form>
      </header>

      <main className="search-results-container">
        {loading ? (
          <div className="search-loading">Querying NASA image servers...</div>
        ) : results.length > 0 ? (
          <div className="search-grid">
            {results.slice(0, 30).map((item, idx) => (
              <motion.div 
                key={idx}
                className="search-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx % 10) * 0.05 }}
              >
                <div className="search-img-wrapper">
                  <img src={item.links?.[0]?.href} alt={item.data[0].title} loading="lazy" />
                </div>
                <div className="search-card-info">
                  <h4 className="item-title">{item.data[0].title}</h4>
                  <p className="item-date">{item.data[0].date_created.split('T')[0]}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="search-empty">No records match your search parameters.</div>
        )}
      </main>
    </div>
  );
}
