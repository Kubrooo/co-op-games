// LocalStorage manager for saving user unlocks, badges, titles, and audio preference
const STORAGE_KEY = 'duo_date_user_data_v1';

export function getStoredUserData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (err) {
    console.error('Failed to parse stored user data:', err);
  }

  // Default initial data
  return {
    unlockedAvatars: ['🐱', '🐰', '🐼', '🦊'],
    unlockedTitles: ['Chaos Duo', 'Professional Yapper', 'Certified Teammate'],
    unlockedFrames: ['default', 'neon_pink'],
    stats: {
      matchesPlayed: 0,
      totalSyncPercentage: 0,
      highestCombo: 0,
      perfectSyncs: 0
    },
    audioMuted: false
  };
}

export function saveUserData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save user data:', err);
  }
}

export function unlockItem(type, item) {
  const data = getStoredUserData();
  if (type === 'avatar' && !data.unlockedAvatars.includes(item)) {
    data.unlockedAvatars.push(item);
  } else if (type === 'title' && !data.unlockedTitles.includes(item)) {
    data.unlockedTitles.push(item);
  } else if (type === 'frame' && !data.unlockedFrames.includes(item)) {
    data.unlockedFrames.push(item);
  }
  saveUserData(data);
  return data;
}

export function updateMatchStats({ syncPercentage, combo, isPerfectSync }) {
  const data = getStoredUserData();
  data.stats.matchesPlayed += 1;
  data.stats.totalSyncPercentage = Math.round(
    ((data.stats.totalSyncPercentage * (data.stats.matchesPlayed - 1)) + syncPercentage) / data.stats.matchesPlayed
  );
  if (combo > data.stats.highestCombo) {
    data.stats.highestCombo = combo;
  }
  if (isPerfectSync) {
    data.stats.perfectSyncs += 1;
  }
  saveUserData(data);
  return data;
}
