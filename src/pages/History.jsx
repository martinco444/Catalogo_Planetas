import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getVisited, clearVisited } from '../utils/visitedHistory'

export default function History(){
  const navigate = useNavigate()
  const list = getVisited()

  return (
    <div className="container">
      <h2>Historial de planetas visitados</h2>
      <div style={{display:'flex',gap:12,marginBottom:12}}>
        <button onClick={() => { clearVisited(); window.location.reload() }} className="btn">Limpiar historial</button>
        <Link to="/" className="btn muted">Volver</Link>
      </div>

      {list.length === 0 ? (
        <div className="muted">No hay planetas visitados aún.</div>
      ) : (
        <ul style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12,listStyle:'none',padding:0}}>
          {list.map(item => (
            <li key={item.id} className="card" style={{cursor:'pointer'}} onClick={() => navigate(`/planet/${item.id}`)}>
              {item.img ? <img src={item.img} alt={item.name} style={{width:'100%',height:120,objectFit:'cover'}} /> : null}
              <div style={{padding:10}}>
                <strong>{item.name}</strong>
                <div className="muted" style={{fontSize:12}}>Visitado: {new Date(item.ts).toLocaleString()}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
