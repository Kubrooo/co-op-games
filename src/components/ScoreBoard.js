import React from 'react';
import { useGame } from '../hooks/useGame';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Zap } from 'lucide-react';

export function ScoreBoard({ streak = 0, p1Active = false, p2Active = false }) {
  const { room, player } = useGame();
  const p1 = room?.players?.[0] || { name: 'Player 1', avatar: '🐱' };
  const p2 = room?.players?.[1] || { name: 'Player 2', avatar: '🐰' };
  const scoreP1 = room?.scores?.p1 || 0;
  const scoreP2 = room?.scores?.p2 || 0;

  return (
    <div className="w-full bg-[#161b2e]/90 border border-white/10 p-3 sm:p-4 rounded-3xl backdrop-blur-xl shadow-2xl flex items-center justify-between">
      {/* Player 1 */}
      <div className="flex items-center space-x-3">
        <div className={`relative p-1 rounded-2xl border-2 transition-all ${
          p1Active ? 'border-cyan-400 shadow-md shadow-cyan-500/50 scale-105' : 'border-white/10'
        }`}>
          <span className="text-2xl sm:text-3xl">{p1.avatar}</span>
        </div>
        <div>
          <span className="text-xs font-bold text-white/70 block max-w-[90px] sm:max-w-[120px] truncate">
            {p1.name} {p1.playerNum === player.playerNum && '(Kamu)'}
          </span>
          <span className="font-display font-extrabold text-lg sm:text-2xl text-cyan-300">
            {scoreP1} <span className="text-[10px] text-white/50">PTS</span>
          </span>
        </div>
      </div>

      {/* Center Round & Streak */}
      <div className="flex flex-col items-center px-2">
        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
          Ronde {room.round} / {room.totalRounds}
        </span>
        {streak > 1 && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center space-x-1 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full shadow-lg mt-1 animate-pulse"
          >
            <Flame className="w-3.5 h-3.5 fill-slate-950" />
            <span>STREAK {streak}x!</span>
          </motion.div>
        )}
      </div>

      {/* Player 2 */}
      <div className="flex items-center space-x-3 text-right">
        <div>
          <span className="text-xs font-bold text-white/70 block max-w-[90px] sm:max-w-[120px] truncate">
            {p2.name} {p2.playerNum === player.playerNum && '(Kamu)'}
          </span>
          <span className="font-display font-extrabold text-lg sm:text-2xl text-pink-300">
            {scoreP2} <span className="text-[10px] text-white/50">PTS</span>
          </span>
        </div>
        <div className={`relative p-1 rounded-2xl border-2 transition-all ${
          p2Active ? 'border-pink-400 shadow-md shadow-pink-500/50 scale-105' : 'border-white/10'
        }`}>
          <span className="text-2xl sm:text-3xl">{p2.avatar}</span>
        </div>
      </div>
    </div>
  );
}
