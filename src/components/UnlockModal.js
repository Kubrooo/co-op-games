import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, X } from 'lucide-react';
import { Button } from './Button';

export function UnlockModal({ unlock, onClose }) {
  if (!unlock) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-gradient-to-b from-[#161b2e] to-[#0d0f1d] border-2 border-amber-400/50 p-6 rounded-3xl max-w-sm w-full shadow-2xl text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 animate-pulse" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-2 animate-bounce" />

          <span className="text-xs font-black text-amber-300 uppercase tracking-widest block mb-1">
            PENGAHARGAAN BARU DIBUKA!
          </span>

          <span className="text-5xl my-3 block">{unlock.icon || '🏆'}</span>

          <h3 className="font-display font-extrabold text-2xl text-white mb-1">
            {unlock.name}
          </h3>

          <p className="text-xs text-white/70 font-semibold mb-6">
            Selamat! Kamu telah membuktikan kekompakan luar biasa di Duo Chaos!
          </p>

          <Button variant="secondary" onClick={onClose} className="w-full">
            Klaim Hadiah!
          </Button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
