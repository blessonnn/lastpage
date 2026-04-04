import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllEntries } from '../utils/firebaseService';
import PhotoConstellation from './PhotoConstellation';

const RoleGate = ({ onSelectFriend, onSelectAdmin }) => {
  const [count, setCount] = useState(0);
  const [isFriendClicked, setIsFriendClicked] = useState(false);
  const [isAdminClicked, setIsAdminClicked] = useState(false);

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
            className="flex justify-center mb-0 w-full"
          >
            <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl text-white leading-[0.9] -tracking-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] flex py-4">
              {"Lastpage".split('').map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                  animate={
                    isFriendClicked
                      ? { opacity: 0, y: -50, filter: 'blur(10px)', transition: { duration: 0.3, delay: i * 0.03, ease: 'easeIn' } }
                      : { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.0, delay: i * 0.05 + 0.2, ease: [0.22, 1, 0.36, 1] } }
                  }
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
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
            <button
              onClick={() => {
                setIsFriendClicked(true);
                setTimeout(onSelectFriend, 500);
              }}
              className={`group relative px-10 py-3 rounded-full border transition-all duration-500 overflow-hidden ${
                isFriendClicked 
                  ? 'border-transparent translate-y-1 scale-[0.98]' 
                  : 'border-white/20 hover:border-white/40 hover:-translate-y-1 hover:scale-[1.02]'
              }`}
            >
              <div 
                className={`absolute bottom-0 left-0 w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0 ${
                  isFriendClicked ? 'h-full bg-white' : 'h-0 bg-white'
                }`} 
              />
              <div className="relative z-10 flex flex-col items-center justify-center w-full">
                <span className="relative z-20 font-sans text-base font-medium tracking-widest uppercase flex">
                  {"I'm a friend".split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 1, y: 0 }}
                      animate={
                        isFriendClicked 
                          ? { opacity: 0, y: -30, filter: 'blur(5px)', transition: { duration: 0.3, delay: 0.2 + i * 0.02, ease: 'easeIn' } }
                          : { opacity: 1, y: 0 }
                      }
                      className={`inline-block whitespace-pre transition-colors duration-300 ${isFriendClicked ? 'text-black' : 'text-white'}`}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
                <div className={`relative z-10 text-[9px] uppercase tracking-[0.2em] font-semibold transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isFriendClicked ? 'opacity-0 -translate-y-6 text-black/60' : 'opacity-100 mt-0.5 translate-y-0 text-white/40 group-hover:text-white/60'
                }`}>Enter the book</div>
              </div>
            </button>
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

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { delay: 1.5 } }
            }}
            className="mt-12 flex justify-center w-full"
          >
            <button
              onClick={() => {
                setIsAdminClicked(true);
                setTimeout(onSelectAdmin, 500);
              }}
              className={`group relative px-6 py-3 rounded-full border transition-all duration-500 overflow-hidden ${
                isAdminClicked 
                  ? 'border-transparent translate-y-1 scale-[0.98]' 
                  : 'border-white/10 hover:border-white/30 hover:-translate-y-1 hover:scale-[1.02]'
              }`}
            >
              <div 
                className={`absolute bottom-0 left-0 w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0 ${
                  isAdminClicked ? 'h-full bg-white' : 'h-0 bg-white'
                }`} 
              />
              <div className="relative z-10 flex flex-col items-center justify-center w-full">
                <span className="relative z-20 font-sans text-[9px] font-bold tracking-widest uppercase flex">
                  {"Admin Login".split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 1, y: 0 }}
                      animate={
                        isAdminClicked 
                          ? { opacity: 0, y: -30, filter: 'blur(5px)', transition: { duration: 0.3, delay: 0.2 + i * 0.02, ease: 'easeIn' } }
                          : { opacity: 1, y: 0 }
                      }
                      className={`inline-block whitespace-pre transition-colors duration-300 ${isAdminClicked ? 'text-black' : 'text-white/40 group-hover:text-white/80'}`}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              </div>
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default RoleGate;
