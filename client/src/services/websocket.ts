import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const pool = new Pool({
  // Your PostgreSQL connection config
});

export const setupWebSocket = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  // Listen for database changes using LISTEN/NOTIFY
  const client = await pool.connect();
  await client.query('LISTEN notification_insert');

  client.on('notification', async (msg) => {
    if (msg.channel === 'notification_insert') {
      const payload = JSON.parse(msg.payload!);
      io.to(payload.user_id).emit('notification', payload);
    }
  });

  return io;
};