import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const FriendEntryGate = ({ onBack, onEnter }) => {
  const [name, setName] = useState('');
  const [displayText, setDisplayText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
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
      setIsClicked(true);
      setTimeout(() => onEnter(name.trim()), 250);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-4 bg-background paper-grain">
      <AnimatePresence>
        {showError && (
          <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex justify-start items-center w-[220px] h-[40px]">
            <motion.div
              initial={{ scale: 0, width: "40px" }}
              animate={{ scale: 1, width: "220px" }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
              transition={{
                scale: { type: "spring", stiffness: 600, damping: 25 },
                width: { delay: 0.2, type: "spring", stiffness: 450, damping: 25 }
              }}
              style={{ originX: 0.5, originY: 0.5 }}
              className="bg-accent rounded-full h-[40px] overflow-hidden flex items-center shadow-[0_10px_30px_-5px_rgba(204,85,0,0.5)] absolute left-0"
            >
              <div className="min-w-[220px] h-full flex items-center justify-center">
                <motion.span 
                  initial={{ opacity: 0, filter: "blur(2px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ delay: 0.3, duration: 0.2 }}
                  className="text-[12px] font-sans font-medium tracking-[0.05em] text-white whitespace-nowrap"
                >
                  Please enter your name
                </motion.span>
              </div>
            </motion.div>
          </div>
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
        <h2 className="font-serif text-4xl sm:text-7xl text-ink mb-12 sm:mb-16 flex justify-center items-center py-2">
            <span className="relative flex whitespace-pre">
              {displayText.split('').map((char, i) => (
                <motion.span
                  key={i}
                  animate={isClicked ? { opacity: 0, y: -50, filter: 'blur(10px)', transition: { duration: 0.3, delay: i * 0.03, ease: 'easeIn' } } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
              <motion.span
                animate={isClicked ? { opacity: 0, y: -50, transition: { duration: 0.3, delay: displayText.length * 0.03, ease: 'easeIn' } } : { opacity: isTypingComplete ? [0.2, 0.1] : [1, 0, 1] }}
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
            type="submit"
            className={`group relative overflow-hidden w-full sm:w-auto px-10 sm:px-16 py-4 sm:py-6 bg-zinc-950 font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.4em] font-black transition-all shadow-2xl rounded-full border border-transparent ${
              isClicked 
                ? 'translate-y-1 scale-[0.98] shadow-none' 
                : 'hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)]'
            }`}
          >
            <div 
              className={`absolute bottom-0 left-0 w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0 ${
                isClicked ? 'h-full bg-white' : 'h-0 bg-white'
              }`} 
            />
            <span className={`relative z-10 transition-colors duration-500 ${isClicked ? 'text-black' : 'text-white'}`}>
              Enter the book
            </span>
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
};

export default FriendEntryGate;
