'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../Navbar/Navbar';
import Assistant from '../AICosmicAssistant/Assistant';
import BackgroundManager from '../Background/BackgroundManager';
import BrandMark from '../BrandMark/BrandMark';

const introLine = 'Space is the dream of humanity';

export default function AppChrome({ children }) {
  const pathname = usePathname();
  const [showIntro, setShowIntro] = useState(false);
  const shouldUseIntro = pathname === '/';

  useEffect(() => {
    if (!shouldUseIntro) {
      setShowIntro(false);
      return;
    }

    const hasSeenIntro = window.sessionStorage.getItem('astride-intro-seen');
    if (hasSeenIntro) {
      setShowIntro(false);
      return;
    }

    setShowIntro(true);
    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem('astride-intro-seen', 'true');
      setShowIntro(false);
    }, 2600);

    return () => window.clearTimeout(timer);
  }, [shouldUseIntro]);

  return (
    <>
      <BackgroundManager />
      {!showIntro && <Navbar />}
      <main className="content">{children}</main>
      {!showIntro && <Assistant />}

      <AnimatePresence>
        {showIntro && shouldUseIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6, delay: 0.75, ease: [0.22, 1, 0.36, 1] } }}
            className="fixed inset-0 z-[20000] flex items-center justify-center bg-black"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-10 px-6 text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <BrandMark className="h-16 w-16 md:h-20 md:w-20" />
              </motion.div>
              <div className="flex flex-wrap justify-center gap-y-2 text-white text-xl md:text-3xl font-light tracking-[0.05em] max-w-4xl">
                {introLine.split('').map((char, index) => (
                  <motion.span
                    key={`${char}-${index}`}
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -22 }}
                    transition={{ duration: 0.45, delay: 0.32 + index * 0.03, ease: [0.16, 1, 0.3, 1] }}
                    className={char === ' ' ? 'w-[0.35em]' : ''}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
