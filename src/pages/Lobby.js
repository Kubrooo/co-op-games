import React from 'react';
import { useGame } from '../hooks/useGame';
import { RoomCode } from '../components/RoomCode';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { motion } from 'framer-motion';
import { Play, CheckCircle2, UserCheck } from 'lucide-react';

export function Lobby() {
  const { player, room, handleToggleReady, handleStartGame, errorMessage } = useGame();

  const isHost = room.hostId === player.id || player.playerNum === 1;
  const players = room.players || [];
  const p1 = players.find(p => p.playerNum === 1) || { name: 'Player 1', avatar: '🐱', ready: false };
  const p2 = players.find(p => p.playerNum === 2);

  const bothReady = players.length >= 2 && players.every(p => p.ready);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center px-4 py-6">
      {/* Header */}
      <span className="text-xs font-black tracking-widest text-cyan-400 uppercase bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full mb-3">
        LOBBY PERMAINAN
      </span>
      <h1 className="font-display font-black text-2xl sm:text-3xl text-white mb-6">
        Tunggu Teman Mainmu & Siapkan Diri!
      </h1>

      {/* Room Code Display */}
      <RoomCode code={room.roomId} />

      {/* Error Toast */}
      {errorMessage && (
        <div className="w-full bg-rose-500/20 border border-rose-400/40 text-rose-300 px-4 py-2 rounded-2xl text-xs font-bold my-4">
          {errorMessage}
        </div>
      )}

      {/* Players Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
        {/* Player 1 */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-6 rounded-3xl border-2 backdrop-blur-xl flex flex-col items-center relative overflow-hidden transition-all ${
            p1.ready
              ? 'bg-emerald-500/10 border-emerald-400/50 shadow-xl shadow-emerald-500/10'
              : 'bg-[#161b2e] border-white/10'
          }`}
        >
          <Avatar emoji={p1.avatar} size="lg" isReady={p1.ready} title="Player 1 (Host)" />
          <span className="font-display font-extrabold text-xl text-white mt-3">
            {p1.name} {p1.playerNum === player.playerNum && '(Kamu)'}
          </span>
          <span className={`text-xs font-bold mt-1 ${p1.ready ? 'text-emerald-400' : 'text-white/40'}`}>
            {p1.ready ? 'SIAP TEMPUR! ✓' : 'Belum Ready...'}
          </span>
        </motion.div>

        {/* Player 2 */}
        <motion.div
          whileHover={p2 ? { scale: 1.02 } : {}}
          className={`p-6 rounded-3xl border-2 backdrop-blur-xl flex flex-col items-center justify-center relative overflow-hidden transition-all ${
            p2
              ? p2.ready
                ? 'bg-emerald-500/10 border-emerald-400/50 shadow-xl shadow-emerald-500/10'
                : 'bg-[#161b2e] border-white/10'
              : 'bg-white/5 border-dashed border-white/20'
          }`}
        >
          {p2 ? (
            <>
              <Avatar emoji={p2.avatar} size="lg" isReady={p2.ready} title="Player 2" />
              <span className="font-display font-extrabold text-xl text-white mt-3">
                {p2.name} {p2.playerNum === player.playerNum && '(Kamu)'}
              </span>
              <span className={`text-xs font-bold mt-1 ${p2.ready ? 'text-emerald-400' : 'text-white/40'}`}>
                {p2.ready ? 'SIAP TEMPUR! ✓' : 'Belum Ready...'}
              </span>
            </>
          ) : (
            <div className="flex flex-col items-center py-4">
              <span className="text-4xl animate-bounce mb-2">⏳</span>
              <span className="font-display font-bold text-sm text-white/60">
                Menunggu Player 2 Masuk...
              </span>
              <span className="text-xs text-white/40 mt-1">
                Bagi kode room ke partner mainmu!
              </span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Action Controls */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button
          variant={player.ready ? "success" : "primary"}
          size="lg"
          onClick={handleToggleReady}
          className="w-full sm:w-auto"
          icon={CheckCircle2}
        >
          {player.ready ? 'Batal Ready' : 'Saya Ready!'}
        </Button>

        {isHost && (
          <Button
            variant="secondary"
            size="lg"
            disabled={!bothReady}
            onClick={handleStartGame}
            className="w-full sm:w-auto"
            icon={Play}
          >
            {bothReady ? 'Mulai Game Now!' : 'Tunggu Kedua Pemain Ready'}
          </Button>
        )}
      </div>
    </div>
  );
}
