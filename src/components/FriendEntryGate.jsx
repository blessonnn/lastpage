import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const FriendEntryGate = ({ onBack, onEnter }) => {
  const [name, setName] = useState('');
  const [displayText, setDisplayText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showError, setShowError] = useState(false);
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
    if (name.trim()) {
      onEnter(name.trim());
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-4 bg-background paper-grain">
      <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: -20, scale: 0.9, x: "-50%" }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="fixed top-12 left-1/2 z-50 flex items-center justify-center px-6 py-3 bg-zinc-900/90 backdrop-blur-xl border border-white/10 text-white rounded-full shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] pointer-events-none"
          >
            <span className="text-[13px] font-sans font-medium tracking-wide">Please enter your name</span>
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        onClick={onBack}
        className="absolute top-12 left-12 flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-ink transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> Go back
      </button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-xl text-center px-4"
      >
        <h2 className="font-serif text-4xl sm:text-7xl text-ink mb-12 sm:mb-16 flex justify-center items-center">
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
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (showError) setShowError(false);
              }}
              className="w-full bg-transparent py-4 text-center font-serif text-3xl sm:text-4xl focus:outline-none transition-colors placeholder:text-neutral-100 relative z-10"
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
            className="w-full sm:w-auto px-10 sm:px-16 py-4 sm:py-6 bg-zinc-950 text-white font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.4em] font-black hover:bg-accent transition-all shadow-2xl rounded-full"
          >
            Enter the book
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
};

export default FriendEntryGate;
