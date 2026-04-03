'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

export default function FavoritesButton({ itemId, itemType, itemData }) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkIsFavorite();
    }
  }, [user, itemId]);

  const checkIsFavorite = async () => {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('item_id', itemId)
      .eq('item_type', itemType)
      .single();

    if (data) setIsFavorite(true);
  };

  const toggleFavorite = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to save favorites!');
      return;
    }

    setLoading(true);
    if (isFavorite) {
      // Remove
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .eq('item_type', itemType);
      
      if (!error) setIsFavorite(false);
    } else {
      // Add
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          item_id: itemId,
          item_type: itemType,
          item_data: itemData
        });

      if (!error) setIsFavorite(true);
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={toggleFavorite}
      disabled={loading}
      className={`fav-btn ${isFavorite ? 'active' : ''}`}
      title={user ? (isFavorite ? 'Remove from favorites' : 'Save to favorites') : 'Login to save'}
    >
      <span className="icon">{isFavorite ? '❤️' : '🤍'}</span>
      <style jsx>{`
        .fav-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(5px);
          font-weight: 500;
        }
        .fav-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }
        .fav-btn.active {
          border-color: var(--accent-pink);
          background: rgba(236, 72, 153, 0.1);
        }
        .fav-btn.active .icon {
          animation: heartBeat 0.3s ease-out;
        }
        @keyframes heartBeat {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
      `}</style>
    </button>
  );
}
