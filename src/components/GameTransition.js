import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function GameTransition({ isVisible, title, description, icon }) {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#0d0f1d]/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center"
      >
        <motion.div
          initial={{ scale: 0.5, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          className="bg-white/5 border border-white/10 p-8 rounded-3xl max-w-md w-full shadow-2xl flex flex-col items-center"
        >
          <span className="text-6xl mb-4 animate-bounce">{icon || '🎮'}</span>
          <span className="text-xs font-black text-cyan-400 tracking-widest uppercase mb-1">
            MINIGAME BERIKUTNYA
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white mb-2 bg-gradient-to-r from-[#ff4d8d] via-[#00f2fe] to-[#00f5d4] bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-sm text-white/70 font-semibold mb-6">
            {description}
          </p>

          <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full text-xs font-bold text-amber-300 animate-pulse">
            <span>Bersiap-siap...</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
