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
    <div className="w-full py-4">
      <div className="mb-20 text-center">
        <p className="text-purple-500 font-black tracking-[0.8em] uppercase text-[9px] mb-6 opacity-80">{"Live Dispatches // SECTOR-07"}</p>
        <h3 className="text-4xl md:text-6xl font-orbitron font-black text-white tracking-widest uppercase">
          Cosmic Intels
        </h3>
        <div className="h-[1px] w-32 bg-white/10 mx-auto mt-10" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20"
      >
        {displayNews.map((article, idx) => (
          <motion.div key={idx} variants={item} className="relative group cursor-pointer overflow-hidden rounded-[40px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] transition-all duration-500 p-10 hover:border-purple-500/30">
            <div className="relative z-10 flex flex-col h-full">
               <span className="text-[9px] text-[#94a3b8] font-black tracking-[0.5em] uppercase mb-16">
                  {article.news_site || article.source?.name || 'NASA News'}
               </span>
               
               <h4 className="text-2xl md:text-3xl font-orbitron font-black text-white leading-tight group-hover:text-purple-300 transition-colors line-clamp-3 mb-10 tracking-tight">
                 {article.title}
               </h4>
               
               <div className="mt-auto pt-10 border-t border-white/5 flex justify-between items-center">
                 <Link href={article.url} target="_blank" className="text-[9px] font-black uppercase text-[#94a3b8] group-hover:text-white transition-colors tracking-[0.4em]">Read Dispatch →</Link>
                 <span className="text-[9px] font-black text-white/10 tracking-[0.5em]">#{idx + 1}</span>
               </div>
            </div>

            {/* Subtle background image */}
            <div className="absolute right-[-10%] top-[-10%] w-[300px] h-[300px] opacity-10 group-hover:opacity-20 transition-opacity duration-1000 rotate-12 blur-sm">
               <img 
                 src={article.image_url || article.image || article.urlToImage} 
                 alt="" 
                 className="w-full h-full object-cover rounded-full" 
               />
               <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-black" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-24 flex justify-center">
        <Link href="/news" className="group flex items-center gap-6 text-[10px] font-bold tracking-[0.5em] text-gray-500 hover:text-white uppercase transition-all">
          <span className="h-[1px] w-12 bg-white/10 group-hover:w-20 transition-all"></span>
          {"Access Deep-Feed Archive"}
          <span className="h-[1px] w-12 bg-white/10 group-hover:w-20 transition-all"></span>
        </Link>
      </div>
    </div>
  );
}
