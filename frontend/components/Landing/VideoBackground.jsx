'use client';

export default function VideoBackground() {
  const videoSrc = null; // USER: Set your Earth video source here (e.g., "/earth-bg.mp4")

  return (
    <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000">
      {videoSrc && (
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover opacity-60 scale-110 filter brightness-[0.35] contrast-[1.2]"
          src={videoSrc} 
          poster="/hero-earth.png"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
    </div>
  );
}
