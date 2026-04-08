'use client';
import { motion } from 'framer-motion';

export default function FloatingTile({ children, accent = 'purple', index = 0 }) {
  const accentMap = {
    purple: {
      border: 'hover:border-purple-500/50',
      glow: 'hover:shadow-[0_0_80px_-20px_rgba(139,92,246,0.35)]',
      corner: 'from-purple-500',
      scan: 'rgba(139,92,246,0.03)',
      beam: 'rgba(139,92,246,0.24)',
      aura: 'rgba(139,92,246,0.13)',
      grid: 'rgba(255,255,255,0.035)',
    },
    cyan: {
      border: 'hover:border-cyan-500/50',
      glow: 'hover:shadow-[0_0_80px_-20px_rgba(6,182,212,0.35)]',
      corner: 'from-cyan-500',
      scan: 'rgba(6,182,212,0.03)',
      beam: 'rgba(6,182,212,0.24)',
      aura: 'rgba(6,182,212,0.13)',
      grid: 'rgba(255,255,255,0.035)',
    },
    aurora: {
      border: 'hover:border-emerald-400/50',
      glow: 'hover:shadow-[0_0_80px_-20px_rgba(16,185,129,0.35)]',
      corner: 'from-emerald-400',
      scan: 'rgba(16,185,129,0.03)',
      beam: 'rgba(34,211,238,0.24)',
      aura: 'rgba(16,185,129,0.12)',
      grid: 'rgba(255,255,255,0.035)',
    },
  };

  const a = accentMap[accent] ?? accentMap.purple;

  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 w-full will-change-transform"
    >
      {/* Outer glow layer — sits outside, never clips children */}
      <div
        className={`
          relative w-full max-w-[1320px] mx-auto
          rounded-[32px] md:rounded-[40px]
          border border-white/[0.07]
          bg-gradient-to-br from-white/[0.045] via-white/[0.02] to-transparent
          shadow-[0_14px_80px_-26px_rgba(0,0,0,0.88)]
          transition-all duration-700
          ${a.border} ${a.glow}
          group overflow-hidden
        `}
      >
        {/* ── Corner bracket accents (TL) */}
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background: `radial-gradient(circle at 14% 10%, ${a.aura}, transparent 26%), linear-gradient(135deg, rgba(255,255,255,0.05), transparent 36%)`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: `linear-gradient(${a.grid} 1px, transparent 1px), linear-gradient(90deg, ${a.grid} 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.8), transparent)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-px"
          style={{ background: `linear-gradient(180deg, transparent, ${a.beam}, transparent)` }}
        />
        <div
          className="pointer-events-none absolute inset-x-[18%] top-0 h-px opacity-80"
          style={{ background: `linear-gradient(90deg, transparent, ${a.beam}, transparent)` }}
        />
        <span className={`pointer-events-none absolute top-0 left-0 block h-px w-20 bg-gradient-to-r ${a.corner} to-transparent opacity-60 rounded-tl-[40px]`} />
        <span className={`pointer-events-none absolute top-0 left-0 block w-px h-20 bg-gradient-to-b ${a.corner} to-transparent opacity-60 rounded-tl-[40px]`} />

        {/* ── Corner bracket accents (BR) */}
        <span className={`pointer-events-none absolute bottom-0 right-0 block h-px w-20 bg-gradient-to-l ${a.corner} to-transparent opacity-30`} />
        <span className={`pointer-events-none absolute bottom-0 right-0 block w-px h-20 bg-gradient-to-t ${a.corner} to-transparent opacity-30`} />

        {/* ── Very subtle scanlines */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[0.025]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${a.scan} 3px, ${a.scan} 4px)`,
          }}
        />

        {/* ── Top edge shimmer on hover */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[inherit] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/10 to-transparent" />

        {/* ── Content — no overflow-hidden here so nothing clips */}
        <div className="relative z-10 p-6 md:p-14">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

