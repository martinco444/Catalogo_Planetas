import React from 'react'
import SketchfabEmbed from './SketchfabEmbed'
import { heroModelEmbed } from '../data/featuredModels'

export default function HeroSection(){
  return (
    <section className="card" style={{display:'grid',gridTemplateColumns:'1fr 420px',gap:20,alignItems:'center'}}>
      <div>
        <h1 style={{marginTop:0}}>Catálogo del Sistema Solar</h1>
        <p className="muted">Explora los planetas principales, consulta sus estadísticas y descubre la Tierra en 3D.</p>
      </div>
      <div>
        <SketchfabEmbed src={heroModelEmbed} title="Hero 3D" height={260} />
      </div>
    </section>
  )
}
