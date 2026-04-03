'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './UniverseScale.css';

const SCALES = [
  { name: 'Atom', size: '0.0000000001m', icon: '⚛️', color: '#60a5fa' },
  { name: 'DNA', size: '0.000000002m', icon: '🧬', color: '#10b981' },
  { name: 'Red Blood Cell', size: '0.000008m', icon: '🔴', color: '#ef4444' },
  { name: 'Human', size: '1.7m', icon: '👤', color: '#6366f1' },
  { name: 'Giza Pyramid', size: '146m', icon: '📐', color: '#f59e0b' },
  { name: 'Mount Everest', size: '8,848m', icon: '🏔️', color: '#94a3b8' },
  { name: 'Earth', size: '12,742km', icon: '🌍', color: '#3b82f6' },
  { name: 'Jupiter', size: '139,820km', icon: '🪐', color: '#d97706' },
  { name: 'The Sun', size: '1,392,700km', icon: '☀️', color: '#fbbf24' },
  { name: 'Solar System', size: '287bn km', icon: '🌌', color: '#8b5cf6' },
  { name: 'Milky Way', size: '100,000 ly', icon: '✨', color: '#c084fc' },
  { name: 'Observable Universe', size: '93bn ly', icon: '♾️', color: '#ffffff' }
];

export default function UniverseScale() {
  const [index, setIndex] = useState(3); // Start at Human

  return (
    <div className="scale-page">
      <header className="scale-header">
        <h1 className="scale-title">Scale of the <span className="gradient-text">Universe</span></h1>
        <p className="scale-subtitle">Explore the vast difference between the microscopic and the cosmic.</p>
      </header>

      <main className="scale-slider-container">
        <div className="scale-visual">
          <div className="scale-item-wrapper">
             <motion.div 
               key={SCALES[index].name}
               className="scale-obj"
               initial={{ scale: 0.5, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ type: 'spring', stiffness: 100 }}
               style={{ textShadow: `0 0 20px ${SCALES[index].color}` }}
             >
                <div className="scale-icon">{SCALES[index].icon}</div>
                <h2 className="scale-name">{SCALES[index].name}</h2>
                <p className="scale-val">{SCALES[index].size}</p>
             </motion.div>
          </div>

          <div className="scale-comparison">
             {index > 0 && (
               <div className="comp-item prev">
                 <span>{SCALES[index-1].name}</span>
               </div>
             )}
             <div className="comp-item current">
                ACTIVE FOCUS
             </div>
             {index < SCALES.length - 1 && (
               <div className="comp-item next">
                 <span>{SCALES[index+1].name}</span>
               </div>
             )}
          </div>
        </div>

        <div className="scale-footer-controls">
          <input 
            type="range" 
            min="0" 
            max={SCALES.length - 1} 
            value={index} 
            onChange={(e) => setIndex(parseInt(e.target.value))}
            className="scale-range"
          />
          <div className="scale-labels">
            <span>MICROSCOPIC</span>
            <span>MACROSCOPIC</span>
          </div>
        </div>
      </main>
    </div>
  );
}
