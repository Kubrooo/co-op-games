import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../hooks/useGame';
import { socketManager } from '../utils/socket';
import { sound } from '../utils/sound';
import { motion } from 'framer-motion';

export function ReactionBattle() {
  const { player, room, handleFinishRound } = useGame();
  const [gameState, setGameState] = useState('WAITING'); // WAITING, FALSE_SIGNAL, TARGET_ACTIVE, FINISHED
  const [falseSignalText, setFalseSignalText] = useState('SIAP-SIAP... JANGAN KLIK!');
  const [p1Reaction, setP1Reaction] = useState(null);
  const [p2Reaction, setP2Reaction] = useState(null);
  const [winner, setWinner] = useState(null);

  const startTimeRef = useRef(0);
  const timerRef = useRef(null);

  const p1 = room?.players?.[0] || { name: 'Player 1', avatar: '🐱' };
  const p2 = room?.players?.[1] || { name: 'Player 2', avatar: '🐰' };

  useEffect(() => {
    // Random delay between 2.5s and 5.5s
    const randomDelay = Math.floor(Math.random() * 3000) + 2500;

    // Optional false signal halfway through
    const falseTimer = setTimeout(() => {
      if (Math.random() < 0.6) {
        setFalseSignalText('JANGAN TEKAN! 🛑');
        sound.playFail();
      }
    }, randomDelay / 2);

    timerRef.current = setTimeout(() => {
      setGameState('TARGET_ACTIVE');
      startTimeRef.current = Date.now();
      sound.playEventTrigger();
    }, randomDelay);

    const handleAction = (data) => {
      if (data.actionType === 'REACTION_CLICK') {
        if (data.playerNum === 1) setP1Reaction(data.payload.time);
        if (data.playerNum === 2) setP2Reaction(data.payload.time);
      }
    };

    socketManager.on('action_received', handleAction);

    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(falseTimer);
      socketManager.off('action_received', handleAction);
    };
  }, []);

  useEffect(() => {
    if ((p1Reaction !== null || p2Reaction !== null) && gameState === 'TARGET_ACTIVE') {
      evaluateWinner(p1Reaction, p2Reaction);
    }
  }, [p1Reaction, p2Reaction, gameState]);

  const handleClick = () => {
    if (gameState === 'WAITING' || gameState === 'FALSE_SIGNAL') {
      // False start penalty
      sound.playFail();
      const reactionTime = 9999; // Early click penalty
      if (player.playerNum === 1) setP1Reaction(reactionTime);
      else setP2Reaction(reactionTime);

      socketManager.submitAction(room.roomId, 'REACTION_CLICK', { time: reactionTime });
      return;
    }

    if (gameState === 'TARGET_ACTIVE') {
      const ms = Date.now() - startTimeRef.current;
      sound.playSuccess();
      if (player.playerNum === 1) setP1Reaction(ms);
      else setP2Reaction(ms);

      socketManager.submitAction(room.roomId, 'REACTION_CLICK', { time: ms });
    }
  };

  const evaluateWinner = (r1, r2) => {
    setGameState('FINISHED');
    const t1 = r1 ?? 9999;
    const t2 = r2 ?? 9999;

    let p1Pts = 0;
    let p2Pts = 0;
    let winPlayer = null;

    if (t1 < t2) {
      p1Pts = 200;
      p2Pts = 50;
      winPlayer = 1;
    } else if (t2 < t1) {
      p2Pts = 200;
      p1Pts = 50;
      winPlayer = 2;
    } else {
      p1Pts = 100;
      p2Pts = 100;
    }

    setWinner(winPlayer);

    setTimeout(() => {
      handleFinishRound(p1Pts, p2Pts, 'Reaction Battle', {
        p1Ms: t1,
        p2Ms: t2,
        winner: winPlayer
      });
    }, 3000);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center">
      <div className="mb-4">
        <span className="text-xs font-black tracking-widest text-[#00f5d4] uppercase bg-teal-950/60 border border-teal-500/30 px-3 py-1 rounded-full">
          MODE 3: REACTION BATTLE
        </span>
      </div>

      {/* Main Interactive Battle Arena Button */}
      {gameState !== 'FINISHED' ? (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          className={`w-full min-h-[300px] rounded-3xl border-4 flex flex-col items-center justify-center p-6 shadow-2xl transition-colors ${
            gameState === 'TARGET_ACTIVE'
              ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 border-emerald-300 text-slate-950 animate-pulse'
              : 'bg-[#161b2e] border-rose-500/40 text-white'
          }`}
        >
          {gameState === 'TARGET_ACTIVE' ? (
            <div className="flex flex-col items-center space-y-2">
              <span className="text-6xl animate-bounce">⚡</span>
              <h2 className="font-display font-black text-4xl sm:text-5xl tracking-wider">
                KLIK SEKARANG!
              </h2>
              <span className="text-sm font-bold text-slate-900">
                TEKAN SECEPAT MUNGKIN!
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <span className="text-5xl mb-2">🛑</span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-rose-400">
                {falseSignalText}
              </h2>
              <span className="text-xs text-white/50 font-semibold">
                (Awas! Klik duluan sebelum waktunya = Penalti Poin!)
              </span>
            </div>
          )}
        </motion.button>
      ) : (
        /* Results Card */
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="w-full bg-[#161b2e] border-2 border-emerald-400/40 p-6 rounded-3xl shadow-2xl flex flex-col items-center"
        >
          <span className="text-xs font-black text-emerald-300 uppercase tracking-widest mb-4">
            HASIL KECEPATAN REAKSI
          </span>
          <div className="flex items-center space-x-6 mb-4">
            <div className="flex flex-col items-center">
              <span className="text-3xl">{p1.avatar}</span>
              <span className="text-xs font-bold text-white/70 mt-1">{p1.name}</span>
              <span className="text-lg font-extrabold text-cyan-300 mt-1">
                {p1Reaction === 9999 ? 'Penalti! (Terlalu Cepat)' : `${p1Reaction} ms`}
              </span>
            </div>
            <span className="font-black text-xl text-white/30">VS</span>
            <div className="flex flex-col items-center">
              <span className="text-3xl">{p2.avatar}</span>
              <span className="text-xs font-bold text-white/70 mt-1">{p2.name}</span>
              <span className="text-lg font-extrabold text-pink-300 mt-1">
                {p2Reaction === 9999 ? 'Penalti! (Terlalu Cepat)' : `${p2Reaction} ms`}
              </span>
            </div>
          </div>
          <span className="font-display font-extrabold text-lg text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-4 py-1.5 rounded-full">
            🏆 PEMENANG: {winner === 1 ? p1.name : winner === 2 ? p2.name : 'SERI!'}
          </span>
        </motion.div>
      )}
    </div>
  );
}
