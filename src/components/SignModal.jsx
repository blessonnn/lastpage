import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const SignModal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !message) return;
    
    setIsSubmitting(true);
    await onSubmit({ name, message });
    setIsSubmitting(false);
    
    // Clear and close
    setName('');
    setMessage('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 md:p-24 backdrop-blur-xl bg-background/80"
        >
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-2xl bg-white p-12 shadow-2xl relative paper-grain border border-neutral-200"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-neutral-400 hover:text-ink transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="font-serif text-4xl text-ink mb-12">Sign the book</h2>

            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="relative group">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border-b border-neutral-200 py-4 font-serif text-2xl focus:outline-none focus:border-accent transition-colors placeholder:text-neutral-300"
                  placeholder="Your Name"
                />
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-focus-within:w-full" />
              </div>

              <div className="relative group">
                <textarea
                  required
                  rows={4}
                  maxLength={500}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-transparent border-b border-neutral-200 py-4 font-sans text-lg focus:outline-none focus:border-accent transition-colors placeholder:text-neutral-300 resize-none"
                  placeholder="Your message for the class..."
                />
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-focus-within:w-full" />
                <div className="text-[10px] text-neutral-400 mt-2 text-right tracking-widest">
                  {message.length} / 500
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-ink text-background py-6 font-sans text-sm uppercase tracking-[0.2em] font-bold hover:bg-accent transition-colors relative overflow-hidden group rounded-full"
              >
                <span className={isSubmitting ? 'opacity-0' : 'opacity-100'}>
                  Leave your mark
                </span>
                {isSubmitting && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  </div>
                )}
                <div className="absolute inset-0 pointer-events-none bg-accent opacity-0 group-active:opacity-100 animate-ink-splash" />
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SignModal;
