import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STAGE_HEIGHT = 180; // Optimized height for all screen sizes

const YearItem = ({ year, index, activeStage, status, totalStages }) => {
  const isActive = activeStage === index;
  const isPast = activeStage > index;
  const isFinal = year === 2026;

  // Visibility logic: Final focus or current active. Past years fade Away.
  const shouldShowYear = (isActive || (isFinal && activeStage === totalStages - 1)) && !isPast;

  return (
    <div 
      className="flex flex-col items-center justify-center relative w-full"
      style={{ height: STAGE_HEIGHT }}
    >
      {/* Year Display Area */}
      <div className="relative h-20 sm:h-28 flex items-center justify-center">
        <AnimatePresence>
          {shouldShowYear && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center"
            >
              <div className="flex relative items-center">
                {year.toString().split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0, delay: 0.2 + (0.05 * i) }}
                    className={`font-code ${isFinal ? 'text-6xl sm:text-8xl text-accent' : 'text-3xl sm:text-5xl text-white/40'} w-[1.1ch] text-center leading-none tracking-wider`}
                  >
                    {char}
                  </motion.span>
                ))}

                {/* Tracking Cursor */}
                {isActive && status === 'typing' && (
                  <motion.div 
                    initial={{ left: 0 }}
                    animate={{ left: "100%" }}
                    transition={{ duration: 0.2, ease: "steps(4, end)", delay: 0.2 }}
                    className={`absolute top-0 bottom-0 ${isFinal ? 'w-2 bg-accent shadow-[0_0_20px_rgba(201,130,107,0.6)]' : 'w-1 bg-white/40'}`}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Leading Dotted Line - Grows downward from current year */}
      {!isFinal && (
        <div className="absolute top-[75%] left-1/2 -translate-x-1/2 h-24 w-1 flex items-center justify-center overflow-hidden">
          <AnimatePresence>
            {isActive && status === 'line' && (
              <motion.div 
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
                className="w-full h-full flex flex-col items-center gap-2 origin-top pt-2"
              >
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-white/20 rounded-full shrink-0" />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Final Year destination glow effect */}
      {isFinal && isActive && (
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.4, 0.3], scale: [0, 1.2, 1] }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute inset-0 m-auto w-[600px] h-[600px] bg-accent rounded-full blur-[140px] pointer-events-none z-[-1]"
        />
      )}
    </div>
  );
};

const LoadingScreen = ({ onComplete }) => {
  const years = [2022, 2023, 2024, 2025, 2026];
  const [activeStage, setActiveStage] = useState(0); 
  const [status, setStatus] = useState('typing'); 

  useEffect(() => {
    let timer;
    if (status === 'typing') {
      timer = setTimeout(() => {
        if (activeStage < years.length - 1) setStatus('line');
        else setStatus('done');
      }, 800); // Perfectly balanced (0.2s delay + 0.2s typing + 0.4s pause)
    } else if (status === 'line') {
      timer = setTimeout(() => {
        setActiveStage(prev => prev + 1);
        setStatus('typing');
      }, 500); // 500ms for line growth
    }
    return () => clearTimeout(timer);
  }, [activeStage, status, years.length]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
    >
      {/* Centering Logic: Shifting the entire timeline so the activeStage is always in the vertical middle */}
      <motion.div 
        initial={{ y: (( (years.length - 1) / 2 ) - 0) * STAGE_HEIGHT }}
        animate={{ y: (( (years.length - 1) / 2 ) - activeStage) * STAGE_HEIGHT }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="flex flex-col items-center w-full"
      >
        {years.map((year, index) => (
          <YearItem 
            key={year}
            year={year}
            index={index}
            activeStage={activeStage}
            status={status}
            totalStages={years.length}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
