import React from 'react'
import SketchfabEmbed from './SketchfabEmbed'
import { earthModelEmbed } from '../data/featuredModels'

// EarthViewer is a simple wrapper now using Sketchfab iframe
// It's prepared to swap to <model-viewer> later if a .glb is provided.
export default function EarthViewer(){
  return (
    <div className="card">
      <h3>Earth — Visual 3D</h3>
      <SketchfabEmbed src={earthModelEmbed} title="Earth 3D" height={360} />
    </div>
  )
}
