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
        <h2 className="font-serif text-6xl text-ink mb-12">What's your name?</h2>
        
        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="relative">
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-b-2 border-neutral-200 py-6 text-center font-serif text-4xl focus:outline-none focus:border-accent transition-colors placeholder:text-neutral-100"
              placeholder="First name"
            />
          </div>

          <button
            type="submit"
            className="px-12 py-6 bg-accent text-white font-sans text-xs uppercase tracking-[0.3em] font-bold hover:bg-ink transition-colors shadow-xl"
          >
            Enter the book
          </button>
        </form>
      </motion.div>
    </section>
  );
};

export default FriendEntryGate;
