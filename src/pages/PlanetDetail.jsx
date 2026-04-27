import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPlanetById } from '../services/planetsApi'
import { formatPlanet } from '../utils/formatPlanetData'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import PlanetStats from '../components/PlanetStats'
import EarthViewer from '../components/EarthViewer'

export default function PlanetDetail(){
  const { id } = useParams()
  const [planet, setPlanet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    setLoading(true)
    getPlanetById(id)
      .then(raw => setPlanet(formatPlanet(raw)))
      .catch(err => setError(err.message || 'Error'))
      .finally(()=> setLoading(false))
  },[id])

  if(loading) return <LoadingState />
  if(error) return <ErrorState message={error} />
  if(!planet) return <div className="card">Planeta no encontrado</div>

  return (
    <div className="container">
      <div style={{marginBottom:12}}><Link to="/">← Volver</Link></div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 360px',gap:16}}>
        <div className="card">
          <h2>{planet.name}</h2>
          <p className="muted">Tipo: {planet.bodyType}</p>
          <p className="muted">Descubierto por: {planet.discoveredBy || '—'} — {planet.discoveryDate || '—'}</p>
          <div style={{marginTop:12}}>
            <h4>Descripción técnica (datos crudos)</h4>
            <pre style={{whiteSpace:'pre-wrap',fontSize:12,color:'#dbe9ff',background:'rgba(255,255,255,0.02)',padding:12,borderRadius:8,maxHeight:320,overflow:'auto'}}>
              {JSON.stringify(planet.raw, null, 2)}
            </pre>
          </div>
        </div>

        <aside style={{display:'grid',gap:12}}>
          <PlanetStats planet={planet} />
          {planet.name === 'Earth' && <EarthViewer />}
        </aside>
      </div>
    </div>
  )
}
