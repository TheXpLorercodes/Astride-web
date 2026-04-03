'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Starfield() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const translateY1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const translateY2 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const translateY3 = useTransform(scrollYProgress, [0, 1], [0, -450]);

  return (
    <div ref={ref} className="fixed inset-0 z-[-1] overflow-hidden bg-[#020205]">
      {/* Background Nebulae */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-900/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[150px] rounded-full" />
      </div>

      {/* Star Layers */}
      <motion.div style={{ y: translateY1 }} className="absolute inset-0">
        <div className="stars-layer-high-density" />
      </motion.div>

      <motion.div style={{ y: translateY2 }} className="absolute inset-0">
        <div className="stars-layer-mid-density" />
      </motion.div>

      <motion.div style={{ y: translateY3 }} className="absolute inset-0">
        <div className="stars-layer-low-density" />
      </motion.div>

      <style jsx>{`
        .stars-layer-high-density, .stars-layer-mid-density, .stars-layer-low-density {
          position: absolute;
          inset: -300px;
          background-image: 
            radial-gradient(1px 1px at 25px 45px, #fff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 150px 80px, #fff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 80px 120px, #fff, rgba(0,0,0,0)),
            radial-gradient(1.2px 1.2px at 250px 200px, #fff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 300px 300px, #fff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 450px 50px, #fff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 500px 450px, #fff, rgba(0,0,0,0));
          background-size: 200px 200px;
          opacity: 0.5;
        }
        .stars-layer-mid-density {
          background-size: 400px 400px;
          opacity: 0.3;
        }
        .stars-layer-low-density {
          background-size: 600px 600px;
          opacity: 0.2;
        }
      `}</style>
    </div>
  );
}
