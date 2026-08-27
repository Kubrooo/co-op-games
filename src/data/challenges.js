// Data for Memory Chaos & Duo Co-op Challenges

export const MEMORY_CARDS_DATA = [
  { id: 1, symbol: '❤️', color: 'bg-rose-500' },
  { id: 2, symbol: '⭐', color: 'bg-amber-400' },
  { id: 3, symbol: '🍕', color: 'bg-orange-500' },
  { id: 4, symbol: '🚀', color: 'bg-cyan-500' },
  { id: 5, symbol: '🥑', color: 'bg-emerald-500' },
  { id: 6, symbol: '💎', color: 'bg-blue-500' },
  { id: 7, symbol: '🔥', color: 'bg-red-500' },
  { id: 8, symbol: '⚡', color: 'bg-yellow-400' },
  { id: 9, symbol: '🎉', color: 'bg-purple-500' },
  { id: 10, symbol: '🍓', color: 'bg-pink-500' },
  { id: 11, symbol: '🍩', color: 'bg-amber-600' },
  { id: 12, symbol: '🍦', color: 'bg-teal-400' }
];

export const DUO_PATTERNS = [
  {
    instruction: "Player 1: Kasih tahu Player 2 urutan tombol ini!",
    sequence: ['RED', 'BLUE', 'YELLOW', 'GREEN'],
    labels: { RED: '🔴 Merah', BLUE: '🔵 Biru', YELLOW: '🟡 Kuning', GREEN: '🟢 Hijau' }
  },
  {
    instruction: "Player 1: Sebutkan kombinasi emoji ini!",
    sequence: ['HEART', 'STAR', 'FIRE'],
    labels: { HEART: '❤️ Hati', STAR: '⭐ Bintang', FIRE: '🔥 Api', DIAMOND: '💎 Berlian' }
  },
  {
    instruction: "Player 1: Instruksikan kode rahasia ini!",
    sequence: ['UP', 'DOWN', 'LEFT', 'RIGHT'],
    labels: { UP: '⬆️ Atas', DOWN: '⬇️ Bawah', LEFT: '⬅️ Kiri', RIGHT: '➡️ Kanan' }
  },
  {
    instruction: "Player 1: Teriakkan warna buah-buahan ini!",
    sequence: ['YELLOW', 'RED', 'GREEN', 'RED'],
    labels: { RED: '🍎 Apel', YELLOW: '🍌 Pisang', GREEN: 'Melon', BLUE: '🫐 Blueberry' }
  },
  {
    instruction: "Player 1: Pandu Player 2 menekan nomor ini!",
    sequence: ['ONE', 'THREE', 'TWO', 'FOUR'],
    labels: { ONE: '1️⃣ Satu', TWO: '2️⃣ Dua', THREE: '3️⃣ Tiga', FOUR: '4️⃣ Empat' }
  },
  {
    instruction: "Player 1: Instruksikan gerakan dansa ini!",
    sequence: ['LEFT', 'RIGHT', 'UP', 'UP'],
    labels: { UP: '⬆️ Lompat', DOWN: '⬇️ Jongkok', LEFT: '⬅️ Kiri', RIGHT: '➡️ Kanan' }
  },
  {
    instruction: "Player 1: Berikan sinyal cuaca ini!",
    sequence: ['SUN', 'RAIN', 'FLASH', 'SUN'],
    labels: { SUN: '☀️ Cerah', RAIN: '🌧️ Hujan', FLASH: '⚡ Petir', WIND: '💨 Angin' }
  },
  {
    instruction: "Player 1: Diktekan pesanan makanan cepat saji ini!",
    sequence: ['BURGER', 'FRIES', 'BOBA'],
    labels: { BURGER: '🍔 Burger', FRIES: '🍟 Kentang', BOBA: '🧋 Boba', PIZZA: '🍕 Pizza' }
  }
];
