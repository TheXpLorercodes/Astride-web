'use client';
import { usePathname } from 'next/navigation';

export default function BackgroundManager() {
  const pathname = usePathname();
  
  // Show globally on every page as requested
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-black" />
  );
}
