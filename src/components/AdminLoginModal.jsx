import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const AdminLoginModal = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() === 'Blessonjfjf' && password === 'Blesson@123123') {
      setIsClicked(true);
      setTimeout(() => onLogin(), 300);
    } else {
      setError(true);
      setTimeout(() => setError(false), 800);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="min-h-screen flex flex-col justify-center items-center px-4 bg-background paper-grain w-full relative"
        >
          <button 
            onClick={onClose}
            className="absolute top-12 left-12 flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-ink transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Go back
          </button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-xl text-center px-4"
          >
            <h2 className="font-serif text-4xl sm:text-7xl text-ink mb-12 sm:mb-16 flex justify-center items-center py-2">
                <span className="relative flex whitespace-pre">
                  {"Admin Login".split('').map((char, i) => (
                    <motion.span
                      key={i}
                      animate={isClicked ? { opacity: 0, y: -50, filter: 'blur(10px)', transition: { duration: 0.3, delay: i * 0.03, ease: 'easeIn' } } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-12 max-w-sm mx-auto">
              <div className="space-y-8">
                <div className={`relative group w-full ${error ? 'animate-shake' : ''}`}>
                  <input
                    type="text"
                    autoFocus
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(false); }}
                    className="w-full bg-transparent py-4 text-center font-serif text-2xl sm:text-3xl focus:outline-none transition-colors placeholder:text-neutral-200 relative z-10"
                    placeholder="Username"
                  />
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-neutral-200 origin-center" />
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent origin-center scale-x-0 group-focus-within:scale-x-100 transition-transform duration-700 ease-out z-20" />
                </div>

                <div className={`relative group w-full ${error ? 'animate-shake' : ''}`}>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(false); }}
                    className="w-full bg-transparent py-4 text-center font-sans text-2xl focus:outline-none transition-colors placeholder:text-neutral-200 relative z-10 tracking-[0.5em]"
                    placeholder="••••••••"
                  />
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-neutral-200 origin-center" />
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent origin-center scale-x-0 group-focus-within:scale-x-100 transition-transform duration-700 ease-out z-20" />
                  
                  {error && (
                    <p className="text-[10px] text-red-500 uppercase tracking-widest mt-4 text-center absolute -bottom-8 w-full">
                      Invalid credentials
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className={`group relative overflow-hidden w-full px-10 sm:px-16 py-4 sm:py-6 bg-zinc-950 font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.4em] font-black transition-all shadow-2xl rounded-full border border-transparent ${
                    isClicked 
                      ? 'translate-y-1 scale-[0.98] shadow-none' 
                      : 'hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)]'
                  }`}
                >
                  <div 
                    className={`absolute bottom-0 left-0 w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0 ${
                      isClicked ? 'h-full bg-white' : 'h-0 bg-white'
                    }`} 
                  />
                  <span className={`relative z-10 transition-colors duration-500 ${isClicked ? 'text-black' : 'text-white'}`}>
                    Enter
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default AdminLoginModal;
