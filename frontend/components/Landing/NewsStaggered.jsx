'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NewsStaggered({ news }) {
  if (!news || news.length === 0) return null;

  // Take only the first 4
  const displayNews = news.slice(0, 4);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="relative min-h-screen py-40 px-6 md:px-20 max-w-7xl mx-auto">
      <div className="mb-20 text-center md:text-left">
        <h2 className="text-sm font-orbitron font-bold tracking-[0.4em] text-purple-400 uppercase mb-4">
          Latest Dispatches // SECTOR-7
        </h2>
        <h3 className="text-3xl md:text-5xl font-orbitron font-bold text-white tracking-tight">
          Cosmic News Feed
        </h3>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
      >
        {displayNews.map((article, idx) => (
          <motion.div key={idx} variants={item} className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl aspect-[16/9]">
              <img
                src={article.image || article.urlToImage}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020205] to-transparent opacity-80" />

              <div className="absolute bottom-0 p-8 w-full">
                <span className="text-[10px] text-purple-400 font-bold tracking-widest uppercase mb-2 block">
                  {article.source?.name || 'NASA News'}
                </span>
                <h4 className="text-xl font-bold text-white leading-tight group-hover:text-purple-300 transition-colors line-clamp-2">
                  {article.title}
                </h4>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-20 flex justify-center">
        <Link href="/news" className="text-sm font-bold tracking-[0.3em] text-gray-500 hover:text-white uppercase transition-colors border-b border-white/10 pb-2">
          View Archive // Deep Feed →
        </Link>
      </div>
    </section>
  );
}
