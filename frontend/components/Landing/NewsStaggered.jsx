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
        <p className="text-purple-500 font-black tracking-[0.6em] uppercase text-[10px] mb-4">{"Latest Dispatches // SECTOR-7"}</p>
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
          <motion.div key={idx} variants={item} className="planet-card !min-h-[280px] group cursor-pointer">
            <div className="card-top">
               <span className="text-[10px] text-purple-400 font-black tracking-widest uppercase">
                  {article.news_site || article.source?.name || 'NASA News'}
               </span>
            </div>
            
            <div className="card-body !mt-8">
               <h4 className="text-xl font-bold text-white leading-tight group-hover:text-purple-300 transition-colors line-clamp-3">
                 {article.title}
               </h4>
               <Link href={article.url} target="_blank" className="mt-8 block text-[10px] font-black uppercase text-gray-500 hover:text-white transition-colors tracking-widest">Read Dispatch →</Link>
            </div>

            <div className="card-planet-wrap !w-[180px] !h-[180px] md:!w-[240px] md:!h-[240px] !right-[-5%] !top-[-5%]">
               <img 
                 src={article.image_url || article.image || article.urlToImage} 
                 alt="" 
                 className="card-image opacity-40 group-hover:opacity-80 transition-opacity" 
               />
               <div className="card-shadow"></div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-20 flex justify-center">
        <Link href="/news" className="text-sm font-bold tracking-[0.3em] text-gray-500 hover:text-white uppercase transition-colors border-b border-white/10 pb-2">
          {"View Archive // Deep Feed →"}
        </Link>
      </div>
    </section>
  );
}
