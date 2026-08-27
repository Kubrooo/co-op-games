import React, { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { MEMORY_CARDS_DATA } from '../data/challenges';
import { socketManager } from '../utils/socket';
import { sound } from '../utils/sound';
import { motion } from 'framer-motion';

export function MemoryChaos() {
  const { player, room, handleFinishRound } = useGame();
  const [phase, setPhase] = useState('MEMORIZE'); // MEMORIZE, RECALL, REVEALED
  const [cards, setCards] = useState([]);
  const [targetItem, setTargetItem] = useState(null);
  const [p1Pick, setP1Pick] = useState(null);
  const [p2Pick, setP2Pick] = useState(null);

  const p1 = room?.players?.[0] || { name: 'Player 1', avatar: '🐱' };
  const p2 = room?.players?.[1] || { name: 'Player 2', avatar: '🐰' };

  useEffect(() => {
    // Generate 6 random items from MEMORY_CARDS_DATA
    const shuffled = [...MEMORY_CARDS_DATA].sort(() => 0.5 - Math.random()).slice(0, 6);
    setCards(shuffled);
    const target = shuffled[Math.floor(Math.random() * shuffled.length)];
    setTargetItem(target);

    // Memorize phase for 3.5s
    const timer = setTimeout(() => {
      setPhase('RECALL');
      sound.playCountdown();
    }, 3500);

    const handleAction = (data) => {
      if (data.actionType === 'MEMORY_PICK') {
        if (data.playerNum === 1) setP1Pick(data.payload.cardId);
        if (data.playerNum === 2) setP2Pick(data.payload.cardId);
      }
    };

    socketManager.on('action_received', handleAction);

    return () => {
      clearTimeout(timer);
      socketManager.off('action_received', handleAction);
    };
  }, []);

  useEffect(() => {
    if (p1Pick !== null && p2Pick !== null && phase === 'RECALL') {
      evaluateMemory(p1Pick, p2Pick);
    }
  }, [p1Pick, p2Pick, phase]);

  const handleCardClick = (cardId) => {
    if (phase !== 'RECALL') return;
    if (player.playerNum === 1 && p1Pick !== null) return;
    if (player.playerNum === 2 && p2Pick !== null) return;

    sound.playClick();
    socketManager.submitAction(room.roomId, 'MEMORY_PICK', { cardId });

    if (socketManager.useMock) {
      if (player.playerNum === 1) setP1Pick(cardId);
      else setP2Pick(cardId);
    }
  };

  const evaluateMemory = (c1, c2) => {
    setPhase('REVEALED');
    const isP1Correct = c1 === targetItem.id;
    const isP2Correct = c2 === targetItem.id;

    const p1Pts = isP1Correct ? 150 : 0;
    const p2Pts = isP2Correct ? 150 : 0;

    if (isP1Correct || isP2Correct) sound.playSuccess();
    else sound.playFail();

    setTimeout(() => {
      handleFinishRound(p1Pts, p2Pts, 'Memory Chaos', {
        target: targetItem.symbol,
        p1Correct: isP1Correct,
        p2Correct: isP2Correct
      });
    }, 3000);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center">
      <div className="mb-4">
        <span className="text-xs font-black tracking-widest text-[#7928ca] uppercase bg-purple-950/60 border border-purple-500/30 px-3 py-1 rounded-full">
          MODE 4: MEMORY CHAOS
        </span>
      </div>

      {/* Target Hint Card */}
      <div className="w-full bg-[#161b2e] border-2 border-white/10 p-4 rounded-3xl mb-6 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-white/50 block">
            {phase === 'MEMORIZE' ? 'HAFALKAN POSISI EMOJI!' : 'MANA POSISI EMOJI INI?'}
          </span>
          <span className="font-display font-extrabold text-xl text-amber-300">
            {targetItem ? targetItem.symbol : '❓'}
          </span>
        </div>
        <div className="bg-white/10 px-3 py-1.5 rounded-full text-xs font-bold text-cyan-300">
          {phase === 'MEMORIZE' ? '👁️ LIHAT DENGAN TELITI' : '🧠 PILIH DENGAN INGATAN'}
        </div>
      </div>

      {/* Card Grid */}
      <div className="w-full grid grid-cols-3 gap-3">
        {cards.map((card, idx) => {
          const isFaceUp = phase === 'MEMORIZE' || phase === 'REVEALED';
          const isTarget = card.id === targetItem?.id;

          return (
            <motion.button
              key={card.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(card.id)}
              disabled={phase !== 'RECALL'}
              className={`h-24 sm:h-28 rounded-2xl border-2 flex items-center justify-center text-4xl shadow-lg transition-all ${
                isFaceUp
                  ? `${card.color} border-white/40 text-white`
                  : 'bg-white/5 border-white/20 hover:bg-white/10'
              }`}
            >
              {isFaceUp ? card.symbol : '❓'}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
