import React from 'react';
import { AVATARS_LIST } from '../data/unlocks';
import { motion } from 'framer-motion';

export function AvatarSelector({ selectedEmoji, onSelect, unlockedAvatars = [] }) {
  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">
        Pilih Avatar Kamu:
      </label>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 bg-black/20 p-3 rounded-2xl border border-white/10 max-h-48 overflow-y-auto custom-scrollbar">
        {AVATARS_LIST.map((item) => {
          const isUnlocked = unlockedAvatars.includes(item.emoji) || item.unlockReq === 'Default';
          const isSelected = selectedEmoji === item.emoji;

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => isUnlocked && onSelect(item.emoji)}
              disabled={!isUnlocked}
              className={`relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-gradient-to-tr from-[#ff4d8d]/30 to-[#00f2fe]/30 border-cyan-400 shadow-md shadow-cyan-500/20'
                  : isUnlocked
                  ? 'bg-white/5 border-white/10 hover:bg-white/10'
                  : 'bg-white/2 border-white/5 opacity-40 cursor-not-allowed'
              }`}
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-[9px] text-white/70 font-medium truncate w-full text-center mt-1">
                {item.name}
              </span>
              {!isUnlocked && (
                <span className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center text-xs">
                  🔒
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
