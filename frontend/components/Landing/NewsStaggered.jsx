'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NewsStaggered({ news }) {
  if (!news || news.length === 0) return null;

  const displayNews = news.slice(0, 4);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="w-full py-4">
      <div className="mb-10 md:mb-12 text-center">
        <p className="text-purple-500 font-black tracking-[0.55em] md:tracking-[0.8em] uppercase text-[8px] md:text-[9px] mb-5 md:mb-6 opacity-80">
          {'Live Dispatches // Sector-07'}
        </p>
        <h3 className="mx-auto max-w-[12ch] text-[clamp(1.65rem,3vw,2.4rem)] font-orbitron font-black text-white tracking-[-0.04em] leading-[0.98] uppercase">
          Cosmic Intels
        </h3>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
        className="flex justify-center"
      >
        <div className="grid w-full max-w-[1240px] grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6 xl:gap-6">
          {displayNews.map((article, idx) => {
            const imageSrc = article.image_url || article.image || article.urlToImage;
            const source = article.news_site || article.source?.name || 'NASA News';
            const description = article.summary || article.excerpt || article.description || 'Read the latest update from the live space news feed.';

            return (
              <motion.article
                key={idx}
                variants={item}
                className="flex flex-col bg-transparent border border-white/10 w-full transition-all duration-300 hover:border-white/30 hover:bg-white/[0.02]"
                style={{ padding: '1.2rem', fontFamily: 'sans-serif' }}
              >
                <div className="h-[200px] w-full overflow-hidden mb-6 relative">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={article.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-[1.05]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-white/5 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex flex-col flex-1 relative z-10">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
                    <span className="text-[0.65rem] font-extrabold uppercase tracking-widest text-[#F5A623]">
                      {source}
                    </span>
                    <span className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">
                      {article.published_at ? new Date(article.published_at).toLocaleDateString('en-GB') : 'CURRENT'}
                    </span>
                  </div>

                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="no-underline">
                    <h3 className="text-[1.15rem] leading-[1.4] font-bold text-white mb-3 hover:text-purple-300 transition-colors" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontFamily: 'inherit' }}>
                      {article.title}
                    </h3>
                  </a>

                  <p className="text-[0.85rem] leading-[1.65] text-slate-300 mb-6 flex-1" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-white/10 flex flex-wrap 2xl:flex-nowrap justify-between items-center gap-4">
                    <div className="flex flex-1 min-w-[120px] items-center gap-3 pr-2 overflow-hidden">
                      <div className="w-9 h-9 shrink-0 rounded-full overflow-hidden border-[1.5px] border-white/20 bg-white/5">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(source)}&background=random`} 
                          alt="Author" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[0.8rem] font-bold text-white truncate">{source}</span>
                        <span className="text-[0.65rem] text-slate-400 truncate mt-[1px]">Space Journalist</span>
                      </div>
                    </div>

                    <a
                      className="shrink-0 inline-flex items-center justify-between rounded-full bg-[#4A485B] border-[1.5px] border-[#F5A623] pl-[1.1rem] pr-1.5 py-1.5 shadow-lg transition-transform hover:scale-[1.03] active:scale-95"
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="mr-[0.6rem] text-[0.8rem] font-semibold text-white tracking-wide">Read more</span>
                      <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F5C237] to-[#F07A18] text-white shadow-sm">
                        <svg className="h-[10px] w-[10px] ml-[1px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </span>
                    </a>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </motion.div>

      <div className="mt-10 flex justify-center">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-4 py-2 text-[0.82rem] font-medium text-slate-300 transition-all hover:border-purple-500/30 hover:bg-white/[0.05] hover:text-white"
        >
          Load more news
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
