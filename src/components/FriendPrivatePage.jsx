import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Check, Mic, Square, Play, Trash2, Loader2, LogOut, Camera } from 'lucide-react';
import { saveDraft } from '../utils/storage';
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
      const { saveFriendSession } = await import('../utils/storage');
      saveFriendSession({ ...session, submitted: true, submittedEntry: result });
      setSubmittedEntry(result); setIsSubmitted(true); setIsSuccessVisible(true);
    } catch (error) { alert("Failed."); } finally { setIsSubmitting(false); }
  };

  if (isSubmitted && !isSuccessVisible) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center py-12 px-6">
        <header className="w-full max-w-7xl mb-12 text-center">
            <h1 className="font-code text-4xl text-ink mb-2 lowercase">{session.name}'s story</h1>
        </header>
        <div className="w-full max-w-[95vw] lg:max-w-7xl bg-white p-8 sm:p-20 rounded-[2.5rem] shadow-2xl border border-neutral-100">
            <h3 className="font-code text-3xl text-ink mb-12">{session.name}</h3>
            <div className="flex flex-col lg:flex-row gap-16">
              <div className="flex-grow">
                 <p className="font-code text-ink text-2xl leading-relaxed">"{submittedEntry?.message || message}"</p>
                 {submittedEntry?.photo && <img src={submittedEntry.photo} className="w-full max-w-2xl rounded-2xl mt-12 shadow-lg" alt="" />}
              </div>
              {submittedEntry?.voice && (
                <div className="lg:w-80 shrink-0">
                   <div className="p-8 bg-accent/5 rounded-3xl border border-accent/10">
                      <Play className="w-6 h-6 text-accent mb-4" />
                      <audio src={submittedEntry.voice} controls className="w-full h-8" />
                   </div>
                </div>
              )}
            </div>
        </div>
        <button onClick={onSignOut} className="mt-12 text-[10px] uppercase font-bold tracking-widest text-neutral-300">Exit Workspace</button>
      </div>
    );
  }

  if (isSuccessVisible) {
     return (
        <div className="min-h-screen bg-background flex flex-col justify-center items-center text-center p-6">
           <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center text-white mb-12 shadow-2xl">
              <Check className="w-10 h-10" />
           </div>
           <h2 className="font-code text-4xl mb-16 lowercase">Story added.</h2>
           <div className="flex flex-col gap-4 w-full max-w-xs">
              <button onClick={() => setIsSuccessVisible(false)} className="w-full py-5 rounded-full border border-neutral-200 text-[11px] uppercase font-black tracking-widest text-accent">Review Story</button>
              <button onClick={onSignOut} className="w-full py-5 rounded-full border border-neutral-200 text-[11px] uppercase font-black tracking-widest text-neutral-400">Back to start</button>
           </div>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4 sm:px-6 relative">
      <header className="w-full max-w-[95vw] lg:max-w-7xl mb-12 flex flex-col items-center sm:items-start sm:px-12">
        <span className="text-[9px] uppercase tracking-[0.5em] font-black mb-2 opacity-30">Writing Room</span>
        <h1 className="font-code text-5xl md:text-8xl text-ink lowercase tracking-tighter italic">{session.name}'s page</h1>
      </header>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-[95vw] lg:max-w-7xl bg-white p-6 sm:p-16 lg:p-24 rounded-[3rem] lg:rounded-[4.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] border border-white flex flex-col min-h-[80vh] relative"
      >
        <div className="flex-grow flex flex-col">
          <div className="flex items-center gap-4 mb-12 opacity-40">
            <div className="w-16 h-[1px] bg-ink" />
            <span className="text-[9px] uppercase tracking-[0.4em] font-black">Composition</span>
          </div>
          
          <div className="relative flex-grow flex flex-col">
            <textarea
              required={!voice}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="write something .. " 
              className="w-full flex-grow bg-transparent border-none focus:ring-0 focus:outline-none text-2xl sm:text-6xl font-code text-transparent caret-accent resize-none placeholder:text-neutral-200 leading-[1.3] custom-scrollbar"
            />
            <div className="absolute inset-0 pointer-events-none whitespace-pre-wrap break-words text-2xl sm:text-6xl font-code text-ink leading-[1.3]">
              {message.split('').map((char, i) => (
                <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.1 }}>{char}</motion.span>
              ))}
              {message.length > 0 && <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="inline-block w-4 h-12 bg-accent/30 ml-2 align-middle" />}
            </div>
          </div>
        </div>

        {/* Action Row: Replaces Sidebar */}
        <div className="mt-16 pt-12 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-12">
          
          {/* Media Attachments */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => fileInputRef.current.click()} 
                className={`flex items-center gap-3 py-3 px-6 rounded-full transition-all border ${photo ? 'bg-accent/10 border-accent/20 text-accent font-black' : 'bg-neutral-50 border-neutral-100 text-neutral-400 hover:border-accent font-bold'}`}
              >
                <Camera className="w-5 h-5" />
                <span className="text-[10px] uppercase tracking-widest">{photo ? 'Photo Added' : 'Add Photo'}</span>
                <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
              </button>
              {photo && <button onClick={() => setPhoto(null)} className="text-red-300 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>}
            </div>

            <div className="flex items-center gap-6">
              {!isRecording ? (
                <button 
                  onClick={voice ? undefined : startRecording} 
                  className={`flex items-center gap-3 py-3 px-6 rounded-full transition-all border ${voice ? 'bg-accent/10 border-accent/20 text-accent font-black' : 'bg-neutral-50 border-neutral-100 text-neutral-400 hover:border-accent font-bold'}`}
                >
                  <Mic className="w-5 h-5" />
                  <span className="text-[10px] uppercase tracking-widest">{voice ? 'Voice Captured' : 'Record Voice'}</span>
                </button>
              ) : (
                <button onClick={stopRecording} className="flex items-center gap-3 py-3 px-6 rounded-full bg-red-500 text-white animate-pulse">
                  <Square className="w-5 h-5" />
                  <span className="text-[10px] uppercase font-black tracking-widest text-white">Stop Recording</span>
                </button>
              )}
              {voice && (
                <div className="flex items-center gap-4">
                  <button onClick={() => new Audio(voice).play()} className="text-[10px] uppercase font-black text-accent hover:underline">Preview</button>
                  <button onClick={deleteVoice} className="text-red-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || (!message.trim() && !voice)}
            className={`px-16 py-6 rounded-full font-code text-[14px] uppercase tracking-[0.5em] font-black transition-all shadow-2xl flex items-center gap-4 ${
              isSubmitting || (!message.trim() && !voice) 
                ? 'bg-neutral-50 text-neutral-200 cursor-not-allowed border border-neutral-100' 
                : 'bg-zinc-950 text-white hover:bg-accent ring-8 ring-transparent hover:ring-accent/10 active:scale-[0.98]'
            }`}
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {isSubmitting ? 'Syncing' : 'add my story'}
          </button>
        </div>
        
        {/* Previews */}
        <AnimatePresence>
          {(photo) && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-8">
               <div className="w-48 aspect-video rounded-2xl bg-neutral-100 overflow-hidden shadow-sm border border-neutral-200 group relative">
                  <img src={photo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

        <button 
          onClick={onSignOut} 
          className="mt-16 flex items-center gap-2 px-6 py-3 rounded-full border border-neutral-200 text-neutral-400 text-[10px] uppercase font-bold tracking-widest hover:bg-zinc-950 hover:text-white transition-all duration-300 shadow-sm"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign out
        </button>
    </div>
  );
};

export default FriendPrivatePage;
