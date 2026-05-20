require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const http = require('http');
const passport = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const db = require('./config/db');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '200kb' }));

const sessionMiddleware = session({ secret: process.env.SESSION_SECRET || 'dev', resave: false, saveUninitialized: false });
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// auth routes
app.use('/auth', authRoutes);

// API routes
app.use('/api', apiRoutes);

// create default rooms at startup
async function ensureDefaultRooms() {
  const names = ['General', 'Random', 'Support'];
  for (const n of names) {
    const r = await db.query('SELECT id FROM rooms WHERE name=$1', [n]);
    if (!r.rows.length) {
      await db.query('INSERT INTO rooms (id, name, is_private) VALUES ($1,$2,$3)', [uuidv4(), n, false]);
    }
  }
}

ensureDefaultRooms().catch(console.error);

// set up socket.io
const setupSocket = require('./lib/socket');
const io = setupSocket(server, sessionMiddleware, app);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log('PrivChat server listening on', PORT));
