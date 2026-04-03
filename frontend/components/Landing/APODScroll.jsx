'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function APODScroll({ data }) {
  if (!data) return null;

  return (
    <section className="relative min-h-[80vh] flex items-center justify-end px-6 md:px-20 py-20">
      <motion.div
        initial={{ opacity: 0, y: 50, x: 20 }}
        whileInView={{ opacity: 1, y: 0, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative group max-w-2xl"
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-purple-500/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        
        {/* Glass Card */}
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-3xl shadow-2xl">
          <div className="relative h-[300px] md:h-[400px]">
            {data.media_type === 'video' ? (
              <iframe src={data.url} className="w-full h-full border-none" title={data.title} />
            ) : (
              <img 
                src={data.url} 
                alt={data.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            )}
            <div className="absolute top-6 left-6 px-4 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold tracking-widest text-purple-400 uppercase">
              NASA APOD
            </div>
          </div>
          
          <div className="p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-orbitron font-bold text-white mb-4 line-clamp-2">
              {data.title}
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed line-clamp-3 mb-6">
              {data.explanation}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-[10px] text-gray-500 tracking-widest uppercase font-mono">{data.date}</span>
              <button className="text-xs text-purple-400 font-bold tracking-widest uppercase hover:text-white transition-colors">
                Read Abstract // 01
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
