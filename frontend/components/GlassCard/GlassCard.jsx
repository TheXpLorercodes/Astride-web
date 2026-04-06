"use client";
import React from 'react';
import './GlassCard.css';

export default function GlassCard({ children, className = '' }) {
  return (
    <div className={`glass-card ${className}`.trim()}>
      {children}
    </div>
  );
}
