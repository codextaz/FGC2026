/**
 * api/index.js — Vercel Serverless Function Entry Point for Express REST API
 */
import express from 'express';
import cors from 'cors';

import playersRouter from '../server/routes/players.js';
import bracketsRouter from '../server/routes/brackets.js';
import adminRouter from '../server/routes/admin.js';
import { getDb } from '../server/db.js';

const app = express();

app.use(cors());
app.use(express.json());

// Initialize Database connection on each serverless invocation
app.use(async (req, res, next) => {
  try {
    await getDb();
    next();
  } catch (err) {
    console.error('[Vercel API] DB init error:', err);
    res.status(500).json({ error: 'Database initialization error.' });
  }
});

// Mount API routes
app.use('/api/players', playersRouter);
app.use('/api/brackets', bracketsRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
