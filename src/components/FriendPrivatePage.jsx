import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Check } from 'lucide-react';
import { saveDraft } from '../utils/storage';
import { submitEntry } from '../utils/firebaseService';

const FriendPrivatePage = ({ session, onSignOut }) => {
  const [message, setMessage] = useState(session.draft_message || '');
  const [photo, setPhoto] = useState(session.draft_photo || null);
  const [isSubmitted, setIsSubmitted] = useState(session.submitted || false);
  const [submittedEntry, setSubmittedEntry] = useState(session.submittedEntry || null);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Auto-save draft
  useEffect(() => {
    if (!isSubmitted) {
      const timer = setTimeout(() => {
        saveDraft(message, photo);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [message, photo, isSubmitted]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const entry = {
        name: session.name,
        message,
        photo
      };

      const result = await submitEntry(entry);
      
      // Update local session
      const { saveFriendSession } = await import('../utils/storage');
      saveFriendSession({ ...session, submitted: true, submittedEntry: result });

      setSubmittedEntry(result);
      setIsSubmitted(true);
      setIsSuccessVisible(true);
    } catch (error) {
      alert("Submission failed. Please check your internet connection and try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted && !isSuccessVisible) {
    return (
      <div className="min-h-screen bg-background p-12 flex flex-col items-center">
        <header className="max-w-xl w-full mb-24 text-center">
          <h1 className="font-serif text-5xl text-ink mb-4">{session.name}'s page</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold">You've already signed. Thank you.</p>
        </header>
        
        <div className="w-full max-w-xl bg-white p-12 shadow-sm border border-neutral-200 paper-grain relative">
          <div className="absolute top-0 right-0 p-4">
             <span className="text-[10px] text-neutral-300 uppercase tracking-widest italic opacity-50 font-sans">Read-only view</span>
          </div>
          
          <h3 className="font-serif text-3xl text-ink mb-8">{session.name}</h3>
          
          {submittedEntry?.photo && (
            <img src={submittedEntry.photo} className="w-full h-auto rounded-lg mb-8 shadow-sm grayscale-[20%] hover:grayscale-0 transition-all duration-700" alt="Memory" />
          )}
          
          <p className="font-sans text-ink-muted text-lg leading-relaxed mb-8 italic">
            "{submittedEntry?.message || message}"
          </p>
          
          <div className="text-[10px] uppercase tracking-widest text-neutral-400">
            {new Date(submittedEntry?.submittedAt).toLocaleDateString()}
          </div>
        </div>

        <button 
          onClick={onSignOut}
          className="mt-24 text-[10px] uppercase tracking-widest text-neutral-300 hover:text-ink transition-colors"
        >
          Sign out
        </button>
      </div>
    );
  }

  if (isSuccessVisible) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background flex flex-col justify-center items-center text-center p-6"
      >
        <div className="wax-seal-pop mb-12 relative">
          <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="48" fill="#C9826B" />
            <path d="M35 50L45 60L65 40" stroke="white" strokeWidth="4" strokeLinecap="round" />
            <circle cx="50" cy="50" r="42" stroke="white" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
          </svg>
        </div>
        <h2 className="font-serif text-5xl text-ink mb-4">Your page has been saved.</h2>
        <p className="font-serif italic text-xl text-neutral-400">"See you on the other side."</p>
        <button 
          onClick={() => setIsSuccessVisible(false)}
          className="mt-16 text-[10px] uppercase tracking-widest text-accent font-bold hover:text-ink transition-colors"
        >
          View your entry
        </button>
        <button 
          onClick={onSignOut}
          className="mt-6 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-ink transition-colors"
        >
          Go back to front page
        </button>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-24 px-6 relative">
      <header className="max-w-2xl w-full mb-24 text-center">
        <h1 className="font-serif text-7xl md:text-8xl text-ink mb-4">{session.name}'s page</h1>
        <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400">Only you can see this.</p>
      </header>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-24">
        {/* Section A: Write */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent mb-6 block">Your message</label>
          <div className="relative w-full rounded-[12px] bg-white shadow-sm overflow-hidden" style={{ minHeight: '300px' }}>
            <textarea
              required
              rows={10}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onScroll={(e) => {
                const overlay = document.getElementById('typewriter-overlay');
                if (overlay) overlay.scrollTop = e.target.scrollTop;
              }}
              className="absolute inset-0 w-full h-full border-none focus:ring-0 focus:outline-none text-2xl font-serif italic leading-[1.6] text-transparent caret-ink resize-none p-8 z-10 bg-transparent"
              spellCheck={false}
            />
            <div 
              id="typewriter-overlay"
              className="absolute inset-0 w-full h-full p-8 text-2xl font-serif italic leading-[1.6] text-ink-muted pointer-events-none whitespace-pre-wrap break-words overflow-hidden"
              aria-hidden="true"
            >
              {message === '' ? (
                <span className="text-neutral-300">Write anything. A memory, a wish, a joke...</span>
              ) : (
                message.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1 }}
                  >
                    {char}
                  </motion.span>
                ))
              )}
            </div>
          </div>
        </motion.section>

        {/* Section B: Photo */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent mb-6 block">Add a photo (optional)</label>
          {photo ? (
            <div className="relative group rounded-xl overflow-hidden shadow-2xl">
              <img src={photo} className="w-full h-auto grayscale-[30%] group-hover:grayscale-0 transition-all duration-700" alt="Preview" />
              <button 
                type="button"
                onClick={() => setPhoto(null)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full hover:bg-white transition-colors shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed border-neutral-200 rounded-xl p-16 flex flex-col items-center justify-center cursor-pointer hover:border-accent group transition-colors bg-white/50"
            >
              <Upload className="w-12 h-12 text-neutral-200 group-hover:text-accent transition-colors mb-4" />
              <span className="font-sans text-sm text-neutral-400 group-hover:text-ink transition-colors">Drop a photo here or tap to upload</span>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                className="hidden" 
                accept="image/*"
              />
            </div>
          )}
        </motion.section>

        {/* Section C: Submit */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="pb-24"
        >
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${isSubmitting ? 'bg-neutral-300' : 'bg-accent hover:bg-gold'} text-white py-8 font-sans text-sm uppercase tracking-[0.3em] font-bold transition-all shadow-2xl relative overflow-hidden group rounded-full`}
          >
            <span className="relative z-10">{isSubmitting ? 'Preserving memory...' : 'Leave your mark'}</span>
            {!isSubmitting && <div className="absolute inset-0 pointer-events-none bg-ink opacity-0 group-active:opacity-20 animate-ink-splash" />}
          </button>
        </motion.section>
      </form>
    </div>
  );
};

export default FriendPrivatePage;
