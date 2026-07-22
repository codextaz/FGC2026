/**
 * routes/players.js — Player registration CRUD endpoints.
 *
 * GET    /api/players              → list all players
 * POST   /api/players              → register a new player
 * PATCH  /api/players/:id/status   → toggle Verified ↔ Pending (admin)
 * DELETE /api/players/:id          → remove a player (admin)
 */
import { Router } from 'express';
import { getDb } from '../db.js';
import { validateEcoRef, checkDuplicateGamerTag, checkDuplicatePhone } from '../../src/utils/referralValidation.js';

const router = Router();

// ─── GET /api/players ─────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  const db = await getDb();
  res.json(db.data.players);
});

// ─── POST /api/players ────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const db = await getDb();
  const { gamerTag, fullName, phone, gameId, practiceDates, totalFee, ecoRef } = req.body;

  // Basic field validation
  if (!gamerTag?.trim() || !fullName?.trim() || !phone?.trim() || !gameId || !ecoRef) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const players = db.data.players;

  // Server-side duplicate gamer tag check
  const tagCheck = checkDuplicateGamerTag(gamerTag, players);
  if (tagCheck.isDuplicate) {
    return res.status(409).json({ error: tagCheck.error });
  }

  // Server-side duplicate phone check
  const phoneCheck = checkDuplicatePhone(phone, players);
  if (phoneCheck.isDuplicate) {
    return res.status(409).json({ error: phoneCheck.error });
  }

  // Server-side EcoCash reference validation + duplicate check
  const existingRefs = players.map(p => p.ecoRef);
  const refCheck = validateEcoRef(ecoRef, existingRefs);
  if (!refCheck.isValid) {
    return res.status(400).json({ error: refCheck.error });
  }

  // Spot limit: max 15 per game
  const slotsUsed = players.filter(p => p.gameId === gameId).length;
  if (slotsUsed >= 15) {
    return res.status(409).json({ error: 'This game is sold out. Please choose a different game.' });
  }

  // Build the new player object
  const newPlayer = {
    id: `EVO-2026-${String(players.length + 1).padStart(3, '0')}`,
    gamerTag: gamerTag.trim(),
    fullName: fullName.trim(),
    phone: phone.trim(),
    gameId,
    practiceDates: Array.isArray(practiceDates) ? practiceDates : [],
    totalFee: Number(totalFee) || 5,
    ecoRef: refCheck.normalizedValue,
    status: 'Pending',   // Admin must verify each real payment
    registeredAt: new Date().toISOString(),
  };

  db.data.players.unshift(newPlayer);
  await db.write();

  return res.status(201).json(newPlayer);
});

// ─── PATCH /api/players/:id/status ───────────────────────────────────────────
router.patch('/:id/status', async (req, res) => {
  const db = await getDb();
  const player = db.data.players.find(p => p.id === req.params.id);
  if (!player) return res.status(404).json({ error: 'Player not found.' });

  player.status = player.status === 'Verified' ? 'Pending' : 'Verified';
  await db.write();

  return res.json(player);
});

// ─── DELETE /api/players/:id ──────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  const db = await getDb();
  const before = db.data.players.length;
  db.data.players = db.data.players.filter(p => p.id !== req.params.id);

  if (db.data.players.length === before) {
    return res.status(404).json({ error: 'Player not found.' });
  }

  await db.write();
  return res.json({ success: true });
});

export default router;
