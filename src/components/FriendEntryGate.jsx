import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const FriendEntryGate = ({ onBack, onEnter }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onEnter(name.trim());
    }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-4 bg-background paper-grain">
      <button 
        onClick={onBack}
        className="absolute top-12 left-12 flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-ink transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Go back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl text-center"
      >
        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-ink mb-8 sm:mb-12 flex justify-center items-center">
          <span>What's your&nbsp;</span>
          <span className="overflow-hidden inline-flex">
            <motion.span
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            >
              name?
            </motion.span>
          </span>
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-12">
          <div className="relative group mx-auto w-[90%] sm:w-full">
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent py-4 sm:py-6 text-center font-serif text-3xl sm:text-4xl focus:outline-none transition-colors placeholder:text-neutral-100 relative z-10"
              placeholder="First name"
            />
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              className="absolute bottom-0 left-0 w-full h-[2px] bg-neutral-200 origin-center pointer-events-none"
            />
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent origin-center scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 ease-out pointer-events-none z-20" />
          </div>

          <motion.button
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            type="submit"
            className="w-[90%] sm:w-auto px-8 sm:px-12 py-5 sm:py-6 bg-accent text-white font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold hover:bg-ink transition-colors shadow-xl rounded-[12px]"
          >
            Enter the book
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
};

export default FriendEntryGate;
