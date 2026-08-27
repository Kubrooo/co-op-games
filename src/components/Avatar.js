import React from 'react';
import { motion } from 'framer-motion';

export function Avatar({ emoji, size = 'md', isReady = false, isWinner = false, isTiny = false, title }) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-14 h-14 text-3xl',
    lg: 'w-20 h-20 text-5xl',
    xl: 'w-28 h-28 text-7xl'
  };

  const currentSize = isTiny ? 'w-8 h-8 text-lg' : sizeClasses[size] || sizeClasses.md;

  return (
    <div className="flex flex-col items-center">
      <motion.div
        whileHover={{ scale: 1.1 }}
        animate={isWinner ? { y: [0, -10, 0] } : {}}
        transition={isWinner ? { repeat: Infinity, duration: 1 } : {}}
        className={`relative rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border-2 ${
          isReady ? 'border-emerald-400 shadow-lg shadow-emerald-500/30' : 'border-white/20'
        } ${currentSize} backdrop-blur-md`}
      >
        <span>{emoji || '🐱'}</span>
        {isReady && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-md">
            ✓
          </span>
        )}
      </motion.div>
      {title && (
        <span className="mt-1 text-[10px] font-bold tracking-wider text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full">
          {title}
        </span>
      )}
    </div>
  );
}
