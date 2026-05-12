import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

export default function ChatRoom() {
  const [joined, setJoined] = useState(false);
  const [room, setRoom] = useState('');
  const [user, setUser] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('chat_history', (msgs) => {
      setMessages(msgs);
    });
    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off('chat_history');
      socket.off('message');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoin = () => {
    if (room && user) {
      socket.emit('join', room);
      setJoined(true);
    }
  };

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
        <button onClick={handleJoin}>Join</button>
      </div>
    );
  }

  return (
    <div className="chat-main">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontWeight: 'bold' }}>Sala: {room}</span>
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
      <form className="chat-form" onSubmit={handleSend}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
