'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AsteroidHero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen py-20 overflow-hidden">
      {/* Glow Backdrop */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" 
      />

      {/* Main Asteroid Logo */}
      <motion.div
        initial={{ scale: 0.1, rotate: -20, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ 
          duration: 1.5, 
          ease: [0.16, 1, 0.3, 1],
          delay: 0.2
        }}
        className="relative z-10 hover:cursor-pointer"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image 
            src="/asteroid_logo.png" // I'll rename the generated file or just use the absolute path later in the assemble phase
            alt="Astride Logo"
            width={400}
            height={400}
            className="drop-shadow-[0_0_30px_rgba(139,92,246,0.3)] filter contrast-125 brightness-110"
            priority
          />
        </motion.div>
      </motion.div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-12 text-center z-10"
      >
        <h1 className="text-4xl md:text-6xl font-orbitron font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-400 to-white">
          ASTRIDE
        </h1>
        <p className="mt-4 text-sm md:text-base tracking-[0.5em] text-gray-400 uppercase font-medium">
          Infinite Exploration
        </p>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 flex flex-col items-center gap-4"
      >
        <span className="text-[10px] tracking-[0.3em] text-gray-500 uppercase">Commence Descent</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-[1px] h-12 bg-gradient-to-b from-purple-500 to-transparent" 
        />
      </motion.div>
    </section>
  );
}
