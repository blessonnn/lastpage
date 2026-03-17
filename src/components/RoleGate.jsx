import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllEntries } from '../utils/firebaseService';

const RoleGate = ({ onSelectFriend, onSelectAdmin }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const entries = await getAllEntries();
      setCount(entries.length);
    };
    fetchCount();
  }, []);
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative bg-background overflow-hidden">
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat blur-[3px] scale-105 opacity-50"
        style={{ backgroundImage: "url('/img/IMG_1696.jpg')" }}
      />
      {/* Texture Overlay */}
      <div className="absolute inset-0 z-0 bg-white/40 backdrop-blur-[1px] paper-grain" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl relative z-10"
      >
        <span className="text-xs uppercase tracking-[0.4em] text-white/70 font-semibold mb-6 block">
          Class of 2026
        </span>
        
        <h1 className="font-serif text-8xl md:text-[10rem] text-ink leading-none mb-8 -tracking-tight">
          Lastpage
        </h1>
        
        <p className="font-serif italic text-xl md:text-2xl text-ink-muted max-w-lg mx-auto leading-relaxed mb-16">
          "Leave your mark before the chapter ends."
        </p>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          <motion.button
            whileHover={{ y: -2, scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.95)" }}
            whileTap={{ scale: 0.98 }}
            onClick={onSelectFriend}
            className="w-fit bg-white/70 backdrop-blur-2xl px-16 py-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] border border-white/40 group transition-all hover:shadow-[0_8px_48px_0_rgba(0,0,0,0.12)] rounded-full flex flex-col items-center justify-center"
          >
            <span className="font-sans text-xl font-medium text-ink/90 tracking-tight group-hover:text-ink transition-colors">I'm a friend</span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-500 font-bold opacity-50">Enter the book</span>
          </motion.button>
        </div>

        {count > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-sm text-neutral-400 font-sans tracking-wide"
          >
            {count} {count === 1 ? 'friend' : 'friends'} have signed the book
          </motion.div>
        )}

        <button
          onClick={onSelectAdmin}
          className="mt-24 text-[10px] uppercase tracking-[0.3em] text-white/60 hover:text-white transition-colors font-sans py-4"
        >
          Admin Access
        </button>
      </motion.div>
    </section>
  );
};

export default RoleGate;
