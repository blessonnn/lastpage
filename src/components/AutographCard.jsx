import React from 'react';
import { motion } from 'framer-motion';

const AutographCard = ({ name, message, date, rotation }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      style={{ rotate: `${rotation}deg` }}
      className="bg-white p-8 shadow-sm border border-neutral-200/50 paper-grain relative overflow-hidden group transition-shadow hover:shadow-xl"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <h3 className="font-serif text-2xl text-ink mb-4 leading-tight">
        {name}
      </h3>
      
      <p className="font-sans text-ink-muted leading-relaxed mb-6 whitespace-pre-wrap">
        {message}
      </p>
      
      <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-neutral-400 font-medium">
        <span>{new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-accent">#Lastpage</span>
      </div>
    </motion.div>
  );
};

export default AutographCard;
