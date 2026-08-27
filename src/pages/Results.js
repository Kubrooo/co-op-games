import React, { useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { Button } from '../components/Button';
import { Avatar } from '../components/Avatar';
import { UnlockModal } from '../components/UnlockModal';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Heart, Sparkles, Flame, Zap } from 'lucide-react';

export function Results() {
  const { room, player, handleRestartMatch, newUnlock, setNewUnlock } = useGame();

  const p1 = room?.players?.[0] || { name: 'Player 1', avatar: '🐱' };
  const p2 = room?.players?.[1] || { name: 'Player 2', avatar: '🐰' };
  const scoreP1 = room?.scores?.p1 || 0;
  const scoreP2 = room?.scores?.p2 || 0;
  const totalCombined = scoreP1 + scoreP2;

  // Calculate funny statistics & sync percentage
  const syncPercentage = Math.round(Math.min(99, Math.max(45, (totalCombined / 1200) * 100)));

  const funnyQuotes = [
    "87% Synchronized — Terbukti cocok dan sehati! 💖",
    "Someone was definitely cheating or overthinking! 🤣",
    "Most likely to panic under pressure: Player 2 🙈",
    "Profesional Yapper Duo — Gak berhenti teriak di Voice Call! 🎙️",
    "Kekompakan tingkat dewa! Satu ronde lagi gak nih? 🎮"
  ];

  const randomQuote = funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)];

  useEffect(() => {
    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti playback:', e);
    }
  }, []);

  const isP1Winner = scoreP1 > scoreP2;
  const isDraw = scoreP1 === scoreP2;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center px-4 py-8 relative z-10">
      {/* Celebration Header */}
      <span className="text-xs font-black tracking-widest text-amber-300 uppercase bg-amber-950/60 border border-amber-500/30 px-4 py-1.5 rounded-full mb-3">
        MATCH COMPLETED — HASIL AKHIR
      </span>

      <h1 className="font-display font-black text-3xl sm:text-5xl text-white mb-2">
        {syncPercentage}% Synchronized!
      </h1>

      <p className="text-sm font-semibold text-amber-300 mb-6 italic">
        "{randomQuote}"
      </p>

      {/* Winner Podium Display */}
      <div className="w-full bg-[#161b2e] border-2 border-amber-400/40 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl my-4 relative overflow-hidden flex flex-col items-center">
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-around w-full mb-6">
          {/* Player 1 Card */}
          <div className="flex flex-col items-center">
            <Avatar emoji={p1.avatar} size="lg" isWinner={isP1Winner && !isDraw} title={p1.name} />
            <span className="font-display font-black text-2xl text-cyan-300 mt-2">
              {scoreP1} <span className="text-xs text-white/50">PTS</span>
            </span>
          </div>

          <div className="flex flex-col items-center">
            <Trophy className="w-10 h-10 text-amber-400 animate-bounce mb-1" />
            <span className="text-xs font-black text-white/40 uppercase">
              {isDraw ? 'HASIL SERI!' : 'PEMENANG'}
            </span>
          </div>

          {/* Player 2 Card */}
          <div className="flex flex-col items-center">
            <Avatar emoji={p2.avatar} size="lg" isWinner={!isP1Winner && !isDraw} title={p2.name} />
            <span className="font-display font-black text-2xl text-pink-300 mt-2">
              {scoreP2} <span className="text-xs text-white/50">PTS</span>
            </span>
          </div>
        </div>

        {/* Sync Progress Gauge */}
        <div className="w-full bg-black/40 p-4 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between text-xs font-bold text-white/70 mb-2">
            <span>Skor Kekompakan Duo</span>
            <span className="text-amber-300">{syncPercentage}% Match</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#ff4d8d] via-[#00f2fe] to-[#00f5d4] transition-all duration-1000"
              style={{ width: `${syncPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* History Breakdown */}
      {room.gameHistory && room.gameHistory.length > 0 && (
        <div className="w-full bg-[#161b2e]/80 border border-white/10 p-5 rounded-3xl my-4 text-left">
          <span className="text-xs font-bold text-white/50 uppercase tracking-widest block mb-3">
            REKAP MINIGAME:
          </span>
          <div className="space-y-2">
            {room.gameHistory.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white/5 p-3 rounded-xl text-xs">
                <span className="font-bold text-white/90">
                  Ronde {item.round}: {item.gameTitle}
                </span>
                <span className="font-mono text-cyan-300 font-bold">
                  P1: +{item.p1Score} | P2: +{item.p2Score}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Replay Actions */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
        <Button
          variant="primary"
          size="lg"
          onClick={handleRestartMatch}
          className="w-full sm:w-auto"
          icon={RefreshCw}
        >
          Main 1 Ronde Lagi! 🎮
        </Button>
      </div>

      {/* Unlock Celebratory Modal if earned */}
      <UnlockModal unlock={newUnlock} onClose={() => setNewUnlock(null)} />
    </div>
  );
}
