/**
 * db.js — JSON file database using lowdb (pure JS, no native compilation needed).
 * Data is persisted to server/evo_fgc.json on every write.
 */
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

// Default schema — used only on first run when the file doesn't exist
const defaultData = {
  players: [],
  brackets: SEED_BRACKETS,
};

// Singleton DB instance (resolved once at startup)
let _db = null;

export async function getDb() {
  if (_db) return _db;
  _db = await JSONFilePreset(DB_PATH, defaultData);
  console.log(`[db] Connected to ${DB_PATH}`);
  return _db;
}
