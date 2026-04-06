'use client';

export default function APODScroll({ data }) {
  if (!data) return null;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-stretch">
        <div className="relative min-h-[300px] md:min-h-[420px] overflow-hidden rounded-[28px] md:rounded-[36px] border border-white/5 shadow-2xl group/img">
          {data.media_type === 'video' ? (
            data.url.includes('youtube.com') || data.url.includes('vimeo.com') ? (
              <iframe
                src={data.url}
                className="absolute inset-0 w-full h-full border-none"
                title={data.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={data.url}
                className="absolute inset-0 w-full h-full object-cover"
                controls
                autoPlay
                muted
                loop
                playsInline
              />
            )
          ) : (
            <img
              src={data.url}
              alt={data.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-105"
            />
          )}
          <div className="absolute top-5 left-5 md:top-6 md:left-6 px-4 md:px-5 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-[8px] md:text-[9px] font-black tracking-[0.35em] md:tracking-[0.5em] text-purple-400 uppercase">
            NASA APOD // {data.date}
          </div>
        </div>

        <div className="flex flex-col justify-center items-start text-left min-h-full px-1 md:px-2">
          <div className="w-full max-w-[34rem]">
            <h2 className="text-[clamp(2.1rem,3.8vw,4rem)] font-orbitron font-black text-white tracking-[-0.045em] leading-[0.94] uppercase">
              {data.title}
            </h2>
            <div className="h-[1px] w-24 bg-gradient-to-r from-purple-500/50 to-transparent mt-6 mb-6" />
            <p className="text-[15px] md:text-[16px] leading-[1.85] font-outfit text-slate-400 opacity-85">
              {data.explanation}
            </p>
            <div className="pt-7">
              <button className="px-7 md:px-8 py-3 rounded-full border border-white/5 bg-white/5 text-[9px] text-slate-300 font-black tracking-[0.3em] uppercase hover:text-white hover:bg-white/10 hover:border-white/10 transition-all">
                {'Access Archive ->'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
