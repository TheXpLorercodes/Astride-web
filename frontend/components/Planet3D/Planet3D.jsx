import React from 'react';
import './Planet3D.css';

export default function Planet3D({ texture, size = '400px', glowColor = '#3b82f6' }) {
  return (
    <div className="planet-3d-container" style={{ '--size': size, '--glow': glowColor }}>
      <div className="planet-3d-sphere" style={{ backgroundImage: `url(${texture})` }}>
        <div className="planet-3d-shadow"></div>
      </div>
      <div className="planet-3d-glow"></div>
    </div>
  );
}
