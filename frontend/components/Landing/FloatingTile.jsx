'use client';
import { motion } from 'framer-motion';

export default function FloatingTile({ children, accent = 'purple' }) {
  const accentMap = {
    purple: {
      border: 'hover:border-purple-500/50',
      glow: 'hover:shadow-[0_0_80px_-20px_rgba(139,92,246,0.35)]',
      corner: 'from-purple-500',
      scan: 'rgba(139,92,246,0.03)',
    },
    cyan: {
      border: 'hover:border-cyan-500/50',
      glow: 'hover:shadow-[0_0_80px_-20px_rgba(6,182,212,0.35)]',
      corner: 'from-cyan-500',
      scan: 'rgba(6,182,212,0.03)',
    },
  };

  const a = accentMap[accent] ?? accentMap.purple;

  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 w-full"
    >
      {/* Outer glow layer — sits outside, never clips children */}
      <div
        className={`
          relative max-w-5xl mx-auto
          rounded-[32px] md:rounded-[40px]
          border border-white/[0.07]
          bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent
          shadow-[0_8px_60px_-12px_rgba(0,0,0,0.8)]
          transition-all duration-700
          ${a.border} ${a.glow}
          group
        `}
      >
        {/* ── Corner bracket accents (TL) */}
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

        {/* ── Content — no overflow-hidden here so nothing clips */}
        <div className="relative z-10 p-6 md:p-14">
          {children}
        </div>
      </div>
    </motion.div>
  );
}