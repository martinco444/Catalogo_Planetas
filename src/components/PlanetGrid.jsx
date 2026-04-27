import React from 'react'
import PlanetCard from './PlanetCard'

export default function PlanetGrid({planets}){
  if(!planets) return null
  return (
    <section className="grid">
      {planets.map(p => (
        <PlanetCard key={p.id} planet={p} />
      ))}
    </section>
  )
}
