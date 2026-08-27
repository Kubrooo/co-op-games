import React, { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { WHO_IS_MORE_LIKELY_QUESTIONS } from '../data/questions';
import { socketManager } from '../utils/socket';
import { sound } from '../utils/sound';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer } from '../components/Timer';
import { useTimer } from '../hooks/useTimer';

export function WhoIsMoreLikely() {
  const { player, room, handleFinishRound, activeEvent } = useGame();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [p1Choice, setP1Choice] = useState(null);
  const [p2Choice, setP2Choice] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [resultText, setResultText] = useState('');

  const p1 = room?.players?.[0] || { name: 'Player 1', avatar: '🐱' };
  const p2 = room?.players?.[1] || { name: 'Player 2', avatar: '🐰' };

  // Timer: 15 seconds (or 10 if fast_timer event)
  const duration = activeEvent?.effect === 'fast_timer' ? 10 : 15;
  const { timeLeft } = useTimer(duration, () => {
    if (!revealed) {
      evaluateResult(p1Choice, p2Choice);
    }
  });

  useEffect(() => {
    const qIdx = (room.round * 3 + Math.floor(Math.random() * 5)) % WHO_IS_MORE_LIKELY_QUESTIONS.length;
    setQuestionIndex(qIdx);

    const handleAction = (data) => {
      if (data.actionType === 'MORE_LIKELY_VOTE') {
        if (data.playerNum === 1) setP1Choice(data.payload.choice);
        if (data.playerNum === 2) setP2Choice(data.payload.choice);
      }
    };

    socketManager.on('action_received', handleAction);
    return () => socketManager.off('action_received', handleAction);
  }, [room.round]);

  useEffect(() => {
    if (p1Choice !== null && p2Choice !== null && !revealed) {
      evaluateResult(p1Choice, p2Choice);
    }
  }, [p1Choice, p2Choice, revealed]);

  const handleVote = (choice) => {
    if (player.playerNum === 1 && p1Choice !== null) return;
    if (player.playerNum === 2 && p2Choice !== null) return;

    sound.playClick();
    socketManager.submitAction(room.roomId, 'MORE_LIKELY_VOTE', { choice });

    // Fallback for single-device click simulation
    if (socketManager.useMock) {
      if (player.playerNum === 1) setP1Choice(choice);
      else setP2Choice(choice);
    }
  };

  const evaluateResult = (c1, c2) => {
    setRevealed(true);
    const vote1 = c1 ?? 1;
    const vote2 = c2 ?? 2;

    const isMatch = vote1 === vote2;
    let p1Pts = 0;
    let p2Pts = 0;

    if (isMatch) {
      p1Pts = 100;
      p2Pts = 100;
      setResultText('✨ COMPACT & SYNCED! (+100 PTS KEDUA PEMAIN)');
      sound.playSuccess();
    } else {
      setResultText('🤣 BERBEDALAH PENDAPAT! ("Siapa yang paling denial ni?")');
      sound.playFail();
    }

    setTimeout(() => {
      handleFinishRound(p1Pts, p2Pts, 'Siapa yang Lebih Mungkin?', {
        matched: isMatch,
        p1Vote: vote1,
        p2Vote: vote2
      });
    }, 3000);
  };

  const question = WHO_IS_MORE_LIKELY_QUESTIONS[questionIndex];
  const isReversed = activeEvent?.effect === 'reverse';

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center">
      {/* Header */}
      <div className="mb-4">
        <span className="text-xs font-black tracking-widest text-[#ff4d8d] uppercase bg-pink-950/60 border border-pink-500/30 px-3 py-1 rounded-full">
          MODE 1: SIAPA YANG LEBIH MUNGKIN?
        </span>
      </div>

      <Timer seconds={timeLeft} totalSeconds={duration} />

      {/* Question Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full bg-[#161b2e] border-2 border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl my-6 backdrop-blur-xl relative overflow-hidden"
      >
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#ff4d8d]/10 rounded-full blur-2xl pointer-events-none" />
        <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white leading-relaxed">
          "{question}"
        </h2>
      </motion.div>

      {/* Choice Buttons */}
      {!revealed ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleVote(isReversed ? 2 : 1)}
            disabled={(player.playerNum === 1 && p1Choice !== null) || (player.playerNum === 2 && p2Choice !== null)}
            className={`p-5 rounded-3xl border-2 transition-all flex flex-col items-center justify-center space-y-2 ${
              (player.playerNum === 1 && p1Choice === (isReversed ? 2 : 1)) || (player.playerNum === 2 && p2Choice === (isReversed ? 2 : 1))
                ? 'bg-cyan-500/30 border-cyan-400 shadow-xl shadow-cyan-500/20'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <span className="text-4xl">{p1.avatar}</span>
            <span className="font-display font-black text-lg text-cyan-300">
              {p1.name}
            </span>
            {(player.playerNum === 1 && p1Choice !== null) && (
              <span className="text-xs text-emerald-400 font-bold">Pilihan Terkunci! ✓</span>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleVote(isReversed ? 1 : 2)}
            disabled={(player.playerNum === 1 && p1Choice !== null) || (player.playerNum === 2 && p2Choice !== null)}
            className={`p-5 rounded-3xl border-2 transition-all flex flex-col items-center justify-center space-y-2 ${
              (player.playerNum === 1 && p1Choice === (isReversed ? 1 : 2)) || (player.playerNum === 2 && p2Choice === (isReversed ? 1 : 2))
                ? 'bg-pink-500/30 border-pink-400 shadow-xl shadow-pink-500/20'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <span className="text-4xl">{p2.avatar}</span>
            <span className="font-display font-black text-lg text-pink-300">
              {p2.name}
            </span>
            {(player.playerNum === 2 && p2Choice !== null) && (
              <span className="text-xs text-emerald-400 font-bold">Pilihan Terkunci! ✓</span>
            )}
          </motion.button>
        </div>
      ) : (
        /* Reveal Animation Card */
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full bg-[#161b2e] border-2 border-amber-400/40 p-6 rounded-3xl shadow-2xl flex flex-col items-center"
        >
          <span className="text-xs font-black text-amber-300 uppercase tracking-widest mb-3">
            HASIL PILIHAN
          </span>
          <div className="flex items-center space-x-6 mb-4">
            <div className="flex flex-col items-center">
              <span className="text-3xl">{p1.avatar}</span>
              <span className="text-xs font-bold text-white/70 mt-1">{p1.name}</span>
              <span className="text-sm font-extrabold text-cyan-300 mt-0.5">
                Memilih: {p1Choice === 1 ? p1.name : p2.name}
              </span>
            </div>
            <span className="font-black text-2xl text-white/30">VS</span>
            <div className="flex flex-col items-center">
              <span className="text-3xl">{p2.avatar}</span>
              <span className="text-xs font-bold text-white/70 mt-1">{p2.name}</span>
              <span className="text-sm font-extrabold text-pink-300 mt-0.5">
                Memilih: {p2Choice === 1 ? p1.name : p2.name}
              </span>
            </div>
          </div>
          <span className="font-display font-extrabold text-lg text-amber-300 bg-amber-950/60 border border-amber-500/30 px-4 py-1.5 rounded-full">
            {resultText}
          </span>
        </motion.div>
      )}
    </div>
  );
}
