import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPlanetById } from '../services/planetsApi'
import { formatPlanet } from '../utils/formatPlanetData'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import TechnicalDetails from '../components/TechnicalDetails'
import SketchfabEmbed from '../components/SketchfabEmbed'
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

export default function PlanetDetail(){
  const { id } = useParams()
  const [planet, setPlanet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    setLoading(true)
    setError(null)
    setPlanet(null)
    getPlanetById(id)
      .then(raw => setPlanet(formatPlanet(raw)))
      .catch(err => setError(err.message || 'Error'))
      .finally(()=> setLoading(false))
  },[id])

  if(loading) return <LoadingState />
  if(error) return <ErrorState message={error} />
  if(!planet) return <div className="card">Planeta no encontrado</div>

  const planet3DModels = {
    Mercury: mercuryModelEmbed,
    Venus: venusModelEmbed,
    Earth: earthModelEmbed,
    Mars: marsModelEmbed,
    Jupiter: jupiterModelEmbed,
    Saturn: saturnModelEmbed,
    Uranus: uranusModelEmbed,
    Neptune: neptuneModelEmbed
  }

  const modelSrc = planet3DModels[planet.name]

  return (
    <div className="container">
      <div style={{marginBottom:12}}><Link to="/">← Volver</Link></div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 660px',gap:16}}>
        <div className="card">
          <h2>{planet.displayName || planet.name}</h2>

          <TechnicalDetails planet={planet} />
        </div>

        <aside style={{display:'grid',gap:12}}>
          {modelSrc ? (
            <div className="card">
              <h4>Visual 3D</h4>
              <SketchfabEmbed src={modelSrc} title={`${planet.displayName || planet.name} 3D`} height={620} />
            </div>
          ) : (
            <div className="card">No hay modelo 3D disponible</div>
          )}
        </aside>
      </div>
    </div>
  )
}
