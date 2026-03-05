import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbDir = join(__dirname, '..', '..', 'data');
const dbPath = join(dbDir, 'rsvp.db');

mkdirSync(dbDir, { recursive: true });

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS rsvps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    attending INTEGER NOT NULL,
    guest_count INTEGER,
    events TEXT,
    dietary TEXT,
    lodging INTEGER,
    single_rooms INTEGER,
    double_rooms INTEGER,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

export default db;
