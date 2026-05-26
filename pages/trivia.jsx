import React from 'react'
import TriviaLobby from '../src/components/TriviaLobby'
import RecentTrivia from '../src/components/RecentTrivia'

export default function TriviaPage(){
  return (
    <div className="container">
      <h2>Trivia en tiempo real</h2>
      <div style={{display:'grid',gridTemplateColumns:'1fr 360px',gap:16}}>
        <div>
          <TriviaLobby />
        </div>
        <aside style={{display:'grid',gap:12}}>
          <div className="card">
            <h4>Instrucciones</h4>
            <ul>
              <li>Crea una sala y comparte el código con amigos.</li>
              <li>Cada sala tiene 10 preguntas sobre el planeta seleccionado.</li>
              <li>La pregunta cambia cuando el primer jugador responde o cuando se acaba el tiempo.</li>
              <li>El leaderboard se muestra en vivo y al finalizar la partida.</li>
            </ul>
          </div>
          <RecentTrivia />
        </aside>
      </div>
    </div>
  )
}
