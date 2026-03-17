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
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative bg-background paper-grain">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl"
      >
        <span className="text-xs uppercase tracking-[0.4em] text-accent font-semibold mb-6 block">
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
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSelectFriend}
            className="w-full md:w-64 bg-white p-12 shadow-sm border border-neutral-200 paper-grain group transition-all hover:border-accent hover:shadow-xl"
          >
            <span className="font-serif text-3xl text-ink block mb-2 group-hover:text-accent transition-colors">I'm a friend</span>
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-sans">Enter the book</span>
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
          className="mt-24 text-[10px] uppercase tracking-[0.3em] text-neutral-400 hover:text-ink transition-colors font-sans py-4"
        >
          Admin Access
        </button>
      </motion.div>
    </section>
  );
};

export default RoleGate;
