import React, { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { SYNC_QUESTIONS } from '../data/questions';
import { socketManager } from '../utils/socket';
import { sound } from '../utils/sound';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer } from '../components/Timer';
import { useTimer } from '../hooks/useTimer';
import { Flame } from 'lucide-react';

export function Sync() {
  const { player, room, handleFinishRound, activeEvent } = useGame();
  const [subRound, setSubRound] = useState(1);
  const [p1Choice, setP1Choice] = useState(null);
  const [p2Choice, setP2Choice] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalP1Pts, setTotalP1Pts] = useState(0);
  const [totalP2Pts, setTotalP2Pts] = useState(0);

  const p1 = room?.players?.[0] || { name: 'Player 1', avatar: '🐱' };
  const p2 = room?.players?.[1] || { name: 'Player 2', avatar: '🐰' };

  const question = SYNC_QUESTIONS[(room.round * 4 + subRound) % SYNC_QUESTIONS.length];

  const duration = activeEvent?.effect === 'fast_timer' ? 8 : 12;
  const { timeLeft, reset: resetTimer } = useTimer(duration, () => {
    if (!revealed) {
      evaluateSubRound(p1Choice, p2Choice);
    }
  });

  useEffect(() => {
    const handleAction = (data) => {
      if (data.actionType === 'SYNC_VOTE') {
        if (data.playerNum === 1) setP1Choice(data.payload.choice);
        if (data.playerNum === 2) setP2Choice(data.payload.choice);
      }
    };

    socketManager.on('action_received', handleAction);
    return () => socketManager.off('action_received', handleAction);
  }, [subRound]);

  useEffect(() => {
    if (p1Choice !== null && p2Choice !== null && !revealed) {
      evaluateSubRound(p1Choice, p2Choice);
    }
  }, [p1Choice, p2Choice, revealed]);

  const handleVote = (choice) => {
    if (player.playerNum === 1 && p1Choice !== null) return;
    if (player.playerNum === 2 && p2Choice !== null) return;

    sound.playClick();
    socketManager.submitAction(room.roomId, 'SYNC_VOTE', { choice });

    if (socketManager.useMock) {
      if (player.playerNum === 1) setP1Choice(choice);
      else setP2Choice(choice);
    }
  };

  const evaluateSubRound = (c1, c2) => {
    setRevealed(true);
    const vote1 = c1 ?? 'A';
    const vote2 = c2 ?? 'B';

    const isMatch = vote1 === vote2;
    let newStreak = streak;
    let addP1 = 0;
    let addP2 = 0;

    if (isMatch) {
      newStreak += 1;
      setStreak(newStreak);
      const mult = newStreak > 1 ? newStreak : 1;
      addP1 = 150 * mult;
      addP2 = 150 * mult;
      sound.playCombo(newStreak);
    } else {
      setStreak(0);
      sound.playFail();
    }

    const nextP1 = totalP1Pts + addP1;
    const nextP2 = totalP2Pts + addP2;
    setTotalP1Pts(nextP1);
    setTotalP2Pts(nextP2);

    setTimeout(() => {
      if (subRound < 3) {
        setSubRound(prev => prev + 1);
        setP1Choice(null);
        setP2Choice(null);
        setRevealed(false);
        resetTimer(duration);
      } else {
        handleFinishRound(nextP1, nextP2, 'Sync Challenge', {
          maxStreak: newStreak,
          subRoundsCompleted: 3
        });
      }
    }, 2500);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-3">
        <span className="text-xs font-black tracking-widest text-cyan-400 uppercase bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full">
          MODE 2: SYNC (TANDINGAN {subRound}/3)
        </span>
        {streak > 1 && (
          <div className="flex items-center space-x-1 bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-1 rounded-full shadow-lg animate-pulse">
            <Flame className="w-3.5 h-3.5" />
            <span>{streak}x COMBO!</span>
          </div>
        )}
      </div>

      <Timer seconds={timeLeft} totalSeconds={duration} />

      {/* Question Card */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="w-full bg-[#161b2e] border-2 border-white/10 p-6 rounded-3xl shadow-2xl my-5 backdrop-blur-xl"
      >
        <span className="text-xs font-bold text-white/50 uppercase tracking-widest block mb-1">
          Kategori: {question.category}
        </span>
        <h2 className="font-display font-extrabold text-2xl text-white">
          PILIH SALAH SATU SECEPATNYA!
        </h2>
      </motion.div>

      {/* Binary Choice Buttons */}
      {!revealed ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleVote('A')}
            disabled={(player.playerNum === 1 && p1Choice !== null) || (player.playerNum === 2 && p2Choice !== null)}
            className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center justify-center space-y-2 ${
              (player.playerNum === 1 && p1Choice === 'A') || (player.playerNum === 2 && p2Choice === 'A')
                ? 'bg-cyan-500/30 border-cyan-400 shadow-xl shadow-cyan-500/20'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <span className="font-display font-black text-xl text-cyan-300">
              {question.optionA}
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleVote('B')}
            disabled={(player.playerNum === 1 && p1Choice !== null) || (player.playerNum === 2 && p2Choice !== null)}
            className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center justify-center space-y-2 ${
              (player.playerNum === 1 && p1Choice === 'B') || (player.playerNum === 2 && p2Choice === 'B')
                ? 'bg-pink-500/30 border-pink-400 shadow-xl shadow-pink-500/20'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <span className="font-display font-black text-xl text-pink-300">
              {question.optionB}
            </span>
          </motion.button>
        </div>
      ) : (
        /* Reveal Card */
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="w-full bg-[#161b2e] border-2 border-cyan-400/40 p-6 rounded-3xl shadow-2xl flex flex-col items-center"
        >
          <span className="text-xs font-black text-cyan-300 uppercase tracking-widest mb-3">
            HASIL SYNC
          </span>
          <div className="flex items-center space-x-6 mb-3">
            <div className="flex flex-col items-center">
              <span className="text-3xl">{p1.avatar}</span>
              <span className="text-sm font-bold text-cyan-300 mt-1">
                {p1Choice === 'A' ? question.optionA : question.optionB}
              </span>
            </div>
            <span className="font-black text-xl text-white/30">VS</span>
            <div className="flex flex-col items-center">
              <span className="text-3xl">{p2.avatar}</span>
              <span className="text-sm font-bold text-pink-300 mt-1">
                {p2Choice === 'A' ? question.optionA : question.optionB}
              </span>
            </div>
          </div>
          <span className={`font-display font-extrabold text-lg px-4 py-1.5 rounded-full ${
            p1Choice === p2Choice
              ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-500/30'
              : 'text-rose-300 bg-rose-950/60 border border-rose-500/30'
          }`}>
            {p1Choice === p2Choice ? '🔥 MATCH! PERFECT SYNC!' : '💔 BEDA PILIHAN! COMBO RESET'}
          </span>
        </motion.div>
      )}
    </div>
  );
}
