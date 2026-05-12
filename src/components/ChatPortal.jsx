import React from 'react';
import { createPortal } from 'react-dom';

export default function ChatPortal({ children }) {
  // Crea un portal para renderizar el chat directamente en el body
  return createPortal(children, document.body);
}
