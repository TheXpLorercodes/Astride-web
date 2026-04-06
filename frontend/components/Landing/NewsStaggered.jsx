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
                className="overflow-hidden rounded-[24px] border border-white/8 bg-white/[0.03] shadow-[0_18px_50px_-30px_rgba(0,0,0,0.9)] transition-all duration-300 hover:border-purple-500/30 hover:bg-white/[0.05]"
              >
                <div className="h-[160px] w-full overflow-hidden bg-white/[0.04]">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-purple-500/20 via-transparent to-white/5" />
                  )}
                </div>

                <div className="p-5 flex h-[230px] flex-col">
                  <span className="mb-3 text-[8px] font-black uppercase tracking-[0.28em] text-slate-400">
                    {source}
                  </span>

                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="no-underline">
                    <span className="line-clamp-3 text-[1.05rem] leading-7 font-semibold text-white transition-colors hover:text-purple-300">
                      {article.title}
                    </span>
                  </a>

                  <p className="mt-3 line-clamp-4 text-[0.9rem] leading-6 text-slate-400">
                    {description}
                  </p>

                  <a
                    className="mt-auto inline-flex w-fit items-center gap-2 rounded-md bg-purple-500/90 px-3 py-2 text-[0.82rem] font-medium text-white transition-all hover:bg-purple-400"
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Find out more
                    <span aria-hidden="true">→</span>
                  </a>
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
