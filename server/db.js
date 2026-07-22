/**
 * db.js — Hybrid Database Layer
 *
 * Local Dev: Uses lowdb (persists to server/evo_fgc.json).
 * Vercel / Cloud: Detects Upstash Redis / Vercel KV environment variables
 * (KV_REST_API_URL / UPSTASH_REDIS_REST_URL) to persist player registrations
 * and brackets permanently in the cloud.
 */
import { Redis } from '@upstash/redis';
import { JSONFilePreset } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'evo_fgc.json');

// ─── Seed bracket data ────────────────────────────────────────────────────────
const SEED_BRACKETS = {
  'dbz': [
    { matchId: 1, round: 'Quarter-Finals', player1: 'ShadowStriker', player2: 'CellGamesPro', score1: 0, score2: 0, winner: null },
    { matchId: 2, round: 'Quarter-Finals', player1: 'GohanMain', player2: 'VegetaPrince', score1: 0, score2: 0, winner: null },
    { matchId: 3, round: 'Quarter-Finals', player1: 'TrunksSlash', player2: 'BrolySmash', score1: 0, score2: 0, winner: null },
    { matchId: 4, round: 'Quarter-Finals', player1: 'PiccoloGod', player2: 'BYE (Seed 1)', score1: 2, score2: 0, winner: 'PiccoloGod' },
    { matchId: 5, round: 'Semi-Finals', player1: 'TBD', player2: 'TBD', score1: 0, score2: 0, winner: null },
    { matchId: 6, round: 'Semi-Finals', player1: 'PiccoloGod', player2: 'TBD', score1: 0, score2: 0, winner: null },
    { matchId: 7, round: 'Grand Final', player1: 'TBD', player2: 'TBD', score1: 0, score2: 0, winner: null },
  ],
  'guilty-gear': [
    { matchId: 1, round: 'Quarter-Finals', player1: 'SolBadguy_ZW', player2: 'KyKiske', score1: 0, score2: 0, winner: null },
    { matchId: 2, round: 'Quarter-Finals', player1: 'MayAnchor', player2: 'Nagoriyuki', score1: 0, score2: 0, winner: null },
    { matchId: 3, round: 'Quarter-Finals', player1: 'Ramlethal', player2: 'HappyChaos', score1: 0, score2: 0, winner: null },
    { matchId: 4, round: 'Quarter-Finals', player1: 'PotemkinBuster', player2: 'BYE', score1: 2, score2: 0, winner: 'PotemkinBuster' },
    { matchId: 5, round: 'Semi-Finals', player1: 'TBD', player2: 'TBD', score1: 0, score2: 0, winner: null },
    { matchId: 6, round: 'Semi-Finals', player1: 'PotemkinBuster', player2: 'TBD', score1: 0, score2: 0, winner: null },
    { matchId: 7, round: 'Grand Final', player1: 'TBD', player2: 'TBD', score1: 0, score2: 0, winner: null },
  ],
  'tekken7': [
    { matchId: 1, round: 'Quarter-Finals', player1: 'KazuyaKing', player2: 'MishimaPower', score1: 0, score2: 0, winner: null },
    { matchId: 2, round: 'Quarter-Finals', player1: 'BryanFury_ZW', player2: 'PaulPhoenix', score1: 0, score2: 0, winner: null },
    { matchId: 3, round: 'Quarter-Finals', player1: 'JinKazama', player2: 'HwoarangRider', score1: 0, score2: 0, winner: null },
    { matchId: 4, round: 'Quarter-Finals', player1: 'KingGrappler', player2: 'BYE', score1: 2, score2: 0, winner: 'KingGrappler' },
    { matchId: 5, round: 'Semi-Finals', player1: 'TBD', player2: 'TBD', score1: 0, score2: 0, winner: null },
    { matchId: 6, round: 'Semi-Finals', player1: 'KingGrappler', player2: 'TBD', score1: 0, score2: 0, winner: null },
    { matchId: 7, round: 'Grand Final', player1: 'TBD', player2: 'TBD', score1: 0, score2: 0, winner: null },
  ],
};

const DEFAULT_DATA = {
  players: [],
  brackets: SEED_BRACKETS,
};

let _dbInstance = null;

export async function getDb() {
  if (_dbInstance) return _dbInstance;

  // Check for Upstash Redis / Vercel KV Environment Variables
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (redisUrl && redisToken) {
    console.log('[db] Using Cloud Persistence (Upstash Redis / Vercel KV)');
    const redis = new Redis({ url: redisUrl, token: redisToken });

    // Fetch existing cloud data
    let players = await redis.get('evo_players');
    let brackets = await redis.get('evo_brackets');

    if (!players) {
      players = DEFAULT_DATA.players;
      await redis.set('evo_players', players);
    }
    if (!brackets) {
      brackets = DEFAULT_DATA.brackets;
      await redis.set('evo_brackets', brackets);
    }

    _dbInstance = {
      data: { players, brackets },
      write: async function () {
        await Promise.all([
          redis.set('evo_players', this.data.players),
          redis.set('evo_brackets', this.data.brackets),
        ]);
      },
    };

    return _dbInstance;
  }

  // Fallback: Local Lowdb JSON File
  const lowdb = await JSONFilePreset(DB_PATH, DEFAULT_DATA);
  console.log(`[db] Using Local Persistence (${DB_PATH})`);
  _dbInstance = lowdb;
  return _dbInstance;
}
