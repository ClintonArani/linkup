import express, { NextFunction, Request, Response, json } from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import user_router from './routers/user.router';
import auth_router from './routers/auth.router';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mssql from 'mssql';
import { sqlConfig } from './config/sqlConfig';
import { v4 } from 'uuid';
import message_router from './routers/message.router';
import connectionRouter from './routers/connection.router';
import forumRouter from './routers/forum.router';
import attachment_router from './routers/attachment.router';
import resource_router from './routers/resource.router';
import chatbotRouter from './routers/chatbot.router';
import path from 'path';
import fs from 'fs';
import post_router from './routers/post.router';

dotenv.config();

const app = express();
app.use(json());
app.use(cors());

app.use(fileUpload({
    createParentPath: true,
    limits: { 
        fileSize: 50 * 1024 * 1024 // 50MB
    },
    useTempFiles: false, // Keep as false for memory storage
    abortOnLimit: true,
    responseOnLimit: 'File size too large',
    debug: true 
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add logging middleware to capture request details
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

// Add routers
app.use('/users', user_router);
app.use('/auth', auth_router);
app.use('/messages', message_router);
app.use('/connections', connectionRouter);
app.use('/api', forumRouter);
app.use('/attachments', attachment_router);
app.use('/resources', resource_router);
app.use('/chatbot', chatbotRouter);
app.use('/posts', post_router);

// Handle 404 errors
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT;

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow all origins (update this in production)
        methods: ["GET", "POST"]
    }
});

// Database connection pool
let pool: mssql.ConnectionPool;

// Connect to the database
async function connectToDatabase() {
    try {
        pool = await mssql.connect(sqlConfig);
        console.log('Database connection established.');
    } catch (err) {
        console.error('Failed to connect to the database:', err);
        process.exit(1); // Exit the process if the database connection fails
    }
}

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a room based on user ID
  socket.on('joinRoom', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
  });

  // Handle sending messages
  socket.on('sendMessage', async (data) => {
      const { sender_id, receiver_id, message } = data;
      console.log('Received message data:', data);

      try {
          // Save the message to the database
          const message_id = v4();
          const request = pool.request()
              .input('id', mssql.VarChar, message_id)
              .input('sender_id', mssql.VarChar, sender_id)
              .input('receiver_id', mssql.VarChar, receiver_id)
              .input('message', mssql.Text, message);

          console.log('Executing database query...');
          const result = await request.execute('sendMessage');
          console.log('Message saved to database:', result);

          // Emit the message to the receiver
          console.log(`Emitting message to receiver ${receiver_id}`);
          io.to(receiver_id).emit('receiveMessage', {
              sender_id,
              message,
              timestamp: new Date()
          });
      } catch (err) {
          console.error('Failed to save message:', err);
          // Emit an error event to the sender
          socket.emit('messageError', { error: 'Failed to send message' });
      }
  });

  // Join a forum room
  socket.on('joinForum', (forum_id) => {
      socket.join(forum_id);
      console.log(`User ${socket.id} joined forum room: ${forum_id}`);
  });

  // Handle sending forum messages
  socket.on('sendForumMessage', async (data) => {
      const { forum_id, sender_id, message, file_url, file_name } = data;
      console.log('Received forum message data:', data);

      try {
          // Save the message to the database
          const message_id = v4();
          const request = pool.request()
              .input('id', mssql.VarChar, message_id)
              .input('forum_id', mssql.VarChar, forum_id)
              .input('sender_id', mssql.VarChar, sender_id)
              .input('message', mssql.Text, message)
              .input('file_url', mssql.VarChar, file_url)
              .input('file_name', mssql.VarChar, file_name);

          console.log('Executing database query...');
          const result = await request.execute('sendForumMessage');
          console.log('Message saved to database:', result);

          // Emit the message to the forum room
          console.log(`Emitting message to forum room ${forum_id}`);
          io.to(forum_id).emit('receiveForumMessage', {
              sender_id,
              message,
              file_url,
              file_name,
              timestamp: new Date()
          });
      } catch (err) {
          console.error('Failed to save forum message:', err);
          // Emit an error event to the sender
          socket.emit('messageError', { error: 'Failed to send forum message' });
      }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
  });
});

// Start the server
(async () => {
    await connectToDatabase(); // Connect to the database before starting the server
    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}...`);
    });
})();