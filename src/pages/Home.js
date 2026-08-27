import React, { useState } from 'react';
import { useGame } from '../hooks/useGame';
import { Button } from '../components/Button';
import { AvatarSelector } from '../components/AvatarSelector';
import { motion } from 'framer-motion';
import { Zap, Sparkles, Gamepad2, ArrowRight } from 'lucide-react';

export function Home() {
  const { handleCreateRoom, handleJoinRoom, errorMessage, setErrorMessage, userData } = useGame();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🐱');
  const [joinCode, setJoinCode] = useState('');
  const [showJoinInput, setShowJoinInput] = useState(false);

  const onCreate = () => {
    if (!name.trim()) {
      setErrorMessage('Silakan isi nama kamu terlebih dahulu!');
      return;
    }
    setErrorMessage('');
    handleCreateRoom(name.trim(), avatar);
  };

  const onJoin = () => {
    if (!name.trim()) {
      setErrorMessage('Silakan isi nama kamu terlebih dahulu!');
      return;
    }
    if (!joinCode.trim()) {
      setErrorMessage('Masukkan kode room!');
      return;
    }
    setErrorMessage('');
    handleJoinRoom(joinCode.trim(), name.trim(), avatar);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center px-4 py-8 relative z-10">
      {/* Floating Hero Characters */}
      <div className="flex items-center justify-center space-x-6 my-4">
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#ff4d8d]/30 to-[#7928ca]/30 border-2 border-pink-400 flex items-center justify-center text-4xl sm:text-5xl shadow-2xl shadow-pink-500/30 backdrop-blur-md"
        >
          <span>🐱</span>
        </motion.div>

        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#ff4d8d] to-[#00f2fe] p-0.5 flex items-center justify-center shadow-lg animate-pulse">
          <div className="w-full h-full bg-[#0d0f1d] rounded-full flex items-center justify-center">
            <Zap className="w-6 h-6 text-[#00f2fe] fill-[#00f2fe]" />
          </div>
        </div>

        <motion.div
          animate={{ y: [0, -12, 0], rotate: [4, -4, 4] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#00f2fe]/30 to-[#00f5d4]/30 border-2 border-cyan-400 flex items-center justify-center text-4xl sm:text-5xl shadow-2xl shadow-cyan-500/30 backdrop-blur-md"
        >
          <span>🐰</span>
        </motion.div>
      </div>

      {/* Main Tagline */}
      <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight my-3">
        Two players.{' '}
        <span className="bg-gradient-to-r from-[#ff4d8d] via-[#00f2fe] to-[#00f5d4] bg-clip-text text-transparent block sm:inline">
          One questionable amount of competitiveness.
        </span>
      </h1>

      <p className="text-sm sm:text-base text-white/70 font-semibold max-w-lg mb-8">
        Browser game multiplayer 2-player paling seru & chaotic. Mainkan 5 minigame kocak dan chaos events!
      </p>

      {/* Error Toast */}
      {errorMessage && (
        <div className="w-full max-w-md bg-rose-500/20 border border-rose-400/40 text-rose-300 px-4 py-2 rounded-2xl text-xs font-bold mb-4 animate-shake">
          {errorMessage}
        </div>
      )}

      {/* Profile Form Card */}
      <div className="w-full bg-[#161b2e]/90 border border-white/10 p-6 rounded-3xl backdrop-blur-xl shadow-2xl space-y-5 text-left mb-6">
        <div>
          <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">
            Nama / Nickname Kamu:
          </label>
          <input
            type="text"
            placeholder="Contoh: Yapper, Pro Gamer, Si Paling Panic..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-black/40 border border-white/15 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 text-sm font-semibold transition-all"
          />
        </div>

        <AvatarSelector
          selectedEmoji={avatar}
          onSelect={setAvatar}
          unlockedAvatars={userData?.unlockedAvatars}
        />

        {/* Optional Server URL Setting */}
        <div className="pt-2 border-t border-white/10">
          <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">
            Server Backend URL (Opsional — untuk Localtunnel / Online Server):
          </label>
          <input
            type="text"
            placeholder="Contoh: https://sweet-cat-42.loca.lt"
            defaultValue={localStorage.getItem('duo_server_url') || ''}
            onChange={(e) => {
              const url = e.target.value.trim();
              if (url) localStorage.setItem('duo_server_url', url);
              else localStorage.removeItem('duo_server_url');
            }}
            className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/20 text-xs font-mono transition-all"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button
          variant="primary"
          size="lg"
          onClick={onCreate}
          className="w-full sm:w-auto"
          icon={Gamepad2}
        >
          Buat Room Baru
        </Button>

        {!showJoinInput ? (
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowJoinInput(true)}
            className="w-full sm:w-auto"
          >
            Masuk Kode Room
          </Button>
        ) : (
          <div className="w-full sm:w-auto flex items-center space-x-2">
            <input
              type="text"
              placeholder="KODE ROOM (misal: A1B2C)"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              className="px-4 py-3 bg-black/50 border border-white/20 rounded-2xl text-white font-mono text-sm font-bold placeholder-white/30 focus:outline-none focus:border-pink-400 uppercase tracking-widest w-full"
            />
            <Button variant="secondary" size="md" onClick={onJoin} icon={ArrowRight}>
              Masuk
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
