/**
 * routes/admin.js — Admin authentication endpoint.
 *
 * POST /api/admin/login   → verify admin password, return a simple session token
 */
import { Router } from 'express';

const router = Router();

// Simple in-memory token store (sufficient for a single-organizer tournament)
const VALID_TOKENS = new Set();

// ─── POST /api/admin/login ────────────────────────────────────────────────────
router.post('/login', (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin2026';

  if (password !== adminPassword) {
    return res.status(401).json({ error: 'Invalid admin password.' });
  }

  // Generate a simple random token
  const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
  VALID_TOKENS.add(token);

  return res.json({ token });
});

// ─── POST /api/admin/logout ───────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (token) VALID_TOKENS.delete(token);
  return res.json({ success: true });
});

// Helper exported for use in other routes if needed
export function isValidAdminToken(token) {
  return token && VALID_TOKENS.has(token);
}

export default router;
