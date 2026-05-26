import React, { useEffect, useState } from 'react'
import { getSocket } from '../services/socket'

export default function RecentTrivia(){
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const base = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000'
  const socket = getSocket()

  async function fetchRecent(){
    setLoading(true)
    try{
      const res = await fetch(base + '/recent-games')
      const data = await res.json()
      setList(Array.isArray(data) ? data : [])
    }catch(e){
      console.error('recent fetch error', e)
      setList([])
    }finally{ setLoading(false) }
  }

  useEffect(()=>{
    fetchRecent()
    if(!socket) return
    const onUpdate = (data) => setList(Array.isArray(data) ? data : [])
    const onRecent = (data) => { console.log('[RecentTrivia] recent_games', data); onUpdate(data) }
    socket.on('recent_games', onRecent)
    return ()=>{
      if(!socket) return
      socket.off('recent_games', onRecent)
    }
  },[socket])

  return (
    <div className="card recent-games">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h4>Últimas partidas</h4>
        <button className="btn small" onClick={fetchRecent} disabled={loading}>{loading ? '...' : 'Actualizar'}</button>
      </div>

      {list.length === 0 ? (
        <div className="muted" style={{marginTop:8}}>No hay partidas recientes.</div>
      ) : (
        <ol style={{marginTop:8}}>
          {list.map((g, i) => (
            <li key={i} style={{marginBottom:8}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div style={{fontWeight:700}}>{g.planet}</div>
                  <div className="small-muted">{new Date(g.ts).toLocaleString()}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div className="small-muted">Ganador:</div>
                  <div style={{fontWeight:700}}>{(g.leaderboard && g.leaderboard[0]) ? `${g.leaderboard[0].name} — ${g.leaderboard[0].score} pts` : '—'}</div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
