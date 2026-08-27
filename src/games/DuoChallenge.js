import React, { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { DUO_PATTERNS } from '../data/challenges';
import { socketManager } from '../utils/socket';
import { sound } from '../utils/sound';
import { motion } from 'framer-motion';
import { Timer } from '../components/Timer';
import { useTimer } from '../hooks/useTimer';
import { MessageSquare } from 'lucide-react';

export function DuoChallenge() {
  const { player, room, handleFinishRound } = useGame();
  const [patternIndex, setPatternIndex] = useState(0);
  const [p2EnteredSequence, setP2EnteredSequence] = useState([]);
  const [status, setStatus] = useState('PLAYING'); // PLAYING, SUCCESS, FAIL

  const p1 = room?.players?.[0] || { name: 'Player 1', avatar: '🐱' };
  const p2 = room?.players?.[1] || { name: 'Player 2', avatar: '🐰' };

  const currentPattern = DUO_PATTERNS[(room.round + 2) % DUO_PATTERNS.length];

  const { timeLeft } = useTimer(15, () => {
    if (status === 'PLAYING') {
      evaluateCoop(false);
    }
  });

  useEffect(() => {
    const handleAction = (data) => {
      if (data.actionType === 'DUO_KEY_PRESS') {
        const nextSeq = [...p2EnteredSequence, data.payload.key];
        setP2EnteredSequence(nextSeq);
        sound.playClick();

        // Check if length matches target
        if (nextSeq.length === currentPattern.sequence.length) {
          const isCorrect = nextSeq.every((k, idx) => k === currentPattern.sequence[idx]);
          evaluateCoop(isCorrect);
        }
      }
    };

    socketManager.on('action_received', handleAction);
    return () => socketManager.off('action_received', handleAction);
  }, [p2EnteredSequence, currentPattern]);

  const handleP2KeyPress = (key) => {
    if (player.playerNum !== 2 || status !== 'PLAYING') return;
    socketManager.submitAction(room.roomId, 'DUO_KEY_PRESS', { key });

    if (socketManager.useMock) {
      const nextSeq = [...p2EnteredSequence, key];
      setP2EnteredSequence(nextSeq);
      sound.playClick();
      if (nextSeq.length === currentPattern.sequence.length) {
        const isCorrect = nextSeq.every((k, idx) => k === currentPattern.sequence[idx]);
        evaluateCoop(isCorrect);
      }
    }
  };

  const evaluateCoop = (isSuccess) => {
    if (isSuccess) {
      setStatus('SUCCESS');
      sound.playSuccess();
    } else {
      setStatus('FAIL');
      sound.playFail();
    }

    const pts = isSuccess ? 200 : 0;
    setTimeout(() => {
      handleFinishRound(pts, pts, 'Duo Challenge', {
        coopSuccess: isSuccess
      });
    }, 3000);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center">
      <div className="mb-4">
        <span className="text-xs font-black tracking-widest text-[#ffea00] uppercase bg-yellow-950/60 border border-yellow-500/30 px-3 py-1 rounded-full">
          MODE 5: DUO CO-OP CHALLENGE
        </span>
      </div>

      <Timer seconds={timeLeft} totalSeconds={15} />

      {/* Voice Instruction Hint */}
      <div className="my-3 flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 px-4 py-2 rounded-full text-xs font-bold text-cyan-300">
        <MessageSquare className="w-4 h-4 text-pink-400" />
        <span>Gunakan Call / Discord / Teriakkan Instruksi ke Teammate!</span>
      </div>

      {/* Player 1 View: Sees Pattern */}
      {player.playerNum === 1 ? (
        <div className="w-full bg-[#161b2e] border-2 border-cyan-400/40 p-6 rounded-3xl shadow-2xl my-4">
          <span className="text-xs font-black text-cyan-300 uppercase tracking-widest block mb-2">
            PETA INSTRUKSI PLAYER 1 (TERIAKKAN KE {p2.name}!)
          </span>
          <h3 className="text-base font-bold text-white mb-4">
            {currentPattern.instruction}
          </h3>
          <div className="flex items-center justify-center space-x-3 bg-black/40 p-4 rounded-2xl border border-white/10">
            {currentPattern.sequence.map((key, idx) => (
              <span
                key={idx}
                className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-mono font-black text-white text-base shadow-md"
              >
                {currentPattern.labels[key] || key}
              </span>
            ))}
          </div>
        </div>
      ) : (
        /* Player 2 View: Input Buttons */
        <div className="w-full bg-[#161b2e] border-2 border-pink-400/40 p-6 rounded-3xl shadow-2xl my-4">
          <span className="text-xs font-black text-pink-300 uppercase tracking-widest block mb-2">
            INPUT PLAYER 2 (DENGARKAN INSTRUKSI DARI {p1.name}!)
          </span>

          <div className="flex items-center justify-center space-x-2 mb-6 min-h-[44px]">
            {p2EnteredSequence.map((key, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-emerald-500/30 border border-emerald-400 text-emerald-300 rounded-xl text-xs font-bold"
              >
                {currentPattern.labels[key] || key}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(currentPattern.labels).map(([key, label]) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleP2KeyPress(key)}
                disabled={status !== 'PLAYING'}
                className="p-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl font-extrabold text-white text-sm"
              >
                {label}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Result Status Banner */}
      {status !== 'PLAYING' && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className={`w-full p-4 rounded-2xl font-display font-extrabold text-lg mt-4 ${
            status === 'SUCCESS'
              ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300'
              : 'bg-rose-500/20 border border-rose-400 text-rose-300'
          }`}
        >
          {status === 'SUCCESS' ? '🎉 CO-OP SYNC SUKSES! (+200 PTS KEDUA PEMAIN)' : '💔 TIMEOUT / SALAH URUTAN!'}
        </motion.div>
      )}
    </div>
  );
}
