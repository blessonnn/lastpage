import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllEntries } from '../utils/firebaseService';

const frames = [
  "abhinav.png", "abhiraj.png", "adil.png", "akshara.png", "amal.png", 
  "anooja.png", "aysha.png", "chemb.png", "echiii.png", "fidha.png", 
  "gagna.png", "gokool.png", "gopi.png", "hamda.png", "lamiya.png", 
  "leshman.png", "liyakath.png", "megha.png", "mishal.png", "muthu.png", 
  "naseef.png", "naseem.png", "pacha.png", "punni.png", "riya.png", "saja.png", 
  "salman.png", "shamila.png", "siva.png", "suttu.png", "vasu.png", 
  "vismaya.png", "vivek.png", "ziya.png"
];

const row1Frames = frames;
const row2Frames = [...frames.slice(11), ...frames.slice(0, 11)];
const row3Frames = [...frames.slice(22), ...frames.slice(0, 22)];
const rows = [row1Frames, row2Frames, row3Frames];

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
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative bg-zinc-50 overflow-hidden">
      {/* Background Image Layer: Sliding Marquees */}
      <div className="absolute inset-0 z-0 opacity-100 overflow-hidden pointer-events-none flex flex-col justify-center gap-2 sm:gap-3 md:gap-4">
        {rows.map((rowArr, rowIndex) => (
          <motion.div
            key={rowIndex}
            className="flex gap-2 sm:gap-3 md:gap-4 shrink-0"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
              repeat: Infinity, 
              ease: "linear", 
              duration: 40 + (rowIndex * 15) // speeds: 40s, 55s, 70s
            }}
            style={{ width: "max-content" }}
          >
            {[...rowArr, ...rowArr].map((frame, idx) => (
              <div key={`${frame}-${idx}-${rowIndex}`} className="w-[28vh] h-[38vh] sm:w-28 sm:h-auto md:w-36 lg:w-44 xl:w-48 aspect-[3/4] rounded-lg overflow-hidden shadow-sm shrink-0">
                <img 
                  src={`/frames/${frame}`} 
                  alt="Memory Frame" 
                  className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
                  loading="lazy"
                />
              </div>
            ))}
          </motion.div>
        ))}
      </div>

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
        className="w-full max-w-[90vw] sm:max-w-full md:max-w-auto relative z-10 mx-auto"
      >
        {/* Barely visible Translucent Rectangle wrapping the core content */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-10 md:p-16 shadow-2xl border border-white/10 w-full max-w-2xl mx-auto flex flex-col items-center">
          
          <motion.span 
            variants={{
              hidden: { y: 30, opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
            }}
            className="text-[9px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.4em] text-white/80 font-semibold mb-4 sm:mb-6 block w-full text-center"
          >
            Class of 2026
          </motion.span>
          
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { 
                opacity: 1, 
                y: 0, 
                transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
              }
            }}
            className="flex justify-center mb-6 sm:mb-8 pb-4 w-full"
          >
            <div className="relative inline-block px-4 py-1 sm:px-6 sm:py-2">
              <motion.div
                variants={{
                  hidden: { scaleX: 0 },
                  visible: { 
                    scaleX: 1, 
                    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 } 
                  }
                }}
                className="absolute inset-0 bg-white origin-left rounded-lg pointer-events-none"
              />
              <h1 className="relative z-10 font-serif text-4xl sm:text-6xl md:text-8xl text-black leading-[1.1] -tracking-tight">
                Lastpage
              </h1>
            </div>
          </motion.div>
          
          <motion.p 
            variants={{
              hidden: { y: 30, opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
            }}
            className="font-serif italic text-sm sm:text-lg md:text-xl text-white/90 max-w-lg mx-auto leading-relaxed mb-6 sm:mb-12 px-2 sm:px-0 text-center"
          >
            "Leave your mark before the chapter ends."
          </motion.p>

          <motion.div 
            variants={{
              hidden: { y: 30, opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
            }}
            className="flex flex-col md:flex-row gap-3 sm:gap-8 justify-center items-center w-full"
          >
            <motion.button
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSelectFriend}
              className="w-full sm:w-fit bg-transparent px-5 py-2 sm:px-8 sm:py-3 rounded-full border border-white/50 group transition-all duration-100 hover:bg-black hover:border-black flex flex-col items-center justify-center"
            >
              <span className="font-sans text-sm sm:text-lg font-medium text-white tracking-tight transition-colors duration-100">I'm a friend</span>
              <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/60 group-hover:text-white/90 font-semibold mt-0.5 sm:mt-1 transition-colors duration-100">Enter the book</span>
            </motion.button>
          </motion.div>

          {count > 0 && (
            <motion.div 
              variants={{
                hidden: { y: 30, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
              }}
              className="mt-6 sm:mt-10 text-[10px] sm:text-sm text-white/70 font-sans tracking-wide text-center"
            >
              {count} {count === 1 ? 'friend' : 'friends'} have signed the book
            </motion.div>
          )}

          <motion.button
            variants={{
              hidden: { y: 30, opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
            }}
            onClick={onSelectAdmin}
            className="mt-8 sm:mt-16 text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/40 hover:text-white transition-colors font-sans py-2"
          >
            Admin Access
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

export default RoleGate;
