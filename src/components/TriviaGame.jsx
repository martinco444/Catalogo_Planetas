import React, { useEffect, useState, useRef } from 'react'
import { getSocket } from '../services/socket'
import TriviaLeaderboard from './TriviaLeaderboard'

export default function TriviaGame({ roomId, playerName }){
  const socket = getSocket()
  const [question, setQuestion] = useState(null)
  const [index, setIndex] = useState(-1)
  const [duration, setDuration] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState(null)
  const [players, setPlayers] = useState([])
  const [lastAnswer, setLastAnswer] = useState(null)
  const [gameOverData, setGameOverData] = useState(null)

  const intervalRef = useRef(null)

  useEffect(()=>{
    if(!socket) return
    const onCurrent = ({ index: idx, question: q, duration: d }) => {
      setIndex(idx)
      setQuestion(q)
      setDuration(d)
      setAnswered(false)
      setSelected(null)
      setLastAnswer(null)
      setGameOverData(null)
      setTimeLeft(d)
      if(intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = setInterval(()=>{
        setTimeLeft(prev => {
          if(prev <= 1){ clearInterval(intervalRef.current); return 0 }
          return prev - 1
        })
      }, 1000)
    }

    const onAnswerResult = (data) => {
      setLastAnswer(data)
    }

    const onScoreUpdate = ({ leaderboard }) => {
      setPlayers(leaderboard)
    }

    const onGameOver = ({ leaderboard }) => {
      // stop local countdown timer and show final leaderboard
      if(intervalRef.current){ clearInterval(intervalRef.current); intervalRef.current = null }
      setTimeLeft(0)
      console.log('[TriviaGame] game_over received', leaderboard)
      setGameOverData(leaderboard)
      setPlayers(leaderboard)
    }

    socket.on('current_question', onCurrent)
    socket.on('answer_result', onAnswerResult)
    socket.on('score_update', onScoreUpdate)
    socket.on('game_over', onGameOver)

    return ()=>{
      socket.off('current_question', onCurrent)
      socket.off('answer_result', onAnswerResult)
      socket.off('score_update', onScoreUpdate)
      socket.off('game_over', onGameOver)
      if(intervalRef.current) clearInterval(intervalRef.current)
    }
  },[socket])

  const handleAnswer = (i) => {
    if(answered || !socket) return
    setAnswered(true)
    setSelected(i)
    socket.emit('answer', { roomId, answerIndex: i }, (res) => {
      // optional ack
    })
  }

  if(gameOverData) return (
    <div>
      <div className="card trivia-game">
        <h4>Partida finalizada — Leaderboard</h4>
        <TriviaLeaderboard leaderboard={gameOverData} />
      </div>
    </div>
  )

  return (
    <div>
      <div className="card trivia-game">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <strong>Pregunta #{index+1}</strong>
            <div className="muted">Tiempo: {timeLeft}s</div>
          </div>
          <div>
            <strong>{playerName}</strong>
          </div>
        </div>

        {question ? (
          <div style={{marginTop:12}}>
            <div style={{marginBottom:8}}><strong>{question.text}</strong></div>
            <div style={{display:'grid',gap:8}}>
              {question.choices.map((c, idx) => (
                <button key={idx} className="btn" onClick={()=>handleAnswer(idx)} disabled={answered} style={{textAlign:'left'}}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="muted">Esperando pregunta...</div>
        )}

        {lastAnswer ? (
          <div style={{marginTop:12}} className="muted">Última respuesta: {lastAnswer.player.name} — {lastAnswer.correct ? 'Correcta' : 'Incorrecta'}</div>
        ) : null}
      </div>

      <div style={{marginTop:12}}>
        <h5>Scores</h5>
        <TriviaLeaderboard leaderboard={players} />
      </div>
    </div>
  )
}
