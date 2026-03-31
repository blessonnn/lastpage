import React from 'react';
import { motion } from 'framer-motion';

const YearItem = ({ year, delay, showLine, isLast }) => {
  const digits = year.toString().split("");
  
  return (
    <div className="flex flex-col items-center relative">
      {/* Typewriter reveal of the year */}
      <div className="relative flex items-center h-16">
        <motion.div 
          initial={{ opacity: 1 }}
          animate={isLast ? { opacity: 1 } : { opacity: [1, 1, 0] }}
          transition={isLast ? {} : { duration: 0.5, delay: delay + 0.8 }}
          className="flex"
        >
          {digits.map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0, delay: delay + (0.1 * i) }}
              className={`font-dot ${isLast ? 'text-7xl sm:text-8xl text-accent' : 'text-4xl text-white/40'} w-[1.1ch] text-center`}
            >
              {char}
            </motion.span>
          ))}
        </motion.div>

        {/* Stepped Cursor */}
        <motion.div 
          initial={{ x: 0, opacity: 0 }}
          animate={{ 
            x: "4.4ch",
            opacity: [0, 1, 1, 0] 
          }}
          transition={{ 
            x: { duration: 0.4, ease: "steps(4, end)", delay: delay },
            opacity: { duration: 0.6, times: [0, 0.1, 0.8, 1], delay: delay }
          }}
          className={`absolute left-0 top-0 bottom-0 ${isLast ? 'w-2 bg-accent shadow-[0_0_15px_rgba(201,130,107,0.5)]' : 'w-1 bg-white/40'}`}
        />
      </div>

      {/* Growing Dotted Line downwards */}
      {showLine && (
        <div className="h-20 w-1 relative my-2 overflow-hidden">
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ duration: 0.6, delay: delay + 0.5, ease: "easeInOut" }}
            className="w-full flex flex-col items-center gap-2"
          >
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-white/20 rounded-full shrink-0" />
            ))}
          </motion.div>
        </div>
      )}
      
      {/* 2026 Background Glow */}
      {isLast && (
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.4, 0], scale: [0, 1.2, 2.5] }}
          transition={{ duration: 1.5, times: [0, 0.7, 1], delay: delay }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent rounded-full blur-[140px] pointer-events-none z-[-1]"
        />
      )}
    </div>
  );
};

const LoadingScreen = ({ onComplete }) => {
  const years = [2022, 2023, 2024, 2025, 2026];
  const STAGE_GAP = 1.3; // Calibrated for smooth typewriter + line growth

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-start overflow-hidden pt-[15vh] landscape:pt-[5vh]"
    >
      <div className="flex flex-col items-center">
        {years.map((year, index) => (
          <YearItem 
            key={year}
            year={year}
            delay={index * STAGE_GAP}
            showLine={index < years.length - 1}
            isLast={index === years.length - 1}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
