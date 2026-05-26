import React, { useEffect, useState } from 'react'
import { getSocket } from '../services/socket'
import TriviaGame from './TriviaGame'
import { useRouter } from 'next/router'
import useAuth from '../hooks/useAuth'

export default function TriviaLobby(){
  const socket = getSocket()
  const [name, setName] = useState('')
  const [roomInput, setRoomInput] = useState('')
  const [planet, setPlanet] = useState('Earth')
  const [joinedRoom, setJoinedRoom] = useState(null)
  const [players, setPlayers] = useState([])
  const [isHost, setIsHost] = useState(false)
  const [gameState, setGameState] = useState('waiting') // waiting | running | finished
  const [copied, setCopied] = useState(false)
  const { user } = useAuth()

  useEffect(()=>{
    if(!socket) return
    const onPlayerList = (list) => setPlayers(list)
    const onGameStarted = () => setGameState('running')
    const onGameOver = ({ leaderboard }) => {
      // update players immediately; delay changing parent state briefly so child can process 'game_over'
      setPlayers(leaderboard)
      setTimeout(()=> setGameState('finished'), 150)
    }

    socket.on('player_list', onPlayerList)
    socket.on('game_started', onGameStarted)
    socket.on('game_over', onGameOver)

    return ()=>{
      socket.off('player_list', onPlayerList)
      socket.off('game_started', onGameStarted)
      socket.off('game_over', onGameOver)
    }
  },[socket])

  // auto-join if query params present (from chat)
  const router = useRouter()
  useEffect(()=>{
    if(!socket) return
    if(!router.isReady) return
    const { room, name } = router.query
    if(room && name && !joinedRoom){
      // try to join the room using provided name
      socket.emit('join_room', { roomId: room, name }, (res) => {
        if(res && res.ok){
          setJoinedRoom(room)
          setIsHost(false)
          setName(name)
        }else{
          // show error and keep user on page
          alert(res && res.error ? res.error : 'Error al unirse a la sala desde chat')
        }
      })
    }
  },[socket, router.isReady, router.query])

  // if user logged in, prefill name
  useEffect(()=>{
    if(user && user.name) setName(user.name)
  },[user])

  const handleCreate = () => {
    if(!name) return alert('Ingresa un nombre')
    socket.emit('create_room', { name, planet }, (res) => {
      if(res && res.ok){
        setJoinedRoom(res.roomId)
        setIsHost(true)
      }else{
        alert(res && res.error ? res.error : 'Error creando sala')
      }
    })
  }

  const handleJoin = () => {
    if(!name) return alert('Ingresa un nombre')
    if(!roomInput) return alert('Ingresa código de sala')
    socket.emit('join_room', { roomId: roomInput, name }, (res) => {
      if(res && res.ok){
        setJoinedRoom(roomInput)
        setIsHost(false)
      }else{
        alert(res && res.error ? res.error : 'Error al unirse')
      }
    })
  }

  const handleStart = () => {
    if(!joinedRoom) return
    socket.emit('start_game', { roomId: joinedRoom }, (res) => {
      if(res && !res.ok) alert(res.error || 'Error al iniciar')
    })
  }

  const handleFinish = () => {
    if(!joinedRoom) return
    if(!socket) return
    if(!confirm('¿Deseas finalizar la partida ahora?')) return
    socket.emit('end_game', { roomId: joinedRoom }, (res) => {
      if(res && !res.ok) return alert(res.error || 'Error al finalizar')
      // do not set local state here; wait for server 'game_over' event
    })
  }

  const handleCopyCode = async () => {
    if(!joinedRoom) return
    try{
      if(navigator && navigator.clipboard && navigator.clipboard.writeText){
        await navigator.clipboard.writeText(joinedRoom)
      } else {
        // fallback
        window.prompt('Copia el código de la sala', joinedRoom)
      }
      setCopied(true)
      setTimeout(()=>setCopied(false), 2000)
    }catch(e){
      console.error('copy failed', e)
      window.prompt('Copia el código de la sala', joinedRoom)
    }
  }

  if(!joinedRoom){
    return (
      <div className="card trivia-lobby">
        <h3>Trivia Multiplayer — Crear / Unirse</h3>

        <div style={{display:'grid',gap:8}}>
          <input placeholder="Tu nombre" value={name} onChange={e=>setName(e.target.value)} />

          <div className="lobby-controls">
            <div className="field">
              <label className="small-muted">Planeta</label>
              <select value={planet} onChange={e=>setPlanet(e.target.value)}>
                <option>Mercury</option>
                <option>Venus</option>
                <option>Earth</option>
                <option>Mars</option>
                <option>Jupiter</option>
                <option>Saturn</option>
                <option>Uranus</option>
                <option>Neptune</option>
              </select>
            </div>
            <div className="field">
              <label style={{visibility:'hidden'}}>.</label>
              <button onClick={handleCreate} className="btn create-btn">Crear sala</button>
            </div>
          </div>

          <hr />

          <div style={{display:'flex',gap:8}}>
            <input placeholder="Código de sala" value={roomInput} onChange={e=>setRoomInput(e.target.value)} />
            <button onClick={handleJoin} className="btn muted">Unirse</button>
          </div>
        </div>
      </div>
    )
  }

  // joined
  if(gameState === 'running'){
    return (
      <div>
        <div style={{marginBottom:12}} className="card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <div><strong>Sala:</strong> {joinedRoom} — Planeta: {planet}</div>
              <button onClick={handleCopyCode} className="btn small">{copied ? 'Copiado' : 'Copiar'}</button>
            </div>
            <div>{isHost ? <button onClick={handleFinish} className="btn muted">Finalizar partida</button> : null}</div>
          </div>
        </div>
        <TriviaGame roomId={joinedRoom} playerName={name} />
      </div>
    )
  }

  return (
    <div>
      <div className="card trivia-lobby">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <div>
              <h4>Sala: {joinedRoom}</h4>
              <div className="muted">Planeta: {planet}</div>
            </div>
            <div>
              <button onClick={handleCopyCode} className="btn small">{copied ? 'Copiado' : 'Copiar código'}</button>
            </div>
          </div>
          <div>
            {isHost ? <button onClick={handleStart} className="btn">Iniciar partida</button> : <div className="muted">Esperando al host...</div>}
          </div>
        </div>

        <div style={{marginTop:12}}>
          <h5>Jugadores conectados</h5>
          <ul style={{listStyle:'none',padding:0}}>
            {players.map((p,idx) => (<li key={idx} style={{padding:'6px 0'}}>{p.name} — {p.score} pts</li>))}
          </ul>
        </div>
      </div>
    </div>
  )
}
