const path = require('path')
const fs = require('fs')
const Database = require('better-sqlite3')
const bcrypt = require('bcryptjs')

// allow configurable DB file via env var in production
const DB_PATH = process.env.DB_FILE ? path.resolve(process.env.DB_FILE) : path.join(__dirname, 'data.sqlite')
// ensure directory exists
try{ fs.mkdirSync(path.dirname(DB_PATH), { recursive: true }) }catch(e){}
const exists = fs.existsSync(DB_PATH)
const db = new Database(DB_PATH)
console.log(`[sqlite] using DB file ${DB_PATH}`)

// Pragmas for production-friendly defaults
try{
  db.pragma('journal_mode = WAL')
  db.pragma('synchronous = NORMAL')
  db.pragma('foreign_keys = ON')
  db.pragma('busy_timeout = 5000')
}catch(e){ console.error('DB pragma error', e) }

// init tables
db.prepare(`CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE,
  hash TEXT
)`).run()

db.prepare(`CREATE TABLE IF NOT EXISTS recent_games (
  id TEXT PRIMARY KEY,
  room_id TEXT,
  planet TEXT,
  leaderboard TEXT,
  ts INTEGER,
  total_questions INTEGER
)`).run()

function findUserByName(name){
  return db.prepare('SELECT id, name, hash FROM users WHERE name = ?').get(name)
}

function createUser(name, password){
  if(findUserByName(name)) throw new Error('User exists')
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2,8)
  const hash = bcrypt.hashSync(password, 10)
  db.prepare('INSERT INTO users (id, name, hash) VALUES (?,?,?)').run(id, name, hash)
  return { id, name }
}

function verifyUser(name, password){
  const u = findUserByName(name)
  if(!u) return false
  if(bcrypt.compareSync(password, u.hash)) return { id: u.id, name: u.name }
  return false
}

function insertRecentGame({ roomId, planet, leaderboard, ts, totalQuestions }){
  const id = `${roomId}-${Date.now().toString(36)}`
  const lb = JSON.stringify(leaderboard || [])
  const t = ts || Date.now()
  db.prepare('INSERT INTO recent_games (id, room_id, planet, leaderboard, ts, total_questions) VALUES (?,?,?,?,?,?)')
    .run(id, roomId, planet, lb, t, totalQuestions || 0)
  return { id, planet, leaderboard: leaderboard || [], ts: t, totalQuestions: totalQuestions || 0 }
}

function getRecentGames(limit = 5){
  const rows = db.prepare('SELECT id, room_id as roomId, planet, leaderboard, ts, total_questions as totalQuestions FROM recent_games ORDER BY ts DESC LIMIT ?').all(limit)
  return rows.map(r => ({ id: r.id, planet: r.planet, leaderboard: JSON.parse(r.leaderboard || '[]'), ts: r.ts, totalQuestions: r.totalQuestions }))
}

module.exports = { findUserByName, createUser, verifyUser, insertRecentGame, getRecentGames }
