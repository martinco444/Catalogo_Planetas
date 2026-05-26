import React from 'react'
import dynamic from 'next/dynamic'
import SketchfabEmbed from './SketchfabEmbed'
import { heroModelEmbed } from '../data/featuredModels'

// Load heavy 3D components only on the client to avoid SSR issues
const SatelliteScene = dynamic(() => import('./SatelliteScene'), { ssr: false })
const SolarSystemScene = dynamic(() => import('./SolarSystemScene'), { ssr: false })

export default function HeroSection(){
  return (
    <section className="card" style={{display:'grid',gridTemplateColumns:'1fr 720px',gap:20,alignItems:'center'}}>
      <div>
        <div style={{marginBottom:12}}>
          <SatelliteScene width={320} height={140} />
        </div>
        <h1 style={{marginTop:0}}>Catálogo de planetas en el Sistema Solar para Desarrollo Web</h1>
        <p className="muted">Explora los planetas principales, consulta sus estadísticas y observalos en 3D.</p>
      </div>
      <div>
        <SolarSystemScene width={720} height={300} />
      </div>
    </section>
  )
}
