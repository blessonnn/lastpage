import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ onComplete }) => {
  const years = [2022, 2023, 2024, 2025, 2026];
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const targetYear = years[index].toString();
    
    if (isTyping) {
      if (displayText.length < targetYear.length) {
        const timeout = setTimeout(() => {
          setDisplayText(targetYear.slice(0, displayText.length + 1));
        }, 150); // Steady typing speed
        return () => clearTimeout(timeout);
      } else {
        setIsTyping(false);
        // Pause duration: Longer for the final year to build anticipation
        const pauseTime = index === years.length - 1 ? 1500 : 600; 
        
        const timeout = setTimeout(() => {
          if (index < years.length - 1) {
            setIndex(index + 1);
            setDisplayText(""); // Reset for the next year
            setIsTyping(true);
          } else {
            // Signal completion to parent
            onComplete();
          }
        }, pauseTime);
        return () => clearTimeout(timeout);
      }
    }
  }, [index, displayText, isTyping, onComplete, years]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        filter: "blur(20px)",
        scale: 1.1
      }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
    >
      <div className="relative flex flex-col items-center">
        {/* Atmospheric Glow for Year 2026 */}
        {index === years.length - 1 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.3, scale: 1.2 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 m-auto w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-accent rounded-full blur-[120px] pointer-events-none z-[-1]"
          />
        )}
        
        <div className="flex items-center justify-center min-h-[120px] sm:min-h-[160px]">
          <span className={`font-dot tracking-tighter transition-all duration-700 ${
            index === years.length - 1 
              ? 'text-7xl sm:text-9xl text-accent drop-shadow-[0_0_30px_rgba(var(--accent-rgb),0.4)]' 
              : 'text-5xl sm:text-7xl text-white/30'
          }`}>
            {displayText}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "steps(2)" }}
              className="ml-1 inline-block w-[0.1em] h-[0.8em] bg-current align-middle"
            />
          </span>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.2, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-12 text-[10px] sm:text-xs uppercase tracking-[0.5em] text-white font-sans font-medium"
        >
          {index === years.length - 1 ? "The Story Begins" : "Rewinding Memories"}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
