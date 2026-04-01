import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const FriendEntryGate = ({ onBack, onEnter }) => {
  const [name, setName] = useState('');
  const [displayText, setDisplayText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const fullText = "What's your name?";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayText(fullText.slice(0, i + 1));
        i++;
      } else {
        setIsTypingComplete(true);
        clearInterval(interval);
      }
    }, 70);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onEnter(name.trim());
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-4 bg-background paper-grain">
      <button 
        onClick={onBack}
        className="absolute top-12 left-12 flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-ink transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> Go back
      </button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-xl text-center"
      >
        <h2 className="font-serif text-5xl sm:text-7xl text-ink mb-16 flex justify-center items-center">
            <span className="relative">
              {displayText}
              <motion.span
                animate={{ opacity: isTypingComplete ? [0.2, 0.1] : [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "steps(2)" }}
                className={`inline-block w-[0.1em] h-[0.9em] bg-accent ml-2 align-middle`}
              />
            </span>
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="relative group mx-auto w-full max-w-sm">
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent py-4 text-center font-serif text-4xl focus:outline-none transition-colors placeholder:text-neutral-100 relative z-10"
              placeholder="First name"
            />
            <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5, delay: 1 }}
                className="absolute bottom-0 left-0 w-full h-[1px] bg-neutral-200 origin-center"
            />
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent origin-center scale-x-0 group-focus-within:scale-x-100 transition-transform duration-700 ease-out z-20" />
          </div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-16 py-6 bg-zinc-950 text-white font-sans text-[11px] uppercase tracking-[0.4em] font-black hover:bg-accent transition-all shadow-2xl rounded-full"
          >
            Enter the book
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
};

export default FriendEntryGate;
