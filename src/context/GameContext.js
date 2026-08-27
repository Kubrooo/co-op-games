import React, { createContext, useContext, useState, useEffect } from 'react';
import { socketManager } from '../utils/socket';
import { sound } from '../utils/sound';
import { getStoredUserData, unlockItem, updateMatchStats } from '../utils/storage';
import { RANDOM_EVENTS } from '../data/events';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [page, setPage] = useState('HOME'); // HOME, LOBBY, GAME, RESULTS
  const [player, setPlayer] = useState({
    id: null,
    playerNum: 1,
    name: 'Player 1',
    avatar: '🐱',
    ready: false,
    score: 0
  });

  const [room, setRoom] = useState({
    roomId: '',
    hostId: '',
    players: [],
    status: 'LOBBY',
    round: 1,
    totalRounds: 5,
    scores: { p1: 0, p2: 0 },
    gameHistory: []
  });

  const [currentGameType, setCurrentGameType] = useState('WHO_IS_MORE_LIKELY');
  const [activeEvent, setActiveEvent] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [userData, setUserData] = useState(getStoredUserData());
  const [errorMessage, setErrorMessage] = useState('');
  const [newUnlock, setNewUnlock] = useState(null);

  // Initialize socket listeners
  useEffect(() => {
    socketManager.connect();

    socketManager.on('room_created', ({ roomId, player: pData, room: rData }) => {
      setPlayer(pData);
      setRoom(rData);
      setPage('LOBBY');
      sound.playClick();
    });

    socketManager.on('room_joined', ({ roomId, player: pData, room: rData }) => {
      setPlayer(pData);
      setRoom(rData);
      setPage('LOBBY');
      sound.playClick();
    });

    socketManager.on('room_updated', ({ room: rData }) => {
      setRoom(rData);
      const me = rData.players.find(p => p.playerNum === player.playerNum || p.id === player.id);
      if (me) {
        setPlayer(prev => ({ ...prev, ...me }));
      }
    });

    socketManager.on('game_started', ({ room: rData }) => {
      setRoom(rData);
      setPage('GAME');
      selectNextMinigame(1);
      sound.playSuccess();
    });

    socketManager.on('scores_updated', ({ scores, gameHistory }) => {
      setRoom(prev => ({
        ...prev,
        scores,
        gameHistory
      }));
    });

    socketManager.on('round_advanced', ({ round, room: rData }) => {
      setRoom(rData);
      selectNextMinigame(round);
    });

    socketManager.on('game_ended', ({ room: rData }) => {
      setRoom(rData);
      setPage('RESULTS');
      sound.playVictory();

      // Process unlocks & stats
      const totalP1 = rData.scores.p1 || 0;
      const totalP2 = rData.scores.p2 || 0;
      const syncPct = Math.round(Math.min(100, ((totalP1 + totalP2) / 1000) * 100));
      const updated = updateMatchStats({
        syncPercentage: syncPct,
        combo: 5,
        isPerfectSync: syncPct > 85
      });
      setUserData(updated);

      if (syncPct > 80 && !updated.unlockedTitles.includes('Perfect Sync')) {
        const fresh = unlockItem('title', 'Perfect Sync');
        setUserData(fresh);
        setNewUnlock({ type: 'Title', name: 'Perfect Sync', icon: '💖' });
      }
    });

    socketManager.on('game_restarted', ({ room: rData }) => {
      setRoom(rData);
      setPage('LOBBY');
    });

    socketManager.on('error_message', ({ message }) => {
      setErrorMessage(message);
      sound.playFail();
    });

    socketManager.on('player_disconnected', ({ playerName, room: rData }) => {
      setErrorMessage(`Pemain ${playerName} terputus dari room.`);
      if (rData) setRoom(rData);
    });
  }, [player.playerNum, player.id]);

  const selectNextMinigame = (roundNum) => {
    const minigames = ['WHO_IS_MORE_LIKELY', 'SYNC', 'REACTION', 'MEMORY', 'DUO_CHALLENGE'];
    const selected = minigames[(roundNum - 1) % minigames.length];
    setCurrentGameType(selected);

    // 40% chance of random event trigger
    if (Math.random() < 0.45) {
      const randomEvt = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
      setActiveEvent(randomEvt);
      sound.playEventTrigger();
    } else {
      setActiveEvent(null);
    }
  };

  const handleCreateRoom = (name, avatar) => {
    socketManager.createRoom(name, avatar);
  };

  const handleJoinRoom = (code, name, avatar) => {
    socketManager.joinRoom(code, name, avatar);
  };

  const handleToggleReady = () => {
    socketManager.toggleReady(room.roomId);
    sound.playClick();
  };

  const handleStartGame = () => {
    socketManager.startGame(room.roomId);
  };

  const handleFinishRound = (p1Points, p2Points, gameTitle, stats) => {
    let finalP1 = p1Points;
    let finalP2 = p2Points;

    // Apply Random Event multipliers
    if (activeEvent) {
      if (activeEvent.effect === 'double') {
        finalP1 *= 2;
        finalP2 *= 2;
      }
    }

    socketManager.updateScores(room.roomId, finalP1, finalP2, gameTitle, stats);
    setTimeout(() => {
      socketManager.nextRound(room.roomId);
    }, 1500);
  };

  const handleRestartMatch = () => {
    socketManager.restartGame(room.roomId);
    sound.playClick();
  };

  const toggleSoundMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    sound.setMuted(newMuteState);
    sound.playClick();
  };

  return (
    <GameContext.Provider value={{
      page,
      setPage,
      player,
      setPlayer,
      room,
      currentGameType,
      activeEvent,
      isMuted,
      toggleSoundMute,
      userData,
      errorMessage,
      setErrorMessage,
      newUnlock,
      setNewUnlock,
      handleCreateRoom,
      handleJoinRoom,
      handleToggleReady,
      handleStartGame,
      handleFinishRound,
      handleRestartMatch
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
