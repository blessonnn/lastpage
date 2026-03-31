import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const YearItem = ({ year, index, activeStage, status, totalStages }) => {
  const isActive = activeStage === index;
  const isPast = activeStage > index;
  const isFinal = year === 2026;

  // Final 2026 should be visible permanently once reached
  const isVisibleAtEnd = isFinal && activeStage === totalStages - 1;
  const isCurrentlyActive = isActive;
  
  // Year visibility logic: 
  // - Show if active or if it's the final year at the end
  // - Fade out if past and not the final year
  const shouldShowYear = (isCurrentlyActive || isVisibleAtEnd) && !isPast;

  // Dotted lines fade out once the "past" state is reached
  const shouldShowLineBelow = isActive && status === 'line';

  return (
    <div className="flex flex-col items-center relative">
      <div className="relative h-16 sm:h-24 flex items-center">
        <AnimatePresence>
          {shouldShowYear && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="relative flex items-center"
            >
              <div className="flex relative">
                {year.toString().split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0, delay: 0.1 * i }}
                    className={`font-dot ${isFinal ? 'text-6xl sm:text-8xl text-accent' : 'text-3xl sm:text-5xl text-white/30'} w-[1.1ch] text-center`}
                  >
                    {char}
                  </motion.span>
                ))}

                {/* Accurate Cursor */}
                {isActive && status === 'typing' && (
                  <motion.div 
                    initial={{ left: 0 }}
                    animate={{ left: "100%" }}
                    transition={{ duration: 0.4, ease: "steps(4, end)" }}
                    className={`absolute top-0 bottom-0 ${isFinal ? 'w-2 bg-accent shadow-[0_0_20px_rgba(201,130,107,0.6)]' : 'w-1 bg-white/30'}`}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dotted Line Leading downwards - Fades out once past */}
      {!isFinal && (
        <div className="h-24 w-1 relative overflow-hidden my-2">
          <AnimatePresence>
            {shouldShowLineBelow && (
              <motion.div 
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ 
                  scaleY: { duration: 0.8, ease: "easeInOut" },
                  opacity: { duration: 0.3 }
                }}
                className="w-full h-full flex flex-col items-center gap-2 origin-top py-1"
              >
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-white/20 rounded-full shrink-0 shadow-[0_0_5px_rgba(255,255,255,0.1)]" />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Destination Final Polish Glow */}
      {isFinal && isCurrentlyActive && (
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.4, 0.3], scale: [0, 1.2, 1] }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent rounded-full blur-[140px] pointer-events-none z-[-1]"
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
        if (activeStage < years.length - 1) {
          setStatus('line');
        } else {
          setStatus('done');
        }
      }, 1200); 
    } else if (status === 'line') {
      timer = setTimeout(() => {
        setActiveStage(prev => prev + 1);
        setStatus('typing');
      }, 1000); 
    }

    return () => clearTimeout(timer);
  }, [activeStage, status, years.length]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
    >
      <div className="flex flex-col items-center">
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
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
