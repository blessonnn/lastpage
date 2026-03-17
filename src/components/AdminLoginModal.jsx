import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';

const AdminLoginModal = ({ isOpen, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const ADMIN_PASSWORD = "lastpage2025";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 800);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-background/90"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md bg-white p-12 shadow-2xl relative paper-grain border border-neutral-200"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-neutral-400 hover:text-ink transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="font-serif text-4xl text-ink mb-12 text-center">Admin Access</h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className={`relative ${error ? 'animate-shake' : ''}`}>
                <input
                  type="password"
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-neutral-200 py-4 text-center font-sans text-2xl focus:outline-none focus:border-ink transition-colors placeholder:text-neutral-200 tracking-[0.5em]"
                  placeholder="••••••••"
                />
                {error && (
                  <p className="text-[10px] text-red-500 uppercase tracking-widest mt-4 text-center">
                    Incorrect password
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-ink text-background py-6 font-sans text-xs uppercase tracking-[0.2em] font-bold hover:bg-gold transition-colors flex items-center justify-center gap-3"
              >
                Enter <ArrowRight className="w-4 h-4" />
              </button>

              <button 
                type="button"
                onClick={onClose}
                className="w-full text-[10px] uppercase tracking-widest text-neutral-400 hover:text-ink transition-colors mt-4"
              >
                Go back
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminLoginModal;
