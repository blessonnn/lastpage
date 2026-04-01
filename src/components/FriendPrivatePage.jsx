import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Check, Mic, Square, Play, Trash2, Loader2, LogOut, Camera, Heart } from 'lucide-react';
import { saveDraft, saveFriendSession } from '../utils/storage';
import { submitEntry } from '../utils/firebaseService';

const FriendPrivatePage = ({ session, onSignOut }) => {
  const [message, setMessage] = useState(session.draft_message || '');
  const [photo, setPhoto] = useState(session.draft_photo || null);
  const [voice, setVoice] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(session.submitted || false);
  const [submittedEntry, setSubmittedEntry] = useState(session.submittedEntry || null);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSpecialMessage, setShowSpecialMessage] = useState(false);

  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

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
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => { setVoice(reader.result); setAudioUrl(URL.createObjectURL(audioBlob)); };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) { alert("Mic required."); }
  };

  const stopRecording = () => { if (mediaRecorderRef.current) mediaRecorderRef.current.stop(); setIsRecording(false); };
  const deleteVoice = () => { setVoice(null); setAudioUrl(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !voice && !isSubmitting) return;
    setIsSubmitting(true);
    try {
      const entry = { name: session.name, message, photo, voice };
      const result = await submitEntry(entry);
      saveFriendSession({ ...session, submitted: true, submittedEntry: result });
      setSubmittedEntry(result); setIsSubmitted(true); setIsSuccessVisible(true);
    } catch (error) { alert("Failed."); } finally { setIsSubmitting(false); }
  };

  if (isSubmitted && !isSuccessVisible && !showSpecialMessage) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center py-12 px-6">
        <header className="w-full max-w-7xl mb-12 text-center text-ink/30 font-code text-[10px] uppercase tracking-[0.6em]">Mark of {session.name}</header>
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-5xl bg-white p-12 sm:p-24 rounded-[3rem] shadow-2xl border border-neutral-100 flex flex-col gap-12">
            <h3 className="font-code text-4xl text-ink mb-4 italic">{session.name}</h3>
            <div className="flex flex-col lg:flex-row gap-20">
               <div className="flex-grow">
                  <p className="font-code text-ink text-3xl leading-relaxed">"{submittedEntry?.message || message}"</p>
                  {submittedEntry?.photo && <img src={submittedEntry.photo} className="w-full max-w-2xl rounded-2xl mt-12 shadow-md hover:scale-[1.02] transition-transform duration-700" alt="" />}
               </div>
               <div className="lg:w-80 shrink-0">
                  {submittedEntry?.voice && (
                    <div className="p-8 bg-accent/5 rounded-3xl border border-accent/10">
                       <Play className="w-6 h-6 text-accent mb-6" />
                       <p className="text-[9px] uppercase font-bold tracking-widest text-accent mb-4">Voice Entry</p>
                       <audio src={submittedEntry.voice} controls className="w-full h-8" />
                    </div>
                  )}
                  <div className="mt-12 text-[10px] uppercase font-bold tracking-[0.3em] text-neutral-200">{new Date(submittedEntry?.submittedAt).toLocaleDateString()}</div>
               </div>
            </div>
            <div className="mt-20 pt-12 border-t border-neutral-50 flex items-center justify-between">
              <button 
                onClick={() => setShowSpecialMessage(true)} 
                className="group flex items-center gap-3 px-8 py-5 rounded-full bg-accent text-white font-code text-[11px] uppercase tracking-[0.4em] font-black hover:bg-zinc-950 transition-all shadow-xl shadow-accent/20"
              >
                <Heart className="w-4 h-4 fill-current group-hover:scale-125 transition-transform" />
                From Me, To You
              </button>
              <button onClick={onSignOut} className="text-[10px] uppercase font-bold tracking-widest text-neutral-300 hover:text-ink transition-colors">Sign out</button>
            </div>
        </motion.div>
      </div>
    );
  }

  // Final Special Message View
  if (showSpecialMessage) {
    return <SpecialMessage session={session} onBack={() => setShowSpecialMessage(false)} onSignOut={onSignOut} />;
  }

  if (isSuccessVisible) {
     return (
        <div className="min-h-screen bg-background flex flex-col justify-center items-center text-center p-6">
           <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center text-white mb-12 shadow-2xl">
              <Check className="w-10 h-10" />
           </div>
           <h2 className="font-code text-5xl mb-20 lowercase tracking-tighter italic">Story preserved.</h2>
           <div className="flex flex-col gap-5 w-full max-w-sm">
              <button onClick={() => setIsSuccessVisible(false)} className="w-full py-6 rounded-full border border-neutral-200 text-[12px] uppercase font-black tracking-[0.3em] text-accent hover:bg-accent/5 transition-all">Review marked story</button>
              <button onClick={() => setShowSpecialMessage(true)} className="w-full py-6 rounded-full bg-accent text-white text-[12px] uppercase font-black tracking-[0.3em] shadow-xl shadow-accent/20">From Me, To You</button>
              <button onClick={onSignOut} className="w-full py-6 rounded-full border border-neutral-100 text-[12px] uppercase font-black tracking-[0.3em] text-neutral-300">Exit book</button>
           </div>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4 sm:px-6 relative">
      <header className="w-full max-w-[95vw] lg:max-w-7xl mb-12 flex flex-col items-center sm:items-start sm:px-12">
        <span className="text-[9px] uppercase tracking-[0.5em] font-black mb-2 opacity-30">Writing Room</span>
        <h1 className="font-code text-6xl md:text-8xl text-ink lowercase tracking-tighter italic drop-shadow-sm">{session.name}'s page</h1>
      </header>

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[95vw] lg:max-w-7xl bg-white p-6 sm:p-20 lg:p-28 rounded-[4rem] lg:rounded-[5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.06)] border border-white flex flex-col min-h-[80vh] relative">
        <div className="flex-grow flex flex-col">
          <div className="flex items-center gap-4 mb-16 opacity-30">
            <div className="w-20 h-[1.5px] bg-ink" />
            <span className="text-[10px] uppercase tracking-widest font-black">Composition Area</span>
          </div>
          
          <div className="relative flex-grow flex flex-col">
            <textarea
              required={!voice}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="write something .. " 
              className="w-full flex-grow bg-transparent border-none focus:ring-0 focus:outline-none text-2xl sm:text-6xl font-code text-transparent caret-accent resize-none placeholder:text-neutral-200 leading-tight custom-scrollbar"
            />
            <div className="absolute inset-0 pointer-events-none whitespace-pre-wrap break-words text-2xl sm:text-6xl font-code text-ink leading-tight">
              {message.split('').map((char, i) => (
                <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.1 }}>{char}</motion.span>
              ))}
              {message.length > 0 && <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity, ease: "steps(2)" }} className="inline-block w-[0.2em] h-[0.9em] bg-accent ml-2 align-middle shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]" />}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-16 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-16">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-8">
              <button 
                onClick={() => fileInputRef.current.click()} 
                className={`flex items-center gap-4 py-4 px-8 rounded-full transition-all border ${photo ? 'bg-accent text-white shadow-xl shadow-accent/20' : 'bg-neutral-50 border-neutral-100 text-neutral-400 hover:border-accent hover:bg-neutral-100'}`}
              >
                <Camera className="w-6 h-6" />
                <span className="text-[11px] uppercase font-black tracking-widest">{photo ? 'Photo Attached' : 'Add Image'}</span>
                <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
              </button>
              {photo && <button onClick={() => setPhoto(null)} className="text-red-300 hover:text-red-500 hover:scale-110 transition-all"><X className="w-6 h-6" /></button>}
            </div>

            <div className="flex items-center gap-8">
              {!isRecording ? (
                <button onClick={voice ? undefined : startRecording} className={`flex items-center gap-4 py-4 px-8 rounded-full transition-all border ${voice ? 'bg-accent text-white shadow-xl shadow-accent/20' : 'bg-neutral-50 border-neutral-100 text-neutral-400 hover:border-accent hover:bg-neutral-100'}`}>
                  <Mic className="w-6 h-6" />
                  <span className="text-[11px] uppercase font-black tracking-widest">{voice ? 'Voice Captured' : 'Record Voice'}</span>
                </button>
              ) : (
                <button onClick={stopRecording} className="flex items-center gap-4 py-4 px-8 rounded-full bg-red-500 text-white animate-pulse shadow-xl shadow-red-500/30">
                  <Square className="w-6 h-6" />
                  <span className="text-[11px] uppercase font-black tracking-widest">End Capture</span>
                </button>
              )}
              {voice && (
                <div className="flex items-center gap-6">
                  <button onClick={() => new Audio(voice).play()} className="text-[11px] uppercase font-black text-accent hover:underline tracking-widest">Preview</button>
                  <button onClick={deleteVoice} className="text-red-300 hover:text-red-500 hover:scale-110 transition-all"><Trash2 className="w-6 h-6" /></button>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || (!message.trim() && !voice)}
            className={`px-20 py-7 rounded-full font-code text-[15px] uppercase tracking-[0.5em] font-black transition-all shadow-2xl flex items-center gap-5 ${
              isSubmitting || (!message.trim() && !voice) 
                ? 'bg-neutral-100 text-neutral-200 cursor-not-allowed' 
                : 'bg-zinc-950 text-white hover:bg-accent ring-[10px] ring-transparent hover:ring-accent/10 active:scale-[0.98]'
            }`}
          >
            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : null}
            {isSubmitting ? 'Syncing...' : 'add my story'}
          </button>
        </div>
      </motion.div>

      <button onClick={onSignOut} className="mt-16 text-[10px] uppercase tracking-[0.6em] text-neutral-300 hover:text-ink font-black bg-white/50 backdrop-blur-md px-10 py-5 rounded-full border border-neutral-100 transition-all">Relinquish control</button>
    </div>
  );
};

// --- Sub-component for the Special "From Me, To You" Message ---
const SpecialMessage = ({ session, onBack, onSignOut }) => {
  const [displayText, setDisplayText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  
  const bodyText = `This has been the best chapter of my life, and I have you to thank for making it so incredible. You weren’t just a teammate or a classmate; you were my constant. I’m walking away with a degree, but I’m staying for this friendship. Let’s make sure this story never ends.`;
  const signature = "by Blesson";
  const fullText = `${session.name},\n\n${bodyText}\n\n${signature}`;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayText(fullText.slice(0, i + 1));
        i++;
      } else {
        setIsTypingComplete(true);
        clearInterval(interval);
      }
    }, 40); // Snappy high-end reveal
    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-6 text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(var(--accent-rgb),0.1)_0%,_transparent_100%)] pointer-events-none" />
      
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="w-full max-w-4xl bg-white/5 backdrop-blur-3xl p-12 sm:p-24 rounded-[4rem] border border-white/10 shadow-3xl relative">
        <div className="relative font-code text-2xl sm:text-4xl leading-relaxed whitespace-pre-wrap">
          {displayText}
          <motion.span animate={{ opacity: isTypingComplete ? [0.2, 0] : [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity, ease: "steps(2)" }} className="inline-block w-[0.1em] h-[0.9em] bg-accent ml-2 align-middle" />
        </div>
        
        <div className="mt-20 flex items-center justify-between">
           <button onClick={onBack} className="text-[10px] uppercase font-bold tracking-[0.5em] text-white/30 hover:text-accent transition-colors">Go Back</button>
           <button onClick={onSignOut} className="px-10 py-5 rounded-full border border-white/10 text-[10px] uppercase font-bold tracking-[0.5em] hover:bg-white hover:text-black transition-all">Sign Out</button>
        </div>
      </motion.div>
    </div>
  );
};

export default FriendPrivatePage;
