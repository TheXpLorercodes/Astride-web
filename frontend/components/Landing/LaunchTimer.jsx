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
    <div className="flex flex-col items-center text-center w-full max-w-5xl mx-auto py-4">
      <div className="mb-10 px-6 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-[9px] font-black tracking-[0.6em] text-purple-400 uppercase">
        {"Launch Sequence // T-MINUS"}
      </div>

      <h2 className="text-4xl md:text-6xl font-orbitron font-black text-white mb-20 tracking-tighter line-clamp-2 px-4 opacity-90">
        {data.name?.split('|')[0] || data.name}
      </h2>

      <div className="flex gap-4 md:gap-16 justify-center w-full">
        {[
          { label: 'Hrs', val: timeLeft.h },
          { label: 'Min', val: timeLeft.m },
          { label: 'Sec', val: timeLeft.s }
        ].map((unit, i) => (
          <div key={unit.label} className="flex flex-col items-center min-w-[80px] md:min-w-[160px]">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/5 blur-3xl pointer-events-none" />
              <span className="relative text-5xl md:text-8xl font-orbitron font-black text-white tabular-nums tracking-tighter leading-none">
                {unit.val}
              </span>
            </div>
            <span className="mt-6 text-[9px] text-[#94a3b8] font-black uppercase tracking-[0.6em]">
              {unit.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-20 pt-10 border-t border-white/5 w-full flex flex-col items-center gap-6">
        <div className="text-[10px] tracking-[0.4em] text-gray-500 uppercase font-mono">
          Terminal: {data.pad?.name || 'Orbital Platform'}
        </div>
        <div className="flex gap-4 opacity-30">
          <span className="w-1 h-1 rounded-full bg-cyan-500" />
          <span className="w-1 h-1 rounded-full bg-cyan-500" />
          <span className="w-1 h-1 rounded-full bg-cyan-500" />
        </div>
      </div>
    </div>
  );
}
