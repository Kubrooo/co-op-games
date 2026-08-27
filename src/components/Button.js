import React from 'react';
import { motion } from 'framer-motion';

export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  className = '',
  icon: Icon
}) {
  const baseStyle = "font-display font-extrabold rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-lg select-none disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-gradient-to-r from-[#ff4d8d] to-[#7928ca] text-white hover:brightness-110 shadow-pink-500/25 active:scale-95 border border-pink-400/30",
    secondary: "bg-gradient-to-r from-[#00f2fe] to-[#00f5d4] text-slate-950 hover:brightness-110 shadow-cyan-500/25 active:scale-95 border border-cyan-300/30",
    outline: "bg-white/5 border border-white/20 text-white hover:bg-white/10 active:scale-95",
    success: "bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 hover:brightness-110 shadow-emerald-500/25 active:scale-95 border border-emerald-300/30",
    danger: "bg-gradient-to-r from-rose-500 to-red-600 text-white hover:brightness-110 shadow-rose-500/25 active:scale-95 border border-rose-400/30"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base sm:text-lg"
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.96 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{children}</span>
    </motion.button>
  );
}
