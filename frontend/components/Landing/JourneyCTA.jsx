'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

export default function JourneyCTA() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [0.8, 1]);

  return (
    <motion.div
      style={{ opacity, scale }}
      className="fixed bottom-8 right-8 z-50 pointer-events-auto"
    >
      <Link href="/solar-system">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative px-8 py-4 bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-orbitron font-bold text-xs tracking-[0.2em] uppercase rounded-full shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all group overflow-hidden flex items-center gap-3"
        >
          <span className="relative z-10">Begin Journey</span>
          <span className="relative z-10 text-lg">→</span>
          
          {/* Animated Glow Border */}
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
          
          {/* Internal Pulse */}
          <motion.div 
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" 
          />
        </motion.button>
      </Link>
    </motion.div>
  );
}
