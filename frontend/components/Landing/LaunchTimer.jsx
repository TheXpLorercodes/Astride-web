'use client';
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
    <div className="flex flex-col items-center text-center w-full max-w-[1080px] mx-auto">
      <div className="mb-6 md:mb-7 px-5 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-[8px] md:text-[9px] font-black tracking-[0.35em] md:tracking-[0.5em] text-purple-400 uppercase">
        {'Launch Sequence // T-MINUS'}
      </div>

      <h2 className="max-w-[16ch] text-[clamp(2.2rem,4.4vw,3.9rem)] font-orbitron font-black text-white mb-10 md:mb-12 tracking-[-0.05em] leading-[0.96] px-4 opacity-95 text-center">
        {data.name?.split('|')[0] || data.name}
      </h2>

      <div className="grid grid-cols-3 gap-4 md:gap-6 w-full max-w-[860px] items-stretch justify-center">
        {[
          { label: 'Hrs', val: timeLeft.h },
          { label: 'Min', val: timeLeft.m },
          { label: 'Sec', val: timeLeft.s }
        ].map((unit) => (
          <div key={unit.label} className="flex flex-col items-center justify-center rounded-[24px] md:rounded-[28px] border border-white/[0.05] bg-white/[0.02] px-3 py-5 md:px-6 md:py-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            <span className="mb-3 text-[8px] md:text-[9px] text-slate-400 font-black uppercase tracking-[0.35em] md:tracking-[0.45em]">
              {unit.label}
            </span>
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/5 blur-2xl pointer-events-none" />
              <span className="relative text-[clamp(2.8rem,6.4vw,5.2rem)] font-orbitron font-black text-white tabular-nums tracking-[-0.06em] leading-none">
                {unit.val}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 md:mt-12 pt-6 border-t border-white/5 w-full max-w-[860px] flex flex-col items-center gap-4">
        <div className="text-[9px] md:text-[10px] tracking-[0.24em] md:tracking-[0.32em] text-gray-500 uppercase font-mono text-center px-4">
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
