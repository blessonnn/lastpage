import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AyshaScreen = ({ onContinue }) => {
  const fullText = "History maker in the house! \uD83C\uDFC6 A perfect 10 SGPA and the first one in the college? That is a massive flex. Massive congratulations to you—you’ve officially set the bar for everyone else!";
  const [displayText, setDisplayText] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayText(fullText.slice(0, i + 1));
        i++;
      } else {
        setIsDone(true);
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, []);

  const renderText = () => {
    if (!isDone) return displayText;
    const parts = fullText.split("Massive congratulations");
    return (
      <>
        {parts[0]}
        <span className="text-yellow-400 font-bold italic transition-colors duration-1000">Massive congratulations</span>
        {parts[1]}
      </>
    );
  };

  const handleContinue = () => {
    if (isDone && !isExiting) {
      setIsExiting(true);
      setTimeout(() => {
        onContinue();
      }, 700);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background paper-grain flex flex-col items-center justify-center p-4 sm:p-12 cursor-pointer"
      onClick={handleContinue}
    >
      <motion.div 
        layout
        initial={{ y: 40, opacity: 0, borderRadius: "3rem" }}
        animate={
          isExiting 
            ? { y: 0, opacity: 1, width: "100%", height: "100%", maxWidth: "100%", borderRadius: "0px", padding: 0 } 
            : { y: 0, opacity: 1, width: "100%", height: "auto", maxWidth: "56rem", borderRadius: "3rem" }
        }
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="bg-zinc-950 p-8 sm:p-16 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden"
      >
        <motion.div 
          animate={{ opacity: isExiting ? 0 : 1, y: isExiting ? -20 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-full text-white font-code text-2xl sm:text-4xl md:text-5xl leading-tight text-center"
        >
          {isDone ? renderText() : displayText}
          {!isDone && (
            <motion.span 
              animate={{ opacity: [1, 0, 1] }} 
              transition={{ duration: 0.8, repeat: Infinity, ease: "steps(2)" }} 
              className="inline-block w-[0.4em] h-[1em] bg-white ml-2 align-middle shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            />
          )}
        </motion.div>
      </motion.div>
      {isDone && !isExiting && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="absolute bottom-12 text-[10px] font-sans tracking-[0.4em] uppercase opacity-40 text-center text-ink flex items-center justify-center">
          Click anywhere to continue
        </motion.div>
      )}
    </motion.div>
  );
};

export default AyshaScreen;
