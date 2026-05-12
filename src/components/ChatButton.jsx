import React, { useState } from 'react';
import ChatRoom from './ChatRoom';
import ChatPortal from './ChatPortal';

export default function ChatButton() {
  const [open, setOpen] = useState(false);
  return (
    <ChatPortal>
      {!open && (
        <button className="chat-fab-btn" onClick={() => setOpen(true)} title="Abrir chat">
          <span role="img" aria-label="chat">💬</span>
        </button>
      )}
      {open && (
        <div className="chat-popup">
          <div className="chat-header">
            Chat
            <button className="chat-close-btn" onClick={() => setOpen(false)} title="Cerrar">×</button>
          </div>
          <ChatRoom />
        </div>
      )}
    </ChatPortal>
  );
}
