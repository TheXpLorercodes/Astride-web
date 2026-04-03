'use client';
import React, { useState, useEffect } from 'react';

export default function FavoritesButton({ id, table, name }) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('cosmo_favs') || '[]');
    setIsFav(favs.some(f => f.id === id));
  }, [id]);

  const toggleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    let favs = JSON.parse(localStorage.getItem('cosmo_favs') || '[]');
    if (isFav) {
      favs = favs.filter(f => f.id !== id);
    } else {
      favs.push({ id, table, name, addedAt: new Date().toISOString() });
    }
    localStorage.setItem('cosmo_favs', JSON.stringify(favs));
    setIsFav(!isFav);
  };

  return (
    <button 
      onClick={toggleFav} 
      style={{
        background: isFav ? 'rgba(236, 72, 153, 0.2)' : 'rgba(255,255,255,0.1)',
        border: `1px solid ${isFav ? '#ec4899' : 'transparent'}`,
        color: isFav ? '#ec4899' : '#fff',
        width: '36px', height: '36px',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.2s',
        fontSize: '1.2rem',
        zIndex: 10
      }}
      title={isFav ? "Remove from Favorites" : "Add to Favorites"}
      aria-label="Toggle Favorite"
    >
      {isFav ? '❤️' : '🤍'}
    </button>
  );
}
