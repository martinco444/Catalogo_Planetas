import React from 'react'
import SketchfabEmbed from './SketchfabEmbed'
import { heroModelEmbed } from '../data/featuredModels'
import SatelliteScene from './SatelliteScene'

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
        <SketchfabEmbed src={heroModelEmbed} title="Hero 3D" height={300} />
      </div>
    </section>
  )
}
