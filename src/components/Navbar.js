import React from 'react';
import { useGame } from '../hooks/useGame';
import { Volume2, VolumeX, Zap, Trophy, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { isMuted, toggleSoundMute, room, player, page, setPage } = useGame();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (room?.roomId) {
      navigator.clipboard.writeText(room.roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="w-full bg-[#161b2e]/80 backdrop-blur-md border-b border-white/10 px-4 py-3 sticky top-0 z-40 flex items-center justify-between shadow-lg">
      {/* Brand Logo */}
      <div 
        onClick={() => setPage('HOME')}
        className="flex items-center space-x-2 cursor-pointer group"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff4d8d] to-[#00f2fe] p-0.5 flex items-center justify-center shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
          <div className="w-full h-full bg-[#0d0f1d] rounded-[10px] flex items-center justify-center">
            <Zap className="w-5 h-5 text-[#00f2fe] fill-[#00f2fe] animate-pulse" />
          </div>
        </div>
        <div>
          <span className="font-display font-extrabold text-xl tracking-wider bg-gradient-to-r from-[#ff4d8d] via-[#00f2fe] to-[#00f5d4] bg-clip-text text-transparent">
            DUO CHAOS
          </span>
          <span className="hidden sm:inline-block text-[10px] text-white/50 uppercase tracking-widest font-semibold ml-2">
            Co-op Arcade
          </span>
        </div>
      </div>

      {/* Room Badge if in room */}
      {room?.roomId && page !== 'HOME' && (
        <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
          <span className="text-xs text-white/60 font-semibold uppercase tracking-wider hidden sm:inline">Room:</span>
          <span className="font-mono font-bold text-amber-300 tracking-wider text-sm">{room.roomId}</span>
          <button 
            onClick={handleCopyCode} 
            className="text-white/60 hover:text-white transition-colors p-1"
            title="Salin Kode Room"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center space-x-3">
        {/* Mute Audio */}
        <button
          onClick={toggleSoundMute}
          className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-all"
          title={isMuted ? "Aktifkan Suara" : "Matikan Suara"}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        {/* Player Profile Badge */}
        {player?.avatar && (
          <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
            <span className="text-lg">{player.avatar}</span>
            <span className="text-xs font-bold text-white/90 max-w-[80px] truncate">{player.name}</span>
          </div>
        )}
      </div>
    </header>
  );
}
