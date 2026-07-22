/**
 * server/index.js — Express REST API server for EVO FGC Competition
 * Runs on PORT defined in server/.env (default: 3001)
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import playersRouter from './routes/players.js';
import bracketsRouter from './routes/brackets.js';
import adminRouter from './routes/admin.js';
import { getDb } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-admin-token'],
}));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/players', playersRouter);
app.use('/api/brackets', bracketsRouter);
app.use('/api/admin', adminRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Static Frontend Delivery (for Production Deployment) ─────────────────────
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// SPA fallback for non-API client routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

// ─── Start ────────────────────────────────────────────────────────────────────
async function start() {
  // Initialise the DB (creates file + seeds brackets on first run)
  await getDb();

  app.listen(PORT, () => {
    console.log(`\n🔥 EVO FGC API running at http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
    console.log(`   Players: http://localhost:${PORT}/api/players`);
    console.log(`   Brackets: http://localhost:${PORT}/api/brackets\n`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
