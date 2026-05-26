const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
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
// recent finished games (most recent first)
const recentGames = []

// helper to record finished games and notify clients
function recordFinishedGame(room){
  try{
    const leaderboard = Object.values(room.players).map(p => ({ name: p.name, score: p.score })).sort((a,b)=>b.score - a.score)
    const entry = { id: room.id, planet: room.planet, leaderboard, ts: Date.now(), totalQuestions: room.questions ? room.questions.length : 0 }
    recentGames.unshift(entry)
    if(recentGames.length > 5) recentGames.pop()
    // notify connected clients in real-time
    io.emit('recent_games', recentGames)
  }catch(e){
    console.error('Error recording recent game', e)
  }
}

// Endpoint to retrieve recent games
app.get('/recent-games', (req, res) => {
  res.json(recentGames)
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
    gameRooms[roomId].players[socket.id] = { id: socket.id, name: name || 'Jugador', score: 0 }
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
    room.players[socket.id] = { id: socket.id, name: name || 'Jugador', score: 0 }
    io.to(roomId).emit('player_list', Object.values(room.players).map(p => ({ name: p.name, score: p.score })))
    if(cb) cb({ ok:true, roomId })
  })

  socket.on('start_game', ({ roomId }, cb) => {
    const room = gameRooms[roomId]
    if(!room) return cb ? cb({ ok:false, error:'Room not found' }) : null
    if(room.host !== socket.id) return cb ? cb({ ok:false, error:'Only host can start' }) : null
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
    if(room.host !== socket.id) return cb ? cb({ ok:false, error:'Only host can end the game' }) : null
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
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
