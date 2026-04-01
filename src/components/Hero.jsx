import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import PhotoConstellation from './PhotoConstellation';

const Hero = ({ count }) => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative bg-black overflow-hidden select-none">
      {/* Dynamic Background Animation */}
      <PhotoConstellation />

      {/* Subtle Cinematic Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.8)_100%)] z-[1]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl relative z-20 pointer-events-none"
      >
        <span className="text-xs uppercase tracking-[0.5em] text-accent/80 font-bold mb-8 block drop-shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]">
          Class of 2026
        </span>
        
        <h1 className="font-serif text-8xl md:text-[11rem] text-white leading-none mb-4 -tracking-tight flex flex-wrap justify-center drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          {"Lastpage".split("").map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ 
                duration: 0.8, 
                delay: 0.8 + (0.05 * i),
                ease: "easeOut"
              }}
            >
              {char}
            </motion.span>
          ))}
        </h1>
        
        <p className="font-serif italic text-xl md:text-3xl text-white/60 max-w-lg mx-auto leading-relaxed mt-2 opacity-80 backdrop-blur-sm px-4">
          "Leave your mark before the chapter ends."
        </p>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="mt-16 text-[10px] text-neutral-500 font-sans tracking-[0.2em] uppercase"
        >
          {count || 0} friends have signed the book
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 cursor-pointer flex flex-col items-center gap-3 z-30 group"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-500 group-hover:text-white transition-colors duration-500">Scroll to read</span>
        <div className="relative">
          <div className="absolute -inset-2 bg-accent/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <ScrollDownIcon className="w-5 h-5 text-neutral-500 group-hover:text-accent transition-colors duration-500" />
        </div>
      </motion.div>
    </section>
  );
};

// Custom Scroll Down Icon Component for more control
const ScrollDownIcon = ({ className }) => (
  <motion.div
    animate={{ y: [0, 8, 0] }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    className={className}
  >
    <ChevronDown strokeWidth={1.5} />
  </motion.div>
);

export default Hero;

