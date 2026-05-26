import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { getSocket } from '../services/socket';

const socket = getSocket();

export default function ChatRoom() {
  const [joined, setJoined] = useState(false);
  const [room, setRoom] = useState('');
  const [user, setUser] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [gameCode, setGameCode] = useState('');
  const [gameJoined, setGameJoined] = useState(false);
  const [gameRoomId, setGameRoomId] = useState('');
  const [gamePlayers, setGamePlayers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if(!socket) return
    const onHistory = (msgs) => setMessages(msgs)
    const onMessage = (msg) => setMessages((prev) => [...prev, msg])
    const onPlayerList = (list) => setGamePlayers(list)

    socket.on('chat_history', onHistory);
    socket.on('message', onMessage);
    socket.on('player_list', onPlayerList);

    return () => {
      if(!socket) return
      socket.off('chat_history', onHistory);
      socket.off('message', onMessage);
      socket.off('player_list', onPlayerList);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoin = () => {
    if (!socket) return alert('Socket no disponible')
    if (room && user) {
      socket.emit('join', room);
      setJoined(true);
    }
  };

  const router = useRouter()

  const handleJoinGame = () => {
    if(!socket) return alert('Socket no disponible')
    if(!gameCode || !user) return alert('Ingresa tu nombre y el código de sala de trivia')
    // redirect to /trivia and let the TriviaLobby auto-join using query params
    const url = `/trivia?room=${encodeURIComponent(gameCode)}&name=${encodeURIComponent(user)}`
    router.push(url)
  }

  const handleLeaveGame = () => {
    if(!socket) return
    if(!gameRoomId) return
    socket.emit('leave_room', { roomId: gameRoomId }, () => {
      setGameJoined(false)
      setGameRoomId('')
      setGamePlayers([])
    })
  }

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      socket.emit('message', { room, user, text: input });
      setInput('');
    }
  };

  if (!joined) {
    return (
      <div className="chat-join">
        <h2>Chat Rooms</h2>
        <input
          placeholder="Tu nombre"
          value={user}
          onChange={e => setUser(e.target.value)}
        />
        <input
          placeholder="Sala (ej: general, marte, jupiter)"
          value={room}
          onChange={e => setRoom(e.target.value)}
        />
        <div style={{display:'flex',gap:8,marginTop:8}}>
          <button onClick={handleJoin} className="btn">Unirse al chat</button>
          <button onClick={()=> window.location.href='/trivia'} className="btn muted">Ir a Trivia</button>
        </div>

        <hr style={{margin:'12px 0'}} />

        <div>
          <div className="muted" style={{marginBottom:6}}>¿Tienes un código de sala de Trivia?</div>
          <div style={{display:'flex',gap:8}}>
            <input placeholder="Código trivia (ej: AB12CD)" value={gameCode} onChange={e=>setGameCode(e.target.value)} />
            <button onClick={handleJoinGame} className="btn">Unirse a Trivia</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-main">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <span style={{ fontWeight: 'bold' }}>Sala: {room}</span>
          {gameJoined ? (
            <div style={{fontSize:12,color:'#666'}}>Trivia: {gameRoomId} — <button onClick={handleLeaveGame} style={{marginLeft:8}} className="btn muted">Salir Trivia</button></div>
          ) : (
            <div style={{fontSize:12,color:'#666'}}>¿Quieres unirte a una partida? Usa el campo abajo.</div>
          )}
        </div>

        <button
          style={{ background: '#eee', color: '#235390', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontWeight: 'bold', marginLeft: 8 }}
          onClick={() => {
            setJoined(false);
            setMessages([]);
            setInput('');
          }}
        >Salir</button>
      </div>
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className="chat-message">
            <span className="chat-message-user">{msg.user}:</span> {msg.text}
            <span className="chat-message-time">({new Date(msg.timestamp).toLocaleTimeString()})</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {!gameJoined ? (
        <div style={{display:'flex',gap:8,marginTop:8}}>
          <input placeholder="Código trivia (ej: AB12CD)" value={gameCode} onChange={e=>setGameCode(e.target.value)} />
          <button onClick={handleJoinGame} className="btn">Unirse a Trivia</button>
        </div>
      ) : null}
      <form className="chat-form" onSubmit={handleSend}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button type="submit">Enviar</button>
      </form>
      {gamePlayers && gamePlayers.length > 0 ? (
        <div style={{marginTop:8}} className="card">
          <strong>Jugadores en la partida</strong>
          <ul style={{listStyle:'none',padding:0,marginTop:8}}>
            {gamePlayers.map((p, i) => <li key={i} style={{padding:'4px 0'}}>{p.name} — {p.score} pts</li>)}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
