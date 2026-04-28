import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { planetImages, placeholder } from '../data/planetImages'
import SketchfabEmbed from './SketchfabEmbed'
import {
  earthModelEmbed,
  mercuryModelEmbed,
  venusModelEmbed,
  marsModelEmbed,
  jupiterModelEmbed,
  saturnModelEmbed,
  uranusModelEmbed,
  neptuneModelEmbed
} from '../data/featuredModels'

export default function PlanetCard({ planet }) {
  const img = planetImages[planet.name] || placeholder
  const isEarth = planet.name === 'Earth'

  // Mapa de modelos por planeta
  const planet3DModels = {
    Mercury: mercuryModelEmbed,
    Venus: venusModelEmbed,
    Mars: marsModelEmbed,
    Jupiter: jupiterModelEmbed,
    Saturn: saturnModelEmbed,
    Uranus: uranusModelEmbed,
    Neptune: neptuneModelEmbed
  }

  const has3D = planet3DModels[planet.name]
  const [show3D, setShow3D] = useState(false)

  return (
    <article className="card">
      <Link to={`/planet/${planet.id}`} style={{textDecoration:'none',color:'inherit'}}>
        <div style={{position:'relative',borderRadius:8,overflow:'hidden'}}>
          {isEarth ? (
            show3D ? (
              <SketchfabEmbed src={earthModelEmbed} title="Earth 3D" height={180} />
            ) : (
              <div style={{
                cursor:'pointer'
              }} onClick={(e)=>{ e.preventDefault(); setShow3D(true) }}>
                <img src={img} alt={planet.name} style={{width:'100%',height:140,objectFit:'cover',display:'block'}} />
                <div style={{
                  position:'absolute', left:10, bottom:10, background:'rgba(0,0,0,0.5)',
                  color:'#fff', padding:'6px 10px', borderRadius:20, fontSize:12
                }}>Ver 3D</div>
              </div>
            )
          ) : has3D ? (
            show3D ? (
              <SketchfabEmbed src={planet3DModels[planet.name]} title={planet.name + " 3D"} height={180} />
            ) : (
              <div style={{cursor:'pointer'}} onClick={e => { e.preventDefault(); setShow3D(true) }}>
                <img src={img} alt={planet.name} style={{width:'100%',height:140,objectFit:'cover',display:'block'}} />
                <div style={{
                  position:'absolute', left:10, bottom:10, background:'rgba(0,0,0,0.5)',
                  color:'#fff', padding:'6px 10px', borderRadius:20, fontSize:12
                }}>Ver 3D</div>
              </div>
            )
          ) : (
            <img src={img} alt={planet.name} style={{width:'100%',height:140,objectFit:'cover',display:'block'}} />
          )}
        </div>

        <h3 style={{margin:'12px 0 6px'}}>{planet.name}</h3>
      </Link>

      <div className="muted" style={{fontSize:14,display:'flex',gap:12}}>
        <div>Gravedad: <strong style={{color:'var(--accent)'}}>{planet.gravity ?? '—'}</strong></div>
        <div>Densidad: <strong style={{color:'var(--accent)'}}>{planet.density ?? '—'}</strong></div>
      </div>

      <div style={{marginTop:10,fontSize:13}} className="muted">Radio medio: {planet.meanRadius ? `${planet.meanRadius} km` : '—'}</div>
    </article>
  )
}
