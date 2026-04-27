import React from 'react'

export default function SketchfabEmbed({ src, title = '3D model', height = 480 }){
  if(!src) return null
  return (
    <div className="embedWrap" style={{height: height}}>
      <iframe
        title={title}
        src={src}
        allow="autoplay; fullscreen; vr"
      />
    </div>
  )
}
