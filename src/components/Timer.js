import React from 'react';
import { motion } from 'framer-motion';

export function Timer({ seconds, totalSeconds = 15 }) {
  const percentage = Math.max(0, (seconds / totalSeconds) * 100);
  const isUrgent = seconds <= 3;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Circle SVG Progress */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="26"
            stroke="currentColor"
            strokeWidth="5"
            className="text-white/10"
            fill="transparent"
          />
          <motion.circle
            cx="32"
            cy="32"
            r="26"
            stroke="currentColor"
            strokeWidth="5"
            strokeDasharray="163.36"
            strokeDashoffset={163.36 - (163.36 * percentage) / 100}
            strokeLinecap="round"
            className={`transition-all duration-500 ${
              isUrgent ? 'text-rose-500 animate-pulse' : 'text-cyan-400'
            }`}
            fill="transparent"
          />
        </svg>
        <span className={`absolute font-display font-extrabold text-xl ${
          isUrgent ? 'text-rose-500 animate-bounce' : 'text-white'
        }`}>
          {seconds}
        </span>
      </div>
      <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider mt-1">
        Detik
      </span>
    </div>
  );
}
