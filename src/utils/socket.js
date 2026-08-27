import { io } from 'socket.io-client';

class SocketManager {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.useMock = false;
    this.broadcastChannel = null;
    this.roomId = null;
    this.playerNum = 1;
  }

  connect(serverUrl) {
    const customUrl = localStorage.getItem('duo_server_url');
    const targetUrl = serverUrl || customUrl || import.meta.env.VITE_SOCKET_SERVER_URL || 'https://heavy-foxes-exist.loca.lt';
    
    try {
      this.socket = io(targetUrl, {
        transports: ['websocket', 'polling'],
        timeout: 5000,
        autoConnect: true,
        extraHeaders: {
          "bypass-tunnel-reminder": "true"
        }
      });

      this.socket.on('connect', () => {
        console.log('[SocketManager] Connected to Socket Server:', targetUrl);
        this.useMock = false;
        this.emitToListeners('connection_status', { connected: true, url: targetUrl });
      });

      this.socket.on('connect_error', (err) => {
        console.log('[SocketManager] Backend connection error, enabling fallback local mode:', err.message);
        this.enableMockMode();
        this.emitToListeners('connection_status', { connected: false, url: targetUrl });
      });

      // Pass socket events to registered listeners
      const events = [
        'room_created', 'room_joined', 'room_updated',
        'game_started', 'action_received', 'scores_updated',
        'round_advanced', 'game_ended', 'game_restarted',
        'error_message', 'player_disconnected'
      ];

      events.forEach(event => {
        this.socket.on(event, (data) => {
          this.emitToListeners(event, data);
        });
      });
    } catch (err) {
      console.log('[SocketManager] Connect error, enabling fallback local mode:', err);
      this.enableMockMode();
    }
  }

  enableMockMode() {
    this.useMock = true;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.broadcastChannel = new BroadcastChannel('duo_date_channel');
      this.broadcastChannel.onmessage = (e) => {
        const { event, data } = e.data || {};
        if (event) {
          this.emitToListeners(event, data);
        }
      };
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const callbacks = this.listeners.get(event).filter(cb => cb !== callback);
    this.listeners.set(event, callbacks);
  }

  emitToListeners(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(data));
    }
  }

  // Socket Actions
  createRoom(playerName, avatar) {
    if (this.socket && !this.useMock) {
      this.socket.emit('create_room', { playerName, avatar });
    } else {
      const mockCode = Math.random().toString(36).substring(2, 7).toUpperCase();
      this.roomId = mockCode;
      this.playerNum = 1;
      const room = {
        roomId: mockCode,
        hostId: 'mock_p1',
        players: [{
          id: 'mock_p1',
          playerNum: 1,
          name: playerName || 'Player 1',
          avatar: avatar || '🐱',
          ready: false,
          score: 0,
          wins: 0
        }],
        status: 'LOBBY',
        round: 1,
        totalRounds: 5,
        scores: { p1: 0, p2: 0 },
        gameHistory: []
      };

      // Store in localStorage for multi-tab mock discovery
      localStorage.setItem(`duo_room_${mockCode}`, JSON.stringify(room));

      setTimeout(() => {
        this.emitToListeners('room_created', { roomId: mockCode, player: room.players[0], room });
      }, 100);
    }
  }

  joinRoom(roomId, playerName, avatar) {
    const cleanCode = (roomId || '').trim().toUpperCase();
    if (this.socket && !this.useMock) {
      this.socket.emit('join_room', { roomId: cleanCode, playerName, avatar });
    } else {
      const stored = localStorage.getItem(`duo_room_${cleanCode}`);
      if (!stored) {
        return setTimeout(() => {
          this.emitToListeners('error_message', { message: 'Room tidak ditemukan dalam mode lokal!' });
        }, 100);
      }

      const room = JSON.parse(stored);
      if (room.players.length >= 2) {
        return setTimeout(() => {
          this.emitToListeners('error_message', { message: 'Room penuh!' });
        }, 100);
      }

      this.playerNum = 2;
      this.roomId = cleanCode;
      const p2 = {
        id: 'mock_p2',
        playerNum: 2,
        name: playerName || 'Player 2',
        avatar: avatar || '🐰',
        ready: false,
        score: 0,
        wins: 0
      };

      room.players.push(p2);
      localStorage.setItem(`duo_room_${cleanCode}`, JSON.stringify(room));

      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({ event: 'room_updated', data: { room } });
      }

      setTimeout(() => {
        this.emitToListeners('room_joined', { roomId: cleanCode, player: p2, room });
        this.emitToListeners('room_updated', { room });
      }, 100);
    }
  }

  toggleReady(roomId) {
    if (this.socket && !this.useMock) {
      this.socket.emit('toggle_ready', { roomId });
    } else {
      const stored = localStorage.getItem(`duo_room_${roomId}`);
      if (!stored) return;
      const room = JSON.parse(stored);
      const player = room.players.find(p => p.playerNum === this.playerNum);
      if (player) {
        player.ready = !player.ready;
        localStorage.setItem(`duo_room_${roomId}`, JSON.stringify(room));
        if (this.broadcastChannel) {
          this.broadcastChannel.postMessage({ event: 'room_updated', data: { room } });
        }
        this.emitToListeners('room_updated', { room });
      }
    }
  }

  startGame(roomId) {
    if (this.socket && !this.useMock) {
      this.socket.emit('start_game', { roomId });
    } else {
      const stored = localStorage.getItem(`duo_room_${roomId}`);
      if (!stored) return;
      const room = JSON.parse(stored);
      room.status = 'PLAYING';
      room.round = 1;
      localStorage.setItem(`duo_room_${roomId}`, JSON.stringify(room));

      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({ event: 'game_started', data: { room } });
      }
      this.emitToListeners('game_started', { room });
    }
  }

  submitAction(roomId, actionType, payload) {
    if (this.socket && !this.useMock) {
      this.socket.emit('submit_action', { roomId, actionType, payload });
    } else {
      const data = {
        playerId: `mock_p${this.playerNum}`,
        playerNum: this.playerNum,
        actionType,
        payload,
        timestamp: Date.now()
      };
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({ event: 'action_received', data });
      }
      this.emitToListeners('action_received', data);
    }
  }

  updateScores(roomId, p1Points, p2Points, gameTitle, stats) {
    if (this.socket && !this.useMock) {
      this.socket.emit('update_scores', { roomId, p1Points, p2Points, gameTitle, stats });
    } else {
      const stored = localStorage.getItem(`duo_room_${roomId}`);
      if (!stored) return;
      const room = JSON.parse(stored);
      room.scores.p1 += p1Points || 0;
      room.scores.p2 += p2Points || 0;
      room.gameHistory.push({ round: room.round, gameTitle, p1Score: p1Points, p2Score: p2Points, stats });

      localStorage.setItem(`duo_room_${roomId}`, JSON.stringify(room));
      const data = { scores: room.scores, gameHistory: room.gameHistory };

      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({ event: 'scores_updated', data });
      }
      this.emitToListeners('scores_updated', data);
    }
  }

  nextRound(roomId) {
    if (this.socket && !this.useMock) {
      this.socket.emit('next_round', { roomId });
    } else {
      const stored = localStorage.getItem(`duo_room_${roomId}`);
      if (!stored) return;
      const room = JSON.parse(stored);
      if (room.round >= room.totalRounds) {
        room.status = 'RESULTS';
        if (this.broadcastChannel) {
          this.broadcastChannel.postMessage({ event: 'game_ended', data: { room } });
        }
        this.emitToListeners('game_ended', { room });
      } else {
        room.round += 1;
        localStorage.setItem(`duo_room_${roomId}`, JSON.stringify(room));
        if (this.broadcastChannel) {
          this.broadcastChannel.postMessage({ event: 'round_advanced', data: { round: room.round, room } });
        }
        this.emitToListeners('round_advanced', { round: room.round, room });
      }
    }
  }

  restartGame(roomId) {
    if (this.socket && !this.useMock) {
      this.socket.emit('restart_game', { roomId });
    } else {
      const stored = localStorage.getItem(`duo_room_${roomId}`);
      if (!stored) return;
      const room = JSON.parse(stored);
      room.status = 'LOBBY';
      room.round = 0;
      room.scores = { p1: 0, p2: 0 };
      room.gameHistory = [];
      room.players.forEach(p => p.ready = false);

      localStorage.setItem(`duo_room_${roomId}`, JSON.stringify(room));
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({ event: 'game_restarted', data: { room } });
      }
      this.emitToListeners('game_restarted', { room });
    }
  }
}

export const socketManager = new SocketManager();
