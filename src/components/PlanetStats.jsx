import React from 'react'

export default function PlanetStats({planet}){
  if(!planet) return null
  return (
    <div className="card">
      <h4>Estadísticas</h4>
      <ul style={{listStyle:'none',padding:0}}>
        <li>Gravedad: <strong>{planet.gravity ?? '—'}</strong></li>
        <li>Densidad: <strong>{planet.density ?? '—'}</strong></li>
        <li>Radio medio: <strong>{planet.meanRadius ? `${planet.meanRadius} km` : '—'}</strong></li>
        <li>Lunas: <strong>{planet.moonsCount}</strong></li>
        <li>Tipo: <strong className="muted">{planet.bodyType}</strong></li>
      </ul>
    </div>
  )
}
