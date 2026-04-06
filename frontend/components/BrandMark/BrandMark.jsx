'use client';

export default function BrandMark({ className = '' }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="astride-mark" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7DD3FC" />
          <stop offset="0.45" stopColor="#60A5FA" />
          <stop offset="1" stopColor="#A855F7" />
        </linearGradient>
      </defs>
      <path d="M16 45L31 15L48 45" stroke="url(#astride-mark)" strokeWidth="4.5" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M22 36H42" stroke="white" strokeOpacity="0.9" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M28 48H52" stroke="white" strokeOpacity="0.42" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="49.5" cy="48" r="2.5" fill="url(#astride-mark)" />
      <path d="M12 52L24 52" stroke="white" strokeOpacity="0.22" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
