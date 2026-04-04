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
      setTimeout(() => onLogin(), 500);
    } else {
      setError(true);
      setTimeout(() => setError(false), 800);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.section
          className="min-h-screen flex flex-col justify-center items-center px-4 bg-black w-full relative overflow-hidden"
        >
          <button 
            onClick={onClose}
            className="absolute top-12 left-12 flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-ink transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Go back
          </button>

          <motion.div
            initial={{ y: "100vh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100vh", opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl text-center px-6 py-16 sm:py-24 bg-accent rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.5)] relative overflow-hidden"
          >
            <h2 className="font-serif text-4xl sm:text-7xl text-white mb-12 sm:mb-16 flex justify-center items-center py-2">
                <span className="relative flex whitespace-pre">
                  {"Admin Login".split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 50 }}
                      animate={isClicked ? { opacity: 0, y: -50, filter: 'blur(10px)', transition: { duration: 0.3, delay: i * 0.03, ease: 'easeIn' } } : { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, delay: 0.4 + i * 0.05, ease: [0.22, 1, 0.36, 1] } }}
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
                    className="w-full bg-transparent py-4 text-center font-serif text-2xl sm:text-3xl focus:outline-none transition-colors placeholder:text-white/40 text-white relative z-10"
                    placeholder="Username"
                  />
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/20 origin-center" />
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white origin-center scale-x-0 group-focus-within:scale-x-100 transition-transform duration-700 ease-out z-20" />
                </div>

                <div className={`relative group w-full ${error ? 'animate-shake' : ''}`}>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(false); }}
                    className="w-full bg-transparent py-4 text-center font-sans text-2xl focus:outline-none transition-colors placeholder:text-white/40 text-white relative z-10 tracking-[0.5em]"
                    placeholder="••••••••"
                  />
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/20 origin-center" />
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white origin-center scale-x-0 group-focus-within:scale-x-100 transition-transform duration-700 ease-out z-20" />
                  
                  {error && (
                    <p className="text-[10px] text-zinc-950 uppercase tracking-widest mt-4 text-center absolute -bottom-8 w-full font-bold">
                      Invalid credentials
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className={`group relative overflow-hidden w-full px-10 sm:px-16 py-4 sm:py-6 bg-zinc-950 font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-black transition-all shadow-2xl rounded-full border border-transparent flex items-center justify-center ${
                    isClicked 
                      ? 'shadow-none scale-[0.98]' 
                      : 'hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)]'
                  }`}
                >
                  <div 
                    className={`absolute bottom-0 left-0 w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0 ${
                      isClicked ? 'h-full bg-white' : 'h-0 bg-white'
                    }`} 
                  />
                  <span className="relative z-10 flex items-center justify-center w-full font-black">
                    {"Enter".split('').map((char, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 1, y: 0 }}
                        animate={
                          isClicked 
                            ? { opacity: 0, y: -30, filter: 'blur(5px)', transition: { duration: 0.3, delay: 0.2 + i * 0.03, ease: 'easeIn' } }
                            : { opacity: 1, y: 0 }
                        }
                        className={`inline-block whitespace-pre transition-colors duration-300 ${isClicked ? 'text-black' : 'text-white'}`}
                      >
                        {char}
                      </motion.span>
                    ))}
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
