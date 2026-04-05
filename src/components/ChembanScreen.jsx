import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChembanScreen = ({ onComplete }) => {
  const [status, setStatus] = useState('playing'); // 'playing', 'shrinking', 'completed'
  const videoRef = useRef(null);

  const handleTimeUpdate = (e) => {
    const video = e.target;
    if (video.duration - video.currentTime < 0.5 && status === 'playing') {
      setStatus('shrinking');
      setTimeout(() => {
        onComplete();
      }, 800); // Faster duration
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden">
      <AnimatePresence>
        {status !== 'completed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={
              status === 'playing' 
                ? { opacity: 1, scale: 1, width: "100vw", height: "100vh", borderRadius: "0px", y: 0 } 
                : { opacity: 0, scale: 0.1, width: "320px", height: "180px", borderRadius: "10rem", y: "60vh" }
            }
            transition={{ 
              duration: status === 'playing' ? 0.8 : 0.8, 
              ease: [0.22, 1, 0.36, 1] 
            }}
            className="relative shadow-2xl overflow-hidden bg-black flex items-center justify-center border border-white/5"
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onEnded={onComplete}
              className="w-full h-full object-cover"
            >
              <source src="/chemban-video/chemban.mp4" type="video/mp4" />
            </video>
            
            {status === 'playing' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute bottom-10 left-0 right-0 text-center"
              >
                <span className="text-white/30 text-[10px] uppercase tracking-[0.5em] font-bold">Pressing "Play" on a masterpiece...</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChembanScreen;
