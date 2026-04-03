'use client';
import React, { useState, useEffect } from 'react';
import './LoadingSpinner.css';

const SPACE_FACTS = [
  "Did you know? A day on Venus is longer than a year on Venus.",
  "Warning: Do not attempt to walk on Jupiter. It's a gas giant!",
  "Fact: One million Earths could fit inside the Sun.",
  "Did you know? Space is completely silent because there's no atmosphere.",
  "If two pieces of the same type of metal touch in space, they permanently bond.",
  "Neptune's moon Triton orbits the planet backwards!",
  "There is a planet made of diamonds twice the size of Earth (55 Cancri e).",
  "The footprints on the Moon will last for 100 million years."
];

const EMOJIS = ['🚀', '🛰️', '☄️', '🌌', '🛸', '👽', '🔭'];

export default function LoadingSpinner() {
  return (
    <div className="fun-loading-container">
       <div className="loading-orbit-wrapper">
          <div className="loading-ring-outer"></div>
          <div className="loading-ring-inner"></div>
          <div className="loading-core"></div>
       </div>
       <div className="loading-text-glitch" data-text="SYNCHRONIZING">SYNCHRONIZING</div>
       <p className="loading-sub">PRE-RENDERING COSMIC GEOMETRY</p>
    </div>
  );
}
