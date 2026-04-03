'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function LaunchTimer({ data }) {
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });

  useEffect(() => {
    if (!data?.net) return;

    const calculateTime = () => {
      const now = new Date();
      const target = new Date(data.net);
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ h: '00', m: '00', s: '00' });
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const s = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');

      setTimeLeft({ h, m, s });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [data]);

  if (!data) return null;

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center py-40 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center max-w-4xl"
      >
        <div className="mb-6 px-6 py-2 bg-pink-500/10 border border-pink-500/20 rounded-full text-[10px] font-bold tracking-[0.4em] text-pink-400 uppercase">
          T-Minus Verification // IGNITION
        </div>

        <h2 className="text-4xl md:text-6xl font-orbitron font-bold text-white mb-12 tracking-tight">
          {data.name?.split('|')[0] || data.name}
        </h2>

        <div className="flex gap-4 md:gap-10">
          {[
            { label: 'Hours', val: timeLeft.h },
            { label: 'Minutes', val: timeLeft.m },
            { label: 'Seconds', val: timeLeft.s }
          ].map((unit, i) => (
            <div key={unit.label} className="flex flex-col items-center">
              <div className="relative">
                {/* Glow behind numbers */}
                <div className="absolute inset-0 bg-pink-500/20 blur-2xl pointer-events-none" />
                <span className="relative text-7xl md:text-9xl font-orbitron font-medium text-white tabular-nums tracking-normal">
                  {unit.val}
                </span>
              </div>
              <span className="mt-4 text-[10px] text-pink-400/60 uppercase tracking-[0.5em] font-bold">
                {unit.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center gap-4">
          <p className="text-gray-500 text-xs tracking-widest uppercase">Location: {data.pad?.name || 'Orbital Platform'}</p>
          <div className="flex gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping" />
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500/40" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
