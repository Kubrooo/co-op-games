// 15 Random Events that occasionally alter minigame rounds
export const RANDOM_EVENTS = [
  {
    id: 'double_points',
    title: '⚡ DOUBLE POINTS!',
    description: 'Skor ronde ini dilipatgandakan x2!',
    icon: '⚡',
    badgeColor: 'from-amber-400 to-yellow-500',
    effect: 'double'
  },
  {
    id: 'reverse_controls',
    title: '🔄 REVERSE CONTROLS!',
    description: 'Awas! Posisi tombol pilihan tertukar!',
    icon: '🔄',
    badgeColor: 'from-purple-500 to-pink-500',
    effect: 'reverse'
  },
  {
    id: 'chaos_timer',
    title: '⏳ 10-SECOND CHAOS!',
    description: 'Waktu ronde cuma 10 detik! Cepat!',
    icon: '🔥',
    badgeColor: 'from-red-500 to-orange-500',
    effect: 'fast_timer'
  },
  {
    id: 'tiny_avatar',
    title: '🔍 TINY PLAYERS!',
    description: 'Avatar kalian mengecil jadi imut banget!',
    icon: '🐜',
    badgeColor: 'from-cyan-400 to-blue-500',
    effect: 'tiny'
  },
  {
    id: 'screen_shake',
    title: '📳 SCREEN SHAKE!',
    description: 'Layar bergoyang heboh karena gelombang chaos!',
    icon: '💥',
    badgeColor: 'from-pink-500 to-rose-600',
    effect: 'shake'
  },
  {
    id: 'speed_boost',
    title: '🚀 SPEED BOOST!',
    description: 'Bonus kecepatan respon +50 poin tambahan!',
    icon: '🚀',
    badgeColor: 'from-emerald-400 to-teal-500',
    effect: 'speed'
  },
  {
    id: 'sudden_death',
    title: '💀 SUDDEN DEATH!',
    description: 'Hanya jawaban sempurna yang dapat poin!',
    icon: '💀',
    badgeColor: 'from-indigo-600 to-purple-800',
    effect: 'sudden_death'
  },
  {
    id: 'invisible_choice',
    title: '🙈 INVISIBLE CHOICES!',
    description: 'Teks pilihan menghilang dalam 2 detik!',
    icon: '🙈',
    badgeColor: 'from-gray-600 to-slate-800',
    effect: 'invisible'
  },
  {
    id: 'swap_scores',
    title: '🔀 SCORE STEAL!',
    description: 'Pemenang ronde ini mengambil 50 poin lawan!',
    icon: '🔀',
    badgeColor: 'from-violet-500 to-fuchsia-600',
    effect: 'steal'
  },
  {
    id: 'teamwork_boost',
    title: '🤝 TEAMWORK SYNC!',
    description: 'Jika kalian setuju, keduanya dapat +150 bonus!',
    icon: '🤝',
    badgeColor: 'from-teal-400 to-cyan-500',
    effect: 'teamwork'
  },
  {
    id: 'midas_touch',
    title: '✨ GOLDEN STREAK!',
    description: 'Combo streak memberikan multiplier x3!',
    icon: '✨',
    badgeColor: 'from-yellow-300 to-amber-500',
    effect: 'gold'
  },
  {
    id: 'flash_flash',
    title: '📸 FLASH PARTY!',
    description: 'Layar berkedip gemerlap warna-warni!',
    icon: '📸',
    badgeColor: 'from-rose-400 to-purple-500',
    effect: 'flash'
  },
  {
    id: 'super_combo',
    title: '🔥 SUPER COMBO!',
    description: 'Setiap jawaban benar langsung menambah streak +2!',
    icon: '🔥',
    badgeColor: 'from-orange-500 to-red-600',
    effect: 'super_combo'
  },
  {
    id: 'giggle_mode',
    title: '🤭 GIGGLE MODE!',
    description: 'Efek suara lucu diaktifkan setiap menekan tombol!',
    icon: '🤭',
    badgeColor: 'from-lime-400 to-emerald-500',
    effect: 'giggle'
  },
  {
    id: 'gravity_flip',
    title: '🙃 GRAVITY FLIP!',
    description: 'Tampilan arena terbalik secara playful!',
    icon: '🙃',
    badgeColor: 'from-sky-400 to-indigo-500',
    effect: 'flip'
  }
];
