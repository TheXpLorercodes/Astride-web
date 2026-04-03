'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function ISSFloating() {
  const [position, setPosition] = useState({ lat: 0, lng: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchISS = async () => {
      try {
        const res = await fetch('/api/iss');
        const data = await res.json();
        setPosition({ 
          lat: parseFloat(data.latitude), 
          lng: parseFloat(data.longitude) 
        });
        setLoading(false);
      } catch (err) {
        console.error('ISS Fetch error:', err);
      }
    };

    fetchISS();
    const interval = setInterval(fetchISS, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[60vh] flex items-center justify-start px-6 md:px-20 py-20">
      <motion.div
        initial={{ opacity: 0, x: -50, scale: 0.95 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative p-10 rounded-[40px] border border-cyan-500/20 bg-cyan-950/10 backdrop-blur-2xl w-full max-w-xl group"
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-cyan-500/5 blur-[100px] pointer-events-none" />

        <div className="flex items-center gap-4 mb-8">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <h2 className="text-sm font-orbitron font-bold tracking-[0.3em] text-cyan-400 uppercase">
            {"ISS Live Link // STRATOS-1"}
          </h2>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Latitude</span>
              <p className="text-3xl font-orbitron font-medium text-white tabular-nums">
                {loading ? '---' : position.lat.toFixed(4)}°
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Longitude</span>
              <p className="text-3xl font-orbitron font-medium text-white tabular-nums">
                {loading ? '---' : position.lng.toFixed(4)}°
              </p>
            </div>
          </div>

          <div className="h-[2px] w-full bg-gradient-to-r from-cyan-500/30 to-transparent" />

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">System Status</span>
              <span className="text-xs font-bold text-cyan-400/80">COMM-LINK ESTABLISHED</span>
            </div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-2 border-dashed border-cyan-500/20 rounded-full flex items-center justify-center"
            >
              <div className="w-2 h-2 bg-cyan-400 rounded-full" />
            </motion.div>
          </div>
        </div>

        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-20 h-20 border-t border-r border-cyan-400/30 rounded-tr-[40px]" />
      </motion.div>
    </section>
  );
}
