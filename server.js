import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve static frontend files if built
app.use(express.static(path.join(__dirname, 'dist')));

// In-memory room store
const rooms = new Map();

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

io.on('connection', (socket) => {
  console.log(`[Socket] Player connected: ${socket.id}`);

  // Create room
  socket.on('create_room', ({ playerName, avatar }) => {
    const roomId = generateRoomCode();
    const player = {
      id: socket.id,
      playerNum: 1,
      name: playerName || 'Player 1',
      avatar: avatar || '🐱',
      ready: false,
      score: 0,
      wins: 0,
      titles: ['Chaos Duo']
    };

    rooms.set(roomId, {
      roomId,
      hostId: socket.id,
      players: [player],
      status: 'LOBBY', // LOBBY, PLAYING, RESULTS
      round: 0,
      totalRounds: 5,
      gameHistory: [],
      currentMinigame: null,
      scores: { p1: 0, p2: 0 },
      gameData: {}
    });

    socket.join(roomId);
    socket.emit('room_created', { roomId, player, room: rooms.get(roomId) });
  });

  // Join room
  socket.on('join_room', ({ roomId, playerName, avatar }) => {
    const cleanRoomId = (roomId || '').trim().toUpperCase();
    const room = rooms.get(cleanRoomId);

    if (!room) {
      return socket.emit('error_message', { message: 'Kode Room tidak ditemukan!' });
    }

    if (room.players.length >= 2) {
      return socket.emit('error_message', { message: 'Room sudah penuh (maks 2 pemain).' });
    }

    const player = {
      id: socket.id,
      playerNum: 2,
      name: playerName || 'Player 2',
      avatar: avatar || '🐰',
      ready: false,
      score: 0,
      wins: 0,
      titles: ['Professional Yapper']
    };

    room.players.push(player);
    socket.join(cleanRoomId);

    io.to(cleanRoomId).emit('room_updated', { room });
    socket.emit('room_joined', { roomId: cleanRoomId, player, room });
  });

  // Update profile in lobby
  socket.on('update_profile', ({ roomId, name, avatar }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      if (name) player.name = name;
      if (avatar) player.avatar = avatar;
      io.to(roomId).emit('room_updated', { room });
    }
  });

  // Toggle ready status
  socket.on('toggle_ready', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.ready = !player.ready;
      io.to(roomId).emit('room_updated', { room });
    }
  });

  // Start game flow (Host only)
  socket.on('start_game', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    if (room.hostId !== socket.id) return;
    if (room.players.length < 2) return;

    room.status = 'PLAYING';
    room.round = 1;
    room.scores = { p1: 0, p2: 0 };
    room.gameHistory = [];

    io.to(roomId).emit('game_started', { room });
  });

  // Broadcast minigame action / choice submission
  socket.on('submit_action', ({ roomId, actionType, payload }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    const playerNum = player ? player.playerNum : 1;

    io.to(roomId).emit('action_received', {
      playerId: socket.id,
      playerNum,
      actionType,
      payload,
      timestamp: Date.now()
    });
  });

  // Update scores after a minigame round
  socket.on('update_scores', ({ roomId, p1Points, p2Points, gameTitle, stats }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    room.scores.p1 += (p1Points || 0);
    room.scores.p2 += (p2Points || 0);

    room.gameHistory.push({
      round: room.round,
      gameTitle,
      p1Score: p1Points,
      p2Score: p2Points,
      stats
    });

    io.to(roomId).emit('scores_updated', {
      scores: room.scores,
      gameHistory: room.gameHistory
    });
  });

  // Move to next round or end game
  socket.on('next_round', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    if (room.round >= room.totalRounds) {
      room.status = 'RESULTS';
      io.to(roomId).emit('game_ended', { room });
    } else {
      room.round += 1;
      io.to(roomId).emit('round_advanced', { round: room.round, room });
    }
  });

  // Restart match
  socket.on('restart_game', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    room.status = 'LOBBY';
    room.round = 0;
    room.scores = { p1: 0, p2: 0 };
    room.gameHistory = [];
    room.players.forEach(p => p.ready = false);

    io.to(roomId).emit('game_restarted', { room });
  });

  // Player disconnect handling
  socket.on('disconnect', () => {
    console.log(`[Socket] Player disconnected: ${socket.id}`);
    rooms.forEach((room, roomId) => {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        const disconnectedPlayer = room.players[playerIndex];
        room.players.splice(playerIndex, 1);

        if (room.players.length === 0) {
          rooms.delete(roomId);
        } else {
          io.to(roomId).emit('player_disconnected', {
            playerName: disconnectedPlayer.name,
            room
          });
        }
      }
    });
  });
});

// Fallback for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🎮 Duo Chaos Socket Server running on port ${PORT}`);
});
