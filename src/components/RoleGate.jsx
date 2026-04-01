import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllEntries } from '../utils/firebaseService';
import PhotoConstellation from './PhotoConstellation';

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
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative bg-zinc-950 overflow-hidden select-none">
      {/* Photo Constellation Background */}
      <PhotoConstellation />

      {/* Cinematic Vignette Overlay - Softened */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_rgba(0,0,0,0.7)_100%)] z-[1] pointer-events-none" />
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.1 }
          }
        }}
        className="w-full max-w-[90vw] sm:max-w-full relative z-10 mx-auto"
      >
        {/* Core Content Container - Reduced size and spacing */}
        <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 sm:p-10 border border-white/10 w-full max-w-xl mx-auto flex flex-col items-center shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          
          <motion.span 
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
            }}
            className="text-[9px] uppercase tracking-[0.5em] text-accent font-bold mb-4 block w-full text-center drop-shadow-[0_0_15px_rgba(var(--accent-rgb),0.5)]"
          >
            Class of 2026
          </motion.span>
          
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
              visible: { 
                opacity: 1, 
                y: 0, 
                filter: 'blur(0px)',
                transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } 
              }
            }}
            className="flex justify-center mb-3 w-full"
          >
            <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl text-white leading-[0.9] -tracking-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">
              Lastpage
            </h1>
          </motion.div>
          
          <motion.p 
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 } }
            }}
            className="font-serif italic text-base sm:text-lg md:text-xl text-white/70 max-w-md mx-auto leading-snug mb-6 text-center"
          >
            "Leave your mark before the chapter ends."
          </motion.p>

          <motion.div 
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.6 } }
            }}
            className="flex flex-col items-center w-full"
          >
            <motion.button
              whileHover={{ y: -4, scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ y: 2, scale: 0.98, backgroundColor: "#000000", color: "#ffffff" }}
              onClick={onSelectFriend}
              className="group relative px-10 py-3 rounded-full border border-white/20 transition-all duration-500 hover:border-white/40 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 font-sans text-base font-medium text-white tracking-widest uppercase">I'm a friend</span>
              <div className="text-[9px] uppercase tracking-[0.2em] text-white/40 group-hover:text-white/60 font-semibold mt-0.5 transition-colors duration-500">Enter the book</div>
            </motion.button>
          </motion.div>

          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { delay: 1 } }
            }}
            className="mt-8 text-[10px] text-white/30 font-sans tracking-[0.2em] uppercase"
          >
            {count > 0 ? (
              <span>{count} {count === 1 ? 'friend' : 'friends'} already joined</span>
            ) : (
              <span>Starting the story...</span>
            )}
          </motion.div>

          <motion.button
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { delay: 1.5 } }
            }}
            onClick={onSelectAdmin}
            className="mt-12 text-[8px] uppercase tracking-[0.4em] text-white/20 hover:text-white/60 transition-colors font-sans py-2"
          >
            Admin Access
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

export default RoleGate;
