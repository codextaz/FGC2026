/**
 * routes/brackets.js — Tournament bracket endpoints.
 *
 * GET   /api/brackets                      → all brackets (grouped by gameId)
 * PATCH /api/brackets/:gameId/:matchId     → update a single match result (admin)
 */
import { Router } from 'express';
import { getDb } from '../db.js';

const router = Router();

// ─── GET /api/brackets ────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  const db = await getDb();
  res.json(db.data.brackets);
});

// ─── PATCH /api/brackets/:gameId/:matchId ─────────────────────────────────────
router.patch('/:gameId/:matchId', async (req, res) => {
  const db = await getDb();
  const { gameId, matchId } = req.params;
  const { player1, player2, score1, score2, winner } = req.body;

  const gameMatches = db.data.brackets[gameId];
  if (!gameMatches) return res.status(404).json({ error: `Game "${gameId}" not found.` });

  const match = gameMatches.find(m => m.matchId === Number(matchId));
  if (!match) return res.status(404).json({ error: `Match ${matchId} not found for game "${gameId}".` });

  // Apply only the provided fields
  if (player1 !== undefined) match.player1 = player1;
  if (player2 !== undefined) match.player2 = player2;
  if (score1 !== undefined) match.score1 = Number(score1);
  if (score2 !== undefined) match.score2 = Number(score2);
  if (winner !== undefined) match.winner = winner;

  await db.write();
  return res.json(match);
});

export default router;
