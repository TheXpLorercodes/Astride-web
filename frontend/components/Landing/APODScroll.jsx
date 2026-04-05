'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function APODScroll({ data }) {
  if (!data) return null;

  return (
    <div className="flex flex-col items-center text-center w-full max-w-5xl mx-auto">
      <div className="relative w-full overflow-hidden rounded-[32px] md:rounded-[48px] border border-white/5 shadow-2xl group/img aspect-video mb-16">
        {data.media_type === 'video' ? (
          <iframe src={data.url} className="w-full h-full border-none" title={data.title} />
        ) : (
          <img
            src={data.url}
            alt={data.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-105"
          />
        )}
        <div className="absolute top-8 left-8 px-6 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-[9px] font-black tracking-[0.6em] text-purple-400 uppercase">
          NASA APOD // {data.date}
        </div>
      </div>

      <div className="space-y-8 max-w-3xl">
        <h2 className="text-3xl md:text-6xl font-orbitron font-black text-white tracking-tighter leading-tight drop-shadow-2xl uppercase">
          {data.title}
        </h2>
        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent mx-auto" />
        <p className="text-[#94a3b8] text-base md:text-lg leading-relaxed font-outfit opacity-70">
          {data.explanation}
        </p>
        <div className="pt-10 flex justify-center">
          <button className="px-8 py-3 rounded-full border border-white/5 bg-white/5 text-[9px] text-[#94a3b8] font-black tracking-[0.5em] uppercase hover:text-white hover:bg-white/10 hover:border-white/10 transition-all">
            {"Access Archive →"}
          </button>
        </div>
      </div>
    </div>
  );
}
