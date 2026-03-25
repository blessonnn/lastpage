import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllEntries } from '../utils/firebaseService';

const frames = [
  "abhiraj.png", "adil.png", "akshara.png", "amal.png", "aysha.png", 
  "chemb.png", "gokool.png", "gopi.png", "hamda.png", "leshman.png", 
  "liyakath.png", "muthu.png", "naseef.png", "naseem.png", "riya.png", 
  "saja.png", "salman.png", "shamila.png", "suttu.png", "vasu.png", 
  "vismaya.png", "vivek.png", "ziya.png"
];

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
      {/* Background Image Layer: Collage of frames */}
      <div className="absolute inset-0 z-0 opacity-100 overflow-hidden pointer-events-none">
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 p-4 min-w-[120%] min-h-[120%] -translate-x-[10%] -translate-y-[10%] content-start">
          {Array.from({ length: 4 }).flatMap(() => frames).map((frame, idx) => (
            <div key={`${frame}-${idx}`} className="w-full aspect-[3/4] rounded-lg overflow-hidden shadow-sm">
              <img 
                src={`/frames/${frame}`} 
                alt="Memory Frame" 
                className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl relative z-10 w-full md:w-auto"
      >
        {/* White Translucent Rectangle wrapping the core content */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-16 shadow-2xl border border-white/20 w-full max-w-2xl mx-auto flex flex-col items-center">
          <span className="text-xs uppercase tracking-[0.4em] text-black font-semibold mb-6 block w-full text-center">
            Class of 2026
          </span>
          
          <motion.h1 
            className="font-serif text-6xl md:text-8xl text-black leading-[1.1] mb-6 -tracking-tight flex justify-center overflow-hidden pb-4"
            initial="hidden"
            animate="visible"
          >
            {"Lastpage".split("").map((char, index) => (
              <motion.span
                key={index}
                variants={{
                  hidden: { y: "100%", opacity: 0 },
                  visible: { 
                    y: 0, 
                    opacity: 1,
                    transition: { 
                      duration: 1.2, 
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.2 + (index * 0.08)
                    } 
                  }
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>
          
          <p className="font-serif italic text-lg md:text-xl text-black max-w-lg mx-auto leading-relaxed mb-12 text-center">
            "Leave your mark before the chapter ends."
          </p>

          <div className="flex flex-col md:flex-row gap-8 justify-center items-center w-full">
            <motion.button
              whileHover={{ y: -2, scale: 1.02, backgroundColor: "rgba(0, 0, 0, 0.05)" }}
              whileTap={{ scale: 0.98 }}
              onClick={onSelectFriend}
              className="w-fit bg-transparent px-8 py-3 rounded-full border border-black group transition-all flex flex-col items-center justify-center"
            >
              <span className="font-sans text-lg font-medium text-black tracking-tight transition-colors">I'm a friend</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-black/70 font-semibold mt-1">Enter the book</span>
            </motion.button>
          </div>

          {count > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-10 text-sm text-black font-sans tracking-wide text-center"
            >
              {count} {count === 1 ? 'friend' : 'friends'} have signed the book
            </motion.div>
          )}

          <button
            onClick={onSelectAdmin}
            className="mt-16 text-[10px] uppercase tracking-[0.3em] text-black/40 hover:text-black transition-colors font-sans py-2"
          >
            Admin Access
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default RoleGate;
