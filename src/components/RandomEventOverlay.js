import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

export function RandomEventOverlay({ event }) {
  if (!event) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="w-full mb-4"
      >
        <div className={`bg-gradient-to-r ${event.badgeColor} p-3 rounded-2xl shadow-xl flex items-center justify-between text-slate-950 font-sans border border-white/30`}>
          <div className="flex items-center space-x-3">
            <span className="text-3xl animate-bounce">{event.icon}</span>
            <div>
              <span className="font-display font-extrabold text-base sm:text-lg block tracking-wide">
                {event.title}
              </span>
              <span className="text-xs font-bold opacity-90 block">
                {event.description}
              </span>
            </div>
          </div>
          <Zap className="w-6 h-6 animate-pulse opacity-80" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
