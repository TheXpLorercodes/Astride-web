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
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full flex flex-col items-center text-center px-4"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
        <h2 className="text-[10px] font-orbitron font-black tracking-[0.5em] text-white/90 uppercase">
          {"Telemetry // STRATOS-1"}
        </h2>
        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
      </div>
      
      <p className="text-[10px] font-outfit font-bold tracking-[0.3em] text-gray-500 uppercase mb-12">ISS REAL-TIME ORBITAL LINK</p>

      <div className="w-full max-w-4xl space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          <div className="flex flex-col items-center space-y-4">
            <span className="text-[9px] text-[#94a3b8] uppercase font-black tracking-[0.5em]">Latitude</span>
            <p className="text-5xl md:text-7xl font-orbitron font-black text-white tabular-nums tracking-tighter">
              {loading ? '---' : position.lat.toFixed(4)}
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <span className="text-[9px] text-[#94a3b8] uppercase font-black tracking-[0.5em]">Longitude</span>
            <p className="text-5xl md:text-7xl font-orbitron font-black text-white tabular-nums tracking-tighter">
              {loading ? '---' : position.lng.toFixed(4)}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-10 pt-8 border-t border-white/5">
          <div className="flex flex-col items-center gap-4">
            <span className="text-[9px] text-[#94a3b8] uppercase tracking-[0.5em] font-black font-mono">System Status</span>
            <div className="flex items-center gap-4 px-6 py-2 rounded-full border border-green-500/20 bg-green-500/5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] font-black text-green-400 tracking-[0.3em] uppercase font-mono">COMM-LINK ESTABLISHED</span>
            </div>
          </div>
          
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="relative w-20 h-20 border border-dashed border-white/10 rounded-full flex items-center justify-center scale-90 md:scale-100"
          >
            <div className="w-2.5 h-2.5 bg-purple-400 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
            <div className="absolute inset-2 border border-purple-500/20 rounded-full" />
            <div className="absolute inset-0 border border-purple-500/10 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
