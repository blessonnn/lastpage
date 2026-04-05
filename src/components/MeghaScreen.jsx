import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SoundWave = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-around px-4 pointer-events-none opacity-20 overflow-hidden">
      {[...Array(60)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ height: "20%", opacity: 0.3 }}
          animate={{ 
            height: [`${Math.random() * 40 + 20}%`, `${Math.random() * 60 + 10}%`, `${Math.random() * 40 + 20}%`],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: Math.random() * 1.5 + 1, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="w-1 sm:w-2 bg-accent rounded-full mx-0.5"
        />
      ))}
    </div>
  );
};

const MeghaScreen = ({ onContinue }) => {
  const fullText = `To my dearest,

I’ve been sitting here thinking about us, and my heart is just overflowing with gratitude. Thank you for the incredible warmth you bring into my life and the way you care for me—it’s like a soft light that makes everything feel right, no matter how chaotic the world gets.

Looking back at all our beautiful moments, from the quiet mornings to the times we couldn't stop laughing, I realize how lucky I am to have you by my side. You are my home and my greatest adventure all at once.

My only prayer is that we get to spend the rest of our lives exactly like this—laughing together, growing together, and holding onto each other through it all. I can’t wait for all the memories we haven’t even made yet.

"I wish I could turn back the clock. I'd find you sooner and love you longer." — Unknown

I love you, forever and always.`;

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
    }, 15); // Faster typewriter because of long text
    return () => clearInterval(interval);
  }, [fullText]);

  const renderText = () => {
    if (!isDone) return displayText;
    const parts = fullText.split("I love you, forever and always.");
    return (
      <>
        {parts[0]}
        <span className="text-accent font-bold italic transition-colors duration-1000">I love you, forever and always.</span>
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
      className="min-h-screen bg-background paper-grain flex flex-col items-center justify-center p-4 sm:p-12 cursor-pointer relative overflow-hidden"
      onClick={handleContinue}
    >
      <SoundWave />
      
      <motion.div 
        layout
        initial={{ y: 40, opacity: 0, borderRadius: "3rem" }}
        animate={
          isExiting 
            ? { y: 0, opacity: 1, width: "100%", height: "100%", maxWidth: "100%", borderRadius: "0px" } 
            : { y: 0, opacity: 1, width: "100%", height: "75dvh", maxWidth: "56rem", borderRadius: "3rem" }
        }
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="bg-black shadow-2xl relative overflow-hidden z-10 flex flex-col border border-white/5"
      >
        <div 
          className="flex-grow w-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative"
        >
          <div className="p-8 sm:p-16 md:p-24 min-h-full flex flex-col items-center justify-center">
            <motion.div 
              animate={{ opacity: isExiting ? 0 : 1, y: isExiting ? -20 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-full text-white font-code text-sm sm:text-lg md:text-xl lg:text-2xl leading-relaxed sm:leading-loose text-center whitespace-pre-wrap"
            >
              {isDone ? renderText() : displayText}
              {!isDone && (
                <motion.span 
                  animate={{ opacity: [1, 0, 1] }} 
                  transition={{ duration: 0.8, repeat: Infinity, ease: "steps(2)" }} 
                  className="inline-block w-[0.4em] h-[1em] bg-accent ml-2 align-middle shadow-[0_0_15px_rgba(var(--accent-rgb),0.2)]"
                />
              )}
            </motion.div>
          </div>
        </div>

        {/* Intense Black Linear Gradient Overlay (No blur) */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none transition-opacity duration-500 z-[5]" style={{ opacity: isExiting ? 0 : 1 }} />
      </motion.div>
      {isDone && !isExiting && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 1 }}
          className="absolute bottom-6 sm:bottom-12 text-[10px] font-sans tracking-[0.4em] uppercase text-center text-ink flex items-center justify-center z-20"
        >
          Click anywhere to continue
        </motion.div>
      )}
    </motion.div>
  );
};

export default MeghaScreen;
