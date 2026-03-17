import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Hero = ({ count }) => {
  return (
    <section className="min-h-[90vh] flex flex-col justify-center items-center text-center px-4 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl"
      >
        <span className="text-xs uppercase tracking-[0.4em] text-accent font-semibold mb-6 block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Class of 2026
        </span>
        
        <h1 className="font-serif text-8xl md:text-[10rem] text-ink leading-none mb-8 -tracking-tight">
          Lastpage
        </h1>
        
        <p className="font-serif italic text-xl md:text-2xl text-ink-muted max-w-lg mx-auto leading-relaxed">
          "Leave your mark before the chapter ends."
        </p>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-sm text-neutral-400 font-sans tracking-wide"
        >
          {count} friends have signed the book
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 cursor-pointer flex flex-col items-center gap-2"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <span className="text-[10px] uppercase tracking-widest text-neutral-400">Scroll to read</span>
        <ChevronDown className="w-4 h-4 text-neutral-400 animate-scroll-prompt" />
      </motion.div>
    </section>
  );
};

export default Hero;
