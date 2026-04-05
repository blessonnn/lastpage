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

  // Typewriter States for Title and Placeholder
  const [titleDisplay, setTitleDisplay] = useState("");
  const [titleDone, setTitleDone] = useState(false);
  const [placeholderDisplay, setPlaceholderDisplay] = useState("");
  const [placeholderDone, setPlaceholderDone] = useState(false);

  // Typewriter State for Success Screen
  const successTitleText = " Your story saved in both system and my heart";
  const [successTitleDisplay, setSuccessTitleDisplay] = useState("");
  const [successTitleDone, setSuccessTitleDone] = useState(false);

  const [activeEmojis, setActiveEmojis] = useState([]);
  const nameLower = session.name.trim().toLowerCase();
  const isMegha = nameLower.includes('megha');
  
  const spawnEmoji = () => {
    if (!isMegha) return;
    const emojis = ['💖', '💗', '💓', '💞', '💕', '🌸', '🌷', '✨'];
    const newEmoji = {
      id: Date.now() + Math.random(),
      char: emojis[Math.floor(Math.random() * emojis.length)],
      x: (Math.random() - 0.5) * 40, // Random drift left/right
      y: -20 - Math.random() * 40     // Random height
    };
    setActiveEmojis(prev => [...prev, newEmoji]);
    setTimeout(() => {
      setActiveEmojis(prev => prev.filter(e => e.id !== newEmoji.id));
    }, 800);
  };

  const isSpecialName = ['gopi', 'gopikrishna', 'akshara'].includes(nameLower);
  const isAswin = nameLower.includes('aswin') || nameLower.includes('ashwin');
  const isSreelakshmi = nameLower.includes('sreelakshmi') || nameLower.includes('sree');
  const isAbhijithJR = nameLower.includes('abhijith j') || nameLower === 'abhijith jr';
  const isAbhijithSV = nameLower.includes('abhijith s') || nameLower === 'abhijith sv';
  const isAswanth = nameLower.includes('aswanth');
  const isAmal = nameLower.includes('amal');
  const isMishal = nameLower.includes('mishal');
  const isAysha = nameLower.includes('aysha');
  const isShamila = nameLower.includes('shamila');

  const formattedName = session.name.trim().charAt(0).toUpperCase() + session.name.trim().slice(1).toLowerCase();

  let placeholderPrefix = formattedName;
  if (isAbhijithJR) {
    placeholderPrefix = "chemban";
  } else if (isAbhijithSV) {
    placeholderPrefix = "Bloppan";
  } else if (isAswin) {
    placeholderPrefix = "pacha";
  } else if (isSreelakshmi) {
    placeholderPrefix = "leshman";
  } else if (isAswanth) {
    placeholderPrefix = "suttu";
  } else if (isAmal) {
    placeholderPrefix = "Allu";
  } else if (isMishal) {
    placeholderPrefix = "Goat";
  } else if (isAysha) {
    placeholderPrefix = "SGPA 10";
  } else if (isShamila) {
    placeholderPrefix = "chamala";
  } else if (isSpecialName) {
    placeholderPrefix = "Hey, Rep";
  }
  
  const fullTitle = `${formattedName}'s page`;
  const fullPlaceholder = `${placeholderPrefix}, write something .. `;

  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    // Title Typewriter
    let i = 0;
    const titleInterval = setInterval(() => {
      if (i < fullTitle.length) {
        setTitleDisplay(fullTitle.slice(0, i + 1));
        i++;
      } else {
        setTitleDone(true);
        clearInterval(titleInterval);
      }
    }, 60);

    // Placeholder Typewriter (slightly delayed)
    let j = 0;
    const placeholderInterval = setInterval(() => {
      if (j < fullPlaceholder.length) {
        setPlaceholderDisplay(fullPlaceholder.slice(0, j + 1));
        j++;
      } else {
        setPlaceholderDone(true);
        clearInterval(placeholderInterval);
      }
    }, 40);

    return () => {
      clearInterval(titleInterval);
      clearInterval(placeholderInterval);
    };
  }, [fullTitle, fullPlaceholder]);

  useEffect(() => {
    if (!isSubmitted) {
      const timer = setTimeout(() => {
        saveDraft(message, photo);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [message, photo, isSubmitted]);

  useEffect(() => {
    if (isSuccessVisible) {
      let i = 0;
      setSuccessTitleDisplay("");
      setSuccessTitleDone(false);
      const interval = setInterval(() => {
        if (i < successTitleText.length) {
          setSuccessTitleDisplay(successTitleText.slice(0, i + 1));
          i++;
        } else {
          setSuccessTitleDone(true);
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isSuccessVisible, successTitleText]);

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
                className="group flex items-center gap-3 px-8 py-4 rounded-full bg-accent text-white font-code text-[11px] uppercase tracking-[0.4em] font-black hover:bg-zinc-950 transition-all shadow-xl shadow-accent/20"
              >
                <Heart className="w-3.5 h-3.5 fill-current group-hover:scale-125 transition-transform" />
                From Me, To You
              </button>
              <button onClick={onSignOut} className="text-[10px] uppercase font-bold tracking-widest text-neutral-300 hover:text-ink transition-colors">Sign out</button>
            </div>
        </motion.div>
      </div>
    );
  }

  if (showSpecialMessage) {
    return <SpecialMessage session={session} onBack={() => setShowSpecialMessage(false)} onSignOut={onSignOut} />;
  }

  if (isSuccessVisible) {
     return (
        <div className="min-h-screen bg-background flex flex-col justify-center items-center text-center p-6">
           <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center text-white mb-12 shadow-2xl">
              <Check className="w-10 h-10" />
           </div>
           <h2 className="font-code text-3xl sm:text-4xl md:text-5xl mb-20 lowercase tracking-tighter italic max-w-2xl min-h-[4rem] text-center">
             {successTitleDisplay}
             {!successTitleDone && (
                <motion.span 
                  animate={{ opacity: [1, 0, 1] }} 
                  transition={{ duration: 0.8, repeat: Infinity, ease: "steps(2)" }} 
                  className="inline-block w-[0.3em] h-[0.9em] bg-ink ml-1 align-middle"
                />
             )}
           </h2>
           <div className="flex flex-col gap-5 w-full max-w-sm">
              <button onClick={() => setIsSuccessVisible(false)} className="w-full py-6 rounded-full border border-neutral-200 text-[12px] uppercase font-black tracking-[0.3em] text-accent hover:bg-accent/5 transition-all">Review marked story</button>
              <button onClick={() => setShowSpecialMessage(true)} className="w-full py-6 rounded-full bg-accent text-white text-[12px] uppercase font-black tracking-[0.3em] shadow-xl shadow-accent/20">From Me, To You</button>
              <button onClick={onSignOut} className="w-full py-6 rounded-full border border-neutral-100 text-[12px] uppercase font-black tracking-[0.3em] text-neutral-300">Exit book</button>
           </div>
        </div>
     );
  }

  return (
    <div 
      className={`h-[100dvh] sm:h-auto sm:min-h-screen overflow-hidden sm:overflow-visible flex flex-col items-center py-4 sm:py-12 px-3 sm:px-6 relative ${!isMegha ? 'bg-background' : ''}`}
      style={isMegha ? { 
        backgroundImage: "url('/wallpaper/wallpaper.png')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      } : {}}
    >
      <header className="w-full max-w-[95vw] lg:max-w-7xl mb-4 sm:mb-12 flex flex-col items-center sm:items-start sm:px-12 shrink-0">
        <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.5em] font-black mb-1 sm:mb-2 opacity-30">Writing Room</span>
        <h1 className="font-code text-4xl sm:text-6xl md:text-8xl text-ink tracking-tighter italic min-h-[1.2em]">
           {titleDisplay}
           {!titleDone && <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity, ease: "steps(2)" }} className="inline-block w-[0.1em] h-[0.8em] bg-accent ml-2 align-middle" />}
        </h1>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 40 }} 
        animate={{ opacity: 1, y: 0 }} 
        className={`w-full flex-grow max-w-[95vw] lg:max-w-7xl p-4 sm:p-20 lg:p-28 rounded-[2rem] sm:rounded-[4rem] lg:rounded-[5rem] flex flex-col min-h-0 relative ${
          isMegha 
            ? 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl' 
            : 'bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.06)] border border-white'
        }`}
      >
        <div className="flex-grow flex flex-col min-h-0">
          <div className="flex items-center gap-4 mb-4 sm:mb-16 opacity-30 shrink-0">
            <div className="w-12 sm:w-20 h-[1.5px] bg-ink" />
            <span className="text-[8px] sm:text-[10px] uppercase tracking-widest font-black">Composition Area</span>
          </div>
          
          <div className="relative flex-grow flex flex-col overflow-y-auto custom-scrollbar">
            <textarea
              required={!voice}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (isMegha && Math.random() < 0.4) spawnEmoji();
              }}
              placeholder="" 
              className="w-full flex-grow bg-transparent border-none focus:ring-0 focus:outline-none text-2xl sm:text-6xl font-code text-transparent caret-accent resize-none leading-tight"
            />
            
            {/* Typewriter Overlay for Content and Placeholder */}
            <div className="absolute inset-0 pointer-events-none whitespace-pre-wrap break-words text-2xl sm:text-6xl font-code text-ink leading-tight">
              {message.length === 0 ? (
                <span className="text-neutral-200">
                  {placeholderDisplay}
                  {!placeholderDone && <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity, ease: "steps(2)" }} className="inline-block w-[0.1em] h-[0.8em] bg-accent/30 ml-1 align-middle" />}
                </span>
              ) : (
                <>
                  {message.split('').map((char, i) => (
                    <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.05 }}>{char}</motion.span>
                  ))}
                  <span className="relative inline-block align-middle ml-2">
                    <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity, ease: "steps(2)" }} className="inline-block w-[0.2em] h-[0.9em] bg-accent shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]" />
                    <AnimatePresence>
                      {activeEmojis.map((e) => (
                        <motion.span
                          key={e.id}
                          initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                          animate={{ opacity: 0, scale: 0.8, x: e.x, y: e.y }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="absolute top-0 left-1/2 -translate-x-1/2 text-[25px] sm:text-[45px] pointer-events-none select-none"
                        >
                          {e.char}
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-16 pt-4 sm:pt-16 border-t border-neutral-100 flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-16 shrink-0">
          <div className="flex flex-row items-center justify-between lg:justify-start gap-2 sm:gap-12 w-full lg:w-auto">
            <div className="flex items-center gap-2 sm:gap-8 min-w-0">
              <button 
                onClick={() => fileInputRef.current.click()} 
                className={`flex items-center justify-center gap-2 sm:gap-4 py-3 sm:py-4 px-4 sm:px-8 rounded-full transition-all border ${photo ? 'bg-accent text-white shadow-xl shadow-accent/20' : 'bg-neutral-50 border-neutral-100 text-neutral-400 hover:border-accent hover:bg-neutral-100 hover:text-black active:bg-accent active:text-white'}`}
              >
                <Camera className="w-4 h-4 sm:w-6 sm:h-6 shrink-0" />
                <span className="text-[9px] sm:text-[11px] uppercase font-black tracking-widest hidden sm:inline">{photo ? 'Photo Attached' : 'Add Image'}</span>
                <span className="text-[9px] uppercase font-black tracking-widest sm:hidden">{photo ? 'Attached' : 'Photo'}</span>
                <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
              </button>
              {photo && <button onClick={() => setPhoto(null)} className="text-red-300 hover:text-red-500 hover:scale-110 transition-all shrink-0"><X className="w-4 h-4 sm:w-6 sm:h-6" /></button>}
            </div>

            <div className="flex items-center gap-2 sm:gap-8 min-w-0">
              {!isRecording ? (
                <button onClick={voice ? undefined : startRecording} className={`flex items-center justify-center gap-2 sm:gap-4 py-3 sm:py-4 px-4 sm:px-8 rounded-full transition-all border ${voice ? 'bg-accent text-white shadow-xl shadow-accent/20' : 'bg-neutral-50 border-neutral-100 text-neutral-400 hover:border-accent hover:bg-neutral-100 hover:text-black active:bg-accent active:text-white'}`}>
                  <Mic className="w-4 h-4 sm:w-6 sm:h-6 shrink-0" />
                  <span className="text-[9px] sm:text-[11px] uppercase font-black tracking-widest hidden sm:inline">{voice ? 'Voice Captured' : 'Record Voice'}</span>
                  <span className="text-[9px] uppercase font-black tracking-widest sm:hidden">{voice ? 'Captured' : 'Voice'}</span>
                </button>
              ) : (
                <button onClick={stopRecording} className="flex items-center justify-center gap-2 sm:gap-4 py-3 sm:py-4 px-4 sm:px-8 rounded-full bg-red-500 text-white animate-pulse shadow-xl shadow-red-500/30">
                  <Square className="w-4 h-4 sm:w-6 sm:h-6 shrink-0" />
                  <span className="text-[9px] sm:text-[11px] uppercase font-black tracking-widest hidden sm:inline">End Capture</span>
                  <span className="text-[9px] uppercase font-black tracking-widest sm:hidden">Stop</span>
                </button>
              )}
              {voice && (
                <div className="flex items-center gap-2 sm:gap-6 shrink-0">
                  <button onClick={() => new Audio(voice).play()} className="text-[9px] sm:text-[11px] uppercase font-black text-accent hover:underline tracking-widest hidden sm:inline">Preview</button>
                  <button onClick={deleteVoice} className="text-red-300 hover:text-red-500 hover:scale-110 transition-all shrink-0"><Trash2 className="w-4 h-4 sm:w-6 sm:h-6" /></button>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || (!message.trim() && !voice)}
            className={`group relative overflow-hidden w-full lg:w-auto px-6 sm:px-20 py-4 sm:py-7 rounded-full font-code text-[12px] sm:text-[15px] uppercase tracking-[0.3em] sm:tracking-[0.5em] font-black transition-all shadow-xl flex items-center justify-center gap-3 sm:gap-5 ${
              isSubmitting || (!message.trim() && !voice) 
                ? 'bg-neutral-100 text-neutral-200 cursor-not-allowed' 
                : 'bg-zinc-950 text-white hover:bg-accent ring-[6px] sm:ring-[10px] ring-transparent hover:ring-accent/10 active:scale-[0.98]'
            }`}
          >
            <div className={`absolute bottom-0 left-0 w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0 ${
              isSubmitting ? 'h-full bg-accent' : 'h-0 bg-accent'
            }`} />
            <span className="relative z-10 flex flex-row items-center justify-center gap-3">
              {isSubmitting && <Loader2 className="w-4 h-4 sm:w-6 sm:h-6 animate-spin text-white" />}
              <span className={`transition-colors ${isSubmitting ? 'text-white' : ''}`}>
                {isSubmitting ? 'Syncing...' : 'add my story'}
              </span>
            </span>
          </button>
        </div>
      </motion.div>

      <button onClick={onSignOut} className="mt-4 sm:mt-16 text-[8px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.6em] text-neutral-300 hover:text-ink font-black bg-white/50 backdrop-blur-md px-6 sm:px-10 py-3 sm:py-5 rounded-full border border-neutral-100 transition-all shrink-0 z-10">Front page</button>
    </div>
  );
};

// --- Special Message ---
const SpecialMessage = ({ session, onBack, onSignOut }) => {
  const [displayText, setDisplayText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
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
    }, 40);
    return () => clearInterval(interval);
  }, [fullText]);

  const handleScroll = (e) => {
    const currentScrollY = e.target.scrollTop;
    if (currentScrollY > lastScrollY && currentScrollY > 20) {
      setShowButtons(false);
    } else {
      setShowButtons(true);
    }
    setLastScrollY(currentScrollY);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-6 text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(var(--accent-rgb),0.1)_0%,_transparent_100%)] pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="w-full max-w-4xl h-[75dvh] max-h-[800px] bg-white/5 backdrop-blur-3xl rounded-[4rem] border border-white/10 shadow-3xl relative overflow-hidden flex flex-col">
        
        <div 
          className="flex-grow w-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          onScroll={handleScroll}
        >
           <div className="min-h-full flex flex-col justify-center px-12 sm:px-24 pt-24 pb-48">
             <div className="relative font-code text-2xl sm:text-4xl leading-relaxed whitespace-pre-wrap">
               {displayText}
               <motion.span animate={{ opacity: isTypingComplete ? [0.2, 0] : [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity, ease: "steps(2)" }} className="inline-block w-[0.1em] h-[0.9em] bg-accent ml-2 align-middle" />
             </div>
           </div>
        </div>
           
        {/* Intense Linear Gradient Overlay (No blur) */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-[5]" />

        {/* Floating buttons pinned to the bottom */}
        <motion.div 
          animate={{ y: showButtons ? 0 : 100, opacity: showButtons ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-0 left-0 right-0 px-12 sm:px-24 pb-12 sm:pb-16 flex items-center justify-between z-10 pointer-events-none"
        >
           <button onClick={onBack} className="pointer-events-auto px-10 py-5 rounded-full border border-white/10 text-[10px] uppercase font-bold tracking-[0.5em] hover:bg-white hover:text-black transition-all bg-black/50 backdrop-blur-md shadow-2xl">Go Back</button>
           <button onClick={onSignOut} className="pointer-events-auto px-10 py-5 rounded-full border border-white/10 text-[10px] uppercase font-bold tracking-[0.5em] hover:bg-white hover:text-black transition-all bg-black/50 backdrop-blur-md shadow-2xl">Sign Out</button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FriendPrivatePage;
