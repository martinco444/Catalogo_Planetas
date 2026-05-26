const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// load .env from server folder if present (dont commit .env with secrets)
require('dotenv').config({ path: path.join(__dirname, '.env') })

const app = express();
app.use(cors());
app.use(express.json())

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'
const db = require('./db')
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Persistencia en memoria (por sala)
const roomMessages = {};
const MAX_MESSAGES = 50;

// Trivia game rooms in-memory
const questionsData = require('./data/questions')
const gameRooms = {}
// helper to record finished games and notify clients (persisted in SQLite)
async function recordFinishedGame(room){
  try{
    const leaderboard = Object.values(room.players).map(p => ({ name: p.name, score: p.score })).sort((a,b)=>b.score - a.score)
    // persist and then emit latest list
    db.insertRecentGame({ roomId: room.id, planet: room.planet, leaderboard, ts: Date.now(), totalQuestions: room.questions ? room.questions.length : 0 })
    const latest = db.getRecentGames(5)
    io.emit('recent_games', latest)
  }catch(e){
    console.error('Error recording recent game', e)
  }
}

// Endpoint to retrieve recent games
app.get('/recent-games', (req, res) => {
  try{
    const latest = db.getRecentGames(5)
    res.json(latest)
  }catch(e){
    res.status(500).json([])
  }
})

// --- Auth endpoints (using SQLite) ---
app.post('/register', (req, res) => {
  const { name, password } = req.body || {}
  if(!name || !password) return res.status(400).json({ error: 'missing name or password' })
  try{
    const user = db.createUser(name, password)
    return res.json({ ok: true, user: { id: user.id, name: user.name } })
  }catch(e){
    return res.status(400).json({ error: e.message })
  }
})

app.post('/login', (req, res) => {
  const { name, password } = req.body || {}
  if(!name || !password) return res.status(400).json({ error: 'missing' })
  const user = db.verifyUser(name, password)
  if(!user) return res.status(401).json({ error: 'invalid' })
  const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: '8h' })
  return res.json({ ok: true, token, user: { id: user.id, name: user.name } })
})

app.get('/me', (req, res) => {
  const auth = req.headers.authorization || ''
  if(!auth.startsWith('Bearer ')) return res.status(401).json({ error: 'missing' })
  const token = auth.slice(7)
  try{
    const decoded = jwt.verify(token, JWT_SECRET)
    return res.json({ ok: true, user: decoded })
  }catch(e){
    return res.status(401).json({ error: 'invalid' })
  }
})

function generateRoomCode(len = 6){
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let code = ''
  for(let i=0;i<len;i++) code += chars[Math.floor(Math.random()*chars.length)]
  return code
}

function shuffle(arr){
  const a = arr.slice()
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1))
    const t = a[i]; a[i] = a[j]; a[j] = t
  }
  return a
}

function pickQuestionsForPlanet(planet){
  const pool = questionsData[planet] || []
  if(pool.length === 0) return []
  return shuffle(pool).slice(0,10)
}

// Socket auth: accept optional token in handshake.auth.token; if present verify and attach `socket.user`
io.use((socket, next) => {
  try{
    const token = socket.handshake && socket.handshake.auth && socket.handshake.auth.token
    if(!token) return next()
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if(err){ console.log('[io] invalid token', err.message); return next(new Error('auth error')) }
      socket.user = decoded
      next()
    })
  }catch(e){ return next() }
})

io.on('connection', (socket) => {
  // --- Chat handlers (existing) ---
  socket.on('join', (room) => {
    socket.join(room);
    const messages = roomMessages[room] || [];
    socket.emit('chat_history', messages);
  });

  socket.on('message', ({ room, user, text }) => {
    if (!roomMessages[room]) roomMessages[room] = [];
    const msg = { user, text, timestamp: Date.now() };
    roomMessages[room].push(msg);
    if (roomMessages[room].length > MAX_MESSAGES) {
      roomMessages[room] = roomMessages[room].slice(-MAX_MESSAGES);
    }
    io.to(room).emit('message', msg);
  });

  // --- Trivia handlers ---
  socket.on('create_room', ({ name, planet }, cb) => {
    const roomId = generateRoomCode()
    const chosenPlanet = planet || 'Earth'
    const questions = pickQuestionsForPlanet(chosenPlanet)
    gameRooms[roomId] = {
      id: roomId,
      host: socket.id,
      hostUser: socket.user ? socket.user.id : null,
      planet: chosenPlanet,
      players: {},
      state: 'waiting',
      questions,
      current: -1,
      timer: null,
      advanceTimer: null,
      questionAnswered: false
    }
    socket.join(roomId)
    gameRooms[roomId].players[socket.id] = { id: socket.id, name: (socket.user && socket.user.name) || name || 'Jugador', userId: socket.user ? socket.user.id : null, score: 0 }
    io.to(roomId).emit('player_list', Object.values(gameRooms[roomId].players).map(p => ({ name: p.name, score: p.score })))
    if(cb) cb({ ok: true, roomId })
  })

  socket.on('join_room', ({ roomId, name }, cb) => {
    const room = gameRooms[roomId]
    if(!room){
      if(cb) return cb({ ok:false, error: 'Room not found' })
      return socket.emit('room_error', 'Room not found')
    }
    socket.join(roomId)
    room.players[socket.id] = { id: socket.id, name: (socket.user && socket.user.name) || name || 'Jugador', userId: socket.user ? socket.user.id : null, score: 0 }
    io.to(roomId).emit('player_list', Object.values(room.players).map(p => ({ name: p.name, score: p.score })))
    if(cb) cb({ ok:true, roomId })
  })

  socket.on('start_game', ({ roomId }, cb) => {
    const room = gameRooms[roomId]
    if(!room) return cb ? cb({ ok:false, error:'Room not found' }) : null
    if(room.host !== socket.id && !(room.hostUser && socket.user && room.hostUser === socket.user.id)) return cb ? cb({ ok:false, error:'Only host can start' }) : null
    room.state = 'running'
    room.current = -1
    io.to(roomId).emit('game_started')
    // start first question
    nextQuestion(roomId)
    if(cb) cb({ ok:true })
  })

  socket.on('end_game', ({ roomId }, cb) => {
    const room = gameRooms[roomId]
    if(!room) return cb ? cb({ ok:false, error:'Room not found' }) : null
    if(room.host !== socket.id && !(room.hostUser && socket.user && room.hostUser === socket.user.id)) return cb ? cb({ ok:false, error:'Only host can end the game' }) : null
    console.log(`[end_game] requested by ${socket.id} for room ${roomId}`)
    // finish the game immediately
    room.state = 'finished'
    if(room.timer) { clearTimeout(room.timer); room.timer = null }
    if(room.advanceTimer){ clearTimeout(room.advanceTimer); room.advanceTimer = null }
    const leaderboard = Object.values(room.players).map(p => ({ name: p.name, score: p.score })).sort((a,b)=>b.score - a.score)
    // record to recent games
    try{ recordFinishedGame(room) }catch(e){ console.error('record finish error', e) }
    io.to(roomId).emit('game_over', { leaderboard })
    console.log(`[end_game] emitted game_over for room ${roomId}`)
    if(cb) cb({ ok:true })
  })

  socket.on('answer', ({ roomId, answerIndex }, cb) => {
    const room = gameRooms[roomId]
    if(!room) return cb ? cb({ ok:false, error:'Room not found' }) : null
    if(room.questionAnswered) return cb ? cb({ ok:false, error:'Question already answered' }) : null
    const player = room.players[socket.id]
    if(!player) return cb ? cb({ ok:false, error:'Player not in room' }) : null
    room.questionAnswered = true
    if(room.timer){ clearTimeout(room.timer); room.timer = null }
    const q = room.questions[room.current]
    const correct = q.correctIndex === answerIndex
    if(correct) player.score += 10
    io.to(roomId).emit('answer_result', { player: { id: player.id, name: player.name }, correct, choice: answerIndex })
    const leaderboard = Object.values(room.players).map(p => ({ name: p.name, score: p.score })).sort((a,b)=>b.score - a.score)
    io.to(roomId).emit('score_update', { leaderboard })
    // advance to next question shortly so clients can show result
    if(room.advanceTimer) { clearTimeout(room.advanceTimer); room.advanceTimer = null }
    room.advanceTimer = setTimeout(()=>{
      room.advanceTimer = null
      nextQuestion(roomId)
    }, 1200)
    if(cb) cb({ ok:true, correct })
  })

  socket.on('leave_room', ({ roomId }, cb) => {
    leaveGameRoom(socket.id, roomId)
    if(cb) cb({ ok:true })
  })

  socket.on('disconnect', () => {
    // remove from any game rooms
    Object.keys(gameRooms).forEach(rid => {
      if(gameRooms[rid].players[socket.id]){
        leaveGameRoom(socket.id, rid)
      }
    })
  })

  // helper functions
  function nextQuestion(roomId){
    const room = gameRooms[roomId]
    if(!room) return
    // don't advance questions if game is not running (prevents pending timeouts from continuing after end_game)
    if(room.state !== 'running') { console.log(`[nextQuestion] aborting because room ${roomId} state=${room.state}`); return }
    if(room.advanceTimer){ clearTimeout(room.advanceTimer); room.advanceTimer = null }
    room.current++
    room.questionAnswered = false
    if(room.current >= room.questions.length){
      room.state = 'finished'
      // record finished game and emit
      try{ recordFinishedGame(room) }catch(e){ console.error('Error recording finished game', e) }
      const leaderboard = Object.values(room.players).map(p => ({ name: p.name, score: p.score })).sort((a,b)=>b.score - a.score)
      io.to(roomId).emit('game_over', { leaderboard })
      return
    }
    const q = room.questions[room.current]
    const duration = 20 // seconds per question
    console.log(`[nextQuestion] room=${roomId} current=${room.current} question=${q.question}`)
    io.to(roomId).emit('current_question', { index: room.current, question: { text: q.question, choices: q.choices }, duration })
    // start timer - if no one answers within duration, move to next
    room.timer = setTimeout(()=>{
      room.timer = null
      io.to(roomId).emit('question_timeout', { index: room.current })
      nextQuestion(roomId)
    }, duration*1000)
  }

  function leaveGameRoom(sockId, roomId){
    const room = gameRooms[roomId]
    if(!room) return
    delete room.players[sockId]
    io.to(roomId).emit('player_list', Object.values(room.players).map(p => ({ name: p.name, score: p.score })))
    // if empty, cleanup
    if(Object.keys(room.players).length === 0){
      if(room.timer) clearTimeout(room.timer)
      if(room.advanceTimer) clearTimeout(room.advanceTimer)
      delete gameRooms[roomId]
      return
    }
    // if host left, assign new host
    if(room.host === sockId){
      room.host = Object.keys(room.players)[0]
    }
  }
});

const PORT = process.env.PORT || 4000;
if(JWT_SECRET === 'dev_secret'){
  console.warn('[WARN] JWT_SECRET is not set. Using insecure default. Set JWT_SECRET in server/.env or environment for production.')
}

server.listen(process.env.PORT || PORT, () => {
  console.log(`Socket.IO server running on port ${process.env.PORT || PORT}`);
  console.log('[INFO] JWT secret configured:', JWT_SECRET !== 'dev_secret' ? 'provided' : 'default')
  console.log('[INFO] SQLite DB file path:', db && db.backup ? 'available' : 'unknown')
});
