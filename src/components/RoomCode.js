import React, { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function RoomCode({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-xl shadow-xl w-full max-w-sm">
      <span className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">
        KODE ROOM MAIN
      </span>
      <div className="flex items-center space-x-3 my-1">
        <span className="font-mono text-4xl font-extrabold tracking-widest bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
          {code || '------'}
        </span>
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleCopy}
        className="mt-2 flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-400/30 rounded-xl text-xs font-bold text-cyan-300 transition-all shadow-md"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Tersalin ke Clipboard!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span>Salin Kode Room</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
